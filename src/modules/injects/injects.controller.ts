// injects.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { InjectsService } from './injects.service';
import { CreateInjectDto } from './dto/create-inject.dto';
import { UpdateInjectDto } from './dto/update-inject.dto';
import { InjectDto } from './dto/inject.dto';

@Controller('injects')
export class InjectsController {
  constructor(private readonly injectsService: InjectsService) {}

  @Post()
  create(@Body() createInjectDto: CreateInjectDto): InjectDto {
    return this.injectsService.create(createInjectDto);
  }

  @Get()
  findAll(): InjectDto[] {
    return this.injectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): InjectDto {
    return this.injectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInjectDto: UpdateInjectDto): InjectDto {
    return this.injectsService.update(id, updateInjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): { message: string } {
    this.injectsService.remove(id);
    return { message: `Inject with ID ${id} has been deleted` };
  }
}
