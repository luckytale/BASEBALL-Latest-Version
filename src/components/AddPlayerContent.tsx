import React, { useState, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Auth0UserId } from '../context/Auth0UserId';

interface PlayerData {
  userId: string;
  teamName: string;
  position: string;
  playerName: string;
  playerNumber: number | '';
  pitchHand: string;
  batHand: string;
  pitchTypes?: string[];
}

const PlayerForm: React.FC = () => {
  const { teamName: selectTeamName } = useParams<{ teamName: string }>();
  const userId = Auth0UserId();
  const [teamName] = useState<string>(selectTeamName || '');
  const [position, setPosition] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [playerNumber, setPlayerNumber] = useState<number | ''>('');
  const [pitchHand, setPitchHand] = useState<string>('');
  const [batHand, setBatHand] = useState<string>('');
  const [pitchTypes, setPitchTypes] = useState<string[]>([
    'ストレート',
    'スライダー',
    'カーブ',
    'フォーク',
  ]);
  const [newPitchType, setNewPitchType] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');

  const addPitchType = () => {
    if (newPitchType && !pitchTypes.includes(newPitchType)) {
      setPitchTypes([...pitchTypes, newPitchType]);
      setNewPitchType('');
    }
  };

  const removePitchType = (pitchTypeToRemove: string) => {
    setPitchTypes(
      pitchTypes.filter((pitchType) => pitchType !== pitchTypeToRemove)
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body: PlayerData = {
      userId,
      teamName,
      position,
      playerName,
      playerNumber,
      pitchHand,
      batHand,
    };

    if (position === '投手') {
      body.pitchTypes = pitchTypes;
    }

    try {
      const response = await fetch(
        'https://q0cjhx8t56.execute-api.ap-northeast-1.amazonaws.com/player',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setResponseMessage(`${playerName} 選手を登録しました`);
      } else {
        setResponseMessage(`エラー: ${result.message}`);
      }
    } catch (error) {
      setResponseMessage(
        `ネットワークエラー: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  };

  return (
    <div>
      <h2>新規選手</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="背番号"
          type="number"
          value={playerNumber}
          onChange={(e) => setPlayerNumber(Number(e.target.value))}
          required
        />
        <br />
        <TextField
          label="選手名"
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          required
          margin="normal"
        />
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <ButtonGroup variant="contained" aria-label="Basic button group">
            <Button
              color={position === '投手' ? 'error' : 'inherit'}
              onClick={() => setPosition('投手')}
            >
              投手
            </Button>
            <Button
              color={position === '捕手' ? 'info' : 'inherit'}
              onClick={() => setPosition('捕手')}
            >
              捕手
            </Button>
            <Button
              color={position === '内野手' ? 'warning' : 'inherit'}
              onClick={() => setPosition('内野手')}
            >
              内野手
            </Button>
            <Button
              color={position === '外野手' ? 'success' : 'inherit'}
              onClick={() => setPosition('外野手')}
            >
              外野手
            </Button>
          </ButtonGroup>
        </div>

        <span style={{ marginRight: 10 }}>
          <ButtonGroup variant="contained" aria-label="Basic button group">
            <Button
              size="small"
              color={pitchHand === '右投' ? 'primary' : 'inherit'}
              onClick={() => setPitchHand('右投')}
            >
              右投
            </Button>
            <Button
              size="small"
              color={pitchHand === '左投' ? 'primary' : 'inherit'}
              onClick={() => setPitchHand('左投')}
            >
              左投
            </Button>
          </ButtonGroup>
        </span>
        <span>
          <ButtonGroup variant="contained" aria-label="Basic button group">
            <Button
              size="small"
              color={batHand === '右打' ? 'primary' : 'inherit'}
              onClick={() => setBatHand('右打')}
            >
              右打
            </Button>
            <Button
              size="small"
              color={batHand === '左打' ? 'primary' : 'inherit'}
              onClick={() => setBatHand('左打')}
            >
              左打
            </Button>
          </ButtonGroup>
        </span>

        {position === '投手' && (
          <div>
            <h3>球種</h3>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label="球種を追加"
                variant="outlined"
                size="small"
                value={newPitchType}
                onChange={(e) => setNewPitchType(e.target.value)}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={addPitchType}
                style={{ marginLeft: '10px' }}
              >
                追加
              </Button>
            </div>

            <ul>
              {pitchTypes.map((pitchType, index) => (
                <li
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '5px',
                  }}
                >
                  <span>{pitchType}</span>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => removePitchType(pitchType)}
                    style={{ marginRight: '190px' }}
                  >
                    削除
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'right', mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            追加
          </Button>
        </Box>
      </form>
      <div>{responseMessage}</div>
    </div>
  );
};

export default PlayerForm;
