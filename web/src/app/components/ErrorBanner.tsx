import styles from '../app.module.css';

interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return <div className={styles.errorBanner}>{message}</div>;
}
