import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: 'ap-northeast-1' });
const TableName = 'Game';

export const handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    },
    body: JSON.stringify({ message: '' }),
  };

  if (!event.body) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: 'リクエストボディがありません。',
    });
    return response;
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: '無効なリクエストです。リクエストボディの形式が不正です。',
      errorDetail: error.message,
    });
    return response;
  }

  console.log('Received event body:', body);

  const { userId, gameId, type, year, month, day, team1, team2 } = body;
  const param = {
    TableName,
    Item: marshall({
      userId,
      gameId,
      type,
      year,
      month,
      day,
      team1,
      team2,
    }),
  };

  const command = new PutItemCommand(param);

  try {
    await client.send(command);
    response.statusCode = 201;
    response.body = JSON.stringify({
      userId,
      gameId,
      type,
      year,
      month,
      day,
      team1,
      team2,
    });
  } catch (e) {
    console.error('Error:', e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: '予期せぬエラーが発生しました。',
      errorDetail: e.toString(),
    });
  }

  return response;
};
