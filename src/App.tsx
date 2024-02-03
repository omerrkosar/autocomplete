import React, { useState, useCallback } from 'react';
import AutoComplete from './components/Autocomplete';
import { OptionType } from './types';

function App() {
  const [options, setOptions] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getSearchResults = useCallback((searchTerm: string) => {
    setLoading(true);
    fetch(`https://rickandmortyapi.com/api/character?name=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setOptions([]);
        } else {
          setOptions(
            data.results.map((item: any) => {
              return { value: item.id, label: item.name, image: item.image, episodeCount: item.episode.length };
            })
          );
        }
      });
  }, []);

  return (
    <div>
      <AutoComplete
        style={{ width: '80%', margin: '50px' }}
        options={options}
        getSearchResults={getSearchResults}
        loading={loading}
      />
    </div>
  );
}

export default App;
