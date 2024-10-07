import React, { useState, FormEvent } from 'react';
import { TeamData } from '../api/team-create';
import { Auth0UserId } from '../context/Auth0UserId';

const TeamForm: React.FC = () => {
  const userId = Auth0UserId();
  const [teamName, setTeamName] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const body: TeamData = {
      userId,
      teamName,
    };

    try {
      const response = await fetch(
        'https://q0cjhx8t56.execute-api.ap-northeast-1.amazonaws.com/team',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setResponseMessage(`${result.teamName}を登録しました`);
      } else {
        setResponseMessage(`エラー: ${result.message}`);
      }
    } catch (error) {
      setResponseMessage(
        `ネットワークエラー: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  return (
    <div>
      <h3>新規チーム</h3>
      <form onSubmit={handleSubmit}>
        <label>
          <input
            type="text"
            value={teamName}
            placeholder="チーム名"
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
        </label>
        <p>
          <button type="submit">追加</button>
        </p>
      </form>
      <div>{responseMessage}</div>
    </div>
  );
};

export default TeamForm;
