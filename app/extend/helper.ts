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
};
