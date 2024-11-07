// update-inject.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateInjectDto } from './create-inject.dto';

export class UpdateInjectDto extends PartialType(CreateInjectDto) {}
