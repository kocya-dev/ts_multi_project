import {
  S3Client,
  CreateBucketCommand,
  DeleteBucketCommand,
  GetObjectCommand,
  PutObjectCommand,
  GetObjectCommandOutput,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

export class S3Wrapper {
  private _client: S3Client;
  private _bucketName: string | undefined = undefined;

  constructor() {
    this._client = new S3Client({
      region: "ap-northeast-1",
      endpoint: 
      /*
      credentials: {
        accessKeyId: "sample",
        secretAccessKey: "sample",
      },
      */
    });
  }
  public async create(bucketName: string): Promise<boolean> {
    console.log(bucketName); // 確認用
    if (this._bucketName) return false;

    try {
      this._bucketName = bucketName;
      //S3バケットを作成する
      const response = await this._client.send(
        new CreateBucketCommand({
          Bucket: bucketName,
        })
      );
      console.log(response);
      return true;
    } catch (err) {
      console.error(err); // 既にバケットがある場合: Error.message BucketAlreadyExists
      /*
ERROR	BucketAlreadyExists: The requested bucket name is not available. The bucket namespace is shared by all users of the system. Please select a different name and try again.
    at deserializeAws_restXmlBucketAlreadyExistsResponse (/var/runtime/node_modules/@aws-sdk/client-s3/dist-cjs/protocols/Aws_restXml.js:6113:23)
    at deserializeAws_restXmlCreateBucketCommandError (/var/runtime/node_modules/@aws-sdk/client-s3/dist-cjs/protocols/Aws_restXml.js:3159:25)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async /var/runtime/node_modules/@aws-sdk/middleware-serde/dist-cjs/deserializerMiddleware.js:7:24
    at async /var/runtime/node_modules/@aws-sdk/middleware-signing/dist-cjs/middleware.js:13:20
    at async StandardRetryStrategy.retry (/var/runtime/node_modules/@aws-sdk/middleware-retry/dist-cjs/StandardRetryStrategy.js:51:46)
    at async /var/runtime/node_modules/@aws-sdk/middleware-logger/dist-cjs/loggerMiddleware.js:6:22
    at async S3Wrapper.create (/var/task/index.js:47:24)
    at async Runtime.handler (/var/task/index.js:189:26) {
  '$fault': 'client',
  '$metadata': {
    httpStatusCode: 409,
    requestId: 'VF6ZSV729PR4F01C',
    extendedRequestId: 'rKjIioOXPnwSC0qI2GM/YRYCzCWkc72dRA74E4m8wBGmi2FTOKaYSHV1Te/7A0wAORxLSraMB4w=',
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  Code: 'BucketAlreadyExists',
  BucketName: 'storage-bucket-test',
  RequestId: 'VF6ZSV729PR4F01C',
  HostId: 'rKjIioOXPnwSC0qI2GM/YRYCzCWkc72dRA74E4m8wBGmi2FTOKaYSHV1Te/7A0wAORxLSraMB4w='
}
      */
      return true;
    }
  }
  public async delete(): Promise<boolean> {
    if (!this._bucketName) return false;

    //S3バケットを削除する
    try {
      const response = await this._client.send(
        new DeleteBucketCommand({
          Bucket: this._bucketName,
        })
      );
      this._bucketName = undefined;
      console.log(`${response}`);
      return true;
    } catch (err) {
      console.error(err);
      return true;
    }
  }
  private async getObject(key: string): Promise<GetObjectCommandOutput | undefined> {
    console.log(key); // 確認用
    if (!this._bucketName) return undefined;

    try {
      const response = await this._client.send(
        new GetObjectCommand({
          Bucket: this._bucketName,
          Key: key,
        })
      );
      console.log(response); // 確認用
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  public async getStringObject(key: string): Promise<string | undefined> {
    const response = await this.getObject(key);
    return response?.Body?.transformToString();
  }
  public async getBinaryObject(key: string): Promise<Uint8Array | undefined> {
    const response = await this.getObject(key);
    return response?.Body?.transformToByteArray();
  }
  public async putStringObject(key: string, body: string): Promise<boolean> {
    console.log(key); // 確認用
    console.log(body); // 確認用
    if (!this._bucketName) return false;

    try {
      const response = await this._client.send(
        new PutObjectCommand({
          Bucket: this._bucketName,
          Key: key,
          Body: body,
        })
      );
      console.log(response); // 確認用
      return true;
    } catch (err) {
      console.error(err);
      /*
      ERROR	PermanentRedirect: The bucket you are attempting to access must be addressed using the specified endpoint. Please send all future requests to this endpoint.
    at throwDefaultError (/var/runtime/node_modules/@aws-sdk/smithy-client/dist-cjs/default-error-handler.js:8:22)
    at deserializeAws_restXmlPutObjectCommandError (/var/runtime/node_modules/@aws-sdk/client-s3/dist-cjs/protocols/Aws_restXml.js:5782:43)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async /var/runtime/node_modules/@aws-sdk/middleware-serde/dist-cjs/deserializerMiddleware.js:7:24
    at async /var/runtime/node_modules/@aws-sdk/middleware-signing/dist-cjs/middleware.js:13:20
    at async StandardRetryStrategy.retry (/var/runtime/node_modules/@aws-sdk/middleware-retry/dist-cjs/StandardRetryStrategy.js:51:46)
    at async /var/runtime/node_modules/@aws-sdk/middleware-flexible-checksums/dist-cjs/flexibleChecksumsMiddleware.js:56:20
    at async /var/runtime/node_modules/@aws-sdk/middleware-logger/dist-cjs/loggerMiddleware.js:6:22
    at async S3Wrapper.putStringObject (/var/task/index.js:109:24)
    at async Runtime.handler (/var/task/index.js:195:22) {
  '$fault': 'client',
  '$metadata': {
    httpStatusCode: 301,
    requestId: undefined,
    extendedRequestId: '5UlhmvG1ag+P9jA8mTSXP4iby1+xds1qWf7oJ6NRXNLD9KUDCxfXH2aEpYksLjSXw73n/oGMpLy6f5nudh3B3g==',
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  Code: 'PermanentRedirect',
  Endpoint: 's3.amazonaws.com',
  Bucket: 'storage-bucket-test',
  RequestId: 'WV0SDFA0RPXSM22B',
  HostId: '5UlhmvG1ag+P9jA8mTSXP4iby1+xds1qWf7oJ6NRXNLD9KUDCxfXH2aEpYksLjSXw73n/oGMpLy6f5nudh3B3g=='
}
*/
      throw err;
    }
  }

  public async getList(): Promise<boolean> {
    if (!this._bucketName) return false;

    try {
      const response = await this._client.send(
        new ListObjectsV2Command({
          Bucket: this._bucketName,
          MaxKeys: 10, //取得件数を指定。最大1000件まで
        })
      );
      if (response.Contents) {
        const keys = response.Contents.map((d) => ({
          Key: d.Key as string,
        }));
      }
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
