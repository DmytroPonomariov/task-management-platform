import { useState, useEffect, FormEvent } from 'react';
import { Category, Task, TaskStatus } from '../types';
import styles from '../app.module.css';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    title: string;
    description: string;
    categoryId: string | null;
    status: TaskStatus;
  }) => Promise<void>;
  categories: Category[];
  initialTask: Task | null;
}

export function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialTask,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('null');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setCategoryId(initialTask.categoryId || 'null');
      setStatus(initialTask.status);
    } else {
      setTitle('');
      setDescription('');
      setCategoryId('null');
      setStatus('TODO');
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        categoryId: categoryId === 'null' ? null : categoryId,
        status,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {initialTask ? 'Edit Task' : 'Create Task'}
          </h2>
          <button className={styles.iconButton} onClick={onClose}>
            ❌
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className={styles.formGroup}>
            <label htmlFor="task-title">Title</label>
            <input
              id="task-title"
              type="text"
              required
              placeholder="e.g. Learn React router"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              placeholder="Provide a short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${styles.formInput} ${styles.textareaInput}`}
              rows={4}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label htmlFor="task-category">Category</label>
              <select
                id="task-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={styles.formInput}
              >
                <option value="null">Uncategorized</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className={styles.formInput}
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className={styles.secondaryButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={styles.primaryButton}
            >
              {isSubmitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
