export type Players = {
  userId: string;
  teamName: string;
  position: string;
  playerName: string;
  playerNumber: string;
  pitchHand: string;
  batHand: string;
  pitchTypes: string[];
};

export type ApiResponse = {
  users: Players[];
};

export const fetchPlayers = async (userId: string): Promise<Players[]> => {
  try {
    const response = await fetch(
      'https://q0cjhx8t56.execute-api.ap-northeast-1.amazonaws.com/players'
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
