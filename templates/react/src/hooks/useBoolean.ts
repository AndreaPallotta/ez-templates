import { useState } from 'react';

const useBoolean = (initialState: boolean = false): [boolean, (newState?: boolean, callback?: () => Promise<void>) => void] => {
  const [state, setState] = useState(initialState);

  const handleSetState = (newState?: boolean) => {
    if (newState !== undefined) {
      setState(newState === true);
    } else {
      setState((prevState) => !prevState);
    }
  };

  const toggle = (newState?: boolean, callback?: () => Promise<void>) => {
    if (callback) {
      callback().then(() => {
        handleSetState(newState);
      });
    } else {
      handleSetState(newState);
    }
  };

  return [state, toggle];
};

export default useBoolean;
