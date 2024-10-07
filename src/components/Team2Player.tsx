import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Games, fetchGames } from '../api/games-get';
import { Players, fetchPlayers } from '../api/players-get';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
} from '@mui/material';
import { Auth0UserId } from '../context/Auth0UserId';

const PLAYERS = 10;

interface Team2PlayerProps {
  onChange: (data: Team2PlayerData) => void;
  isTop: boolean;
  team2BattingOrder: number;
}

interface Team2PlayerData {
  team2PlayerNames: string[];
}

const Team2Player: React.FC<Team2PlayerProps> = ({
  isTop,
  team2BattingOrder,
  onChange,
}) => {
  const [games, setGames] = useState<Games[]>([]);
  const [error, setError] = useState<string | null>(null);
  const userId = Auth0UserId();
  const [players, setPlayers] = useState<Players[]>([]);
  const [team2PlayerNumbers, setTeam2PlayerNumbers] = useState<(number | '')[]>(
    Array(PLAYERS).fill('')
  );
  const [team2PlayerNames, setTeam2PlayerNames] = useState<string[]>(
    Array(PLAYERS).fill('')
  );
  const { gameIdParam } = useParams<{ gameIdParam: string }>();

  useEffect(() => {
    const data: Team2PlayerData = {
      team2PlayerNames,
    };
    onChange(data);

    const fetchData = async () => {
      try {
        const fetchedGames = await fetchGames(userId);
        const filteredGames = fetchedGames.filter(
          (game) =>
            game.userId === userId && game.gameId === Number(gameIdParam)
        );
        setGames(filteredGames);

        const fetchedPlayers = await fetchPlayers(userId);
        const filteredPlayers = fetchedPlayers.filter(
          (player) => !userId || player.userId === userId
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
  }, [userId, gameIdParam, team2PlayerNames]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = event.target.value;
    const playerNumber = value !== '' ? Number(value) : '';
    const newPlayerNumbers = [...team2PlayerNumbers];
    newPlayerNumbers[index] = playerNumber;
    setTeam2PlayerNumbers(newPlayerNumbers);

    const player = players.find(
      (player) =>
        player.playerNumber === playerNumber &&
        player.teamName === (games[0] && games[0].team2)
    );

    const newPlayerNames = [...team2PlayerNames];
    newPlayerNames[index] = player ? player.playerName : '';
    setTeam2PlayerNames(newPlayerNames);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {games.map((game) => (
        <div key={game.gameId}>
          <Paper sx={{ width: '100%' }}>
            <TableContainer sx={{ maxHeight: 710 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '22px',
                      }}
                    >
                      {game.team2}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ minWidth: 100 }}
                      sx={{
                        textAlign: 'left',
                        fontWeight: 'bold',
                        padding: '4px',
                      }}
                    >
                      Player
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: 'left',
                        fontWeight: 'bold',
                        padding: '4px',
                      }}
                    >
                      Number
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from({ length: PLAYERS }, (_, index) => (
                    <TableRow
                      key={index}
                      style={{
                        backgroundColor: isTop
                          ? index === 9
                            ? '#b3e5fc'
                            : 'inherit'
                          : index === team2BattingOrder
                            ? '#b3e5fc'
                            : 'inherit',
                      }}
                    >
                      <TableCell>
                        {index + 1 === PLAYERS
                          ? `投 ${team2PlayerNames[index] || ''}`
                          : `${index + 1}. ${team2PlayerNames[index] || ''}`}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <TextField
                          type="number"
                          size="small"
                          variant="outlined"
                          value={team2PlayerNumbers[index]}
                          onChange={(e) =>
                            handleInputChange(
                              e as React.ChangeEvent<HTMLInputElement>,
                              index
                            )
                          }
                          sx={{ width: '60px', '& input': { height: '12px' } }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
      ))}
    </>
  );
};

export default Team2Player;
