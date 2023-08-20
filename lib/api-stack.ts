import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new cdk.aws_lambda_nodejs.NodejsFunction(this, "MyLambda", {
      entry: "api_sample1/lambda_sample1.ts",
      handler: "handler", // デフォルトのハンドラ関数名は "handler"
      runtime: lambda.Runtime.NODEJS_18_X, // デフォルトは Node.js 14.x
      timeout: cdk.Duration.minutes(15), // デフォルトは 3 秒
    })
  }
}
