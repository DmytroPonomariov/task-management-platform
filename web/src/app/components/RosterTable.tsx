import { Enrollment } from '../types';
import styles from '../app.module.css';

interface RosterTableProps {
  enrollments: Enrollment[];
  emptyLabel: string;
}

export function RosterTable({ enrollments, emptyLabel }: RosterTableProps) {
  if (enrollments.length === 0) {
    return <p className={styles.emptyState}>{emptyLabel}</p>;
  }

  return (
    <table className={styles.enrollmentTable}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {enrollments.map((enrollment) => (
          <tr key={enrollment.id}>
            <td>{enrollment.participantName}</td>
            <td>{enrollment.participantEmail}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
