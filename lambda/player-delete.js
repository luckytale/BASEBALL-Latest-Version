import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: 'ap-northeast-1' });
const TableName = 'Player';

export const handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ message: '' }),
  };

  const userId = event.queryStringParameters?.userId;
  const playerName = event.queryStringParameters?.playerName;

  if (!userId || !playerName) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message:
        '無効なリクエストです。query parameterに必須パラメータがセットされていません。',
    });

    return response;
  }

  const param = {
    TableName,
    Key: marshall({
      userId,
      playerName,
    }),
  };

  const command = new DeleteItemCommand(param);

  try {
    await client.send(command);
    response.statusCode = 204;
  } catch (e) {
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: '予期せぬエラーが発生しました。',
      errorDetail: e.toString(),
    });
  }

  return response;
};
