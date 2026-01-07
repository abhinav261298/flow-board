import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAppDispatch } from '@hooks';
import { addTask } from '@store/slices/tasksSlice';
import { validateTaskTitle } from '@utils';
import styles from './AddTaskForm.module.css';

const AddTaskForm = () => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const validationError = validateTaskTitle(title);
    if (validationError) {
      setError(validationError.message);
      return;
    }

    // Task will be automatically added to the column via extraReducers
    dispatch(addTask({ title, columnId: 'todo' }));
    
    setTitle('');
    setError(null);
  };

  const handleChange = (value: string) => {
    setTitle(value);
    if (error && value.trim()) {
      setError(null);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={title}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Add a new task..."
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          aria-label="Task title"
          aria-invalid={!!error}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={!title.trim()}
          aria-label="Add task"
        >
          + Add
        </button>
      </div>
      {error && (
        <p className={styles.errorMessage} role="alert">
          {error}
        </p>
      )}
    </form>
  );
};

export default AddTaskForm;
