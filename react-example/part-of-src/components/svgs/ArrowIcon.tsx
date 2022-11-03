import React from 'react';

interface ArrowIconProps {}

export const ArrowIcon: React.FC<ArrowIconProps> = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7">
      <g>
        <g opacity=".3">
          <path
            fill="#2a2f2a"
            d="M6 4.568L10.278.295a1.01 1.01 0 0 1 1.427 0 1.006 1.006 0 0 1 0 1.424L6.713 6.705a1.01 1.01 0 0 1-1.426 0L.295 1.719a1.006 1.006 0 0 1 0-1.424 1.01 1.01 0 0 1 1.427 0z"
          />
        </g>
      </g>
    </svg>
  );
};
