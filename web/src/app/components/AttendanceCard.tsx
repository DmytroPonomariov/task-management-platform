import { InstructorDashboardSession } from '../types';
import { formatDateTime } from '../utils/format';
import styles from '../app.module.css';

interface AttendanceCardProps {
  session: InstructorDashboardSession;
}

export function AttendanceCard({ session }: AttendanceCardProps) {
  return (
    <article className={styles.dashboardCard}>
      <div className={styles.dashboardCardHeader}>
        <h3>{session.title}</h3>
        <span className={styles.categoryPill}>{formatDateTime(session.scheduledAt)}</span>
      </div>
      <p className={styles.sessionDescription}>
        Enrollment {session.enrolled}/{session.capacity} · Attendance {session.attended} (
        {session.attendanceRate}%)
      </p>
      <ul className={styles.attendanceList}>
        {session.attendance.length === 0 && (
          <li className={styles.emptyState}>No confirmed attendance yet.</li>
        )}
        {session.attendance.map((record) => (
          <li key={record.id}>
            <span>{record.participantName}</span>
            <span className={styles.attendanceEmail}>{record.participantEmail}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
