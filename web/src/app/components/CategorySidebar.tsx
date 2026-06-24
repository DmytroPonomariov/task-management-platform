import { useState, FormEvent } from 'react';
import { Category } from '../types';
import styles from '../app.module.css';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (id: string) => void;
  onAddCategory: (name: string) => Promise<void>;
  onEditCategory: (id: string, name: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onShareTasks: (email: string) => Promise<{ success: boolean; message: string }>;
}

export function CategorySidebar({
  categories,
  selectedCategory,
  onCategorySelect,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onShareTasks,
}: CategorySidebarProps) {
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Share Tasks State
  const [shareEmail, setShareEmail] = useState('');
  const [sharing, setSharing] = useState(false);
  const [shareStatus, setShareStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await onAddCategory(newCatName);
    setNewCatName('');
  };

  const handleEditSubmit = async (id: string) => {
    if (!editingName.trim()) return;
    await onEditCategory(id, editingName);
    setEditingId(null);
    setEditingName('');
  };

  const handleShareSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!shareEmail.trim()) return;
    setSharing(true);
    setShareStatus(null);
    try {
      const res = await onShareTasks(shareEmail);
      setShareStatus(res);
      if (res.success) {
        setShareEmail('');
      }
    } catch (err) {
      setShareStatus({ success: false, message: 'Failed to share tasks.' });
    } finally {
      setSharing(false);
    }
  };

  const startEditing = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarCard}>
        <h2 className={styles.sidebarTitle}>Categories</h2>
        <ul className={styles.categoryList}>
          <li
            className={`${styles.categoryItem} ${
              selectedCategory === '' ? styles.categoryItemActive : ''
            }`}
            onClick={() => onCategorySelect('')}
          >
            <span className={styles.categoryName}>All Categories</span>
          </li>
          <li
            className={`${styles.categoryItem} ${
              selectedCategory === 'none' ? styles.categoryItemActive : ''
            }`}
            onClick={() => onCategorySelect('none')}
          >
            <span className={styles.categoryName}>Uncategorized</span>
          </li>

          {categories.map((cat) => (
            <li
              key={cat.id}
              className={`${styles.categoryItem} ${
                selectedCategory === cat.id ? styles.categoryItemActive : ''
              }`}
              onClick={() => onCategorySelect(cat.id)}
            >
              {editingId === cat.id ? (
                <div
                  className={styles.addCategoryForm}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className={styles.addCategoryInput}
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditSubmit(cat.id)}
                    className={styles.smallPrimaryButton}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className={styles.secondaryButton}
                    style={{ padding: '0.2rem 0.5rem', borderRadius: '0.5rem' }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className={styles.categoryName}>{cat.name}</span>
                  <div className={styles.categoryActions}>
                    <button
                      className={styles.iconButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(cat);
                      }}
                      title="Rename Category"
                    >
                      ✏️
                    </button>
                    <button
                      className={`${styles.iconButton} ${styles.deleteIconBtn}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this category? Associated tasks will be uncategorized.')) {
                          onDeleteCategory(cat.id);
                        }
                      }}
                      title="Delete Category"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        <form onSubmit={handleAddSubmit} className={styles.addCategoryForm}>
          <input
            type="text"
            placeholder="New category..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className={styles.addCategoryInput}
          />
          <button type="submit" className={styles.smallPrimaryButton}>
            +
          </button>
        </form>
      </div>

      <div className={styles.sidebarCard}>
        <h2 className={styles.sidebarTitle}>Share Tasks</h2>
        {shareStatus && (
          <div
            className={shareStatus.success ? styles.successText : styles.errorText}
            style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}
          >
            {shareStatus.success ? '✔ ' : '❌ '}
            {shareStatus.message}
          </div>
        )}
        <form onSubmit={handleShareSubmit} className={styles.addCategoryForm} style={{ flexDirection: 'column', gap: '0.5rem' }}>
          <input
            type="email"
            placeholder="recipient@example.com"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            className={styles.addCategoryInput}
            required
            style={{ width: '100%' }}
          />
          <button type="submit" disabled={sharing} className={styles.smallPrimaryButton} style={{ width: '100%', padding: '0.55rem' }}>
            {sharing ? 'Sharing...' : '✉ Share via Email'}
          </button>
        </form>
      </div>
    </aside>
  );
}
