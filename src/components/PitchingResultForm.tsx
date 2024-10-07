import Team1Player from '../components/Team1Player';
import Team2Player from '../components/Team2Player';
import StrikeZone from '../components/StrikeZone';
import PitchingResultContent from '../components/PitchingResultContent';
import { PitchingData } from '../api/pitching-result-create';
import { FormEvent, useState, useEffect } from 'react';
import Switch from '@mui/material/Switch';
import GroundImage from './GroundImage';
import { useParams } from 'react-router-dom';
import { Players, fetchPlayers } from '../api/players-get';
import { Button } from '@mui/material';
import { Auth0UserId } from '../context/Auth0UserId';

interface ResultData {
  resultId: number;
  ballSpeed: number;
  pitchType: string;
  result: string;
  angle: string;
}

interface Team1PlayerData {
  team1PlayerNames: string[];
}

interface Team2PlayerData {
  team2PlayerNames: string[];
}

interface CourseData {
  course: number;
}

interface PositionData {
  x: number;
  y: number;
}

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const PitchingForm = () => {
  const { gameIdParam } = useParams<{ gameIdParam: string }>();
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [isTop, setIsTop] = useState<boolean>(true);
  const [isBatting, setIsBatting] = useState<boolean>(false);
  const toggleTop = () => setIsTop((prev) => !prev);
  const toggleBatting = () => setIsBatting((prev) => !prev);

  const [resultData, setResultData] = useState<ResultData>({
    resultId: 1,
    ballSpeed: 135,
    pitchType: 'ストレート',
    result: '',
    angle: '',
  });

  const handleResultDataChange = (data: ResultData) => {
    setResultData(data);
  };

  const [team1PlayerNames, setTeam1PlayerNames] = useState<Team1PlayerData>({
    team1PlayerNames: [],
  });
  const [team2PlayerNames, setTeam2PlayerNames] = useState<Team2PlayerData>({
    team2PlayerNames: [],
  });

  const handleTeam1PlayerDataChange = (data: Team1PlayerData) => {
    setTeam1PlayerNames(data);
  };
  const handleTeam2PlayerDataChange = (data: Team2PlayerData) => {
    setTeam2PlayerNames(data);
  };

  const [courseData, setCourseData] = useState<CourseData>({ course: 12 });

  const handleCourseDataChange = (data: CourseData) => {
    setCourseData(data);
  };

  const [team1BattingOrder, setTeam1BattingOrder] = useState<number>(0);
  const [team2BattingOrder, setTeam2BattingOrder] = useState<number>(0);

  const NextBatter = (
    BattingOrder: number,
    setBattingOrder: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (BattingOrder === 8) {
      setBattingOrder(0);
    } else {
      setBattingOrder(BattingOrder + 1);
    }
  };

  const NextBatterButton = () => {
    if (isTop) {
      NextBatter(team1BattingOrder, setTeam1BattingOrder);
    } else {
      NextBatter(team2BattingOrder, setTeam2BattingOrder);
    }
  };

  const [positionData, setPositionData] = useState<PositionData>({
    x: 0,
    y: 0,
  });

  const handlePositionDataChange = (data: PositionData) => {
    setPositionData(data);
  };

  const userId = Auth0UserId();
  const gameId = Number(gameIdParam);
  const [resultId, setResultId] = useState<number>(new Date().getTime());
  const ballSpeed = resultData.ballSpeed;
  const pitchType = resultData.pitchType;
  const [strike, setStrike] = useState<number>(0);
  const [ball, setBall] = useState<number>(0);
  const [out, setOut] = useState<number>(0);
  const result = resultData.result;
  const angle = resultData.angle;
  const course = courseData.course;
  const pitcherName = isTop
    ? team2PlayerNames.team2PlayerNames[9]
    : team1PlayerNames.team1PlayerNames[9];
  const batterName = isTop
    ? team1PlayerNames.team1PlayerNames[team1BattingOrder]
    : team2PlayerNames.team2PlayerNames[team2BattingOrder];
  const [error, setError] = useState<string | null>(null);
  const [pitcherData, setPitcherData] = useState<Players>();
  const [batterData, setBatterData] = useState<Players>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPlayers = await fetchPlayers(userId);

        const filteredPitcherData = fetchedPlayers.filter(
          (player) =>
            (!userId || player.userId === userId) &&
            (!pitcherName || player.playerName === pitcherName)
        );
        setPitcherData(filteredPitcherData[0]);

        const filteredBatterData = fetchedPlayers.filter(
          (player) =>
            (!userId || player.userId === userId) &&
            (!batterName || player.playerName === batterName)
        );
        setBatterData(filteredBatterData[0]);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('データの取得に失敗しました。');
        }
      }
    };
    fetchData();
  }, [userId, pitcherName, batterName]);

  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);

  useEffect(() => {
    setX(0);
    setY(0);
  }, [isBatting]);

  useEffect(() => {
    setX(positionData.x);
    setY(positionData.y);
  }, [positionData]);

  const pitcherHand = pitcherData ? pitcherData.pitchHand : '';
  const batterHand = batterData ? batterData.batHand : '';

  if (error) {
    return <div>{error}</div>;
  }

  const incrementStrike = () => {
    if (strike < 2) {
      setStrike(strike + 1);
    }
  };

  const incrementBall = () => {
    if (ball < 3) {
      setBall(ball + 1);
    }
  };

  const incrementOut = () => {
    resetCount();
    if (out < 2) {
      setOut(out + 1);
    } else {
      setOut(0);
      toggleTop();
    }
  };

  const incrementOutTwice = () => {
    resetCount();
    if (out < 1) {
      setOut(out + 2);
    } else {
      setOut(0);
      toggleTop();
    }
  };

  const resetCount = () => {
    setBall(0);
    setStrike(0);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResultId(new Date().getTime());

    const body: PitchingData = {
      userId,
      gameId,
      resultId,
      pitcherName,
      pitcherHand,
      batterName,
      batterHand,
      pitchType,
      course,
      result,
      angle,
      strike,
      ball,
      out,
      ballSpeed,
      x,
      y,
    };
    console.log(body);

    try {
      const response = await fetch(
        'https://q0cjhx8t56.execute-api.ap-northeast-1.amazonaws.com/pitching',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      const apiresult = await response.json();
      if (response.ok) {
        setResponseMessage(`${pitchType} ${ballSpeed}km/h ${result}`);
        switch (result) {
          case '空振り':
          case '見逃し':
          case 'ファール':
            incrementStrike();
            break;
          case 'ボール':
            incrementBall();
            break;
          case '空三振':
          case '見三振':
            incrementOut();
            NextBatterButton();
            break;
          case '四球':
            resetCount();
            NextBatterButton();
            break;
        }
        switch (angle) {
          case 'ゴロ':
          case '飛':
          case '直':
          case '犠打':
          case '犠飛':
            toggleBatting();
            incrementOut();
            NextBatterButton();
            break;
          case '併殺打':
            toggleBatting();
            resetCount();
            incrementOutTwice();
            NextBatterButton();
            break;
          case '安打':
          case '二塁打':
          case '三塁打':
          case '本塁打':
          case 'エラー':
            toggleBatting();
            resetCount();
            NextBatterButton();
            break;
        }
      } else {
        setResponseMessage(`エラー: ${apiresult.message}`);
      }
    } catch (error) {
      setResponseMessage(
        `ネットワークエラー: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ marginRight: '100px' }}>
          <Team1Player
            onChange={handleTeam1PlayerDataChange}
            isTop={isTop}
            team1BattingOrder={team1BattingOrder}
          />
        </div>
        <div>
          <div
            style={{
              marginTop: '100px',
              marginRight: '120px',
              marginLeft: '50px',
            }}
          >
            <StrikeZone onClick={handleCourseDataChange}></StrikeZone>
          </div>
          <div>
            {isBatting ? (
              <GroundImage onChange={handlePositionDataChange}></GroundImage>
            ) : null}
          </div>
        </div>
        <div style={{ marginTop: '90px' }}>
          <PitchingResultContent
            onChange={handleResultDataChange}
            strike={strike}
            ball={ball}
            out={out}
            isBatting={isBatting}
            pitcherName={pitcherName}
          />
          <div style={{ marginLeft: '340px' }}>
            打球入力
            <Switch {...label} checked={isBatting} onClick={toggleBatting} />
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <input type="hidden" value={userId || ''} />
              <input type="hidden" value={gameId || ''} />
              <input type="hidden" value={resultId || ''} />
              <input type="hidden" value={pitcherName || ''} />
              <input type="hidden" value={pitcherHand || ''} />
              <input type="hidden" value={batterName || ''} />
              <input type="hidden" value={batterHand || ''} />
              <input type="hidden" value={pitchType || ''} />
              <input type="hidden" value={course || ''} />
              <input type="hidden" value={result || ''} />
              <input type="hidden" value={strike || ''} />
              <input type="hidden" value={ball || ''} />
              <input type="hidden" value={out || ''} />
              <input type="hidden" value={ballSpeed || ''} />
              <input type="hidden" value={x || ''} />
              <input type="hidden" value={y || ''} />
              <p style={{ marginLeft: '405px' }}>
                <button type="submit">決定</button>
              </p>
            </form>
            <div>{responseMessage}</div>
            <Button onClick={NextBatterButton}>NextButter</Button>
            <Button onClick={resetCount}>resetCount</Button>
            <Button onClick={toggleTop}>change</Button>
            <br />
            <Button onClick={incrementStrike}>strike</Button>
            <Button onClick={incrementBall}>ball</Button>
            <Button onClick={incrementOut}>out</Button>
            <br />
          </div>
        </div>
        <div style={{ marginLeft: '90px' }}>
          <Team2Player
            onChange={handleTeam2PlayerDataChange}
            isTop={isTop}
            team2BattingOrder={team2BattingOrder}
          />
        </div>
      </div>
    </>
  );
};
export default PitchingForm;
