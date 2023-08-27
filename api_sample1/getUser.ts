import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { DynamoDBWrapper } from "./dynamoDBWrapper";
import { UserItem } from "./dynamoDBWrapperTypes";
import { createSucceed, createFail, createInvalidArgumentError, createArgumentRangeError } from "./createResponse";

// Lambda エントリーポイント
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Hello Lambda!");
  console.log(event);

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
      console.log("SUCCESS (get item valid):", output);
      return createSucceed(output);
    } else {
      console.log("SUCCESS (no item):");
      return createFail("no item");
    }
  } catch (err) {
    console.log("ERROR:", err);
    return createFail(JSON.stringify(err));
  }
};
