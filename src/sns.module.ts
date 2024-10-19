import { Module } from '@nestjs/common';
import { SNSClient } from '@aws-sdk/client-sns';
import { SNS_CLIENT } from './providerKeys';
import { AWS_REGION } from './constants';

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_sns_code_examples.html
@Module({
  providers: [
    {
      provide: SNS_CLIENT,
      useFactory: () =>
        new SNSClient({
          // endpoint: process.env.SNS_ENDPOINT || 'http://127.0.0.1:4566',
          region: AWS_REGION,
        }),
    },
  ],
  exports: [SNS_CLIENT],
})
export class SnsModule {}
