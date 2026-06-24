import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Category, Task, TaskStatus } from './task.types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getWelcome(): { message: string } {
    return { message: 'Hello API' };
  }

  // ==========================================
  // CATEGORIES ENDPOINTS
  // ==========================================

  @Get('categories')
  getCategories(): Category[] {
    return this.appService.getCategories();
  }

  @Post('categories')
  createCategory(@Body('name') name: string): Category {
    return this.appService.createCategory(name);
  }

  @Patch('categories/:id')
  updateCategory(
    @Param('id') id: string,
    @Body('name') name: string
  ): Category {
    return this.appService.updateCategory(id, name);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string): Category {
    return this.appService.deleteCategory(id);
  }

  // ==========================================
  // TASKS ENDPOINTS
  // ==========================================

  @Get('tasks')
  getTasks(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: TaskStatus
  ) {
    return this.appService.getTasks({
      page,
      limit,
      search,
      categoryId,
      status,
    });
  }

  @Get('tasks/:id')
  getTask(@Param('id') id: string): Task {
    return this.appService.findTask(id);
  }

  @Post('tasks')
  createTask(
    @Body()
    payload: {
      title: string;
      description?: string;
      categoryId?: string | null;
      status?: TaskStatus;
    }
  ): Task {
    return this.appService.createTask(payload);
  }

  @Patch('tasks/:id')
  updateTask(
    @Param('id') id: string,
    @Body()
    payload: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      categoryId?: string | null;
    }
  ): Task {
    return this.appService.updateTask(id, payload);
  }

  @Delete('tasks/:id')
  deleteTask(@Param('id') id: string): Task {
    return this.appService.deleteTask(id);
  }

  @Post('tasks/share')
  shareTasks(@Body('email') email: string) {
    return this.appService.shareTasks(email);
  }
}
