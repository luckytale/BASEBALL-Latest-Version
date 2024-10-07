import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface PitchTypeStatsProps {
  pitchType: string;
  pitchTypeCounts: { [key: string]: number };
  pitchesCount: number;
  maxBallSpeed: { [key: string]: number };
  averageBallSpeed: { [key: string]: number };
  strikeCounts: { [key: string]: number };
  swingStrikeCounts: { [key: string]: number };
  batCounts: { [key: string]: number };
  hitCounts: { [key: string]: number };
}

const PitchTypeStats: React.FC<PitchTypeStatsProps> = ({
  pitchType,
  pitchTypeCounts,
  pitchesCount,
  maxBallSpeed,
  averageBallSpeed,
  strikeCounts,
  swingStrikeCounts,
  batCounts,
  hitCounts,
}) => {
  const getPercentage = (pitchType: string): number => {
    const count = pitchTypeCounts[pitchType];
    const percentage = (count / pitchesCount) * 100;
    return Math.round(percentage * 10) / 10;
  };
  const getStrikePercentage = (pitchType: string): number => {
    const percentage =
      (strikeCounts[pitchType] / pitchTypeCounts[pitchType]) * 100;
    return Math.round(percentage * 10) / 10;
  };
  const getSwingStrikePercentage = (pitchType: string): number => {
    const percentage =
      (swingStrikeCounts[pitchType] / pitchTypeCounts[pitchType]) * 100;
    return Math.round(percentage * 10) / 10;
  };

  const getHitPercentage = (pitchType: string): number => {
    const percentage = (hitCounts[pitchType] / batCounts[pitchType]) * 100;
    return Math.round(percentage * 10) / 10;
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ height: 320, border: '1px dotted gray' }}
    >
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell>投球割合</TableCell>
            <TableCell>{getPercentage(pitchType)}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>最高球速</TableCell>
            <TableCell>{maxBallSpeed[pitchType]}km/h</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>平均球速</TableCell>
            <TableCell>{averageBallSpeed[pitchType]}km/h</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ストライク率</TableCell>
            <TableCell>{getStrikePercentage(pitchType)}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>空振り率</TableCell>
            <TableCell>{getSwingStrikePercentage(pitchType)}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>被打率</TableCell>
            <TableCell>{getHitPercentage(pitchType)}%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PitchTypeStats;
