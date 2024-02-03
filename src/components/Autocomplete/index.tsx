import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import useDebounce from 'src/hooks/useDebounce';
import styles from './index.module.css';
import Chips from 'src/components/Chips';
import Option from 'src/components/Option';
import { OptionType } from 'src/types';
import Chip from 'src/components/Chip';
type AutoCompleteProps = {
  disabled?: boolean;
  loading?: boolean;
  getSearchResults: (searchTerm: string) => void;
  options: OptionType[];
  style: React.CSSProperties;
  errorMessage: string;
  selectedOptions: OptionType[];
  onSelect: (option: OptionType, checked: boolean) => void;
  renderChips?: (chips: OptionType[]) => ReactNode;
};

const AutoComplete: FC<AutoCompleteProps> = ({
  style,
  getSearchResults,
  options,
  disabled = false,
  loading = false,
  errorMessage = '',
  onSelect,
  selectedOptions,
  renderChips,
}) => {
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedText = useDebounce<string>(searchTerm, 250);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [selectedChipIndex, setSelectedChipIndex] = useState<number>(-1);
  const [chipsElement, setChipsElement] = useState<HTMLDivElement | null>(null);
  const inputRef = useRef<any>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const defaultRenderChips = useCallback(
    (chips: OptionType[]) => {
      return chips.map((chip, index) => <Chip key={index} chip={chip} unselectOption={() => onSelect(chip, false)} />);
    },
    [onSelect]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickOutside = (event: any) => {
    if (fieldRef.current && !fieldRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  const handleFocusChips = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    getSearchResults(debouncedText);
  }, [debouncedText]);

  const removeOptionClass = () => {
    if (optionsRef.current) {
      const currentItem = selectedIndex !== -1 ? optionsRef.current.children[selectedIndex] : null;
      if (currentItem) {
        currentItem.classList.remove(styles.keySelected);
      }
    }
  };

  const addOptionClass = (index: number) => {
    if (optionsRef.current) {
      const nextItem = optionsRef.current.children[index];
      nextItem.classList.add(styles.keySelected);
      nextItem.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      setSelectedIndex(index);
    }
  };

  const addChipClass = (index: number) => {
    if (chipsElement) {
      const nextItem = chipsElement.children[index];
      nextItem.classList.add(styles.chipSelected);
      setSelectedChipIndex(index);
    }
  };

  const removeChipClass = () => {
    if (chipsElement) {
      const currentItem = selectedChipIndex !== -1 ? chipsElement.children[selectedChipIndex] : null;
      if (currentItem) {
        currentItem.classList.remove(styles.chipSelected);
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !searchTerm && selectedOptions.length && selectedChipIndex !== -1) {
      onSelect(selectedOptions[selectedChipIndex], false);
      handleFocusChips();
      handleRemoveClassNames();
    } else if (e.key === 'Backspace' && !searchTerm && selectedOptions.length) {
      onSelect(selectedOptions[selectedOptions.length - 1], false);
      handleFocusChips();
      handleRemoveClassNames();
    } else if (e.key === 'ArrowDown' || e.key === 'Tab') {
      removeOptionClass();
      if (selectedIndex < options.length - 1) {
        addOptionClass(selectedIndex + 1);
      } else {
        setSelectedIndex(-1);
      }
    } else if (e.key === 'ArrowUp') {
      removeOptionClass();
      if (selectedIndex > 0) {
        addOptionClass(selectedIndex - 1);
      } else if (selectedIndex === -1) {
        addOptionClass(options.length - 1);
      } else {
        setSelectedIndex(-1);
      }
    } else if (e.key === 'Enter' && optionsRef.current) {
      const currentItem = selectedIndex !== -1 ? (optionsRef.current.children[selectedIndex] as HTMLElement) : null;
      if (currentItem) {
        currentItem.click();
      }
    } else if (e.key === 'Escape' && inputRef.current) {
      inputRef.current.blur();
      setShowOptions(false);
      handleRemoveClassNames();
    } else if (e.key === 'ArrowRight') {
      removeChipClass();
      if (selectedChipIndex < selectedOptions.length - 1) {
        addChipClass(selectedChipIndex + 1);
      } else {
        setSelectedChipIndex(-1);
      }
    } else if (e.key === 'ArrowLeft') {
      removeChipClass();
      if (selectedChipIndex > 0) {
        addChipClass(selectedChipIndex - 1);
      } else if (selectedChipIndex === -1) {
        addChipClass(selectedOptions.length - 1);
      } else {
        setSelectedChipIndex(-1);
      }
    } else {
      handleRemoveClassNames();
    }
  };

  const handleRemoveClassNames = () => {
    removeChipClass();
    removeOptionClass();
    setSelectedChipIndex(-1);
    setSelectedIndex(-1);
  };

  return (
    <div
      className={styles.container}
      ref={fieldRef}
      onClick={handleFocusChips}
      style={style}
      onMouseLeave={() => {
        handleRemoveClassNames();
      }}
    >
      <Chips
        searchTerm={searchTerm}
        onChange={setSearchTerm}
        ref={inputRef}
        unselectOption={(option) => onSelect(option, false)}
        chips={selectedOptions}
        onFocus={() => setShowOptions(true)}
        loading={loading}
        disabled={disabled}
        onKeyDown={onKeyDown}
        chipsRef={setChipsElement}
        errorMessage={errorMessage}
        showOptions={showOptions}
        renderChips={renderChips ? renderChips : defaultRenderChips}
      />
      {options.length !== 0 && showOptions && (
        <div ref={optionsRef} className={styles.options}>
          {options.map((option, index) => (
            <Option
              key={index}
              option={option}
              checked={!!selectedOptions.find((item) => item.value === option.value)}
              onClick={(checked) => onSelect(option, checked)}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
      {errorMessage ? (
        <>
          <div className={styles.circle}>!</div>
          <p className={styles.errorMessage}>{errorMessage}</p>
        </>
      ) : null}
    </div>
  );
};

export default AutoComplete;
