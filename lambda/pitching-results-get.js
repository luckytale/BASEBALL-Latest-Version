import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({ region: 'ap-northeast-1' });
const TableName = 'Pitching';

export const handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ message: '' }),
  };

  const param = {
    TableName,
  };

  const command = new ScanCommand(param);

  try {
    const results = (await client.send(command)).Items;
    const unmarshalledUsersItems = results.map((item) => unmarshall(item));
    response.body = JSON.stringify({ users: unmarshalledUsersItems });
  } catch (e) {
    console.error(e);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: '予期せぬエラーが発生しました。',
      errorDetail: e.toString(),
    });
  }

  return response;
};
