import styles from '../app.module.css';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  limit,
  total,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const startTask = (page - 1) * limit + 1;
  const endTask = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className={styles.pagination}>
      <span className={styles.paginationInfo}>
        Showing {startTask}-{endTask} of {total}
      </span>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={styles.pageButton}
        title="Previous Page"
      >
        ◀
      </button>
      {getPageNumbers().map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`${styles.pageButton} ${
            page === num ? styles.pageButtonActive : ''
          }`}
        >
          {num}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={styles.pageButton}
        title="Next Page"
      >
        ▶
      </button>
    </div>
  );
}
