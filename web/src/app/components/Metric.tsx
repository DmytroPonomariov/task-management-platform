import { ReactNode } from 'react';
import styles from '../app.module.css';

interface MetricProps {
  label: string;
  value: ReactNode;
}

export function Metric({ label, value }: MetricProps) {
  return (
    <div>
      <p className={styles.metricLabel}>{label}</p>
      <p className={styles.metricValue}>{value}</p>
    </div>
  );
}
