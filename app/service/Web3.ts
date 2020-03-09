import { Service } from "egg";
import { Transaction, TransactionReceipt } from "web3-eth";
import { Transaction as Tx } from "ethereumjs-tx";

/**
 * Web3 Service
 */
export default class Web3 extends Service {
    /**
     * 从链上获取闪兑交易的信息
     */
    public async getExchange(hash: string) {
        const { ctx, app } = this;
        const { keyString } = app.config.exchange;
        const { web3 } = app;

        let tx: Transaction;
        let receipt: TransactionReceipt;
        // 获取交易信息和交易收据
        try {
            [tx, receipt] = await Promise.all([
                web3.eth.getTransaction(hash),
                web3.eth.getTransactionReceipt(hash),
            ]);
        } catch (error) {
            throw Error("Can not get transaction or receipt.");
        }

        // 判断交易是否上链
        if (!tx.blockHash || !tx.blockNumber || !tx.transactionIndex || !receipt) {
            throw Error("This transaction is pending.");
        }
        const { from, to, value, input } = tx;

        if (!to) {
            throw Error("Can not resolve contract creation transaction");
        }

        // 根据标识字符串判断是否为闪兑交易
        if (!input.includes(keyString)) {
            throw Error("Can not find key string in transaction input data.");
        }

        // 截取出标识字符串后面的部分，尝试解码
        const [data, infoHex] = input.split(keyString);
        const infoStr = ctx.helper.hexToUtf8(infoHex);
        let info: { exchangePairId: number; receiveAddress: string };
        try {
            info = JSON.parse(infoStr);
        } catch (error) {
            throw Error("Cat not parse exchange info object.");
        }

        // 判断是原生币转账还是erc20转账，并取出一些数据
        let type = "base";
        let payValue = BigInt(value);
        let toAddress = to;
        if (data !== "0x") {
            type = "erc20";
            const [, , to, value] = data.split(/0x(.{8})(.{64})/);
            toAddress = to;
            payValue = BigInt(`0x${value}`);
        }

        // 判断erc20交易是否成功
        const payStatus =
            receipt.status === true ? "success" : receipt.status === false ? "fail" : "unknown";

        const exchange: {
            exchangePairId: number;
            payStatus: "success" | "fail" | "unknown";
            payAddress: string;
            payValue: bigint;
            receiveAddress: string;
            toAddress: string;
            contractAddress: string | undefined;
        } = {
            exchangePairId: info.exchangePairId,
            payStatus,
            payAddress: from,
            payValue,
            receiveAddress: info.receiveAddress,
            toAddress,
            contractAddress: type === "erc20" ? to : undefined,
        };

        return exchange;
    }

    /**
     * 获取交易状态
     */
    public async getExchangeStatus(hash: string) {
        const { app } = this;
        const { web3 } = app;

        let receiveStatus = "unknown";

        let tx: Transaction;
        let receipt: TransactionReceipt;
        // 获取交易信息和交易收据
        try {
            [tx, receipt] = await Promise.all([
                web3.eth.getTransaction(hash),
                web3.eth.getTransactionReceipt(hash),
            ]);
        } catch (error) {
            // throw Error("Can not get transaction or receipt.");
            return receiveStatus;
        }

        // 判断交易是否上链
        if (!tx.blockHash || !tx.blockNumber || !tx.transactionIndex || !receipt) {
            // throw Error("This transaction is pending.");
            return receiveStatus;
        }

        // 判断erc20交易是否成功
        receiveStatus =
            receipt.status === true ? "success" : receipt.status === false ? "fail" : "unknown";

        return receiveStatus;
    }

