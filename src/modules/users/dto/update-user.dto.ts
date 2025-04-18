import { IsBoolean, IsEmail, IsOptional } from 'class-validator';
import { usersTable } from 'src/database/schema';
import { InferUpdate } from 'src/utils/modelToDtoTypes';

export class UpdateUserDto implements InferUpdate<typeof usersTable> {
  @IsEmail()
  username: string;

  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
