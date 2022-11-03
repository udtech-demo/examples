import React from 'react';

export const useOutsideClick = (callback: () => void) => {
  const ref = React.useRef<any>(null);

  React.useEffect(() => {
    function handleClickOutside(event: Event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);

  return {
    ref,
  };
};
