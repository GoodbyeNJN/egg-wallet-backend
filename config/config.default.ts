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

    config.security = {
        csrf: {
            enable: false,
        },
    };

    config.multipart = {
        mode: "file",
    };

    config.validate = {
        convert: true,
        widelyUndefined: true,
    };

    config.sequelize = {
        host: "127.0.0.1",
        port: 3306,
        dialect: "mysql",
        username: "moac_wallet_moac",
        password: "afX6DHJJZxkSwKJk",
        database: "moac_wallet_moac",
        logging: false,
    };

    config.redis = {
        client: {
            port: 6379,
            host: "127.0.0.1",
            password: "",
            db: 0,
        },
    };

    config.nos = {
        client: {
            accessKey: "509cb4a36f6f479a8a835640a697e5e7",
            accessSecret: "20c0075d16514585a556358f55372c37",
            endpoint: "http://nos-eastchina1.126.net",
            defaultBucket: "moac-wallet",
        },
    };

    config.chain3 = {
        client: { rpc: "http://node.moacchina.info" },
    };

    config.web3 = {
        client: {
            rpc: "wss://ropsten.infura.io/ws/v3/13ab66893f804b6684194366db26efc3",
        },
        chain: "ropsten",
    };

    config.cmc = {
        endpoint: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
        keys: ["0b6e2f3d-66c5-4bb1-9fc3-ea3fa7e07f64", "d83785b8-fab6-46ca-8a9d-f0fa770668fe"],
    };

    config.exchange = {
        keyString: "00000000000000000000000000000000000000000000000065786368616e6765", // web3.utils.utf8ToHex('exchange')
        // keyString: "000000000000776562332e7574696c732e75746638546f48657828737472293b", // web3.utils.utf8ToHex('exchange')
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

    // config.controller = {
    //     genSDK: {
    //         enable: true,
    //         /** 生成SDK的位置 */
    //         // sdkDir: path.join("app", "assets", "service"),
    //         /** 路由过滤方法，默认只生成 '/api' 开头的路由 */
    //         filter: [/^\/api\//g],
    //         /** 默认使用ts，会生成类型定义，可选js */
    //         type: "ts",
    //         /** service 生成风格，支持 class | function */
    //         serviceType: "class",
    //         /** 类、文件名风格，支持大驼峰、下划线连字符、小驼峰 true | false | lower */
    //         camelCase: true,
    //         // hook: {
    //         //     /** 替换名称 */
    //         //     customClassName: (name) => name.replace("Controller", "Service"),
    //         // },
    //         /** 其余属性参见 https://github.com/zhang740/openapi-generator */
    //     },
    // };

    // move to package.json
    // config.watchDirs = {
    //     processor: {
    //         directory: "app/processor", // files directory.
    //         // pattern: '**/*.(ts|js)', // glob pattern, default is **/*.(ts|js). it doesn't need to configure normally.
    //         // ignore: '', // ignore glob pattern, default to empty.
    //         generator: "function", // generator name, eg: class、auto、function、object
    //         interface: "IModel", // interface name
    //         declareTo: "Application.processor", // declare to this interface
    //         watch: true, // whether need to watch files
    //         // caseStyle: 'upper', // caseStyle for loader
    //         // interfaceHandle: val => `ReturnType<typeof ${val}>`, // interfaceHandle
    //         // trigger: ['add', 'unlink'], // recreate d.ts when receive these events, all events: ['add', 'unlink', 'change']
    //     },
    // };

    // the return config will combines to EggAppConfig
    return {
        ...config,
        ...bizConfig,
    };
};
