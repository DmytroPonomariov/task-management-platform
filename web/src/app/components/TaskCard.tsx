import { Task, TaskStatus } from '../types';
import styles from '../app.module.css';

interface TaskCardProps {
  task: Task;
  categoryName: string | null;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: TaskStatus) => Promise<void>;
}

export function TaskCard({
  task,
  categoryName,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  const formattedDate = new Date(task.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={styles.taskCard}>
      <div className={styles.taskHeader}>
        <h3 className={styles.taskTitle}>{task.title}</h3>
        <div className={styles.cardActions}>
          <button
            className={styles.iconButton}
            onClick={() => onEdit(task)}
            title="Edit Task"
          >
            ✏️
          </button>
          <button
            className={`${styles.iconButton} ${styles.deleteIconBtn}`}
            onClick={() => {
              if (confirm('Are you sure you want to delete this task?')) {
                onDelete(task.id);
              }
            }}
            title="Delete Task"
          >
            🗑️
          </button>
        </div>
      </div>

      <p className={styles.taskDescription}>{task.description || 'No description provided.'}</p>

      <div className={styles.taskMeta}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span className={styles.categoryBadge}>
            📁 {categoryName || 'Uncategorized'}
          </span>
          <span style={{ fontSize: '0.75rem' }}>Updated {formattedDate}</span>
        </div>

        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          className={`${styles.statusDropdown} ${styles[`status${task.status}`]}`}
        >
          <option value="TODO">TODO ◽</option>
          <option value="IN_PROGRESS">IN PROGRESS 🔶</option>
          <option value="DONE">DONE 🟢</option>
        </select>
      </div>
    </div>
  );
}
