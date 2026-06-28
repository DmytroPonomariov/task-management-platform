import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { categoriesSeed, tasksSeed } from './data/task-data';
import { Category, Task, TaskStatus } from './task.types';

export const CURRENT_USER_ID = 'user-alice';

@Injectable()
export class AppService {
  private categories: Category[] = [...categoriesSeed];
  private tasks: Task[] = [...tasksSeed];

  // ==========================================
  // CATEGORIES SERVICES
  // ==========================================

  public getCategories(userId: string = CURRENT_USER_ID): Category[] {
    return this.categories.filter((cat) => cat.userId === userId);
  }

  public createCategory(name: string, userId: string = CURRENT_USER_ID): Category {
    if (!name || name.trim() === '') {
      throw new BadRequestException('Category name is required');
    }

    const exists = this.categories.some(
      (cat) => cat.userId === userId && cat.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (exists) {
      throw new BadRequestException(`Category with name "${name}" already exists`);
    }

    const newCategory: Category = {
      id: `cat-${crypto.randomUUID()}`,
      name: name.trim(),
      userId,
      createdAt: new Date().toISOString(),
    };

    this.categories.push(newCategory);
    return newCategory;
  }

  public updateCategory(id: string, name: string, userId: string = CURRENT_USER_ID): Category {
    if (!name || name.trim() === '') {
      throw new BadRequestException('Category name is required');
    }

    const catIndex = this.categories.findIndex((cat) => cat.id === id && cat.userId === userId);

    if (catIndex === -1) {
      throw new NotFoundException('Category not found');
    }

    const nameExists = this.categories.some(
      (cat) => cat.userId === userId && cat.id !== id && cat.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (nameExists) {
      throw new BadRequestException(`Category with name "${name}" already exists`);
    }

    this.categories[catIndex] = {
      ...this.categories[catIndex],
      name: name.trim(),
    };

    return this.categories[catIndex];
  }

  public deleteCategory(id: string, userId: string = CURRENT_USER_ID): Category {
    const catIndex = this.categories.findIndex((cat) => cat.id === id && cat.userId === userId);

    if (catIndex === -1) {
      throw new NotFoundException('Category not found');
    }

    const deletedCategory = this.categories[catIndex];
    this.categories.splice(catIndex, 1);

    // Cascade delete/nullify references in tasks
    this.tasks = this.tasks.map((task) => {
      if (task.userId === userId && task.categoryId === id) {
        return {
          ...task,
          categoryId: null,
          updatedAt: new Date().toISOString(),
        };
      }
      return task;
    });

    return deletedCategory;
  }

  // ==========================================
  // TASKS SERVICES
  // ==========================================

  public getTasks(
    filters: {
      page?: number;
      limit?: number;
      search?: string;
      categoryId?: string;
      status?: TaskStatus;
    },
    userId: string = CURRENT_USER_ID
  ) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const search = filters.search ? filters.search.trim().toLowerCase() : '';
    const categoryId = filters.categoryId;
    const status = filters.status;

    // Filter user's tasks
    let filteredTasks = this.tasks.filter((task) => task.userId === userId);

    // Apply category filter
    if (categoryId) {
      if (categoryId === 'null' || categoryId === 'none') {
        filteredTasks = filteredTasks.filter((task) => task.categoryId === null);
      } else {
        filteredTasks = filteredTasks.filter((task) => task.categoryId === categoryId);
      }
    }

    // Apply status filter
    if (status) {
      filteredTasks = filteredTasks.filter((task) => task.status === status);
    }

    // Apply search filter
    if (search) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search)
      );
    }

    // Paginate
    const total = filteredTasks.length;
    const startIndex = (page - 1) * limit;
    const paginatedTasks = filteredTasks.slice(startIndex, startIndex + limit);

    return {
      tasks: paginatedTasks,
      total,
      page,
      limit,
    };
  }

  public findTask(id: string, userId: string = CURRENT_USER_ID): Task {
    const task = this.tasks.find((t) => t.id === id && t.userId === userId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  public createTask(
    payload: {
      title: string;
      description?: string;
      categoryId?: string | null;
      status?: TaskStatus;
    },
    userId: string = CURRENT_USER_ID
  ): Task {
    if (!payload.title || payload.title.trim() === '') {
      throw new BadRequestException('Task title is required');
    }

    // Validate category ownership if provided
    if (payload.categoryId && payload.categoryId !== 'null') {
      const catExists = this.categories.some(
        (cat) => cat.id === payload.categoryId && cat.userId === userId
      );
      if (!catExists) {
        throw new BadRequestException('Invalid category selected');
      }
    }

    const newTask: Task = {
      id: `task-${crypto.randomUUID()}`,
      title: payload.title.trim(),
      description: payload.description ? payload.description.trim() : '',
      status: payload.status || 'TODO',
      userId,
      categoryId: payload.categoryId && payload.categoryId !== 'null' ? payload.categoryId : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tasks.push(newTask);
    return newTask;
  }

  public updateTask(
    id: string,
    payload: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      categoryId?: string | null;
    },
    userId: string = CURRENT_USER_ID
  ): Task {
    const taskIndex = this.tasks.findIndex((t) => t.id === id && t.userId === userId);

    if (taskIndex === -1) {
      throw new NotFoundException('Task not found');
    }

    const currentTask = this.tasks[taskIndex];

    // Validate category if updating categoryId
    let targetCategoryId = currentTask.categoryId;
    if (payload.categoryId !== undefined) {
      if (payload.categoryId === null || payload.categoryId === 'null') {
        targetCategoryId = null;
      } else {
        const catExists = this.categories.some(
          (cat) => cat.id === payload.categoryId && cat.userId === userId
        );
        if (!catExists) {
          throw new BadRequestException('Invalid category selected');
        }
        targetCategoryId = payload.categoryId;
      }
    }

    const updatedTask: Task = {
      ...currentTask,
      title: payload.title !== undefined ? payload.title.trim() : currentTask.title,
      description: payload.description !== undefined ? payload.description.trim() : currentTask.description,
      status: payload.status !== undefined ? payload.status : currentTask.status,
      categoryId: targetCategoryId,
      updatedAt: new Date().toISOString(),
    };

    if (updatedTask.title === '') {
      throw new BadRequestException('Task title cannot be empty');
    }

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  public deleteTask(id: string, userId: string = CURRENT_USER_ID): Task {
    const taskIndex = this.tasks.findIndex((t) => t.id === id && t.userId === userId);

    if (taskIndex === -1) {
      throw new NotFoundException('Task not found');
    }

    const deletedTask = this.tasks[taskIndex];
    this.tasks.splice(taskIndex, 1);

    return deletedTask;
  }

  public async shareTasks(email: string, userId: string = CURRENT_USER_ID): Promise<{ success: boolean; message: string }> {
    if (!email || !email.includes('@')) {
      throw new BadRequestException('Valid email is required');
    }

    const userTasks = this.tasks.filter((t) => t.userId === userId);
    const userCategories = this.categories.filter((c) => c.userId === userId);

    const formattedTasks = userTasks.map((t) => {
      const cat = userCategories.find((c) => c.id === t.categoryId);
      const catName = cat ? cat.name : 'Uncategorized';
      return `- [${t.status}] ${t.title} (${catName})`;
    }).join('\n');

    const emailBody = `
Hello,

Here is the current task list for user ${userId}:

${formattedTasks}

Best regards,
TaskFlow System
    `;

    console.log(`\n==========================================`);
    console.log(`[EMAIL SEND] Sending task list to: ${email}`);
    console.log(`------------------------------------------`);
    console.log(emailBody);
    console.log(`==========================================\n`);

    const hasSmtpConfig = process.env.SMTP_USER && process.env.SMTP_PASS;

    if (hasSmtpConfig) {
      try {
        // Use eval('require') to bypass Webpack compile-time bundling for optional nodemailer dependency
        const nodemailer = eval('require')('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
          port: parseInt(process.env.SMTP_PORT || '2525'),
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: '"TaskFlow" <no-reply@taskflow.dev>',
          to: email,
          subject: 'Shared Task List',
          text: emailBody,
        });
        return { success: true, message: 'Email sent successfully' };
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        console.warn(`SMTP is configured, but email sending failed: ${errMsg}`);
      }
    } else {
      console.log('SMTP config omitted. Email logged to console.');
    }

    return { success: true, message: 'Email logged to terminal console (mocked)' };
  }
}
