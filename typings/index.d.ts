import "egg";
import Chain3 from "chain3";
import Web3 from "web3";
import { BlockHeader } from "web3-eth";
import { AbiItem } from "web3-utils";
import { NosClient, NosClientOptions } from "@xgheaven/nos-node-sdk";

interface Chain3Options {
    rpc: string;
}

interface Web3Options {
    rpc: string;
}

declare module "egg" {
    // app对象的类型声明
    interface Application {
        nos: NosClient;
        chain3: Chain3;
        web3: Web3;
        price: {
            [symbol: string]: {
                symbol: string;
                price: number;
                lastUpdated: number;
            };
        };
        exchange: {
            keyword: string;
            abi: AbiItem[];
        };
    }

    // config文件中相关配置信息的类型声明
    interface EggAppConfig {
        nos: {
            client?: NosClientOptions;
            clients?: Record<string, NosClientOptions>;
        };
        chain3: {
            client?: Chain3Options;
            clients?: Record<string, Chain3Options>;
        };
        web3: {
            client?: Web3Options;
            clients?: Record<string, Web3Options>;
            chain?: string;
        };
        cmc: {
            endpoint: string;
            keys: string[];
        };
        server: {
            url: string;
            sckey: string[];
        };
    }

    interface MoacBlock {
        number: number | null;
        hash: string | null;
        parentHash: string;
        nonce: string | null;
        sha3Uncles: string;
        logsBloom: string | null;
        transactionsRoot: string;
        stateRoot: string;
        miner: string;
        difficulty: bigint;
        totalDifficulty: bigint;
        extraData: string;
        size: number;
        gasLimit: number;
        gasUsed: number;
        timestamp: number;
        transactions: MoacTransaction[]; // or string[] if getBlock(hash, false)
        uncles: string[];
    }

    interface MoacTransaction {
        hash: string;
        nonce: number;
        blockHash: string | null;
        blockNumber: number | null;
        transactionIndex: number | null;
        from: string;
        to: string;
        value: bigint;
        gas: number;
        gasPrice: bigint;
        input: string;
        syscnt: string;
        v: string;
        r: string;
        s: string;
        shardingFlag: string;
    }

    interface MoacReceipt {
        transactionHash: string;
        blockHash: string;
        blockNumber: number;
        transactionIndex: number;
        from: string;
        to: string;
        contractAddress: string | null;
        gasUsed: number;
        cumulativeGasUsed: number;
        logs: any[];
        logsBloom: string;
        status: "0x1" | "0x0";
    }

    interface EthBlock extends BlockHeader {}

    interface Task {
        hash: string;
        endBlockNumber: number;
        processor: string;
        [key: string]: any;
    }
}
