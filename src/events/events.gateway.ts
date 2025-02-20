import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SelectScenarioDto } from 'src/modules/scenario/dto/select-scenario.dto';

// define events and data types here
export interface BroadcastEvents {
  'scenario-job-success': {
    jobId: number;
    scenarioData: SelectScenarioDto;
  };
  'scenario-job-failed': {
    jobId: number;
  };
}

@WebSocketGateway({ cors: true })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private server: any;

  afterInit() {
    Logger.log('websocket server initialised');
  }
  handleConnection() {
    Logger.log('connection detected');
  }
  handleDisconnect() {
    Logger.log('disconnect');
  }

  private broadcast(event: keyof BroadcastEvents, message: any) {
    const broadCastMessage = JSON.stringify(message);
    this.server.emit(event, broadCastMessage);
  }

  public onScenarioJobSuccess(data: BroadcastEvents['scenario-job-success']) {
    this.broadcast('scenario-job-success', data);
  }

  public onScenarioJobFailed(data: BroadcastEvents['scenario-job-failed']) {
    this.broadcast('scenario-job-failed', data);
  }
}
