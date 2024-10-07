import React from 'react';
import { Box, Typography } from '@mui/material';
import { PitchingResults } from '../api/pitching-results-get';

interface PitchingResultsProps {
  pitchType: string;
  pitchTypeCounts: { [key: string]: number };
  filteredPitchingResults: PitchingResults[];
}

const CoursePitchingRatio: React.FC<PitchingResultsProps> = ({
  pitchType,
  pitchTypeCounts,
  filteredPitchingResults,
}) => {
  const filteredResults = filteredPitchingResults.filter(
    (result) => result.pitchType === pitchType
  );

  const courseCounts: { [key: number]: number } = {};
  for (let i = 0; i <= 24; i++) {
    courseCounts[i] = 0;
  }

  filteredResults.forEach(({ course }) => {
    courseCounts[course - 1] = (courseCounts[course - 1] || 0) + 1;
  });

  const squares = Array.from({ length: 5 }, (_, rowIndex) =>
    Array.from({ length: 5 }, (_, colIndex) => {
      const index = rowIndex * 5 + colIndex;
      return (
        Math.floor((courseCounts[index] / pitchTypeCounts[pitchType]) * 100) ||
        0
      );
    })
  );

  const flatSquares = squares.flat();

  const topThree = flatSquares
    .map((value, index) => ({ value, position: index }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map((item) => item.position);

  const grayIndices = [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24];

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns="repeat(5, 1fr)"
        gap={0}
        width={200}
        height={250}
        style={{ boxSizing: 'border-box' }}
      >
        {squares.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const index = rowIndex * 5 + colIndex;
            let bgcolor;

            if (topThree.includes(index) && value !== 0) {
              const shade = topThree.indexOf(index);
              bgcolor = `rgba(255, 0, 0, ${1 - shade * 0.2})`;
            } else if (grayIndices.includes(index)) {
              bgcolor = 'gray';
            } else {
              bgcolor = 'lightgray';
            }

            const isCenter =
              rowIndex >= 1 && rowIndex <= 3 && colIndex >= 1 && colIndex <= 3;
            const isTopBorder = isCenter && rowIndex === 1;
            const isBottomBorder = isCenter && rowIndex === 3;
            const isLeftBorder = isCenter && colIndex === 1;
            const isRightBorder = isCenter && colIndex === 3;

            return (
              <Box
                key={`${rowIndex}-${colIndex}`}
                display="flex"
                justifyContent="center"
                alignItems="center"
                bgcolor={bgcolor}
                borderTop={isTopBorder ? '2px solid black' : '1px solid black'}
                borderBottom={
                  isBottomBorder ? '2px solid black' : '1px solid black'
                }
                borderLeft={
                  isLeftBorder ? '2px solid black' : '1px solid black'
                }
                borderRight={
                  isRightBorder ? '2px solid black' : '1px solid black'
                }
                width="40px"
                height="50px"
                style={{ boxSizing: 'border-box' }}
              >
                {value > 0 ? (
                  <Typography variant="subtitle1">{value}%</Typography>
                ) : null}
              </Box>
            );
          })
        )}
      </Box>
    </>
  );
};

export default CoursePitchingRatio;
