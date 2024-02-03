import React, { useState, useCallback } from 'react';
import AutoComplete from './components/Autocomplete';
type Result = {
  label: string;
  value: string;
  image: string;
  episodeCount: number;
};

function App() {
  const [searchResults, setSearchResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getSearchResults = useCallback((searchTerm: string) => {
    setLoading(true);
    fetch(`https://rickandmortyapi.com/api/character?name=${searchTerm}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setSearchResults([]);
        } else {
          setSearchResults(
            data.results.map((item: any) => {
              return { value: item.id, label: item.name, image: item.image, episodeCount: item.episode.length };
            })
          );
        }
      });
  }, []);

  return (
    <div>
      <AutoComplete searchResults={searchResults} getSearchResults={getSearchResults} loading={loading} />
    </div>
  );
}

export default App;
