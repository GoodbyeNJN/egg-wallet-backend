// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCoin from '../../../app/controller/coin';
import ExportErc20 from '../../../app/controller/erc20';
import ExportExchange from '../../../app/controller/exchange';
import ExportExchangePair from '../../../app/controller/exchangePair';
import ExportHome from '../../../app/controller/home';
import ExportPrice from '../../../app/controller/price';

declare module 'egg' {
  interface IController {
    coin: ExportCoin;
    erc20: ExportErc20;
    exchange: ExportExchange;
    exchangePair: ExportExchangePair;
    home: ExportHome;
    price: ExportPrice;
  }
}
