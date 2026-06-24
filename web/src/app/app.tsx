import { useState, useEffect } from 'react';
import styles from './app.module.css';

import { CategorySidebar } from './components/CategorySidebar';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { Pagination } from './components/Pagination';
import { Category, Task, TaskStatus, TasksResponse } from './types';

export function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const limit = 6; // Grid-friendly limit

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  // Fetch Tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());

      if (selectedCategory) {
        queryParams.append('categoryId', selectedCategory);
      }
      if (statusFilter) {
        queryParams.append('status', statusFilter);
      }
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }

      const res = await fetch(`/api/tasks?${queryParams.toString()}`);
      if (res.ok) {
        const data: TasksResponse = await res.json();
        setTasks(data.tasks);
        setTotalTasks(data.total);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial and reactive fetches
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [selectedCategory, statusFilter, searchQuery, page]);

  // Reset page to 1 when filters change
  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    setPage(1);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  // Category Actions
  const handleAddCategory = async (name: string) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await fetchCategories();
      }
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const handleEditCategory = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await fetchCategories();
        await fetchTasks();
      }
    } catch (err) {
      console.error('Error editing category:', err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        if (selectedCategory === id) {
          setSelectedCategory('');
        }
        await fetchCategories();
        await fetchTasks();
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  // Task Actions
  const handleTaskSubmit = async (payload: {
    title: string;
    description: string;
    categoryId: string | null;
    status: TaskStatus;
  }) => {
    try {
      if (editingTask) {
        // Edit Mode
        const res = await fetch(`/api/tasks/${editingTask.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          await fetchTasks();
        }
      } else {
        // Create Mode
        const res = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setPage(1); // Go back to first page to see the new task
          await fetchTasks();
        }
      }
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        // If we are on a page that becomes empty after deletion, go to the previous page
        const newTotal = totalTasks - 1;
        const totalPages = Math.ceil(newTotal / limit);
        if (page > totalPages && page > 1) {
          setPage(page - 1);
        } else {
          await fetchTasks();
        }
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchTasks();
      }
    } catch (err) {
      console.error('Error changing task status:', err);
    }
  };

  const handleShareTasks = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/tasks/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, message: data.message || 'Tasks shared successfully!' };
      } else {
        return { success: false, message: data.message || 'Failed to share tasks.' };
      }
    } catch (err) {
      console.error('Error sharing tasks:', err);
      return { success: false, message: 'Server communication error.' };
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>✓</div>
          <span className={styles.logoTitle}>TaskFlow</span>
        </div>
        <div className={styles.userBadge}>
          👤 alice@example.com (Workspace)
        </div>
      </header>

      <main className={styles.layout}>
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onShareTasks={handleShareTasks}
        />

        <section className={styles.mainContent}>
          <div className={styles.toolbar}>
            <div className={styles.searchWrapper}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search title or description..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={`${styles.formInput} ${styles.searchInput}`}
              />
            </div>

            <div className={styles.filterGroup}>
              <div className={styles.statusTabs}>
                <button
                  className={`${styles.statusTab} ${
                    statusFilter === '' ? styles.statusTabActive : ''
                  }`}
                  onClick={() => handleStatusFilterChange('')}
                >
                  All
                </button>
                <button
                  className={`${styles.statusTab} ${
                    statusFilter === 'TODO' ? styles.statusTabActive : ''
                  }`}
                  onClick={() => handleStatusFilterChange('TODO')}
                >
                  TODO
                </button>
                <button
                  className={`${styles.statusTab} ${
                    statusFilter === 'IN_PROGRESS' ? styles.statusTabActive : ''
                  }`}
                  onClick={() => handleStatusFilterChange('IN_PROGRESS')}
                >
                  In Progress
                </button>
                <button
                  className={`${styles.statusTab} ${
                    statusFilter === 'DONE' ? styles.statusTabActive : ''
                  }`}
                  onClick={() => handleStatusFilterChange('DONE')}
                >
                  Done
                </button>
              </div>

              <button onClick={openCreateModal} className={styles.primaryButton}>
                <span>+</span> Add Task
              </button>
            </div>
          </div>

          {loading ? (
            <div className={styles.loaderWrapper}>
              <div className={styles.loader}></div>
              <p>Fetching your task lists...</p>
            </div>
          ) : tasks.length > 0 ? (
            <>
              <div className={styles.tasksGrid}>
                {tasks.map((task) => {
                  const cat = categories.find((c) => c.id === task.categoryId);
                  return (
                    <TaskCard
                      key={task.id}
                      task={task}
                      categoryName={cat ? cat.name : null}
                      onEdit={openEditModal}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                    />
                  );
                })}
              </div>
              <Pagination
                page={page}
                limit={limit}
                total={totalTasks}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyStateTitle}>No tasks found</p>
              <p className={styles.emptyStateText}>
                {searchQuery || selectedCategory || statusFilter
                  ? "Try relaxing your search query or filters to discover tasks."
                  : "Get started by adding a brand new task using the Add Task button above!"}
              </p>
            </div>
          )}
        </section>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleTaskSubmit}
        categories={categories}
        initialTask={editingTask}
      />
    </div>
  );
}

export default App;
