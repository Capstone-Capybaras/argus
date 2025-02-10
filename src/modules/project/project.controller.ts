import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from '../project/dto/create-project.dto';
import { UpdateProjectDto } from '../project/dto/update-project.dto';
import { SelectProjectDto } from './dto/select-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // Create a new project
  @Post()
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<UpdateProjectDto> {
    try {
      return await this.projectService.createProject(createProjectDto);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to create project');
    }
  }

  // Retrieve all projects
  @Get()
  async getProjects(): Promise<SelectProjectDto[]> {
    return await this.projectService.getProjects();
  }

  // Retrieve a specific project by name
  @Get(':name')
  async getProjectByName(
    @Param('name') name: string,
  ): Promise<SelectProjectDto> {
    const project = await this.projectService.getProjectByName(name);
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    return project;
  }

  @Patch()
  async updateProject(
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<SelectProjectDto> {
    try {
      const updatedProject = await this.projectService.updateProject(
        updateProjectDto.id,
        updateProjectDto,
      );
      if (!updatedProject) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }
      return updatedProject;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Failed to update project');
    }
  }

  // Delete a project by name
  @Delete(':id')
  async deleteProject(@Param('id') id: number) {
    const deleted = await this.projectService.deleteProject(id);
    if (!deleted) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
