import React, { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import useDebounce from '../../hooks/useDebounce';
import styles from './index.module.css';
import Chips from '../Chips';
import Option from '../Option';
import { OptionType } from '../../types';
type AutoCompleteProps = {
  disabled?: boolean;
  loading?: boolean;
  getSearchResults: (searchTerm: string) => void;
  options: OptionType[];
  style: any;
};

const AutoComplete: FC<AutoCompleteProps> = ({
  style,
  getSearchResults,
  options,
  disabled = false,
  loading = false,
}) => {
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const debouncedText = useDebounce<string>(searchTerm, 250);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [selectedChipIndex, setSelectedChipIndex] = useState<number>(-1);
  const [chipsElement, setChipsElement] = useState<HTMLDivElement | null>(null);
  const inputRef = useRef<any>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickOutside = (event: any) => {
    if (fieldRef.current && !fieldRef.current.contains(event.target)) {
      setShowResults(false);
    }
  };

  const deleteItem = (option: OptionType) => {
    setSelectedOptions((state) => state.filter((item) => item.value !== option.value));
  };

  const selectItem = (option: OptionType) => {
    setSelectedOptions((state) => [...state.filter((item) => item.value !== option.value), option]);
  };

  const onClickCheckBox = (checked: boolean, option: OptionType) => {
    if (checked) {
      selectItem(option);
    } else {
      deleteItem(option);
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
      const copySelectedOptions = [
        ...selectedOptions.slice(0, selectedChipIndex),
        ...selectedOptions.slice(selectedChipIndex + 1, selectedOptions.length),
      ];
      setSelectedOptions(copySelectedOptions);
      handleFocusChips();
      removeOptionClass();
      removeChipClass();
    } else if (e.key === 'Backspace' && !searchTerm && selectedOptions.length) {
      const copySelectedOptions = [...selectedOptions];
      copySelectedOptions.pop();
      setSelectedOptions(copySelectedOptions);
      handleFocusChips();
      removeOptionClass();
      removeChipClass();
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
      } else {
        setSelectedIndex(options.length);
      }
    } else if (e.key === 'Enter' && optionsRef.current) {
      const currentItem = selectedIndex !== -1 ? (optionsRef.current.children[selectedIndex] as HTMLElement) : null;
      if (currentItem) {
        currentItem.classList.remove(styles.keySelected);
        currentItem.click();
      }
    } else if (e.key === 'Escape' && inputRef.current) {
      inputRef.current.blur();
      setShowResults(false);
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
      } else {
        setSelectedChipIndex(selectedOptions.length);
      }
    } else {
    }
  };

  return (
    <div
      className={styles.container}
      ref={fieldRef}
      onClick={handleFocusChips}
      style={style}
      onMouseLeave={() => {
        setSelectedIndex(-1);
        removeOptionClass();
      }}
    >
      <Chips
        searchTerm={searchTerm}
        onChange={setSearchTerm}
        ref={inputRef}
        deleteItem={deleteItem}
        chips={selectedOptions}
        onFocus={() => setShowResults(true)}
        loading={loading}
        disabled={disabled}
        onKeyDown={onKeyDown}
        chipsRef={setChipsElement}
      />
      {options.length !== 0 && showResults && (
        <div ref={optionsRef} className={styles.options}>
          {options.map((option, index) => (
            <Option
              key={index}
              {...option}
              checked={!!selectedOptions.find((item) => item.value === option.value)}
              onClick={(checked) => onClickCheckBox(checked, option)}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
