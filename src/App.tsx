import React,{useState,useCallback} from 'react';
import AutoComplete from './components/Autocomplete'
import {getResult} from './apollo';
interface Result {
  label:string;
  value:string;
}

function App() {
  const [searchResults,setSearchResults] = useState<Result[]>([]);
  const [loading,setLoading] = useState<boolean>(false);

  const getSearchResults = useCallback((searchTerm:string)=>{
    setLoading(true);
    getResult(`query { characters(page: 1, filter: { name: "${searchTerm}" }) {info {count}results {name}}location(id: 1) { id}episodesByIds(ids: [1, 2]) {id}}`)
    .then((res:any)=>{
      setLoading(false);
      console.log(res.data.characters.results);
      setSearchResults(res.data.characters.results.map((item:any)=>{
        return {value:item.name,label:item.name};
      }))
    })
  },[])


  return (
    <div>
      <AutoComplete searchResults={searchResults} getSearchResults={getSearchResults} loading={loading}/>
    </div>
  );
}

export default App;
