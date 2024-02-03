import React, { forwardRef, useRef } from 'react';
import type { FC, ReactNode } from 'react';
import styles from './index.module.css';
import LoadingIcon from 'src/icons/LoadingIcon';
import { mergeRefs } from 'src/utils';
import { OptionType } from 'src/types';
type ChipsProps = {
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  onFocus?: () => void;
  chips: OptionType[];
  unselectOption: (value: OptionType) => void;
  searchTerm: string;
  onChange: (searchTerm: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  chipsRef: (state: HTMLDivElement) => void;
  errorMessage: string;
  showOptions: boolean;
  renderChips: (chips: OptionType[]) => ReactNode;
};

const Chips = forwardRef<FC, ChipsProps>(
  (
    {
      searchTerm,
      onChange,
      onKeyDown,
      chips,
      chipsRef,
      placeholder = '',
      onFocus,
      disabled = false,
      loading = false,
      errorMessage = '',
      showOptions = false,
      renderChips,
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
            <div ref={chipsRef}>{renderChips(chips)}</div>
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
          ) : !errorMessage ? (
            <div className={showOptions ? styles.arrowDown : styles.arrowRight} />
          ) : null}
        </div>
      </div>
    );
  }
);

export default Chips;
