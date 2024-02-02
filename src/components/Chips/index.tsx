import React,{forwardRef,useEffect, useRef,useState} from 'react'
import type { FC } from 'react';
import useDebounce from '../../hooks/useDebounce';
import styles from './index.module.css'
import LoadingIcon from '../../icons/LoadingIcon';
import { mergeRefs } from '../../utils';

interface ChipsProps {
    placeholder?: string;
    disabled?:boolean;
    loading?:boolean;
    getSearchResults:(searchTerm:string)=>void;
    onFocus?:()=>void;
    chips:Result[];
    deleteItem:(value:Result)=>void;
  }

  interface Result {
    label:string;
    value:string;
  }

  

const Chips = forwardRef<FC, ChipsProps>(({getSearchResults,deleteItem,chips,placeholder='',onFocus=()=>{},disabled=false,loading=false},ref)=> {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [searchTerm,setSearchTerm] = useState<string>('');
    const debouncedText = useDebounce<string>(searchTerm,250);
  

    const handleFocus = () => {
        if(inputRef.current){
            inputRef.current.focus();
        }
		
	};




    useEffect(()=>{
        getSearchResults(debouncedText);
    },[debouncedText])


    return <div className={styles.container} >
                <div className={styles.chipWrapper}>
                    <ul className={styles.wrapper} onClick={handleFocus} >
                        {chips.map((chip,index)=>(
                            <li key={index} className={styles.chip}><p>{chip.label}</p><p onClick={()=>deleteItem(chip)}>x</p></li>
                        ))}
                        <li className={styles.inputContainer}>
                            <input
                                onFocus={onFocus}
                                type='text'
                                placeholder={placeholder}
                                value={searchTerm}
                                onChange={e => { setSearchTerm(e.target.value)}}
                                disabled={disabled}
                                className={styles.input}
                                ref={mergeRefs(inputRef,ref)}
                            />
                        </li>
                    </ul>
                {loading && <div className='iconLoading'><LoadingIcon /></div>}
                </div>   
            </div>
})

export default Chips;