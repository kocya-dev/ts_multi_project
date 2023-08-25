import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { DynamoDBWrapper } from "./dynamoDBWrapper";
import { UserItem } from "./dynamoDBWrapperTypes";

// Lambda エントリーポイント
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Hello Lambda!");
  console.log(event);

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
    console.log("SUCCESS (post item):");
    return createSucceed();
  } catch (err) {
    console.log("ERROR:", err);
    return createFail(JSON.stringify(err));
  }
};

function createSucceed(): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "end",
    }),
  };
}

function createFail(msg: string): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "exception occurred",
    }),
  };
}

function createInvalidArgumentError(): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "argument error",
    }),
  };
}

function createArgumentRangeError(): APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult> {
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: "argument error",
    }),
  };
}
