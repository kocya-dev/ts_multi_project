import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { DynamoDBWrapper } from "./dynamoDBWrapper";
import { UserItem } from "./dynamoDBWrapperTypes";
import { createSucceed, createFail, createInvalidArgumentError, createArgumentRangeError } from "./createResponse";
import { logger } from "../logger/logger";

// Lambda エントリーポイント
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger("Hello Lambda!");
  logger(event);

  if (!event.pathParameters || !event.pathParameters["user_id"]) {
    return createInvalidArgumentError();
  }

  let id = +event.pathParameters["user_id"];
  if (id < 0 || isNaN(id)) {
    return createArgumentRangeError();
  }

  try {
    const dynamo: DynamoDBWrapper = new DynamoDBWrapper();
    const output: UserItem = await dynamo.getUser(id);
    if (output) {
      logger("SUCCESS (get item valid):", output);
      return createSucceed(output);
    } else {
      logger("SUCCESS (no item):");
      return createFail("no item");
    }
  } catch (err) {
    logger("ERROR:", err);
    return createFail(JSON.stringify(err));
  }
};
