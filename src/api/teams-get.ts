export type Teams = {
  userId: string;
  teamName: string;
};

export type ApiResponse = {
  users: Teams[];
};

export const fetchTeams = async (userId: string): Promise<Teams[]> => {
  try {
    const response = await fetch(
      'https://q0cjhx8t56.execute-api.ap-northeast-1.amazonaws.com/teams'
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
