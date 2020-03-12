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
        if (!tx.blockHash || !tx.blockNumber || !receipt) {
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
            toAddress = `0x${to.substring(24)}`;
            payValue = BigInt(`0x${value}`);
        }

        // 判断erc20交易是否成功
        const payStatus =
            receipt.status === true ? "success" : receipt.status === false ? "fail" : "pending";

        const exchange: {
            exchangePairId: number;
            payStatus: "success" | "fail" | "pending";
            payAddress: string;
            payValue: bigint;
            receiveAddress: string;
            toAddress: string;
            contractAddress: string | undefined;
        } = {
            exchangePairId: info.exchangePairId,
            payStatus,
            payAddress: from.toLowerCase(),
            payValue,
            receiveAddress: info.receiveAddress.toLowerCase(),
            toAddress: toAddress.toLowerCase(),
            contractAddress: type === "erc20" ? to.toLowerCase() : undefined,
        };

        return exchange;
    }

    /**
     * 获取交易状态
     */
    public async getExchangeStatus(hash: string) {
        const { app } = this;
        const { web3 } = app;

        let receiveStatus = "pending";

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
        if (!tx.blockHash || !tx.blockNumber || !receipt) {
            // throw Error("This transaction is pending.");
            return receiveStatus;
        }

        // 判断erc20交易是否成功
        receiveStatus =
            receipt.status === true ? "success" : receipt.status === false ? "fail" : "pending";

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
    }): Promise<string> {
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
                })
                .on("error", (error) => {
                    reject(error);
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
    }): Promise<string> {
        const { ctx, app } = this;
        const { keyString, abi } = app.config.exchange;
        const { chain } = app.config.web3;
        const { web3 } = app;

        const { privateKey, contractAddress, from, to, value, exchangePairId, payHash } = info;

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

        const contract = new web3.eth.Contract(abi, contractAddress);
        const infoHex = ctx.helper.utf8ToHex(JSON.stringify({ exchangePairId, payHash }));
        const data =
            contract.methods.transfer(to, value.toString()).encodeABI() +
            `${keyString}${infoHex.startsWith("0x") ? infoHex.substring(2) : infoHex}`;

        const rawTx = {
            to,
            value: web3.utils.toHex("0"),
            nonce: web3.utils.toHex(nonce),
            gasPrice: web3.utils.toHex(gasPrice),
            gasLimit: web3.utils.toHex("100000"),
            data,
        };
        const tx = new Tx(rawTx, { chain: chain ?? "mainnet" });
        tx.sign(Buffer.from(privateKey, "hex"));
        const serializedTx = tx.serialize();

        return new Promise((resolve, reject) => {
            web3.eth
                .sendSignedTransaction(`0x${serializedTx.toString("hex")}`)
                .once("transactionHash", (txHash) => {
                    resolve(txHash);
                })
                .on("error", (error) => {
                    reject(error);
                });
        });
    }

    public async sendEthTest(): Promise<string> {
        const { ctx, app } = this;
        const { keyString } = app.config.exchange;
        const { chain } = app.config.web3;
        const { web3 } = app;

        const privateKey = "1eb26339272db98b4fe20268a183ef70d9373059ee6fe25116806f8de7884919";
        const from = "0x4ca154cdc89721bcc842e0c163a8c6e512d3f187";
        const to = "0x18ca5a3e7d7869eca01e1e9d490b4f332340dbb3";
        const value = 0.1 * 10 ** 18;
        const exchangePairId = 11;
        const receiveAddress = "0x4ca154cdc89721bcc842e0c163a8c6e512d3f187";

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

        const infoHex = ctx.helper.utf8ToHex(JSON.stringify({ exchangePairId, receiveAddress }));
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
                })
                .on("error", (error) => {
                    reject(error);
                });
        });
    }
}
