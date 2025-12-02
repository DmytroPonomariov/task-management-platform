import { SelectHTMLAttributes } from 'react';
import styles from '../app.module.css';

interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function SelectField({ label, value, onChange, children, ...rest }: SelectFieldProps) {
  return (
    <label className={styles.selectLabel}>
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} {...rest}>
        {children}
      </select>
    </label>
  );
}
