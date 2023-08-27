import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, GetCommandOutput  } from '@aws-sdk/lib-dynamodb'

// Lambda エントリーポイント
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Hello Lambda!")
  console.log(event);

  const config: DynamoDBClientConfig = {
    region: 'ap-northeast-1',
  }
  const dbClient = new DynamoDBClient(config)
  const documentClient = DynamoDBDocumentClient.from(dbClient)
  try {
    const command = new GetCommand({
      TableName: 'user',
      Key: {
        id : "1",
        name : "test",
      }
    })
    const output : GetCommandOutput = await documentClient.send(command)
    if (output.Item) {
      console.log('SUCCESS (get item valid):', output)
    } else {
      console.log('SUCCESS (get no item):', output)
    }
  } catch (err) {
    console.log('ERROR:', err)
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
        message: "end",
    }),
};
}
