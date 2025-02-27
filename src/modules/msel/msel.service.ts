import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/config/providers';
import { S3Service } from 'src/email/s3.service';
import * as schemas from 'src/database/schema';
import { InjectScenarioDto, UploadMselDto } from './msel.dto';
import { eq, sql } from 'drizzle-orm';
import { ConfigService } from '@nestjs/config';
import { PassThrough } from 'stream';
import { SdkStreamMixin } from '@smithy/types';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { CreateInjectDto } from '../injects/dto/create-inject.dto';
import { InjectsService } from '../injects/injects.service';

@Injectable()
export class MselService {
  constructor(
    private readonly s3Service: S3Service,
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schemas>,
    private readonly configService: ConfigService,
    private readonly injectsService: InjectsService,
  ) {}

  async addInjectScenarioNum(joinInjectScenarioDto: InjectScenarioDto) {
    const result = await this.database
      .insert(schemas.injectsToScenariosTable)
      .values(joinInjectScenarioDto)
      .returning();
    return result[0];
  }

  private getSheetHeaders(worksheet: XLSX.WorkSheet): {
    headers: string[];
    range: number;
  } {
    const headers: string[] = [];
    if (!worksheet['!ref']) {
      throw new Error(
        'Sheet reference (!ref) is missing. The sheet might be empty.',
      );
    }
    const range = XLSX.utils.decode_range(worksheet['!ref']); // Get the data range
    //check if first row is empty
    const addr = XLSX.utils.encode_cell({ r: range.s.r, c: range.s.c });
    const cell = worksheet[addr];
    let start;
    if (cell) {
      start = 0;
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
          headers.push(cell.v.toString().trim()); // Convert to string and trim spaces
        }
      }
    } else {
      start = 1;
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({
          r: range.s.r + 1,
          c: col,
        });
        const cell = worksheet[cellAddress];
        if (cell && cell.v) {
          headers.push(cell.v.toString().trim()); // Convert to string and trim spaces
        }
      }
    }
    return { headers: headers, range: start };
  }

  private excelSerialToDate(serial: number): string {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel starts on 1899-12-30
    const msPerDay = 86400000; // 24 * 60 * 60 * 1000 (Milliseconds per day)
    return new Date(excelEpoch.getTime() + serial * msPerDay).toISOString();
  }

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

  async fileParser(project_id: number, filePath: string) {
    //project_id: number, filePath: string
    //const bucketName = this.configService.getOrThrow('S3_BUCKET_NAME');
    //const fileBuffer = await this.s3Service.downloadFile(bucketName, filePath);
    const fileBuffer = fs.readFileSync(
      'src/modules/msel/.test/companyM-msel.xlsx',
    );
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const errors: string[] = [];

    interface Row {
      'Real Day': number | null;
      'Real Time': string | null;
      'Inject ID': string;
      'Inject Type': string | null;
      'Inject/Sequence': string;
      'Sce. #': string | null;
      From: string;
      To: string;
      Artefact: string | null;
    }

    if (!workbook.SheetNames.includes('MSEL')) {
      errors.push("The uploaded Excel file must contain a sheet named 'MSEL'.");
      return { success: false, errors: errors };
      //throw new Error('The uploaded Excel file must contain a sheet named "msel".');
    }
    const worksheet = workbook.Sheets['MSEL'];
    const requiredColumns = [
      'Real Day',
      'Real Time',
      'Inject ID',
      'Inject Type',
      'Inject/Sequence',
      'Sce. #',
      'From',
      'To',
      'Artefact',
    ];
    try {
      const { headers, range } = this.getSheetHeaders(worksheet);
      const missingColumns = requiredColumns.filter(
        (col) => !headers.includes(col),
      );
      if (missingColumns.length > 0) {
        errors.push(`Missing required columns: ${missingColumns.join(', ')}`);
        return { success: false, errors: errors };
      }
      const rows: Row[] = XLSX.utils.sheet_to_json(worksheet, {
        range: range,
        defval: null,
      });
      const existingScenarios = await this.database
        .select({ scenarioNumber: schemas.scenariosTable.scenario_number })
        .from(schemas.scenariosTable)
        .where(eq(schemas.scenariosTable.project_id, project_id));
      const existingScenarioNumbers = existingScenarios.map(
        (s) => s.scenarioNumber,
      );
      // check for non-null fields
      const injectIDs: string[] = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row['Inject ID'] === null) {
          if (
            row['Sce. #'] !== null ||
            row['To'] !== null ||
            row['From'] !== null
          ) {
            errors.push(
              `Inject ID must be unique and cannot be empty at row: ${i + 2}`,
            ); // Adding row number
          }
        } else if (injectIDs.includes(row['Inject ID'])) {
          errors.push(
            `Duplicated Inject ID at row: ${i + 2} Inject IDs must be unique`,
          ); // Adding row number
        } else {
          injectIDs.push(row['Inject ID']);
        }
      }
      if (errors.length > 0) {
        return { success: false, errors: errors };
      }
      //insert into db
      for (const row of rows) {
        if (row['Inject ID'] === null) {
          if (
            row['Sce. #'] === null &&
            row['From'] === null &&
            row['To'] === null
          ) {
            continue;
          }
        }
        const injectDto: CreateInjectDto = {
          project_id: project_id,
          scenario_number: row['Sce. #'],
          date: row['Real Day']
            ? this.excelSerialToDate(row['Real Day'])
            : null,
          time: row['Real Time'],
          inject_desc: row['Inject/Sequence'],
          inject_id: row['Inject ID'],
          inject_type: row['Inject Type'],
          from: row['From'],
          to_recipient: row['To'],
          artefact: row['Artefact'],
          iteration: 0,
          upload_key: filePath,
        };
        try {
          const response = await this.injectsService.createInject(injectDto);
          if (response) {
            const injectSerialId = response.id;
            if (
              row['Sce. #'] !== null &&
              existingScenarioNumbers.includes(row['Sce. #'])
            ) {
              const joinTableEntry: InjectScenarioDto = {
                project_id: project_id,
                inject_id: injectSerialId,
                scenario_number: row['Sce. #'],
              };
              this.addInjectScenarioNum(joinTableEntry);
            } else if (row['Sce. #'] === '0') {
              for (const num of existingScenarioNumbers) {
                const joinTableEntry: InjectScenarioDto = {
                  project_id: project_id,
                  inject_id: injectSerialId,
                  scenario_number: num,
                };
                this.addInjectScenarioNum(joinTableEntry);
              }
            }
          }
        } catch (error) {
          console.log('error creating inject in db: ', error);
        }
      }
    } catch (error) {
      errors.push(error as string);
      console.log(error);
      return { success: false, errors: errors };
    }
  }
}
