import { PitchingResults } from '../api/pitching-results-get';
import groundImage from '../assets/images/ground.jpg';
import { Box } from '@mui/material';

interface BattingDirectionProps {
  filteredPitchingResults: PitchingResults[];
  pitchType: string;
}

const BattingDirection: React.FC<BattingDirectionProps> = ({
  pitchType,
  filteredPitchingResults,
}) => {
  let filteredResults = filteredPitchingResults;

  if (pitchType === '変化球') {
    filteredResults = filteredPitchingResults.filter(
      (result) =>
        result.pitchType !== 'ストレート' && result.x !== 0 && result.y !== 0
    );
  } else {
    filteredResults = filteredPitchingResults.filter(
      (result) =>
        result.pitchType === pitchType && result.x !== 0 && result.y !== 0
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          src={groundImage}
          alt="Ground"
          style={{ width: '300px', height: 'auto', cursor: 'pointer' }}
        />
        {filteredResults.map((pitchingResult) => {
          let color;
          switch (pitchingResult.angle) {
            case '安打':
            case '二塁打':
            case '三塁打':
            case '本塁打':
              color = 'blue';
              break;
            case 'ゴロ':
              color = 'yellow';
              break;
            case '飛':
            case '直':
              color = 'red';
              break;
            default:
              color = 'purple';
          }

          return (
            <div
              key={pitchingResult.resultId}
              style={{
                position: 'absolute',
                top: `${pitchingResult.y}px`,
                left: `${pitchingResult.x}px`,
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: color,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}
      </div>
      <Box
        sx={{
          border: '1px solid gray',
          padding: 1,
          marginBottom: 3,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            backgroundColor: 'yellow',
            borderRadius: '50%',
            marginRight: 8,
            border: '0.1px solid black',
          }}
        ></span>
        ゴロ
        <br />
        <span
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            backgroundColor: 'red',
            borderRadius: '50%',
            marginRight: 8,
          }}
        ></span>
        フライ
        <br />
        <span
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            backgroundColor: 'blue',
            borderRadius: '50%',
            marginRight: 8,
          }}
        ></span>
        安打
        <br />
        <span
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            backgroundColor: 'purple',
            borderRadius: '50%',
            marginRight: 8,
          }}
        ></span>
        その他
      </Box>
    </div>
  );
};

export default BattingDirection;
