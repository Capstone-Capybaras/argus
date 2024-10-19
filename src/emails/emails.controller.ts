import {
  ConfirmSubscriptionCommand,
  ConfirmSubscriptionCommandOutput,
  SNSClient,
} from '@aws-sdk/client-sns';
import { Controller, Inject, Logger, Post, Req } from '@nestjs/common';
import { SNS_CLIENT } from 'src/providerKeys';
import { EmailsService } from './emails.service';
import { PlainBody } from 'src/common/decorators/plainbody.decorator';

@Controller('emails')
export class EmailsController {
  constructor(
    @Inject(SNS_CLIENT)
    private readonly snsClient: SNSClient,
    private readonly emailsService: EmailsService,
  ) {}

  /**
   * Route that is subscribed to sns email inbound topic
   * to receive SES replies
   */
  @Post('inbound')
  async onInbound(
    @PlainBody() message: string,
    @Req() req: Request,
  ): Promise<ConfirmSubscriptionCommandOutput | boolean> {
    if (req.headers['x-amz-sns-message-type'] === 'SubscriptionConfirmation') {
      const subscribeEvent: { Token: string; TopicArn: string } =
        JSON.parse(message);
      const { Token: token, TopicArn: topicArn } = subscribeEvent;
      const command = new ConfirmSubscriptionCommand({
        Token: token,
        TopicArn: topicArn,
      });
      Logger.log('confirmed SNS topic subscription');
      return this.snsClient.send(command);
    } else {
      // check typing here
      // https://docs.aws.amazon.com/ses/latest/dg/event-publishing-retrieving-sns-contents.html
      // no current official support for types,
      // but refer to this for a community one: https://github.com/aws/aws-sdk-js-v3/issues/6141
      const parsedMessage = JSON.parse(message);
      Logger.log({ parsedMessage });
      return this.emailsService.processInbound();
    }
  }
}
