import React, { useState, useEffect } from 'react';
import { GameData } from '../api/game-create';
import { fetchTeams, Teams } from '../api/teams-get';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Auth0UserId } from '../context/Auth0UserId';

const AddGameContent: React.FC = () => {
  const today = new Date();
  const userId = Auth0UserId();
  const [gameId, setGameId] = useState<number>(0);
  const [type, setType] = useState<string>('');
  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth() + 1);
  const [day, setDay] = useState<number>(today.getDate());
  const [team1, setTeam1] = useState<string>('');
  const [team2, setTeam2] = useState<string>('');
  const [teams, setTeams] = useState<Teams[]>([]);
  const [responseMessage, setResponseMessage] = useState<string>('');

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teamsData = await fetchTeams(userId);
        setTeams(teamsData);
      } catch (error) {
        console.error(error);
        setResponseMessage(
          'チームのデータを取得する際にエラーが発生しました。'
        );
      }
    };
    if (userId) {
      loadTeams();
    }
  }, [userId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const body: GameData = {
      userId,
      gameId,
      type,
      year,
      month,
      day,
      team1,
      team2,
    };

    try {
      const response = await fetch(
        'https://q0cjhx8t56.execute-api.ap-northeast-1.amazonaws.com/game',
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
        setResponseMessage(`試合を登録しました`);
      } else {
        setResponseMessage(`エラー: ${result.message}`);
      }
    } catch (error) {
      setResponseMessage(
        `ネットワークエラー: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label>ゲームID:</label>
        <input
          type="number"
          value={gameId}
          style={{ width: '45px' }}
          onChange={(e) => setGameId(Number(e.target.value))}
        />
      </p>
      <p>
        <input
          type="number"
          value={year}
          style={{ width: '50px' }}
          onChange={(e) => setYear(Number(e.target.value))}
        />
        <label>年</label>
        <input
          type="number"
          value={month}
          style={{ width: '30px' }}
          onChange={(e) => setMonth(Number(e.target.value))}
        />
        <label>月</label>
        <input
          type="number"
          value={day}
          style={{ width: '30px' }}
          onChange={(e) => setDay(Number(e.target.value))}
        />
        <label>日</label>
      </p>
      <p>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button
            color={type === 'OP戦' ? 'primary' : 'inherit'}
            onClick={() => handleTypeChange('OP戦')}
          >
            OP戦
          </Button>
          <Button
            color={type === '公式戦' ? 'primary' : 'inherit'}
            onClick={() => handleTypeChange('公式戦')}
          >
            公式戦
          </Button>
        </ButtonGroup>
      </p>
      <div>
        <select value={team1} onChange={(e) => setTeam1(e.target.value)}>
          <option value="">選択してください</option>
          {teams.map((team) => (
            <option key={team.teamName} value={team.teamName}>
              {team.teamName}
            </option>
          ))}
        </select>
        <span> VS </span>
        <select value={team2} onChange={(e) => setTeam2(e.target.value)}>
          <option value="">選択してください</option>
          {teams.map((team) => (
            <option key={team.teamName} value={team.teamName}>
              {team.teamName}
            </option>
          ))}
        </select>
      </div>
      <p>
        <button type="submit">追加</button>
      </p>
      {responseMessage && <p>{responseMessage}</p>}
    </form>
  );
};

export default AddGameContent;
