import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: 'ap-northeast-1' });
const TableName = 'Pitching';

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
    gameId,
    resultId,
    pitcherName,
    pitcherHand,
    batterName,
    batterHand,
    pitchType,
    course,
    result,
    angle,
    strike,
    ball,
    out,
    ballSpeed,
    x,
    y,
  } = body;
  if (!course) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: 'コースが選択されていません。',
    });
    return response;
  }
  if (!batterName) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: '打者が選択されていません。',
    });
    return response;
  }
  if (!pitcherName) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: '投手が選択されていません。',
    });
    return response;
  }
  if (!result) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message: '投球結果が選択されていません。',
    });
    return response;
  }
  if (
    !userId ||
    !gameId ||
    !resultId ||
    !pitcherHand ||
    !batterHand ||
    !pitchType
  ) {
    response.statusCode = 400;
    response.body = JSON.stringify({
      message:
        '無効なリクエストです。request bodyに必須パラメータがセットされていません。',
    });
    return response;
  }

  const param = {
    TableName,
    Item: marshall({
      userId: String(userId), // 数値を文字列に変換
      gameId,
      resultId,
      pitcherName,
      pitcherHand,
      batterName,
      batterHand,
      pitchType,
      course,
      result,
      angle,
      strike,
      ball,
      out,
      ballSpeed,
      x,
      y,
    }),
  };

  const command = new PutItemCommand(param);

  try {
    await client.send(command);
    response.statusCode = 201;
    response.body = JSON.stringify({
      userId,
      gameId,
      resultId,
      pitcherName,
      pitcherHand,
      batterName,
      batterHand,
      pitchType,
      course,
      result,
      angle,
      strike,
      ball,
      out,
      ballSpeed,
      x,
      y,
    });
  } catch (e) {
    console.error('Error:', e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: '予期せぬエラーが発生しました。',
      errorDetail: e.message, // エラーの詳細を追加
    });
  }

  return response;
};
