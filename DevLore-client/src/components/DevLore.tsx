// src/components/News.tsx
import { useState, useEffect } from 'react';
import { 
  type TopicDTO, 
  fetchTopics, 
  createOrUpdateTopics, 
  deleteTopics 
} from '../api/topic_service';
import styles from '../styles/DevLore.module.css';


const DevLore = () => {
  const [topics, setTopics] = useState<TopicDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [formData, setFormData] = useState<Omit<TopicDTO, 'id' | 'createdAt' | 'updatedAt'>>({ 
    title: '' 
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadTopics = async () => {
    try {
      setLoading(true);
      const data = await fetchTopics();
      setTopics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ title: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const topicToSave: TopicDTO = {
      id: editingId || undefined,
      title: formData.title
    };

    try {
      await createOrUpdateTopics([topicToSave]);
      resetForm();
      await loadTopics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Saving failed');
    }
  };

  const handleDelete = async (ids: number[]) => {
    try {
      await deleteTopics(ids);
      setSelectedIds(selectedIds.filter(id => !ids.includes(id)));
      await loadTopics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deletion failed');
    }
  };

  const resetForm = () => {
    setFormData({ title: '' });
    setEditingId(null);
  };

  const setupEdit = (topic: TopicDTO) => {
    if (topic.id === undefined || topic.id === null) return;
    
    setFormData({ title: topic.title || '' });
    setEditingId(topic.id);
  };

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className={styles.loading}>Loading topics...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Topics Management</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            className={styles.formInput}
            required
            placeholder="Enter topic title"
          />
        </div>
        
        <div className={styles.buttonGroup}>
          <button 
            type="submit" 
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            {editingId ? 'Update Topic' : 'Add Topic'}
          </button>
          {editingId && (
            <button 
              type="button" 
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className={styles.bulkActions}>
        <button
          className={`${styles.btn} ${styles.btnDanger}`}
          disabled={selectedIds.length === 0}
          onClick={() => handleDelete(selectedIds)}
        >
          Delete Selected ({selectedIds.length})
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeader}>
            <th></th>
            <th>ID</th>
            <th>Title</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {topics.map(topic => (
            <tr key={topic.id || 'new'} className={styles.tableRow}>
              <td className={styles.tableCell}>
                {topic.id && (
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedIds.includes(topic.id)}
                    onChange={() => topic.id && toggleSelection(topic.id)}
                  />
                )}
              </td>
              <td className={styles.tableCell}>{topic.id || 'N/A'}</td>
              <td className={styles.tableCell}>{topic.title || 'Untitled'}</td>
              <td className={styles.tableCell}>{formatDate(topic.createdAt)}</td>
              <td className={styles.tableCell}>{formatDate(topic.updatedAt)}</td>
              <td className={`${styles.tableCell} ${styles.actionsCell}`}>
                {topic.id && (
                  <>
                    <button
                      className={`${styles.btn} ${styles.btnSm} ${styles.btnWarning}`}
                      onClick={() => setupEdit(topic)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnSm} ${styles.btnDanger}`}
                      onClick={() => topic.id && handleDelete([topic.id])}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DevLore;