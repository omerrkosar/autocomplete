import React, { useState, useCallback } from 'react';
import type { FC } from 'react';
import styles from './index.module.css';
import LoadingIcon from 'src/icons/LoadingIcon';
import Chip from 'src/components/Chip';
import { ChipsProps, OptionType } from 'src/types';

const Chips: FC<ChipsProps> = ({
  searchTerm,
  onChange,
  onKeyDown,
  removeChip,
  chips,
  chipsRef,
  placeholder = '',
  onFocus,
  disabled = false,
  loading = false,
  errorMessage = '',
  renderChips,
  inputRef,
  rightIcon,
  loadingIcon,
}) => {
  const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);

  const handleFocus = () => {
    if (inputElement) {
      inputElement.focus();
    }
  };

  const defaultRenderChips = useCallback(
    (chips: OptionType[]) => {
      return chips.map((chip) => <Chip key={chip.value} chip={chip} removeChip={() => removeChip(chip)} />);
    },
    [removeChip]
  );

  return (
    <div className={styles.container}>
      <div className={styles.chipWrapper}>
        <div className={errorMessage ? styles.errorWrapper : styles.wrapper} onClick={handleFocus}>
          <div ref={chipsRef}>{renderChips ? renderChips(chips) : defaultRenderChips(chips)}</div>
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

        <div className={styles.iconContainer}>
          {loading ? (
            <>
              {loadingIcon ? (
                <>{loadingIcon}</>
              ) : (
                <>
                  <div className={styles.iconLoading}>
                    <LoadingIcon />
                  </div>
                </>
              )}
            </>
          ) : (
            <>{!errorMessage && rightIcon ? <>{rightIcon}</> : null}</>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chips;
