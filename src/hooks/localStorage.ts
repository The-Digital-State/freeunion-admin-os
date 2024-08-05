import { useState, useEffect } from 'react';

const useLocalStorage = (key: string) => {
  // initialize the value from localStorage
  const [currentValue, setCurrentValue] = useState<string | null>(() => localStorage.getItem(key));
  console.log({
    currentValue,
  });

  // on every render, re-subscribe to the storage event
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.storageArea === localStorage) {
        if (currentValue && !localStorage.getItem(key)) {
          setCurrentValue(null);
        }
      }
      if (e.storageArea === localStorage && e.key === key) {
        setCurrentValue(e.newValue);
      }
    };

    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('storage', handler);
    };
  });

  // update localStorage when the currentValue changes via setCurrentValue
  useEffect(() => {
    localStorage.setItem(key, currentValue);
  }, [key, currentValue]);

  // use as const to tell TypeScript this is a tuple
  return [currentValue, setCurrentValue] as const;
};

export default useLocalStorage;
