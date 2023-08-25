import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, GetCommandOutput, PutCommand, PutCommandInput, PutCommandOutput } from "@aws-sdk/lib-dynamodb";
import { UserItem } from "./dynamoDBWrapperTypes";

export class DynamoDBWrapper {
  private _client: DynamoDBClient;
  constructor() {
    const config: DynamoDBClientConfig = {
      region: "ap-northeast-1",
    };
    this._client = new DynamoDBClient(config);
  }
  createDynamoDocument(): DynamoDBDocumentClient {
    const documentClient = DynamoDBDocumentClient.from(this._client);
    return documentClient;
  }
  public async getUser(id: number): Promise<UserItem> {
    const command = new GetCommand({
      TableName: "user",
      Key: {
        id: id,
      },
    });

    try {
      const output: GetCommandOutput = await this._client.send(command);
      return output.Item as UserItem;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  public async postUser(item: UserItem): Promise<void> {
    const command = new PutCommand({ TableName: "user", Item: item });
    try {
      const result: PutCommandOutput = await this._client.send(command);
      console.log(result);
    } catch (err) {
      console.log(err);
      throw err;
    }
    return;
  }
}
