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

    // GET/POSTなどメソッド別に関連付ける方法
    const funcGetUser = this.createLambda(this, "GetUser", "api_sample1/getUser.ts", "handler", this.creatrePolicyDynamoDBUsing());
    const funcPostUser = this.createLambda(this, "PostUser", "api_sample1/postUser.ts", "handler", this.creatrePolicyDynamoDBUsing());

    const api = new apigw.RestApi(this, "NormalApi");
    const apiUsers = api.root.addResource("users", {});
    const apiUser = apiUsers.addResource("{user_id}");
    apiUser.addMethod("GET", new apigw.LambdaIntegration(funcGetUser));
    apiUser.addMethod("POST", new apigw.LambdaIntegration(funcPostUser));

    // GET/POSTなどを1lambdaで受けて内部で分岐する方法
    const funcMachines = this.createLambda(this, "MachineProxy", "api_sample2/proxy.ts", "handler", this.creatrePolicyDynamoDBUsing());
    const apiMachines = api.root.addResource("machines", {});
    const apiMachine = apiMachines.addResource("{user_id}");
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
}
