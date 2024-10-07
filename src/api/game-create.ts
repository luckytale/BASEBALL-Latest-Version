export interface GameData {
  userId: string;
  gameId: number;
  type: string;
  year: number;
  month: number;
  day: number;
  team1: string;
  team2: string;
}

export const GameCreate = async (data: GameData) => {
  try {
    const response = await fetch(
      'https://q0cjhx8t56.execute-api.ap-northeast-1.amazonaws.com/game',
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
