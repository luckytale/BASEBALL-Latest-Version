import React, { useState } from 'react';
import { Box } from '@mui/material';

interface StrikeZoneProps {
  onClick: (data: CourseData) => void;
}

interface CourseData {
  course: number;
}

const StrikeZone: React.FC<StrikeZoneProps> = ({ onClick }) => {
  const [activeIndex, setActiveIndex] = useState<number>(13);

  const handleBoxClick = (index: number) => {
    setActiveIndex(index + 1);
    const data: CourseData = {
      course: index + 1,
    };
    onClick(data);
  };

  const outerIndices = [
    0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24,
  ];

  return (
    <Box
      sx={{
        width: 175,
        height: 210,
        border: '1px solid black',
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      {Array.from({ length: 25 }).map((_, index) => {
        const isTopBorder = index >= 6 && index <= 8;
        const isBottomBorder = index >= 16 && index <= 18;
        const isLeftBorder = index % 5 === 1 && index > 4 && index < 20;
        const isRightBorder = index % 5 === 3 && index > 4 && index < 20;

        return (
          <Box
            key={index}
            onClick={() => handleBoxClick(index)}
            sx={{
              width: '20%',
              height: '20%',
              backgroundColor:
                activeIndex === index + 1
                  ? 'red'
                  : outerIndices.includes(index)
                    ? 'gray'
                    : 'lightgray',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              boxSizing: 'border-box',
              borderTop: isTopBorder ? '3px solid black' : '1px solid black',
              borderBottom: isBottomBorder
                ? '3px solid black'
                : '1px solid black',
              borderLeft: isLeftBorder ? '3px solid black' : '1px solid black',
              borderRight: isRightBorder
                ? '3px solid black'
                : '1px solid black',
            }}
          />
        );
      })}
    </Box>
  );
};

export default StrikeZone;
