import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from '../project/dto/create-project.dto';
import { UpdateProjectDto } from '../project/dto/update-project.dto'

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // Create a new project
  @Post()
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    try {
      const newProject = await this.projectService.createProject(createProjectDto);
      return { message: 'Project created successfully', data: newProject };
    } catch (error) {
      throw new HttpException('Failed to create project', HttpStatus.BAD_REQUEST);
    }
  }

  // Retrieve all projects
  @Get()
  async getProjects() {
    return await this.projectService.getProjects();
  }

  // Retrieve a specific project by name
  @Get(':name')
  async getProjectByName(@Param('name') name: string) {
    const project = await this.projectService.getProjectByName(name);
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    return project;
  }

  // Update a project by name
  @Put(':name')
  async updateProject(@Param('name') name: string, @Body() updateProjectDto: UpdateProjectDto) {
    try {
      const updatedProject = await this.projectService.updateProject(name, updateProjectDto);
      if (!updatedProject) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Project updated successfully', data: updatedProject };
    } catch (error) {
      throw new HttpException('Failed to update project', HttpStatus.BAD_REQUEST);
    }
  }

  // Delete a project by name
  @Delete(':name')
  async deleteProject(@Param('name') name: string) {
    const deleted = await this.projectService.deleteProject(name);
    if (!deleted) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Project deleted successfully' };
  }
}