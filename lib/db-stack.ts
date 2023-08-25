import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class DynamoDBStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB resource -------------------

    new dynamodb.Table(this, "Sample-user-table", {
      // 'Sample-table'はStack内で一意
      tableName: "user", // テーブル名の定義
      partitionKey: {
        //パーティションキーの定義
        name: "id",
        type: dynamodb.AttributeType.NUMBER,
      },
      /*
      sortKey: { // ソートキーの定義
        name: 'name',
        type: dynamodb.AttributeType.STRING,
      },
      */
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // オンデマンド請求
      pointInTimeRecovery: false, // PITRを有効化
      timeToLiveAttribute: "expired", // TTLの設定
      removalPolicy: cdk.RemovalPolicy.DESTROY, // cdk destroyでDB削除可
    });

    new dynamodb.Table(this, "Sample-machine-table", {
      // 'Sample-table'はStack内で一意
      tableName: "machine", // テーブル名の定義
      partitionKey: {
        //パーティションキーの定義
        name: "id",
        type: dynamodb.AttributeType.NUMBER,
      },
      /*
        sortKey: { // ソートキーの定義
          name: 'name',
          type: dynamodb.AttributeType.STRING,
        },
        */
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // オンデマンド請求
      pointInTimeRecovery: false, // PITRを有効化
      timeToLiveAttribute: "expired", // TTLの設定
      removalPolicy: cdk.RemovalPolicy.DESTROY, // cdk destroyでDB削除可
    });
  }
}
