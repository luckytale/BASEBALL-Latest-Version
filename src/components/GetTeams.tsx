import React, { useEffect, useState } from 'react';
import { Teams, fetchTeams } from '../api/teams-get';
import { Box, IconButton } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { Auth0UserId } from '../context/Auth0UserId';

const GetTeams: React.FC = () => {
  const [teams, setTeams] = useState<Teams[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userId = Auth0UserId();
  const [message, setMessage] = useState<string>('');

  const fetchData = async () => {
    try {
      const fetchedTeams = await fetchTeams(userId);
      const filteredTeams = fetchedTeams.filter(
        (team) => !userId || team.userId === userId
      );

      setTeams(filteredTeams);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('データの取得に失敗しました。');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleDelete = async (userId: string, teamName: string) => {
    const confirmed = window.confirm(`${teamName}を削除しますか？`);
    if (!confirmed) return;
    try {
      const response = await axios.delete(
        'https://q0cjhx8t56.execute-api.ap-northeast-1.amazonaws.com/team',
        {
          params: {
            userId,
            teamName,
          },
        }
      );
      if (response.status === 204) {
        fetchData();
        setMessage(`${teamName}を削除しました。`);
      } else {
        setMessage('削除に失敗しました。');
      }
    } catch (error) {
      setMessage(`エラーが発生しました: ${error}`);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {message && <h4>{message}</h4>}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 2,
          padding: 2,
        }}
      >
        {teams.length > 0 ? (
          teams.map((team) => (
            <Box
              key={team.teamName}
              sx={{
                backgroundColor: '#f5f5f5',
                padding: 2,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <h2 style={{ flexGrow: 1 }}>
                <a href={`/teams/${team.teamName}`}>{team.teamName}</a>
              </h2>
              <IconButton
                aria-label="delete"
                onClick={() => handleDelete(team.userId, team.teamName)}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))
        ) : (
          <p>チームが見つかりませんでした。</p>
        )}
      </Box>
    </>
  );
};

export default GetTeams;
