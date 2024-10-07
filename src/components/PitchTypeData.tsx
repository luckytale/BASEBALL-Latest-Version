import { PitchingResults } from '../api/pitching-results-get';
import PitchTypeStats from './PitchTypeStats';
import CoursePitchingRatio from './CoursePitchingRatio';
import BattingDirection from './BattingDirection';
import { fetchPlayers } from '../api/players-get';
import React, { useState, useEffect } from 'react';
import { Auth0UserId } from '../context/Auth0UserId';

interface PitchTypeStatsProps {
  filteredPitchingResults: PitchingResults[];
  pitchTypeCounts: { [key: string]: number };
  pitchesCount: number;
  maxBallSpeed: { [key: string]: number };
  averageBallSpeed: { [key: string]: number };
  strikeCounts: { [key: string]: number };
  swingStrikeCounts: { [key: string]: number };
  batCounts: { [key: string]: number };
  hitCounts: { [key: string]: number };
  pitcherName: string;
}

const PitchTypeData: React.FC<PitchTypeStatsProps> = ({
  filteredPitchingResults,
  pitchTypeCounts,
  pitchesCount,
  maxBallSpeed,
  averageBallSpeed,
  strikeCounts,
  swingStrikeCounts,
  batCounts,
  hitCounts,
  pitcherName,
}) => {
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

  const filteredRightPitchingResults = filteredPitchingResults.filter(
    (pitchingResult) => pitchingResult.batterHand === '右打'
  );
  const filteredLeftPitchingResults = filteredPitchingResults.filter(
    (pitchingResult) => pitchingResult.batterHand === '左打'
  );

  const rightPitchTypeCounts: { [key: string]: number } = {};
  const leftPitchTypeCounts: { [key: string]: number } = {};

  filteredRightPitchingResults.forEach(({ pitchType }) => {
    if (!rightPitchTypeCounts[pitchType]) {
      rightPitchTypeCounts[pitchType] = 0;
    }
    rightPitchTypeCounts[pitchType] += 1;
  });

  filteredLeftPitchingResults.forEach(({ pitchType }) => {
    if (!leftPitchTypeCounts[pitchType]) {
      leftPitchTypeCounts[pitchType] = 0;
    }
    leftPitchTypeCounts[pitchType] += 1;
  });

  return (
    <>
      <div style={{ paddingLeft: 5, paddingRight: 5 }}>
        {pitchTypes.map((pitchType) => (
          <div key={pitchType}>
            <h2>{pitchType}</h2>
            <div style={{ marginTop: 15, marginBottom: 20 }}>
              <PitchTypeStats
                pitchType={pitchType}
                pitchTypeCounts={pitchTypeCounts}
                pitchesCount={pitchesCount}
                maxBallSpeed={maxBallSpeed}
                averageBallSpeed={averageBallSpeed}
                strikeCounts={strikeCounts}
                swingStrikeCounts={swingStrikeCounts}
                batCounts={batCounts}
                hitCounts={hitCounts}
              />
            </div>
            <div style={{ display: 'flex', width: '100%', marginBottom: 50 }}>
              <div
                style={{
                  flex: 1,
                  border: '3px solid #ffebee',
                  marginRight: 5,
                  padding: 5,
                }}
              >
                <h3>対右打者</h3>
                <div style={{ display: 'flex' }}>
                  <div style={{ marginRight: 30, marginTop: 20 }}>
                    <CoursePitchingRatio
                      pitchType={pitchType}
                      pitchTypeCounts={rightPitchTypeCounts}
                      filteredPitchingResults={filteredRightPitchingResults}
                    />
                  </div>
                  <div>
                    <BattingDirection
                      pitchType={pitchType}
                      filteredPitchingResults={filteredRightPitchingResults}
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  border: '3px solid #e3f2fd',
                  marginLeft: 5,
                  padding: 5,
                }}
              >
                <h3>対左打者</h3>
                <div style={{ display: 'flex' }}>
                  <div style={{ marginRight: 30, marginTop: 20 }}>
                    <CoursePitchingRatio
                      pitchType={pitchType}
                      pitchTypeCounts={leftPitchTypeCounts}
                      filteredPitchingResults={filteredLeftPitchingResults}
                    />
                  </div>
                  <div>
                    <BattingDirection
                      pitchType={pitchType}
                      filteredPitchingResults={filteredLeftPitchingResults}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PitchTypeData;
