import React, { useEffect, useState } from 'react';
import { Games, fetchGames } from '../api/games-get';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Auth0UserId } from '../context/Auth0UserId';

const GetGames: React.FC = () => {
  const [games, setGames] = useState<Games[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userId = Auth0UserId();
  const [message, setMessage] = useState<string>('');

  const fetchData = async () => {
    try {
      const fetchedGames = await fetchGames(userId);
      const sortedGames = fetchedGames.sort(
        (a: Games, b: Games) => b.gameId - a.gameId
      );
      setGames(sortedGames);
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

  const handleDelete = async (userId: string, gameId: number) => {
    console.log('Sending request:', { userId, gameId });
    const confirmed = window.confirm(`削除しますか？`);
    if (!confirmed) return;
    try {
      const response = await axios.delete(
        'https://q0cjhx8t56.execute-api.ap-northeast-1.amazonaws.com/game',
        {
          params: {
            userId,
            gameId,
          },
        }
      );
      if (response.status === 204) {
        fetchData();
        setMessage(`削除しました。`);
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
      <div style={{ padding: 30 }}>
        <h2>試合一覧</h2>
        {message && <h4>{message}</h4>}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>日付</TableCell>
                <TableCell>対戦チーム</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {games.length > 0 ? (
                games.map((game) => (
                  <TableRow key={game.userId}>
                    <TableCell>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        component="span"
                      >
                        {game.gameId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        component="span"
                      >
                        {`${game.year}年${game.month}月${game.day}日`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {' '}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          component="span"
                        >
                          {`${game.team1} VS ${game.team2}`}
                        </Typography>
                        <div>
                          <a
                            href={`/games/${game.gameId}`}
                            style={{ marginRight: 50 }}
                          >
                            スコア入力
                          </a>
                          <IconButton
                            aria-label="delete"
                            onClick={() =>
                              handleDelete(game.userId, game.gameId)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    試合を登録してください
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default GetGames;
