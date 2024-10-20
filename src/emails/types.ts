// no current official support for types,
// but refer to this for a community one: https://github.com/aws/aws-sdk-js-v3/issues/6141
export type SESEventNotification =
  | SESBounceNotification
  | SESComplaintNotification
  | SESDeliveryNotification
  | SESSendNotification
  | SESRejectNotification
  | SESOpenNotification
  | SESClickNotification
  | SESRenderingFailureNotification
  | SESDeliveryDelayNotification
  | SESSubscriptionNotification;

export type SESCommonNotification = {
  mail: {
    timestamp: string;
    messageId: string;
    source: string;
    sourceArn: string;
    sendingAccountId: string;
    destination: string[];
    headersTruncated: boolean;
    headers: { name: string; value: string }[];
    commonHeaders: Record<string, string | string[]>;
    tags: Record<string, string[]>;
  };
};

export type BounceTypes =
  | { bounceType: 'Undetermined'; bounceSubType: 'Undetermined' }
  | {
      bounceType: 'Permanent';
      bounceSubType:
        | 'General'
        | 'NoEmail'
        | 'Suppressed'
        | 'OnAccountSuppressionList';
    }
  | {
      bounceType: 'Transient';
      bounceSubType:
        | 'General'
        | 'MailboxFull'
        | 'MessageTooLarge'
        | 'ContentRejected'
        | 'AttachmentRejected';
    };

export type SESBounceNotification = SESCommonNotification & {
  eventType: 'Bounce';
  bounce: BounceTypes & {
    bouncedRecipients: {
      emailAddress: string;
      action?: string;
      status?: string;
      diagnosticCode?: string;
    }[];
    timestamp: string;
    feedbackId: string;
    reportingMTA?: string;
  };
};

export type SESComplaintNotification = SESCommonNotification & {
  eventType: 'Complaint';
  complaint: {
    complainedRecipients: { emailAddress: string }[];
    timestamp: string;
    feedbackId: string;
    complaintSubType?: string;
    userAgent?: string;
    complaintFeedbackType?:
      | 'abuse'
      | 'auth-failure'
      | 'fraud'
      | 'not-spam'
      | 'other'
      | 'virus';
    arrivalDate?: string;
  };
};

export type SESDeliveryNotification = SESCommonNotification & {
  eventType: 'Delivery';
  delivery: {
    timestamp: string;
    processingTimeMillis: number;
    recipients: string[];
    smtpResponse: string;
    reportingMTA?: string;
  };
};

export type SESSendNotification = SESCommonNotification & {
  eventType: 'Send';
  send: object;
};

export type SESRejectNotification = SESCommonNotification & {
  eventType: 'Reject';
  reject: {
    reason: string;
  };
};

export type SESOpenNotification = SESCommonNotification & {
  eventType: 'Open';
  open: {
    ipAddress: string;
    timestamp: string;
    userAgent: string;
  };
};

export type SESClickNotification = SESCommonNotification & {
  eventType: 'Click';
  click: {
    ipAddress: string;
    link: string;
    linkTags: Record<string, string[]>;
    timestamp: string;
    userAgent: string;
  };
};

export type SESRenderingFailureNotification = SESCommonNotification & {
  eventType: 'Rendering Failure';
  failure: {
    templateName: string;
    errorMessage: string;
  };
};

export type SESDeliveryDelayNotification = SESCommonNotification & {
  eventType: 'DeliveryDelay';
  deliveryDelay: {
    delayType:
      | 'InternalFailure'
      | 'General'
      | 'MailboxFull'
      | 'SpamDetected'
      | 'RecipientServerError'
      | 'IPFailure'
      | 'TransientCommunicationFailure'
      | 'BYOIPHostNameLookupUnavailable'
      | 'Undetermined'
      | 'SendingDeferral';
    delayedRecipients: {
      emailAddress: string;
      status: string;
      diagnosticCode: string;
    }[];
    expirationTime: string;
    reportingMTA?: string;
    timestamp: string;
  };
};

export type SESSubscriptionNotification = SESCommonNotification & {
  eventType: 'Subscription';
  subscription: {
    contactList: string;
    timestamp: string;
    source: string;
    newTopicPreferences: TopicPreferences;
    oldTopicPreferences: TopicPreferences;
  };
};

export type TopicPreferences = {
  unsubscribeAll: boolean;
  topicSubscriptionStatus: {
    topicName: string;
    subscriptionStatus: 'OptIn' | 'OptOut';
  }[];
  topicDefaultSubscriptionStatus: {
    topicName: string;
    subscriptionStatus: 'OptIn' | 'OptOut';
  }[];
};
