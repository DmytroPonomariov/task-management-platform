import styles from './app.module.css';

import { PlannerHero } from './components/PlannerHero';


// 1. Fetch sessions and categories
// 2. Use SessionCatalog component to show sessions.
//    2.1 Implement filtering by category
//    2.2 Implement session selecting
// 3. Additional AI task: Use EnrollmentManager component and Post "sessions/:id/enroll" endpoint

export function App() {
  return (
    <div className={styles.app}>
      <PlannerHero />
    </div>
  );
}

export default App;
