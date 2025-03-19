export interface BatchOperationResponse<Success, Failed> {
  success: Success[];
  failed: Failed[];
  failedMessages: string[];
}
