// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCoin from '../../../app/model/Coin';
import ExportEthErc20 from '../../../app/model/EthErc20';
import ExportExchange from '../../../app/model/Exchange';
import ExportExchangePair from '../../../app/model/ExchangePair';
import ExportMoacErc20 from '../../../app/model/MoacErc20';
import ExportWallet from '../../../app/model/Wallet';

declare module 'egg' {
  interface IModel {
    Coin: ReturnType<typeof ExportCoin>;
    EthErc20: ReturnType<typeof ExportEthErc20>;
    Exchange: ReturnType<typeof ExportExchange>;
    ExchangePair: ReturnType<typeof ExportExchangePair>;
    MoacErc20: ReturnType<typeof ExportMoacErc20>;
    Wallet: ReturnType<typeof ExportWallet>;
  }
}
