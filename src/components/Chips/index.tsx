import React, { forwardRef, useRef } from 'react';
import type { FC } from 'react';
import styles from './index.module.css';
import LoadingIcon from '../../icons/LoadingIcon';
import { mergeRefs } from '../../utils';

type ChipsProps = {
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  onFocus?: () => void;
  chips: Result[];
  deleteItem: (value: Result) => void;
  searchTerm: string;
  onChange: (searchTerm: string) => void;
};

type Result = {
  label: string;
  value: string;
  image: string;
  episodeCount: number;
};

const Chips = forwardRef<FC, ChipsProps>(
  ({ searchTerm, onChange, deleteItem, chips, placeholder = '', onFocus, disabled = false, loading = false }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFocus = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    return (
      <div className={styles.container}>
        <div className={styles.chipWrapper}>
          <ul className={styles.wrapper} onClick={handleFocus}>
            {chips.map((chip, index) => (
              <li key={index} className={styles.chip}>
                <p>{chip.label}</p>
                <p onClick={() => deleteItem(chip)}>x</p>
              </li>
            ))}
            <li className={styles.inputContainer}>
              <input
                onFocus={onFocus}
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
                disabled={disabled}
                className={styles.input}
                ref={mergeRefs(inputRef, ref)}
              />
            </li>
          </ul>
          {loading && (
            <div className="iconLoading">
              <LoadingIcon />
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default Chips;
