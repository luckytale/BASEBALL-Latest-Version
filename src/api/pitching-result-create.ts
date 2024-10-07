export interface PitchingData {
  userId: string;
  gameId: number;
  resultId: number;
  pitcherName: string;
  pitcherHand: string;
  batterName: string;
  batterHand: string;
  pitchType: string;
  course: number;
  result: string;
  angle: string;
  strike: number;
  ball: number;
  out: number;
  ballSpeed: number;
  x: number;
  y: number;
}

export const PitchingResultCreate = async (data: PitchingData) => {
  try {
    const response = await fetch(
      'https://q0cjhx8t56.execute-api.ap-northeast-1.amazonaws.com/pitching',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'API呼び出しに失敗しました。');
    }

    return result;
  } catch (error) {
    console.error('Error posting game data:', error);
    throw error;
  }
};
