import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: 'ap-northeast-1' });
const TableName = 'Player';

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

  const {
    userId,
    teamName,
    position,
    playerName,
    playerNumber,
    pitchHand,
    batHand,
    pitchTypes = [],
  } = body;

  if (!playerNumber) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: '入力した背番号は登録できません',
    });
    return response;
  } else if (!position || !pitchHand || !batHand) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: '未選択の項目があります',
    });
    return response;
  } else if (
    !userId ||
    !teamName ||
    !position ||
    !playerName ||
    !pitchHand ||
    !batHand
  ) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message:
        '無効なリクエストです。request bodyに必須パラメータがセットされていません。',
    });
    return response;
  }

  const item = {
    userId: String(userId),
    teamName,
    position,
    playerName,
    playerNumber,
    pitchHand,
    batHand,
  };

  if (
    position === '投手' &&
    Array.isArray(pitchTypes) &&
    pitchTypes.length > 0
  ) {
    item.pitchTypes = pitchTypes;
  }

  const param = {
    TableName,
    Item: marshall(item),
  };

  const command = new PutItemCommand(param);

  try {
    await client.send(command);
    response.statusCode = 201;
    response.body = JSON.stringify({
      userId,
      teamName,
      position,
      playerName,
      playerNumber,
      pitchHand,
      batHand,
      ...(position === '投手' ? { pitchTypes } : {}),
    });
  } catch (e) {
    console.error('Error:', e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: '予期せぬエラーが発生しました。',
      errorDetail: e.message,
    });
  }

  return response;
};
