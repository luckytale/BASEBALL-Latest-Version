import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: 'ap-northeast-1' });
const TableName = 'Team';

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

  // `event.body` の JSON をパース
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (error) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message:
        '無効なリクエストです。request bodyが正しいJSON形式ではありません。',
    });
    return response;
  }

  console.log('Received event body:', body);

  if (!body || !body.userId || !body.teamName) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message:
        '無効なリクエストです。request bodyに必須パラメータがセットされていません。',
    });
    return response;
  }

  // userIdを文字列に変換
  const { userId, teamName } = body;
  const param = {
    TableName,
    Item: marshall({
      userId: String(userId), // userIdを文字列に変換
      teamName,
    }),
  };

  const command = new PutItemCommand(param);

  try {
    await client.send(command);
    response.statusCode = 201;
    response.body = JSON.stringify({
      userId,
      teamName,
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
