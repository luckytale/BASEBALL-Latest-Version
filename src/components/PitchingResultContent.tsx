import React, { useState, useEffect } from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Box, Button, Typography } from '@mui/material';
import CircleStyle from './CircleStyle';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { fetchPlayers } from '../api/players-get';
import { Auth0UserId } from '../context/Auth0UserId';

interface PitchingResultContentProps {
  onChange: (data: ResultData) => void;
  strike: number;
  ball: number;
  out: number;
  isBatting: boolean;
  pitcherName: string;
}

interface ResultData {
  resultId: number;
  ballSpeed: number;
  pitchType: string;
  result: string;
  angle: string;
}

const PitchingResultContent: React.FC<PitchingResultContentProps> = ({
  onChange,
  strike,
  ball,
  out,
  isBatting,
  pitcherName,
}) => {
  const [resultId] = useState<number>(1);
  const [ballSpeed, setBallSpeed] = useState<number>(135);
  const [pitchType, setPitchType] = useState<string>('ストレート');
  const [result, setResult] = useState<string>('');

  const [place, setPlace] = useState<string>('');
  const [angle, setAngle] = useState<string>('');

  useEffect(() => {
    const data: ResultData = {
      resultId,
      ballSpeed,
      pitchType,
      result,
      angle,
    };
    onChange(data);
  }, [resultId, ballSpeed, result, pitchType, strike, ball, out]);

  useEffect(() => {
    setResult('');
    setPlace('');
    setAngle('');
  }, [strike, ball, out, isBatting]);

  useEffect(() => {
    if (isBallSpeed === true) {
      switch (pitchType) {
        case 'ストレート':
        case 'ツーシーム':
          setBallSpeed(135);
          break;
        case 'カットボール':
        case 'シュート':
          setBallSpeed(120);
          break;
        case 'カーブ':
          setBallSpeed(110);
          break;
        case 'スライダー':
          setBallSpeed(125);
          break;
        case 'フォーク':
        case 'チェンジアップ':
        case 'シンカー':
          setBallSpeed(120);
          break;
      }
    }
  }, [pitchType]);

  const handleResultChange = (newResult: string) => {
    if (strike === 2 && newResult === '空振り') {
      setResult('空三振');
      setAngle('空三振');
    } else if (strike === 2 && newResult === '見逃し') {
      setResult('見三振');
      setAngle('見三振');
    } else if (ball === 3 && newResult === 'ボール') {
      setResult('四球');
      setAngle('四球');
    } else {
      setResult(newResult);
    }
  };

  const getStrikeLabel = (result: string) => {
    if (strike === 2) {
      return result === '空振り'
        ? '空三振'
        : result === '見逃し'
          ? '見三振'
          : result;
    }
    return result;
  };

  const getBallLabel = (result: string) => {
    if (ball === 3) {
      return '四球';
    }
    return result;
  };

  const handlePitchTypeChange = (event: SelectChangeEvent): void => {
    const newPitchType = event.target.value;
    setPitchType(newPitchType);
  };
  const handlePlaceChange = (event: SelectChangeEvent): void => {
    const newPlace = event.target.value;
    setPlace(newPlace);
    if (newPlace && angle) setResult(newPlace + angle);
    else setResult('');
  };

  const handleAngleChange = (event: SelectChangeEvent): void => {
    const newAngle = event.target.value;
    setAngle(newAngle);
    if (place && newAngle) setResult(place + newAngle);
    else setResult('');
  };

  const [isBallSpeed, setIsBallSpeed] = useState<boolean>(true);
  const toggleBallSpeed = () => setIsBallSpeed((prev) => !prev);

  const nullBallSpeed = () => {
    toggleBallSpeed();
    setBallSpeed(0);
  };

  const userId = Auth0UserId();
  const [pitchTypes, setPitchTypes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPlayers = await fetchPlayers(userId);

        const pitcher = fetchedPlayers.find(
          (player) =>
            (!userId || player.userId === userId) &&
            player.playerName === pitcherName
        );

        if (pitcher) {
          console.log(pitcher);
          setPitchTypes(
            pitcher.pitchTypes ?? [
              'ストレート',
              'スライダー',
              'カーブ',
              'フォーク',
            ]
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('データの取得に失敗しました。');
        }
      }
    };

    fetchData();
  }, [userId, pitcherName]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Box>
        <Box display="flex" flexDirection="column" gap={0.1} alignItems="left">
          <Box display="inline-flex" alignItems="center" gap={1.3}>
            <Typography variant="h6">B</Typography>
            <Box display="flex" gap={0.5}>
              {Array.from({ length: ball }).map((_, index) => (
                <CircleStyle key={index} color="green" />
              ))}
            </Box>
          </Box>
          <Box display="inline-flex" alignItems="center" gap={1.3}>
            <Typography variant="h6">S</Typography>
            <Box display="flex" gap={0.5}>
              {Array.from({ length: strike }).map((_, index) => (
                <CircleStyle key={index} color="yellow" />
              ))}
            </Box>
          </Box>
          <Box display="inline-flex" alignItems="center" gap={1}>
            <Typography variant="h6">O</Typography>
            <Box display="flex" gap={0.5}>
              {Array.from({ length: out }).map((_, index) => (
                <CircleStyle key={index} color="red" />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <div style={{ paddingTop: '15px', paddingBottom: '3px' }}>
        球種：
        <FormControl sx={{ maxWidth: 200 }} variant="standard" size="small">
          <Select value={pitchType} onChange={handlePitchTypeChange}>
            {pitchTypes.map((pitchType, index) => (
              <MenuItem key={index} value={pitchType}>
                {pitchType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <br />
        <span>
          球速：
          {isBallSpeed ? (
            <span>
              <input
                type="number"
                value={ballSpeed}
                onChange={(e) => {
                  setBallSpeed(parseFloat(e.target.value));
                }}
              />{' '}
              km/h
            </span>
          ) : (
            <span>なし</span>
          )}
          <Button onClick={nullBallSpeed}>
            {isBallSpeed ? '表示なし' : '球速表示'}
          </Button>
        </span>
        <br />
      </div>
      {isBatting ? (
        <div style={{ height: '36.5px' }}>
          <span>結果：</span>
          <FormControl sx={{ minWidth: 50 }} variant="standard" size="small">
            <Select onChange={handlePlaceChange} value={place}>
              <MenuItem value={''}></MenuItem>
              <MenuItem value={'投'}>投</MenuItem>
              <MenuItem value={'捕'}>捕</MenuItem>
              <MenuItem value={'一'}>一</MenuItem>
              <MenuItem value={'二'}>二</MenuItem>
              <MenuItem value={'三'}>三</MenuItem>
              <MenuItem value={'遊'}>遊</MenuItem>
              <MenuItem value={'左'}>左</MenuItem>
              <MenuItem value={'中'}>中</MenuItem>
              <MenuItem value={'右'}>右</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 100 }} variant="standard" size="small">
            <Select onChange={handleAngleChange} value={angle}>
              <MenuItem value={''}></MenuItem>
              <MenuItem value={'ゴロ'}>ゴロ</MenuItem>
              <MenuItem value={'飛'}>フライ</MenuItem>
              <MenuItem value={'直'}>ライナー</MenuItem>
              <MenuItem value={'安打'}>安打</MenuItem>
              <MenuItem value={'二塁打'}>二塁打</MenuItem>
              <MenuItem value={'三塁打'}>三塁打</MenuItem>
              <MenuItem value={'本塁打'}>本塁打</MenuItem>
              <MenuItem value={'失'}>エラー</MenuItem>
              <MenuItem value={'併殺打'}>併殺打</MenuItem>
              <MenuItem value={'犠打'}>犠打</MenuItem>
              <MenuItem value={'犠飛'}>犠飛</MenuItem>
            </Select>
          </FormControl>
        </div>
      ) : (
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
          sx={{ width: '450px' }}
        >
          <Button
            sx={{ flex: 1 }}
            color={
              result === '空振り' || result === '空三振' ? 'primary' : 'inherit'
            }
            onClick={() => handleResultChange('空振り')}
          >
            {getStrikeLabel('空振り')}
          </Button>
          <Button
            sx={{ flex: 1 }}
            color={
              result === '見逃し' || result === '見三振' ? 'primary' : 'inherit'
            }
            onClick={() => handleResultChange('見逃し')}
          >
            {getStrikeLabel('見逃し')}
          </Button>
          <Button
            sx={{ flex: 1 }}
            color={result === 'ファール' ? 'primary' : 'inherit'}
            onClick={() => handleResultChange('ファール')}
          >
            {getStrikeLabel('ファール')}
          </Button>
          <Button
            sx={{ flex: 1 }}
            color={
              result === 'ボール' || result === '四球' ? 'primary' : 'inherit'
            }
            onClick={() => handleResultChange('ボール')}
          >
            {getBallLabel('ボール')}
          </Button>
        </ButtonGroup>
      )}
    </>
  );
};

export default PitchingResultContent;
