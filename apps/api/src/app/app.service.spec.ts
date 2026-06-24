import { Test, TestingModule } from '@nestjs/testing';
import { AppService, CURRENT_USER_ID } from './app.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Categories CRUD', () => {
    it('should list categories for the default user', () => {
      const categories = service.getCategories();
      expect(categories.length).toBeGreaterThan(0);
      categories.forEach((cat) => {
        expect(cat.userId).toBe(CURRENT_USER_ID);
      });
    });

    it('should create a new category', () => {
      const newCat = service.createCategory('Health');
      expect(newCat).toBeDefined();
      expect(newCat.name).toBe('Health');
      expect(newCat.userId).toBe(CURRENT_USER_ID);
      expect(newCat.id).toBeDefined();

      const categories = service.getCategories();
      expect(categories.some((cat) => cat.id === newCat.id)).toBe(true);
    });

    it('should throw BadRequestException for duplicate category name', () => {
      expect(() => service.createCategory('Work')).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for empty category name', () => {
      expect(() => service.createCategory('')).toThrow(BadRequestException);
    });

    it('should update an existing category name', () => {
      const categories = service.getCategories();
      const firstCat = categories[0];

      const updated = service.updateCategory(firstCat.id, 'Updated Work');
      expect(updated.name).toBe('Updated Work');
      expect(updated.id).toBe(firstCat.id);
    });

    it('should delete a category and nullify references in tasks', () => {
      // Create category and task
      const newCat = service.createCategory('Temp Category');
      const newTask = service.createTask({
        title: 'Temp Task',
        categoryId: newCat.id,
      });

      expect(newTask.categoryId).toBe(newCat.id);

      // Delete category
      service.deleteCategory(newCat.id);

      // Category should be gone
      const categories = service.getCategories();
      expect(categories.some((cat) => cat.id === newCat.id)).toBe(false);

      // Task categoryId should be nullified
      const updatedTask = service.findTask(newTask.id);
      expect(updatedTask.categoryId).toBeNull();
    });

    it('should throw NotFoundException when updating non-existent category', () => {
      expect(() => service.updateCategory('non-existent-cat', 'New Name')).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when deleting non-existent category', () => {
      expect(() => service.deleteCategory('non-existent-cat')).toThrow(NotFoundException);
    });
  });

  describe('Tasks CRUD & Searching & Pagination', () => {
    it('should list tasks with pagination', () => {
      const res = service.getTasks({ page: 1, limit: 5 });
      expect(res.tasks).toHaveLength(5);
      expect(res.total).toBe(12); // Alice has 12 tasks seeded
      expect(res.page).toBe(1);
      expect(res.limit).toBe(5);
    });

    it('should filter tasks by categoryId', () => {
      const res = service.getTasks({ categoryId: 'cat-work' });
      expect(res.tasks.length).toBeLessThan(12);
      res.tasks.forEach((task) => {
        expect(task.categoryId).toBe('cat-work');
      });
    });

    it('should filter tasks by status', () => {
      const res = service.getTasks({ status: 'DONE' });
      res.tasks.forEach((task) => {
        expect(task.status).toBe('DONE');
      });
    });

    it('should filter tasks by case-insensitive search query', () => {
      const res = service.getTasks({ search: 'ReAcT' });
      expect(res.tasks.length).toBeGreaterThan(0);
      res.tasks.forEach((task) => {
        const contains =
          task.title.toLowerCase().includes('react') ||
          task.description.toLowerCase().includes('react');
        expect(contains).toBe(true);
      });
    });

    it('should find a single task by ID', () => {
      const task = service.findTask('task-1');
      expect(task).toBeDefined();
      expect(task.id).toBe('task-1');
      expect(task.userId).toBe(CURRENT_USER_ID);
    });

    it('should throw NotFoundException for non-existent task ID', () => {
      expect(() => service.findTask('non-existent-task')).toThrow(NotFoundException);
    });

    it('should create a task', () => {
      const newTask = service.createTask({
        title: 'New Integration Test',
        description: 'Test descriptions',
        status: 'TODO',
        categoryId: 'cat-work',
      });

      expect(newTask).toBeDefined();
      expect(newTask.title).toBe('New Integration Test');
      expect(newTask.description).toBe('Test descriptions');
      expect(newTask.status).toBe('TODO');
      expect(newTask.categoryId).toBe('cat-work');
      expect(newTask.id).toBeDefined();
    });

    it('should throw BadRequestException if creating task with invalid categoryId', () => {
      expect(() =>
        service.createTask({
          title: 'Invalid Cat Task',
          categoryId: 'non-existent-cat',
        })
      ).toThrow(BadRequestException);
    });

    it('should update an existing task', () => {
      const updated = service.updateTask('task-1', {
        title: 'Updated React Title',
        status: 'DONE',
        categoryId: 'cat-personal',
      });

      expect(updated.title).toBe('Updated React Title');
      expect(updated.status).toBe('DONE');
      expect(updated.categoryId).toBe('cat-personal');
    });

    it('should delete an existing task', () => {
      const deleted = service.deleteTask('task-1');
      expect(deleted.id).toBe('task-1');

      expect(() => service.findTask('task-1')).toThrow(NotFoundException);
    });

    it('should successfully mock-share tasks list via email', async () => {
      const res = await service.shareTasks('friend@example.com');
      expect(res.success).toBe(true);
      expect(res.message).toBeDefined();
    });

    it('should throw BadRequestException if sharing with invalid email format', async () => {
      await expect(service.shareTasks('invalidemail')).rejects.toThrow(BadRequestException);
    });
  });
});
