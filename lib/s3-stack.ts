import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class S3StorageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'LessonAwsCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // S3
    const storageBucket = new cdk.aws_s3.Bucket(this, "storageBucket", {
      bucketName: "storage-bucket-test",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // S3 バケットポリシー設定
    const storageBucketPolicyStatement = new cdk.aws_iam.PolicyStatement({
      actions: ["s3:GetObject"],
      effect: cdk.aws_iam.Effect.ALLOW,
      principals: [new cdk.aws_iam.ArnPrincipal("*")],
      resources: [`${storageBucket.bucketArn}/*`],
    });

    storageBucket.addToResourcePolicy(storageBucketPolicyStatement);
  }
}
