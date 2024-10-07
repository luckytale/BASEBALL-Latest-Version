import React from 'react';
import { Box, Typography } from '@mui/material';
import { PitchingResults } from '../api/pitching-results-get';

interface PitchingResultsProps {
  pitchType: string;
  filteredPitchingResults: PitchingResults[];
}

const CourseHitRatio: React.FC<PitchingResultsProps> = ({
  pitchType,
  filteredPitchingResults,
}) => {
  let filteredResults = filteredPitchingResults;

  if (pitchType === 'ストレート') {
    filteredResults = filteredPitchingResults.filter(
      (result) => result.pitchType === pitchType
    );
  } else if (pitchType === '変化球') {
    filteredResults = filteredPitchingResults.filter(
      (result) => result.pitchType !== 'ストレート'
    );
  }

  const courseCounts: { [key: number]: number } = {};
  const courseHitCounts: { [key: number]: number } = {};

  filteredResults.forEach(({ course, angle }) => {
    if (
      angle &&
      angle !== '四球' &&
      angle !== '死球' &&
      angle !== '犠打' &&
      angle !== '犠飛'
    )
      courseCounts[course - 1] = (courseCounts[course - 1] || 0) + 1;
    if (
      angle === '安打' ||
      angle === '二塁打' ||
      angle === '三塁打' ||
      angle === '本塁打'
    ) {
      courseHitCounts[course - 1] = (courseHitCounts[course - 1] || 0) + 1;
    }
  });

  const squares = Array.from({ length: 5 }, (_, rowIndex) =>
    Array.from({ length: 5 }, (_, colIndex) => {
      const index = rowIndex * 5 + colIndex;

      if (courseCounts[index] === 0) {
        return null;
      } else {
        const hitCount =
          courseHitCounts[index] !== undefined ? courseHitCounts[index] : 0;
        const ratio = (hitCount / courseCounts[index]).toFixed(3);
        return ratio;
      }
    })
  );

  const grayIndices = [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24];

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns="repeat(5, 1fr)"
        gap={0}
        width={220}
        height={275}
        style={{ boxSizing: 'border-box' }}
      >
        {squares.map((row, rowIndex) =>
          row.map((value, colIndex) => {
            const index = rowIndex * 5 + colIndex;
            let bgcolor;

            if (Number(value) >= 0.3 && !grayIndices.includes(index)) {
              bgcolor = '#f44336';
            } else if (Number(value) < 0.2 && !grayIndices.includes(index)) {
              bgcolor = '#bbdefb';
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
                width="44px"
                height="55px"
                style={{ boxSizing: 'border-box' }}
              >
                {!grayIndices.includes(index) && !isNaN(Number(value)) ? (
                  <Typography variant="subtitle1">
                    {value !== null
                      ? value.toString().replace(/^0\./, '.')
                      : ''}
                  </Typography>
                ) : null}
              </Box>
            );
          })
        )}
      </Box>
    </>
  );
};

export default CourseHitRatio;
