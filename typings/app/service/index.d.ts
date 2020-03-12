// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportChain3 from '../../../app/service/Chain3';
import ExportNotification from '../../../app/service/Notification';
import ExportTest from '../../../app/service/Test';
import ExportWeb3 from '../../../app/service/Web3';

declare module 'egg' {
  interface IService {
    chain3: AutoInstanceType<typeof ExportChain3>;
    notification: AutoInstanceType<typeof ExportNotification>;
    test: AutoInstanceType<typeof ExportTest>;
    web3: AutoInstanceType<typeof ExportWeb3>;
  }
}
