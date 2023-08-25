import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { DynamoDBWrapper } from "./dynamoDBWrapper";
import { UserItem } from "./dynamoDBWrapperTypes";

// Lambda エントリーポイント
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Hello Lambda!");
  console.log(event);

  if (!event.pathParameters || !event.pathParameters["user_id"]) {
    return createInvalidArgumentError();
  }

  let id = 0;
  try {
    id = +event.pathParameters["user_id"];
    if (id < 0) {
      return createArgumentRangeError();
    }
  } catch (err) {
    return createInvalidArgumentError();
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

function createSucceed(result: any): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "end",
      result: result,
    }),
  };
}

function createFail(msg: string): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: msg,
    }),
  };
}

function createInvalidArgumentError(): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "invalid argument error",
    }),
  };
}

function createArgumentRangeError(): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "argument range error",
    }),
  };
}
