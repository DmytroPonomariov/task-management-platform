import { FormEvent } from 'react';
import { TrainingSession } from '../types';
import { formatDateTime } from '../utils/format';
import { EnrollmentPayload } from '../utils/api';
import styles from '../app.module.css';
import { Metric } from './Metric';
import { TextField } from './TextField';
import { RosterTable } from './RosterTable';

export interface EnrollmentFormValues extends EnrollmentPayload {}

interface EnrollmentManagerProps {
  session: TrainingSession | null;
  formValues: EnrollmentFormValues;
  state: 'idle' | 'submitting';
  message: string | null;
  error: string | null;
  onFieldChange: (field: keyof EnrollmentFormValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function EnrollmentManager({
  session,
  formValues,
  state,
  message,
  error,
  onFieldChange,
  onSubmit,
}: EnrollmentManagerProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.kicker}>Enrollment management</p>
          <h2>Reserve seats in a session</h2>
          {session && (
            <p className={styles.subheading}>
              {session.title} · {session.enrollments.length}/{session.capacity} seats claimed
            </p>
          )}
        </div>
      </div>

      {!session && (
        <p className={styles.emptyState}>Select a session from the catalog first.</p>
      )}

      {session && (
        <div className={styles.enrollmentGrid}>
          <div className={styles.enrollmentCard}>
            <Metric label="Schedule" value={formatDateTime(session.scheduledAt)} />
            <Metric label="Level" value={session.level} />
            <form className={styles.enrollmentForm} onSubmit={onSubmit}>
              <TextField
                label="Participant name"
                type="text"
                value={formValues.participantName}
                placeholder="Leslie Knope"
                required
                onChange={(value) => onFieldChange('participantName', value)}
              />
              <TextField
                label="Participant email"
                type="email"
                value={formValues.participantEmail}
                placeholder="leslie@example.com"
                required
                onChange={(value) => onFieldChange('participantEmail', value)}
              />
              <button className={styles.primaryButton} type="submit" disabled={state === 'submitting'}>
                {state === 'submitting' ? 'Reserving seat…' : 'Add to roster'}
              </button>
              {message && <p className={styles.successText}>{message}</p>}
              {error && <p className={styles.errorText}>{error}</p>}
            </form>
          </div>
          <div className={styles.enrollmentRoster}>
            <div className={styles.rosterHeader}>
              <Metric
                label="Confirmed roster"
                value={`${session.enrollments.length} participants`}
              />
            </div>
            <RosterTable
              enrollments={session.enrollments}
              emptyLabel="No one has claimed a seat yet."
            />
          </div>
        </div>
      )}
    </section>
  );
}
