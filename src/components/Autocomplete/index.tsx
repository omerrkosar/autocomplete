import React, { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import useDebounce from '../../hooks/useDebounce';
import styles from './index.module.css';
import Chips from '../Chips';
type Result = {
  label: string;
  value: string;
  image: string;
  episodeCount: number;
};

type AutoCompleteProps = {
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  getSearchResults: (searchTerm: string) => void;
  searchResults: Result[];
};

const AutoComplete: FC<AutoCompleteProps> = ({
  getSearchResults,
  searchResults,
  disabled = false,
  loading = false,
}) => {
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<Result[]>([]);
  const debouncedText = useDebounce<string>(searchTerm, 250);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickOutside = (event: any) => {
    if (fieldRef.current && !fieldRef.current.contains(event.target)) {
      setShowResults(false);
    }
  };

  const deleteItem = (result: Result) => {
    setSelectedItems((state) => state.filter((item) => item.value !== result.value));
  };

  const selectItem = (result: Result) => {
    setSelectedItems((state) => [...state.filter((item) => item.value !== result.value), result]);
  };

  const onClickCheckBox = (e: React.ChangeEvent<HTMLInputElement>, result: Result) => {
    if (e.target.checked) {
      selectItem(result);
    } else {
      deleteItem(result);
    }
  };

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    getSearchResults(debouncedText);
  }, [debouncedText]);

  useEffect(() => {
    searchResults.map((result) => {
      const indexOfSearchTerm = result.label.toLowerCase().indexOf(searchTerm.toLowerCase());
      console.log(indexOfSearchTerm);
      console.log(result.label.substr(0, indexOfSearchTerm));
      console.log(result.label.substr(indexOfSearchTerm + searchTerm.length, -1));
    });
  }, [searchResults]);

  return (
    <div className={styles.container} ref={fieldRef} onClick={handleFocus}>
      <Chips
        searchTerm={searchTerm}
        onChange={setSearchTerm}
        ref={inputRef}
        deleteItem={deleteItem}
        chips={selectedItems}
        onFocus={() => setShowResults(true)}
        loading={loading}
        disabled={disabled}
      />
      {searchResults.length !== 0 && showResults && (
        <div className={styles.results}>
          {searchResults.map((result) => {
            const indexOfSearchTerm = result.label.toLowerCase().indexOf(searchTerm.toLowerCase());

            return (
              <div key={result.value} className={styles.resultTextContainer}>
                <input
                  type="checkbox"
                  checked={!!selectedItems.find((item) => item.value === result.value)}
                  onChange={(e) => onClickCheckBox(e, result)}
                />
                <p>
                  {result.label.substring(0, indexOfSearchTerm)}
                  <b>{result.label.substring(indexOfSearchTerm, indexOfSearchTerm + searchTerm.length)}</b>
                  {result.label.substring(indexOfSearchTerm + searchTerm.length, result.label.length)}
                </p>

                <p>{result.episodeCount} Episodes</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
