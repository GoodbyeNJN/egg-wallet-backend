import { EggAppConfig, EggAppInfo, PowerPartial } from "egg";
import path from "path";

export default (appInfo: EggAppInfo) => {
    const config: PowerPartial<EggAppConfig> = {};

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + "_1582177782703_6534";

    // add your egg config in here
    config.middleware = [];

    // add your special config in here
    const bizConfig = {
        sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    };

    // 关闭csrf功能
    config.security = {
        csrf: {
            enable: false,
        },
    };

    // 设置文件上传为file模式，另有文件流模式可选
    config.multipart = {
        mode: "file",
    };

    // 参数校验插件egg-validate
    config.validate = {
        convert: true,
        widelyUndefined: true,
    };

    // sequelize的连接信息
    config.sequelize = {
        host: "127.0.0.1",
        port: 3306,
        dialect: "mysql",
        username: "moac_wallet_moac",
        password: "afX6DHJJZxkSwKJk",
        database: "moac_wallet_moac",
        logging: false,
    };

    // 网易云对象存储的连接信息
    config.nos = {
        client: {
            accessKey: "509cb4a36f6f479a8a835640a697e5e7",
            accessSecret: "20c0075d16514585a556358f55372c37",
            endpoint: "http://nos-eastchina1.126.net",
            defaultBucket: "moac-wallet",
        },
    };

    // chain3的连接信息
    config.chain3 = {
        client: { rpc: "http://node.moacchina.info" },
    };

    // web3的连接信息
    config.web3 = {
        client: {
            rpc: "wss://ropsten.infura.io/ws/v3/13ab66893f804b6684194366db26efc3",
        },
        // 测试网的chain名称
        // 后期需要改成正式网的话，改成mainnet，或直接删除这一项
        chain: "ropsten",
        // chain: "mainnet",
    };

    // cmc获取币价的api地址及密钥信息，有每小时和每日限额
    config.cmc = {
        endpoint: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
        keys: ["0b6e2f3d-66c5-4bb1-9fc3-ea3fa7e07f64", "d83785b8-fab6-46ca-8a9d-f0fa770668fe"],
    };

    // 钱包余额不足时通过微信通知管理员，相关说明见如下url
    config.server = {
        url: "https://sc.ftqq.com",
        sckey: ["SCU437T83590f210b822814000b66a170a3c9f155f67a24ee2c5"],
    };

    // 闪兑交易的配置信息
    config.exchange = {
        // 写入转账的input data中，用于识别是否为闪兑交易
        keyString: "00000000000000000000000000000000000000000000000065786368616e6765", // web3.utils.utf8ToHex('exchange')
        abi: [
            {
                constant: true,
                inputs: [],
                name: "name",
                outputs: [{ name: "", type: "string" }],
                payable: false,
                stateMutability: "view",
                type: "function",
            },
            {
                constant: false,
                inputs: [
                    { name: "_spender", type: "address" },
                    { name: "_value", type: "uint256" },
                ],
                name: "approve",
                outputs: [{ name: "success", type: "bool" }],
                payable: false,
                stateMutability: "nonpayable",
                type: "function",
            },
            {
                constant: true,
                inputs: [],
                name: "totalSupply",
                outputs: [{ name: "", type: "uint256" }],
                payable: false,
                stateMutability: "view",
                type: "function",
            },
            {
                constant: false,
                inputs: [
                    { name: "_from", type: "address" },
                    { name: "_to", type: "address" },
                    { name: "_value", type: "uint256" },
                ],
                name: "transferFrom",
                outputs: [{ name: "success", type: "bool" }],
                payable: false,
                stateMutability: "nonpayable",
                type: "function",
            },
            {
                constant: true,
                inputs: [],
                name: "decimals",
                outputs: [{ name: "", type: "uint8" }],
                payable: false,
                stateMutability: "view",
                type: "function",
            },
            {
                constant: false,
                inputs: [],
                name: "kill",
                outputs: [],
                payable: false,
                stateMutability: "nonpayable",
                type: "function",
            },
            {
                constant: true,
                inputs: [{ name: "_owner", type: "address" }],
                name: "balanceOf",
                outputs: [{ name: "balance", type: "uint256" }],
                payable: false,
                stateMutability: "view",
                type: "function",
            },
            {
                constant: true,
                inputs: [],
                name: "owner",
                outputs: [{ name: "", type: "address" }],
                payable: false,
                stateMutability: "view",
                type: "function",
            },
            {
                constant: true,
                inputs: [],
                name: "symbol",
                outputs: [{ name: "", type: "string" }],
                payable: false,
                stateMutability: "view",
                type: "function",
            },
            {
                constant: false,
                inputs: [
                    { name: "_to", type: "address" },
                    { name: "_value", type: "uint256" },
                ],
                name: "transfer",
                outputs: [{ name: "success", type: "bool" }],
                payable: false,
                stateMutability: "nonpayable",
                type: "function",
            },
            {
                constant: true,
                inputs: [
                    { name: "_owner", type: "address" },
                    { name: "_spender", type: "address" },
                ],
                name: "allowance",
                outputs: [{ name: "remaining", type: "uint256" }],
                payable: false,
                stateMutability: "view",
                type: "function",
            },
            {
                inputs: [
                    { name: "initialAmount", type: "uint256" },
                    { name: "tokenName", type: "string" },
                    { name: "decimalUnits", type: "uint8" },
                    { name: "tokenSymbol", type: "string" },
                ],
                payable: false,
                stateMutability: "nonpayable",
                type: "constructor",
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, name: "_from", type: "address" },
                    { indexed: true, name: "_to", type: "address" },
                    { indexed: false, name: "_value", type: "uint256" },
                ],
                name: "Transfer",
                type: "event",
            },
            {
                anonymous: false,
                inputs: [
                    { indexed: true, name: "_owner", type: "address" },
                    { indexed: true, name: "_spender", type: "address" },
                    { indexed: false, name: "_value", type: "uint256" },
                ],
                name: "Approval",
                type: "event",
            },
        ],
    };

    // the return config will combines to EggAppConfig
    return {
        ...config,
        ...bizConfig,
    };
};