    /**
     * 发送eth
     */
    public async sendEth(info: {
        privateKey: string;
        from: string;
        to: string;
        value: number;
        exchangePairId: number;
        payHash: string;
    }) {
        const { ctx, app } = this;
        const { keyString } = app.config.exchange;
        const { chain } = app.config.web3;
        const { web3 } = app;

        const { privateKey, from, to, value, exchangePairId, payHash } = info;

        let nonce: number;
        let gasPrice: string;
        try {
            [nonce, gasPrice] = await Promise.all([
                web3.eth.getTransactionCount(from),
                web3.eth.getGasPrice(),
            ]);
        } catch (error) {
            throw Error("Can not get nonce or gasPrice.");
        }

        const infoHex = ctx.helper.utf8ToHex(JSON.stringify({ exchangePairId, payHash }));
        const rawTx = {
            to,
            value: web3.utils.toHex(value),
            nonce: web3.utils.toHex(nonce),
            gasPrice: web3.utils.toHex(gasPrice),
            gasLimit: web3.utils.toHex("100000"),
            data: `0x${keyString}${infoHex.startsWith("0x") ? infoHex.substring(2) : infoHex}`,
        };
        const tx = new Tx(rawTx, { chain: chain ?? "mainnet" });
        tx.sign(Buffer.from(privateKey, "hex"));
        const serializedTx = tx.serialize();

        return new Promise((resolve, reject) => {
            web3.eth
                .sendSignedTransaction(`0x${serializedTx.toString("hex")}`)
                .once("transactionHash", (txHash) => {
                    resolve(txHash);
                });
        });
    }

    /**
     * 发送Erc20
     */
    public async sendErc20(info: {
        privateKey: string;
        contractAddress: string;
        from: string;
        to: string;
        value: number;
        exchangePairId: number;
        payHash: string;
    }) {
        const { ctx, app } = this;
        const { keyString, abi } = app.config.exchange;
        const { chain3 } = app;

        const { privateKey, contractAddress, from, to, value, exchangePairId, payHash } = info;

        const getErc20Data = (
            contractAddress: string,
            to: string,
            value: number,
            exchangePairId: number,
            payHash: string,
        ) => {
            const contract = chain3.mc.contract(abi).at(contractAddress);

            let data: string;
            try {
                data = contract.transfer.getData(to, value);
            } catch (error) {
                throw Error("Can not get erc20 data.");
            }

            const infoHex = ctx.helper.utf8ToHex(JSON.stringify({ exchangePairId, payHash }));
            data += `${keyString}${infoHex.startsWith("0x") ? infoHex.substring(2) : infoHex}`;

            return data;
        };

        // const getNonce = promisify<number, string>(chain3.mc.getTransactionCount, {
        //     context: chain3,
        // });
        // const getChainId = promisify<number>(chain3.version.getNetwork, {
        //     context: chain3,
        // });
        // const getGasPrice = promisify<number>(chain3.mc.getGasPrice, {
        //     context: chain3,
        // });
        // const sendRawTx = promisify<string, string>(chain3.mc.sendRawTransaction, {
        //     context: chain3,
        // });

        // let nonce: number;
        // let chainId: number;
        // let gasPrice: number;
        // try {
        //     [nonce, chainId, gasPrice] = await Promise.all([
        //         getNonce(from),
        //         getChainId(),
        //         getGasPrice(),
        //     ]);
        // } catch (error) {
        //     throw Error("Can not get nonce, chainId or gasPrice.");
        // }

        // const data = getErc20Data(contractAddress, to, value, exchangePairId, payHash);

        // const tx = {
        //     from,
        //     to: contractAddress,
        //     value: chain3.intToHex("0"),
        //     nonce: chain3.intToHex(nonce.toString()),
        //     gasPrice: chain3.intToHex(gasPrice.toString()),
        //     gasLimit: chain3.intToHex("100000"),
        //     chainId,
        //     data,
        // };

        // const signedTx = chain3.signTransaction(tx, privateKey);
        // return sendRawTx(signedTx);
    }

    // public async sendMoacTest() {
    //     const { ctx, app } = this;
    //     const { keyString } = app.config.exchange;
    //     const { chain3 } = app;

    //     const contractAddress = "0x383811667ce9646e8bce8aff8ca049751dbec64b";
    //     const privateKey = "c2b3209968661cb27550dc191e8fb48c810f66117b727f90acb963978b91d369";
    //     const from = "0xb62e5ae15f057bf13ab1fcaae23232310d87acd0";
    //     const to = "0x1188e75693a6ba76bf9f6d0239e6f0ec5590cc32";
    //     const value = 0.01 * 10 ** 18;
    //     const exchangePairId = 1;
    //     const receiveAddress = "0x1188e75693a6ba76bf9f6d0239e6f0ec5590cc32";

