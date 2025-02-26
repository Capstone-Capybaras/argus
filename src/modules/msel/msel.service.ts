import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/config/providers';
import { S3Service } from 'src/email/s3.service';
import * as schemas from 'src/database/schema';
import { UploadMselDto } from './msel.dto';
import { eq, sql } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

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

  async downloadMsel(key: string, res: Response) {
    const mselKey = await this.database
      .select({ msel: schemas.mselTable.msel })
      .from(schemas.mselTable)
      .where(eq(schemas.mselTable.msel, key))
      .limit(1);

    if (mselKey && mselKey.length > 0) {
      const bucketName = this.configService.getOrThrow('S3_BUCKET_NAME');
      const fileExists = await this.s3Service.checkFileExists(
        bucketName,
        mselKey[0].msel,
      );
      if (fileExists) {
        const fileBuffer = await this.s3Service.downloadFile(
          bucketName,
          mselKey[0].msel,
        );
        const filename = mselKey[0].msel.split('/').pop() ?? key;
        res.set({
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Type': 'application/octet-stream',
          'Content-Length': fileBuffer.length,
        });
        res.send(fileBuffer);
      } else {
        res.status(404).json({ message: 'File not found' });
      }
    } else {
      res.status(404).json({ message: 'MSEL key not found' });
    }
  }
}
