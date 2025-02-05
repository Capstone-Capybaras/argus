import { Injectable, OnModuleInit } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { secretManagerConfig } from 'src/config/secrets';

@Injectable()
export class S3Service implements OnModuleInit {
  private s3: AWS.S3;

  async onModuleInit() {
    const secrets = await secretManagerConfig(); // Fetch secrets from AWS Secrets Manager

    this.s3 = new AWS.S3({
      accessKeyId: secrets.RESOURCE_ACCESS_KEY,
      secretAccessKey: secrets.RESOURCE_ACCESS_SECRET,
      region: secrets.REGION,
    });

    console.log('S3 Client Initialized with Secrets Manager credentials');
  }

  async downloadFile(bucketName: string, key: string): Promise<Buffer> {
    try {
      const params = { Bucket: bucketName, Key: key };
      const data = await this.s3.getObject(params).promise();
      return data.Body as Buffer;
    } catch (err) {
      console.error('Error fetching file from S3:', err);
      throw new Error('File fetching failed');
    }
  }
}
