import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class BatchUploadDto {
  @IsNotEmpty()
  @IsInt()
  projectId: number;
  @IsNotEmpty()
  attachments: string[];
  @IsNotEmpty()
  @IsString()
  templateFile: string;
}
