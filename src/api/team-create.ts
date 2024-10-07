export interface TeamData {
  userId: string;
  teamName: string;
}

export const TeamCreate = async (data: TeamData) => {
  try {
    const response = await fetch(
      'https://q0cjhx8t56.execute-api.ap-northeast-1.amazonaws.com/team',
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
