import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as apigw from "aws-cdk-lib/aws-apigateway";

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const accountId = cdk.Stack.of(this).account;
    const region = cdk.Stack.of(this).region;

    const dynamoDbPolicy: cdk.aws_iam.PolicyStatement = this.creatrePolicyDynamoDBUsing();
    const s3Policy: cdk.aws_iam.PolicyStatement = this.creatrePolicyS3Using();

    // GET/POSTなどメソッド別に関連付ける方法
    const funcGetUser = this.createLambda(this, "GetUser", "api_sample1/getUser.ts", "handler", dynamoDbPolicy);
    const funcPostUser = this.createLambda(this, "PostUser", "api_sample1/postUser.ts", "handler", dynamoDbPolicy);
    const funcGetFile = this.createLambda(this, "GetFile", "api_sample3/getFile.ts", "handler", s3Policy);
    const funcPostFile = this.createLambda(this, "PostFile", "api_sample3/postFile.ts", "handler", s3Policy);

    const api = new apigw.RestApi(this, "NormalApi");
    const apiUsers = api.root.addResource("users", {});
    const apiUser = apiUsers.addResource("{user_id}");
    apiUser.addMethod("GET", new apigw.LambdaIntegration(funcGetUser));
    apiUser.addMethod("POST", new apigw.LambdaIntegration(funcPostUser));
    const apiFiles = api.root.addResource("files", {});
    const apiFileName = apiFiles.addResource("{name}");
    apiFileName.addMethod("GET", new apigw.LambdaIntegration(funcGetFile));
    apiFileName.addMethod("POST", new apigw.LambdaIntegration(funcPostFile));

    // GET/POSTなどを1lambdaで受けて内部で分岐する方法
    const funcMachines = this.createLambda(this, "MachineProxy", "api_sample2/proxy.ts", "handler", dynamoDbPolicy);
    const apiMachines = api.root.addResource("machines", {});
    const apiMachine = apiMachines.addResource("{user_id2}");
    const apiMachinesProxy = apiMachine.addProxy({
      anyMethod: true,
      defaultIntegration: new apigw.LambdaIntegration(funcMachines),
    });
  }

  createLambda(
    scope: Construct,
    id: string,
    entryPath: string,
    handlerName: string,
    policy: cdk.aws_iam.PolicyStatement
  ): cdk.aws_lambda_nodejs.NodejsFunction {
    const func = new cdk.aws_lambda_nodejs.NodejsFunction(scope, id, {
      entry: entryPath,
      handler: handlerName, // デフォルトのハンドラ関数名は "handler"
      runtime: lambda.Runtime.NODEJS_18_X, // デフォルトは Node.js 14.x
      timeout: cdk.Duration.minutes(15), // デフォルトは 3 秒
    });
    func.addToRolePolicy(policy);
    return func;
  }
  creatrePolicyDynamoDBUsing(): cdk.aws_iam.PolicyStatement {
    return new cdk.aws_iam.PolicyStatement({
      actions: ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem", "dynamodb:DescribeTable"],
      effect: cdk.aws_iam.Effect.ALLOW,
      resources: [`*`],
    });
  }
  creatrePolicyS3Using(): cdk.aws_iam.PolicyStatement {
    return new cdk.aws_iam.PolicyStatement({
      actions: [`*`],
      effect: cdk.aws_iam.Effect.ALLOW,
      resources: [`*`],
    });
  }
}
