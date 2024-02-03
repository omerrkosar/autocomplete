import React, { forwardRef, useRef } from 'react';
import type { FC } from 'react';
import styles from './index.module.css';
import LoadingIcon from '../../icons/LoadingIcon';
import { mergeRefs } from '../../utils';
import { OptionType } from '../../types';
type ChipsProps = {
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  onFocus?: () => void;
  chips: OptionType[];
  deleteItem: (value: OptionType) => void;
  searchTerm: string;
  onChange: (searchTerm: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  chipsRef: (state: HTMLDivElement) => void;
  errorMessage: string;
};

const Chips = forwardRef<FC, ChipsProps>(
  (
    {
      searchTerm,
      onChange,
      onKeyDown,
      deleteItem,
      chips,
      chipsRef,
      placeholder = '',
      onFocus,
      disabled = false,
      loading = false,
      errorMessage = '',
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFocus = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    return (
      <div className={styles.container}>
        <div className={styles.chipWrapper}>
          <div className={errorMessage ? styles.errorWrapper : styles.wrapper} onClick={handleFocus}>
            <div ref={chipsRef}>
              {chips.map((chip, index) => (
                <div key={index} className={styles.chip}>
                  <p className={styles.chipsText}>{chip.label}</p>
                  <button className={styles.deleteButton} onClick={() => deleteItem(chip)}>
                    X
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.inputContainer}>
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
                onKeyDown={onKeyDown}
              />
            </div>
          </div>

          {loading ? (
            <div className={styles.iconLoading}>
              <LoadingIcon />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);

export default Chips;