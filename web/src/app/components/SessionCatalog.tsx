import { TrainingSession } from '../types';
import { formatDateTime } from '../utils/format';
import styles from '../app.module.css';

interface SessionCatalogProps {
  sessions: TrainingSession[];
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  loading: boolean;
}

export function SessionCatalog({
  sessions,
  categories,
  selectedCategory,
  onCategoryChange,
  selectedSessionId,
  onSelectSession,
  loading,
}: SessionCatalogProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.kicker}>Session catalog</p>
          <h2>Browse cohorts & filter by focus</h2>
          <p className={styles.subheading}>
            Choose a category to highlight upcoming labs that match the coaching backlog.
          </p>
        </div>
        <div className={styles.actionRow}>
          <label className={styles.selectLabel}>
            Category
            <select
              value={selectedCategory}
              onChange={(event) => onCategoryChange(event.target.value)}
            >
              <option value="all">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {loading && <p className={styles.subheading}>Loading the latest experiences…</p>}

      <ul className={styles.sessionList}>
        {sessions.map((session) => (
          <li
            key={session.id}
            className={`${styles.sessionCard} ${
              selectedSessionId === session.id ? styles.sessionCardActive : ''
            }`}
          >
            <div className={styles.sessionMeta}>
              <span className={styles.categoryPill}>{session.category}</span>
              <span>{formatDateTime(session.scheduledAt)}</span>
            </div>
            <h3>{session.title}</h3>
            <p className={styles.sessionDescription}>{session.description}</p>
            <div className={styles.tagRow}>
              {session.tags.map((tag) => (
                <span className={styles.tag} key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={styles.sessionGrid}>
              <div>
                <p className={styles.metricLabel}>Instructor</p>
                <p className={styles.metricValue}>{session.instructorName}</p>
              </div>
              <div>
                <p className={styles.metricLabel}>Location</p>
                <p className={styles.metricValue}>{session.location}</p>
              </div>
              <div>
                <p className={styles.metricLabel}>Seats</p>
                <p className={styles.metricValue}>
                  {session.enrollments.length}/{session.capacity}
                </p>
              </div>
            </div>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => onSelectSession(session.id)}
            >
              Manage enrollment
            </button>
          </li>
        ))}
      </ul>
      {!sessions.length && !loading && (
        <p className={styles.emptyState}>No sessions match that filter yet.</p>
      )}
    </section>
  );
}
