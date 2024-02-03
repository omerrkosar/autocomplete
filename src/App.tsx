import React, { useState, useCallback } from 'react';
import AutoComplete from './components/Autocomplete';
import { OptionType } from './types';

function App() {
  const [options, setOptions] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const getSearchResults = useCallback((searchTerm: string) => {
    setLoading(true);
    fetch(`https://rickandmortyapi.com/api/character?name=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErrorMessage(data.error);
          setOptions([]);
        } else {
          setErrorMessage('');
          setOptions(
            data.results.map((item: any) => {
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
        getSearchResults={getSearchResults}
        loading={loading}
      />
    </div>
  );
}

export default App;
