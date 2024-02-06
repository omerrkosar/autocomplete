import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { FC } from 'react';
import useDebounce from 'src/hooks/useDebounce';
import styles from './index.module.css';
import Chips from 'src/components/Chips';
import Option from 'src/components/Option';
import { OptionType, AutoCompleteProps } from 'src/types';
import { assertIsNode } from 'src/utils';
import ArrowDown from 'src/icons/ArrowDown';
import ArrowUp from 'src/icons/ArrowUp';

const getOptionLabel = (option: OptionType, searchTerm: string) => {
  const indexOfSearchTerm = option.label.toLowerCase().indexOf(searchTerm.toLowerCase());
  const label = (
    <p className={styles.label}>
      {option.label.substring(0, indexOfSearchTerm)}
      <b>{option.label.substring(indexOfSearchTerm, indexOfSearchTerm + searchTerm.length)}</b>
      {option.label.substring(indexOfSearchTerm + searchTerm.length, option.label.length)}
    </p>
  );
  return label;
};

const AutoComplete: FC<AutoCompleteProps> = ({
  className = '',
  placeholder = '',
  style,
  getOptions,
  options,
  disabled = false,
  loading = false,
  errorMessage = '',
  onSelect,
  selectedOptions,
  renderChips,
  renderOptions,
}) => {
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedText = useDebounce<string>(searchTerm, 250);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [selectedChipIndex, setSelectedChipIndex] = useState<number>(-1);
  const [chipsElement, setChipsElement] = useState<HTMLDivElement | null>(null);
  const [inputElement, setInputElement] = useState<HTMLInputElement | null>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const defaultRenderOptions = useCallback(
    (options: OptionType[]) => {
      return options.map((option) => {
        const label = getOptionLabel(option, debouncedText);
        return (
          <Option
            key={option.value}
            option={option}
            label={label}
            checked={!!selectedOptions.find((item) => item.value === option.value)}
            onClick={(checked) => onSelect(option, checked)}
          />
        );
      });
    },
    [onSelect]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    assertIsNode(event.target);
    if (fieldRef.current && !fieldRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  const handleFocusChips = () => {
    if (inputElement) {
      inputElement.focus();
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    getOptions(debouncedText, controller);

    return () => {
      controller.abort();
    };
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
    } else if (e.key === 'ArrowDown') {
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
    } else if (e.key === 'Escape' && inputElement) {
      inputElement.blur();
      setShowOptions(false);
      handleRemoveClassNames();
    } else if (e.key === 'ArrowRight' && !searchTerm) {
      removeChipClass();
      if (selectedChipIndex < selectedOptions.length - 1) {
        addChipClass(selectedChipIndex + 1);
      } else {
        setSelectedChipIndex(-1);
      }
    } else if (e.key === 'ArrowLeft' && !searchTerm) {
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
      className={`${styles.container} ${className}`}
      ref={fieldRef}
      onClick={handleFocusChips}
      style={style}
      onMouseLeave={() => {
        handleRemoveClassNames();
      }}
    >
      <Chips
        inputValue={searchTerm}
        onChange={setSearchTerm}
        inputRef={setInputElement}
        removeChip={(option) => onSelect(option, false)}
        chips={selectedOptions}
        onFocus={() => setShowOptions(true)}
        loading={loading}
        disabled={disabled}
        onKeyDown={onKeyDown}
        chipsRef={setChipsElement}
        errorMessage={errorMessage}
        placeholder={placeholder}
        renderChips={renderChips}
        rightIcon={showOptions ? <ArrowDown /> : <ArrowUp />}
      />
      {options.length !== 0 && showOptions && (
        <div ref={optionsRef} className={styles.options}>
          {renderOptions ? renderOptions(options) : defaultRenderOptions(options)}
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
