export type Games = {
  userId: string;
  gameId: number;
  type: string;
  year: number;
  month: number;
  day: number;
  team1: string;
  team2: string;
};

export type ApiResponse = {
  users: Games[];
};

export const fetchGames = async (userId: string): Promise<Games[]> => {
  try {
    const response = await fetch(
      'https://q0cjhx8t56.execute-api.ap-northeast-1.amazonaws.com/games'
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
