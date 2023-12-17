import { useState, useEffect } from 'react'

const PREFIX = '__whisper-live_dev_';

const usePersistedState = <T>(key: string, initialState: T) => {
  const [state, setState] = useState((() => {
    const storageValue = localStorage.getItem(PREFIX + key)

    if (storageValue) {
      return JSON.parse(storageValue) as T
    } else {
      return initialState
    }
  })());

  useEffect(() => {
    localStorage.setItem(PREFIX + key, JSON.stringify(state))
  }, [key, state]);

  return [state, setState] as const
}

export default usePersistedState
