import { useState,useEffect } from 'react';



export default function useDebounce<T>(
  value: T,
  delay: number
): T {

  const [state, setState] = useState<T>(value);

  useEffect(()=>{
    const timeout = setTimeout(()=>{
        setState(value)
    }, delay);

    return ()=>clearTimeout(timeout);

  },[value,delay])

  return state as T;
}