import styles from '../app.module.css';

export function PlannerHero() {
  return (
    <header className={styles.hero}>
      <p className={styles.kicker}>Capability Studio</p>
      <h1>Training Session Planner</h1>
      <p className={styles.heroSubtitle}>
        Curate cohorts, enroll talent, and give instructors real-time visibility into
        attendance.
      </p>
    </header>
  );
}
