import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/config/providers';
import { S3Service } from 'src/email/s3.service';
import * as schemas from 'src/database/schema';
import { UploadMselDto } from './msel.dto';
import { eq, sql } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';
import { PassThrough } from 'stream';
import { SdkStreamMixin } from '@smithy/types';

@Injectable()
export class MselService {
  constructor(
    private readonly s3Service: S3Service,
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schemas>,
    private readonly configService: ConfigService,
  ) {}

  async getMselsByProject(project_id: number) {
    const result = await this.database
      .select()
      .from(schemas.mselTable)
      .where(eq(schemas.mselTable.project_id, project_id))
      .orderBy(sql`${schemas.mselTable.date_uploaded} ASC`);
    return result;
  }

  async uploadMsel(data: UploadMselDto) {
    const result = await this.database
      .insert(schemas.mselTable)
      .values(data)
      .returning();
    return result[0];
  }

  async downloadMsel(key: string): Promise<StreamableFile | null> {
    const mselKey = await this.database
      .select({ msel: schemas.mselTable.msel })
      .from(schemas.mselTable)
      .where(eq(schemas.mselTable.msel, key))
      .limit(1);
    if (!mselKey || mselKey.length === 0) {
      throw new Error('File does not exist');
    }
    try {
      const bucketName = this.configService.getOrThrow('S3_BUCKET_NAME');
      const response = await this.s3Service.streamFile(
        bucketName,
        mselKey[0].msel,
      );
      if (!response.Body) {
        throw new Error('File not found');
      }
      const nodeStream = (
        response.Body as SdkStreamMixin
      ).transformToByteArray();
      const passThrough = new PassThrough();
      passThrough.end(await nodeStream);

      return new StreamableFile(passThrough, {
        type: response.ContentType || 'application/octet-stream',
        disposition: `attachment; filename="${key.split('/').pop()}"`,
        length: response.ContentLength,
      });
    } catch (error) {
      console.error('Error fetching file from S3:', error);
      return null;
    }
  }
}
