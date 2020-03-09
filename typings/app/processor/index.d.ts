// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportStartProcess from '../../../app/processor/start_process';
import ExportTasks from '../../../app/processor/tasks';
import ExportUpdateContractAddress from '../../../app/processor/update_contract_address';

declare module 'egg' {
  interface Application {
    processor: IModel;
  }

  interface IModel {
    startProcess: AutoInstanceType<typeof ExportStartProcess>;
    tasks: AutoInstanceType<typeof ExportTasks>;
    updateContractAddress: AutoInstanceType<typeof ExportUpdateContractAddress>;
  }
}
