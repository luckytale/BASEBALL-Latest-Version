import { useEffect, useState } from 'react';
import { Teams, fetchTeams } from '../api/teams-get';
import { Players, fetchPlayers } from '../api/players-get';
import {
  PitchingResults,
  fetchPitchingResults,
} from '../api/pitching-results-get';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import BattingDirection from './BattingDirection';
import CourseHitRatio from './CourseHitRatio';
import { Auth0UserId } from '../context/Auth0UserId';

const AnalyzeBatter = () => {
  const userId = Auth0UserId();
  const [teams, setTeams] = useState<Teams[]>([]);
  const [players, setPlayers] = useState<Players[]>([]);
  const [teamName, setTeamName] = useState<string>('Team2');
  const [batterName, setBatterName] = useState<string>('バセバル77');
  const [pitchingResults, setPitchingResults] = useState<PitchingResults[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleTeamNameChange = (event: SelectChangeEvent) => {
    setTeamName(event.target.value as string);
  };
  const handleBatterNameChange = (event: SelectChangeEvent) => {
    setBatterName(event.target.value as string);
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
            player.position !== '投手'
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
    (pitchingResult) => pitchingResult.batterName === batterName
  );

  const filteredRightPitchingResults = filteredPitchingResults.filter(
    (pitchingResult) => pitchingResult.pitcherHand === '右投'
  );
  const filteredLeftPitchingResults = filteredPitchingResults.filter(
    (pitchingResult) => pitchingResult.pitcherHand === '左投'
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
      <div style={{ marginBottom: 15 }}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Batter</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={batterName}
              label="BatterName"
              onChange={handleBatterNameChange}
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
      <div style={{ border: '10px solid #ffebee' }}>
        <h2>右投手</h2>
        <div style={{ paddingLeft: 10, paddingRight: 10 }}>
          <h2 style={{ marginBottom: 0 }}>ストレート</h2>
          <div style={{ paddingLeft: 20, paddingRight: 20 }}>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <h2>コース別打率</h2>
                <CourseHitRatio
                  pitchType="ストレート"
                  filteredPitchingResults={filteredRightPitchingResults}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h2>打球方向</h2>
                <BattingDirection
                  pitchType="ストレート"
                  filteredPitchingResults={filteredRightPitchingResults}
                />
              </div>
            </div>
          </div>
          <h2 style={{ marginBottom: 0 }}>変化球</h2>
          <div style={{ paddingLeft: 20, paddingRight: 20 }}>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <h2>コース別打率</h2>
                <CourseHitRatio
                  pitchType="変化球"
                  filteredPitchingResults={filteredRightPitchingResults}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h2>打球方向</h2>
                <BattingDirection
                  pitchType="変化球"
                  filteredPitchingResults={filteredRightPitchingResults}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ border: '10px solid #e3f2fd' }}>
        <h2>左投手</h2>
        <div style={{ paddingLeft: 10, paddingRight: 10 }}>
          <h2 style={{ marginBottom: 0 }}>ストレート</h2>
          <div style={{ paddingLeft: 20, paddingRight: 20 }}>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <h2>コース別打率</h2>
                <CourseHitRatio
                  pitchType="ストレート"
                  filteredPitchingResults={filteredLeftPitchingResults}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h2>打球方向</h2>
                <BattingDirection
                  pitchType="ストレート"
                  filteredPitchingResults={filteredLeftPitchingResults}
                />
              </div>
            </div>
          </div>
          <h2 style={{ marginBottom: 0 }}>変化球</h2>
          <div style={{ paddingLeft: 20, paddingRight: 20 }}>
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <h2>コース別打率</h2>
                <CourseHitRatio
                  pitchType="変化球"
                  filteredPitchingResults={filteredLeftPitchingResults}
                />
              </div>
              <div style={{ flex: 1 }}>
                <h2>打球方向</h2>
                <BattingDirection
                  pitchType="変化球"
                  filteredPitchingResults={filteredLeftPitchingResults}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyzeBatter;
