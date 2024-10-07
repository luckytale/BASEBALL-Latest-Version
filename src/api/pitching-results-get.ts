export type PitchingResults = {
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
};

export type ApiResponse = {
  users: PitchingResults[];
};

export const fetchPitchingResults = async (
  userId: string
): Promise<PitchingResults[]> => {
  try {
    const response = await fetch(
      'https://q0cjhx8t56.execute-api.ap-northeast-1.amazonaws.com/pitchings'
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data: ApiResponse = await response.json();
    return data.users.filter((team) => team.userId === userId);
  } catch (error) {
    console.error('Fetch error: ', error);
    throw new Error('データの取得に失敗しました。');
  }
};