    //     const getNonce = promisify<number, string>(chain3.mc.getTransactionCount, {
    //         context: chain3,
    //     });
    //     const getChainId = promisify<number>(chain3.version.getNetwork, {
    //         context: chain3,
    //     });
    //     const getGasPrice = promisify<number>(chain3.mc.getGasPrice, {
    //         context: chain3,
    //     });
    //     const sendRawTx = promisify<string, string>(chain3.mc.sendRawTransaction, {
    //         context: chain3,
    //     });

    //     let nonce: number;
    //     let chainId: number;
    //     let gasPrice: number;
    //     try {
    //         [nonce, chainId, gasPrice] = await Promise.all([
    //             getNonce(from),
    //             getChainId(),
    //             getGasPrice(),
    //         ]);
    //     } catch (error) {
    //         throw Error("Can not get nonce, chainId or gasPrice.");
    //     }

    //     const infoHex = ctx.helper.utf8ToHex(JSON.stringify({ exchangePairId, receiveAddress }));
    //     const tx = {
    //         from,
    //         to,
    //         value: chain3.intToHex(value.toString()),
    //         nonce: chain3.intToHex(nonce.toString()),
    //         gasPrice: chain3.intToHex(gasPrice.toString()),
    //         gasLimit: chain3.intToHex("100000"),
    //         chainId,
    //         data: `0x${keyString}${infoHex.startsWith("0x") ? infoHex.substring(2) : infoHex}`,
    //     };

    //     const signedTx = chain3.signTransaction(tx, privateKey);
    //     return sendRawTx(signedTx);
    // }

    // public async sendErc20Test() {
    //     const { ctx, app } = this;
    //     const { keyString, abi } = app.config.exchange;
    //     const { chain3 } = app;

    //     const contractAddress = "0x383811667ce9646e8bce8aff8ca049751dbec64b";
    //     const privateKey = "d0e0c42c424bc43f2b799ae9150d237eae8d1997ac643db9c33150a30f6c555d";
    //     const from = "0x1188e75693a6ba76bf9f6d0239e6f0ec5590cc32";
    //     const to = "0xb62e5ae15f057bf13ab1fcaae23232310d87acd0";
    //     const value = 1 * 10 ** 18;
    //     const exchangePairId = 2;
    //     const receiveAddress = "0xb62e5ae15f057bf13ab1fcaae23232310d87acd0";

    //     const getErc20Data = (
    //         contractAddress: string,
    //         to: string,
    //         value: number,
    //         exchangePairId: number,
    //         receiveAddress: string,
    //     ) => {
    //         const contract = chain3.mc.contract(abi).at(contractAddress);

    //         let data: string;
    //         try {
    //             data = contract.transfer.getData(to, value);
    //         } catch (error) {
    //             throw Error("Can not get erc20 data.");
    //         }

    //         const infoHex = ctx.helper.utf8ToHex(
    //             JSON.stringify({ exchangePairId, receiveAddress }),
    //         );
    //         data += `${keyString}${infoHex.startsWith("0x") ? infoHex.substring(2) : infoHex}`;

    //         return data;
    //     };

    //     const getNonce = promisify<number, string>(chain3.mc.getTransactionCount, {
    //         context: chain3,
    //     });
    //     const getChainId = promisify<number>(chain3.version.getNetwork, {
    //         context: chain3,
    //     });
    //     const getGasPrice = promisify<number>(chain3.mc.getGasPrice, {
    //         context: chain3,
    //     });
    //     const sendRawTx = promisify<string, string>(chain3.mc.sendRawTransaction, {
    //         context: chain3,
    //     });

    //     let nonce: number;
    //     let chainId: number;
    //     let gasPrice: number;
    //     try {
    //         [nonce, chainId, gasPrice] = await Promise.all([
    //             getNonce(from),
    //             getChainId(),
    //             getGasPrice(),
    //         ]);
    //     } catch (error) {
    //         throw Error("Can not get nonce, chainId or gasPrice.");
    //     }

    //     const data = getErc20Data(contractAddress, to, value, exchangePairId, receiveAddress);

    //     const tx = {
    //         from,
    //         to: contractAddress,
    //         value: chain3.intToHex("0"),
    //         nonce: chain3.intToHex(nonce.toString()),
    //         gasPrice: chain3.intToHex(gasPrice.toString()),
    //         gasLimit: chain3.intToHex("100000"),
    //         chainId,
    //         data,
    //     };

    //     const signedTx = chain3.signTransaction(tx, privateKey);
    //     return sendRawTx(signedTx);
    // }
}
