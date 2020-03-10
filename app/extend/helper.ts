import { IHelper } from "egg";
import Web3 from "web3";

const web3 = new Web3();

export default {
    utf8ToHex(this: IHelper, str: string) {
        return web3.utils.utf8ToHex(str);
    },

    hexToUtf8(this: IHelper, hex: string) {
        return web3.utils.hexToUtf8(hex.startsWith("0x") ? hex : `0x${hex}`);
    },

    validateExchange(
        this: IHelper,
        rawExchange: {
            exchangePairId: number;
            payStatus: "success" | "fail" | "pending";
            payAddress: string;
            payValue: bigint;
            receiveAddress: string;
            toAddress: string;
            contractAddress: string | undefined;
        },
    ) {
        // 判断交易是否成功
        if (rawExchange.payStatus !== "success") {
            throw Error("Error: Transaction status is not success.");
        }

        // 判断是否存在交易对id与收款地址
        if (!rawExchange.exchangePairId || !rawExchange.receiveAddress) {
            throw Error(
                "Error: Can not find `exchangePairId` or `receiveAddress` from transaction input data.",
            );
        }

        // 判断交易对id是否为数字
        if (rawExchange.exchangePairId !== Number(rawExchange.exchangePairId)) {
            throw Error("Error: `exchangePairId` is not a number.");
        }

        // 判断地址是否合法
        if (
            rawExchange.receiveAddress.length !== 42 ||
            !rawExchange.receiveAddress.startsWith("0x")
        ) {
            throw Error("Error: `receiveAddress` is not a valid address.");
        }

        return true;
    },
};
