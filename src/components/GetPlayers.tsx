import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Players, fetchPlayers } from '../api/players-get';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { Auth0UserId } from '../context/Auth0UserId';

const GetPlayers: React.FC = () => {
  const [players, setPlayers] = useState<Players[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userId = Auth0UserId();
  const { teamName } = useParams<{ teamName: string }>();
  const [message, setMessage] = useState<string>('');

  const fetchData = async () => {
    try {
      const fetchedPlayers = await fetchPlayers(userId);

      const filteredPlayers = fetchedPlayers.filter(
        (player) =>
          (!userId || player.userId === userId) &&
          (!teamName || player.teamName === teamName)
      );

      const sortedPlayers = filteredPlayers.sort((a, b) => {
        const positions = ['投手', '捕手', '内野手', '外野手'];
        const sortedPosition =
          positions.indexOf(a.position) - positions.indexOf(b.position);
        if (sortedPosition === 0) {
          return Number(a.playerNumber) - Number(b.playerNumber);
        }
        return sortedPosition;
      });

      setPlayers(sortedPlayers);
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

  const handleDelete = async (userId: string, playerName: string) => {
    const confirmed = window.confirm(`${playerName}選手を削除しますか？`);
    if (!confirmed) return;
    try {
      const response = await axios.delete(
        'https://q0cjhx8t56.execute-api.ap-northeast-1.amazonaws.com/player',
        {
          params: {
            userId,
            playerName,
          },
        }
      );
      if (response.status === 204) {
        fetchData();
        setMessage(`${playerName}選手を削除しました。`);
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
      <h1>{teamName}</h1>
      <h2>選手一覧</h2>
      {message && <p>{message}</p>}
      <div>
        {userId && teamName
          ? players.length > 0 && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#272727' }}>
                      <TableCell sx={{ color: 'white' }}>Position</TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        Player Number
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>Player Name</TableCell>
                      <TableCell sx={{ color: 'white' }}>Hand</TableCell>
                      <TableCell sx={{ color: 'white' }}>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {players.map((player) => (
                      <TableRow
                        key={player.playerName}
                        sx={{
                          backgroundColor:
                            player.position === '投手'
                              ? '#fce4ec'
                              : player.position === '捕手'
                                ? '#e3f2fd'
                                : player.position === '内野手'
                                  ? '#fffde7'
                                  : player.position === '外野手'
                                    ? '#e8f5e9'
                                    : 'inherit',
                        }}
                      >
                        <TableCell sx={{ width: '15%' }}>
                          {player.position}
                        </TableCell>
                        <TableCell sx={{ width: '15%' }}>
                          {player.playerNumber}
                        </TableCell>
                        <TableCell sx={{ width: '30%' }}>
                          {player.playerName}
                        </TableCell>
                        <TableCell sx={{ width: '15%' }}>
                          {player.pitchHand}
                          {player.batHand}
                        </TableCell>
                        <TableCell sx={{ width: '5%' }}>
                          <IconButton
                            aria-label="delete"
                            onClick={() =>
                              handleDelete(player.userId, player.playerName)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          : null}
      </div>
    </>
  );
};

export default GetPlayers;
