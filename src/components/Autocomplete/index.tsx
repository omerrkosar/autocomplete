import React,{useEffect, useRef,useState} from 'react'
import type { FC } from 'react';
import useDebounce from '../../hooks/useDebounce';
import styles from './index.module.css'
import LoadingIcon from '../../icons/LoadingIcon';
import Chips from '../Chips';
interface Result {
    label:string;
    value:string;
  }


interface AutoCompleteProps {
    placeholder?: string;
    disabled?:boolean;
    loading?:boolean;
    getSearchResults:(searchTerm:string)=>void;
    searchResults:Result[];
  }


const AutoComplete: FC<AutoCompleteProps> = ({getSearchResults,searchResults,placeholder='',disabled=false,loading=false})=> {
    const fieldRef = useRef<HTMLDivElement | null>(null);
    const [showResults,setShowResults] = useState<boolean>(false);
    const [selectedItems,setSelectedItems] = useState<Result[]>([]);
    const inputRef = useRef<any>(null);


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleClickOutside = (event:any) => {
        if (fieldRef.current && !fieldRef.current.contains(event.target)) {
            setShowResults(false)
            
        }
    }

    const deleteItem = (result:Result)=> {
        setSelectedItems((state)=>state.filter(item=>item.value!==result.value));
    }

    const selectItem = (result:Result) => {
        setSelectedItems((state)=>[...state.filter(item=>item.value!==result.value),result])
    }

    const onClickCheckBox = (e:React.ChangeEvent<HTMLInputElement>,result:Result) => {
        if(e.target.checked){
            selectItem(result)
        }
        else{
            deleteItem(result)
        }
       
    }


    const handleFocus = () => {
        if(inputRef.current){
            inputRef.current.focus();
        }
	};




    return <div className={styles.container} ref={fieldRef} onClick={handleFocus}>
    <Chips ref={inputRef} getSearchResults={getSearchResults} deleteItem={deleteItem} chips={selectedItems} onFocus={()=>setShowResults(true)} loading={loading} disabled={disabled} />
    {searchResults.length !== 0 && showResults && <div className={styles.results}>
        {searchResults.map(result => <div key={result.value}>
            <input type='checkbox' checked={!!selectedItems.find(item=>item.value===result.value)} onChange={(e)=>onClickCheckBox(e,result)} />
            <p>{result.label}</p>
            
        </div>)}
    </div>}
    
</div>
}

export default AutoComplete;