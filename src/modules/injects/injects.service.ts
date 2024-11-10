// injects.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInjectDto } from './dto/create-inject.dto';
import { UpdateInjectDto } from './dto/update-inject.dto';
import { InjectDto } from './dto/inject.dto';

@Injectable()
export class InjectsService {
  private injects: InjectDto[] = [];

  create(createInjectDto: CreateInjectDto): InjectDto {
    const newInject = { ...createInjectDto };
    this.injects.push(newInject);
    return newInject;
  }

  findAll(): InjectDto[] {
    return this.injects;
  }

  findOne(id: string): InjectDto {
    const inject = this.injects.find((inject) => inject.injectId === id);
    if (!inject) {
      throw new NotFoundException(`Inject with ID ${id} not found`);
    }
    return inject;
  }

  update(id: string, updateInjectDto: UpdateInjectDto): InjectDto {
    const injectIndex = this.injects.findIndex(
      (inject) => inject.injectId === id,
    );
    if (injectIndex === -1) {
      throw new NotFoundException(`Inject with ID ${id} not found`);
    }
    this.injects[injectIndex] = {
      ...this.injects[injectIndex],
      ...updateInjectDto,
    };
    return this.injects[injectIndex];
  }

  remove(id: string): void {
    const injectIndex = this.injects.findIndex(
      (inject) => inject.injectId === id,
    );
    if (injectIndex === -1) {
      throw new NotFoundException(`Inject with ID ${id} not found`);
    }
    this.injects.splice(injectIndex, 1);
  }
}
