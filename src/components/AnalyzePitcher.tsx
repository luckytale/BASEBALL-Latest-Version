import { useEffect, useState } from 'react';
import { Teams, fetchTeams } from '../api/teams-get';
import { Players, fetchPlayers } from '../api/players-get';
import {
  PitchingResults,
  fetchPitchingResults,
} from '../api/pitching-results-get';
import { PieChart } from '@mui/x-charts/PieChart';
import PitchTypeData from './PitchTypeData';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Auth0UserId } from '../context/Auth0UserId';

const AnalyzePitcher = () => {
  const userId = Auth0UserId();
  const [teams, setTeams] = useState<Teams[]>([]);
  const [players, setPlayers] = useState<Players[]>([]);
  const [teamName, setTeamName] = useState<string>('Team1');
  const [pitcherName, setPitcherName] = useState<string>('バセバル20');
  const [pitchingResults, setPitchingResults] = useState<PitchingResults[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleTeamNameChange = (event: SelectChangeEvent) => {
    setTeamName(event.target.value as string);
  };
  const handlePitcherNameChange = (event: SelectChangeEvent) => {
    setPitcherName(event.target.value as string);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTeams = await fetchTeams(userId);
        setTeams(fetchedTeams);
        const fetchedPitchingResults = await fetchPitchingResults(userId);
        setPitchingResults(fetchedPitchingResults);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('予期しないエラーが発生しました。');
        }
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPlayers = await fetchPlayers(userId);
        const filteredPlayers = fetchedPlayers.filter(
          (player) =>
            player.userId === userId &&
            player.teamName === teamName &&
            player.position === '投手'
        );
        setPlayers(filteredPlayers);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('データの取得に失敗しました。');
        }
      }
    };

    fetchData();
  }, [userId, teamName]);

  if (error) {
    return <div>{error}</div>;
  }

  const filteredPitchingResults = pitchingResults.filter(
    (pitchingResult) => pitchingResult.pitcherName === pitcherName
  );

  const pitchTypeCounts: { [key: string]: number } = {};
  const maxBallSpeed: { [key: string]: number } = {};
  const totalBallSpeed: { [key: string]: number } = {};
  const nullBallSpeedCounts: { [key: string]: number } = {};
  const averageBallSpeed: { [key: string]: number } = {};
  const angleCounts: { [key: string]: number } = {};
  const strikeCounts: { [key: string]: number } = {};
  const swingStrikeCounts: { [key: string]: number } = {};
  const batCounts: { [key: string]: number } = {};
  const hitCounts: { [key: string]: number } = {};

  filteredPitchingResults.forEach(({ pitchType, ballSpeed, result, angle }) => {
    if (!pitchTypeCounts[pitchType]) {
      pitchTypeCounts[pitchType] = 0;
    }
    if (!nullBallSpeedCounts[pitchType]) {
      nullBallSpeedCounts[pitchType] = 0;
    }

    pitchTypeCounts[pitchType] += 1;

    if (totalBallSpeed[pitchType]) {
      totalBallSpeed[pitchType] += ballSpeed;
    } else {
      totalBallSpeed[pitchType] = ballSpeed;
    }

    if (!maxBallSpeed[pitchType] || maxBallSpeed[pitchType] < ballSpeed)
      maxBallSpeed[pitchType] = ballSpeed;
    if (ballSpeed === 0) {
      nullBallSpeedCounts[pitchType] += 1;
    }
    if (result !== 'ボール' && result !== '四球') {
      if (strikeCounts[pitchType]) {
        strikeCounts[pitchType] += 1;
      } else {
        strikeCounts[pitchType] = 1;
      }
    }
    if (result === '空振り' || result === '空三振') {
      if (swingStrikeCounts[pitchType]) {
        swingStrikeCounts[pitchType] += 1;
      } else {
        swingStrikeCounts[pitchType] = 1;
      }
    }
    switch (angle) {
      case '安打':
      case '二塁打':
      case '三塁打':
      case '本塁打':
        hitCounts[pitchType] = (hitCounts[pitchType] || 0) + 1;
        break;
    }
    if (angle && angle !== '四球') {
      batCounts[pitchType] = (batCounts[pitchType] || 0) + 1;
    }
  });

  Object.keys(totalBallSpeed).forEach((pitchType) => {
    averageBallSpeed[pitchType] =
      Math.round(
        (totalBallSpeed[pitchType] /
          (pitchTypeCounts[pitchType] - nullBallSpeedCounts[pitchType])) *
          10
      ) / 10;
  });

  filteredPitchingResults.forEach(({ angle }) => {
    switch (angle) {
      case '安打':
      case '二塁打':
      case '三塁打':
      case '本塁打':
        angleCounts['被安打'] = (angleCounts['被安打'] || 0) + 1;
        break;
      case '飛':
      case '直':
        angleCounts['フライ'] = (angleCounts['フライ'] || 0) + 1;
        break;
      case 'ゴロ':
      case '空三振':
      case '見三振':
      case '四球':
        angleCounts[angle] = (angleCounts[angle] || 0) + 1;
        break;
    }
  });

  const pieChartData = Object.keys(pitchTypeCounts).map((key, index) => ({
    id: index,
    label: key,
    value: pitchTypeCounts[key],
  }));

  const AnglePieChartData = Object.keys(angleCounts).map((key, index) => ({
    id: index,
    label: key,
    value: angleCounts[key],
  }));

  const pitchesCount = filteredPitchingResults.length;

  return (
    <>
      <div>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="demo-simple-select-label">Team</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={teamName}
              label="TeamName"
              onChange={handleTeamNameChange}
            >
              {teams.map((team) => (
                <MenuItem key={team.userId} value={team.teamName}>
                  {team.teamName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
      <div>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Pitcher</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={pitcherName}
              label="PitcherName"
              onChange={handlePitcherNameChange}
            >
              {players.map((player) => (
                <MenuItem key={player.userId} value={player.playerName}>
                  {player.playerName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>

      <div style={{ display: 'flex', marginBottom: 50 }}>
        <div style={{ marginRight: 50 }}>
          <h2>球種</h2>
          <PieChart
            series={[
              {
                data: pieChartData,
              },
            ]}
            width={500}
            height={200}
          />
        </div>
        <div>
          <h2>結果</h2>
          <PieChart
            series={[
              {
                data: AnglePieChartData,
              },
            ]}
            width={400}
            height={200}
          />
        </div>
      </div>

      <h2>球種別データ</h2>
      <PitchTypeData
        filteredPitchingResults={filteredPitchingResults}
        pitchTypeCounts={pitchTypeCounts}
        pitchesCount={pitchesCount}
        maxBallSpeed={maxBallSpeed}
        averageBallSpeed={averageBallSpeed}
        strikeCounts={strikeCounts}
        swingStrikeCounts={swingStrikeCounts}
        batCounts={batCounts}
        hitCounts={hitCounts}
        pitcherName={pitcherName}
      />
    </>
  );
};

export default AnalyzePitcher;
