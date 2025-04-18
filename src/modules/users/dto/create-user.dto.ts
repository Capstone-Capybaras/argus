import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { usersTable } from 'src/database/schema';
import { InferInsert } from 'src/utils/modelToDtoTypes';

export class CreateUserDto implements InferInsert<typeof usersTable> {
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsBoolean()
  @IsOptional()
  is_super_user?: boolean;
}
