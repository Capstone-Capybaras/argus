import { IsNotEmpty } from 'class-validator';

export class BatchUploadDto {
  @IsNotEmpty()
  projectId: number;
  @IsNotEmpty()
  attachments: string[];
  @IsNotEmpty()
  filePath: string;
}
