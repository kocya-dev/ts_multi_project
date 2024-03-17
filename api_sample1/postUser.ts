import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { DynamoDBWrapper } from "./dynamoDBWrapper";
import { UserItem } from "./dynamoDBWrapperTypes";
import { createSucceed, createFail, createInvalidArgumentError, createArgumentRangeError } from "./createResponse";
import { logger } from "../logger/logger";

// Lambda エントリーポイント
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger("Hello Lambda!");
  logger(event);

  if (event.pathParameters?.name) {
    return createInvalidArgumentError(); // パスパラメータは非対応
  }
  if (!event.body) {
    return createInvalidArgumentError(); // post情報がない
  }

  try {
    const item: UserItem = JSON.parse(event.body);
    const dynamo: DynamoDBWrapper = new DynamoDBWrapper();
    await dynamo.postUser(item);
    logger("SUCCESS (post item):");
    return createSucceed();
  } catch (err) {
    logger("ERROR:", err);
    return createFail(JSON.stringify(err));
  }
};
