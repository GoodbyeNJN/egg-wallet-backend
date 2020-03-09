import { Controller } from "egg";
import { route } from "egg-controller";
import { promisify, promisifyAll } from "bluebird";
import { Exchange } from "../model/Exchange";
import { Coin } from "../model/Coin";
import { Wallet } from "../model/Wallet";
import { ExchangePair } from "../model/ExchangePair";

export default class HomeController extends Controller {
    @route("/api/v1")
    public async index() {
        const { ctx, app } = this;

        return "api version v1";
    }
}
