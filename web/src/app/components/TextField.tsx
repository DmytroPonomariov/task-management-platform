import { InputHTMLAttributes } from 'react';
import styles from '../app.module.css';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  onChange: (value: string) => void;
}

export function TextField({ label, onChange, ...inputProps }: TextFieldProps) {
  return (
    <label className={styles.formField}>
      {label}
      <input {...inputProps} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
