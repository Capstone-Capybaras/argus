import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { secretManagerConfig } from 'src/config/secrets';
import { Readable } from 'stream';

@Injectable()
export class S3Service implements OnModuleInit {
  private s3: S3Client;

  async onModuleInit() {
    const secrets = await secretManagerConfig(); // Fetch secrets from AWS Secrets Manager

    this.s3 = new S3Client({
      region: secrets.REGION,
    });
  }

  private streamToBuffer = async (stream: Readable): Promise<Buffer> => {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  };

  async checkFileExists(bucketName: string, key: string): Promise<boolean> {
    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    try {
      await this.s3.send(command);
      return true; // HeadObject succeeded, file exists
    } catch (error: any) {
      if (error.name === 'NotFound') {
        return false; // File does not exist
      }
      throw error; // Other errors, rethrow
    }
  }

  async downloadFile(bucketName: string, key: string): Promise<Buffer> {
    try {
      const params = { Bucket: bucketName, Key: key };
      const command = new GetObjectCommand(params);
      const { Body } = await this.s3.send(command);
      if (Body instanceof Readable) {
        const buffer = await this.streamToBuffer(Body); // Convert stream to buffer
        return buffer;
      } else {
        throw new Error(
          `Error fetching file from S3: File not readable. ${Body}`,
        );
      }
    } catch (err) {
      console.error('Error fetching file from S3:', err);
      throw new Error(`Error fetching file from S3: ${err}`);
    }
  }

  async streamFile(bucketName: string, key: string) {
    try {
      const params = { Bucket: bucketName, Key: key };
      const command = new GetObjectCommand(params);
      const response = await this.s3.send(command);
      return response;
    } catch (err) {
      console.error('Error getting object from S3:', err);
      throw new Error(`Error getting object from S3: ${err}`);
    }
  }

  async getObjectsByPrefix(bucketName: string, prefix: string) {
    try {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: prefix,
      });
      const response = await this.s3.send(command);
      const objects = response.Contents?.map((obj) => obj.Key);
      return objects;
    } catch (err) {
      console.log('error getting prefix objects:', err);
    }
  }

  async DeleteObject(bucketName: string, key: string) {
    try {
      const command = new DeleteObjectCommand({ Bucket: bucketName, Key: key });
      const result = await this.s3.send(command);
      return result;
    } catch (err) {
      console.log('Error deleting object:', err);
    }
  }
}
