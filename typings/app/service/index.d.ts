// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportChain3 from '../../../app/service/Chain3';
import ExportTest from '../../../app/service/Test';

declare module 'egg' {
  interface IService {
    chain3: ExportChain3;
    test: ExportTest;
  }
}
