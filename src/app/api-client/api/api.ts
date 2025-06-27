export * from './inProcessBpmApi.service';
import { InProcessBpmApiService } from './inProcessBpmApi.service';
export * from './processBpmApi.service';
import { ProcessBpmApiService } from './processBpmApi.service';
export * from './taskBpmApi.service';
import { TaskBpmApiService } from './taskBpmApi.service';
export * from './userBpmnApi.service';
import { UserBpmnApiService } from './userBpmnApi.service';
export const APIS = [InProcessBpmApiService, ProcessBpmApiService, TaskBpmApiService, UserBpmnApiService];
