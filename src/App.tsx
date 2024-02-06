import React, { useState, useCallback } from 'react';
import AutoComplete from 'src/components/Autocomplete';
import { OptionType, SearchResult } from 'src/types';

function App() {
  const [options, setOptions] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const removeChip = (option: OptionType) => {
    setSelectedOptions((state) => state.filter((item) => item.value !== option.value));
  };

  const selectOption = (option: OptionType) => {
    setSelectedOptions((state) => [...state.filter((item) => item.value !== option.value), option]);
  };

  const onSelect = (option: OptionType, checked: boolean) => {
    if (checked) {
      selectOption(option);
    } else {
      removeChip(option);
    }
  };

  const getOptions = useCallback((searchTerm: string, controller: AbortController) => {
    setLoading(true);
    fetch(`https://rickandmortyapi.com/api/character?name=${searchTerm}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErrorMessage(data.error);
          setOptions([]);
        } else {
          setErrorMessage('');
          setOptions(
            data.results.map((item: SearchResult) => {
              return { value: item.id, label: item.name, image: item.image, episodeCount: item.episode.length };
            })
          );
        }
        setLoading(false);
      })
      .catch(() => {
        setErrorMessage('Fetch Error!');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <AutoComplete
        errorMessage={errorMessage}
        style={{ width: '80%' }}
        options={options}
        getOptions={getOptions}
        loading={loading}
        onSelect={onSelect}
        selectedOptions={selectedOptions}
        placeholder="Select..."
      />
    </div>
  );
}

export default App;
