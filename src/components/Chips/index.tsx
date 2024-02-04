import React, { useState } from 'react';
import type { FC, ReactNode } from 'react';
import styles from './index.module.css';
import LoadingIcon from 'src/icons/LoadingIcon';
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
  inputRef: (state: HTMLInputElement | null) => void;
  errorMessage: string;
  showOptions: boolean;
  renderChips: (chips: OptionType[]) => ReactNode;
};

const Chips: FC<ChipsProps> = ({
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
  inputRef,
}) => {
  const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);

  const handleFocus = () => {
    if (inputElement) {
      inputElement.focus();
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
              placeholder={chips.length ? '' : placeholder}
              value={searchTerm}
              onChange={(e) => {
                onChange(e.target.value);
              }}
              disabled={disabled}
              className={styles.input}
              ref={(ref) => {
                setInputElement(ref);
                inputRef(ref);
              }}
              onKeyDown={onKeyDown}
            />
          </div>
        </div>

        {loading ? (
          <div className={styles.iconLoading}>
            <LoadingIcon />
          </div>
        ) : !errorMessage ? (
          <div className={showOptions ? styles.arrowDown : styles.arrowUp} />
        ) : null}
      </div>
    </div>
  );
};

export default Chips;
