import { Controller } from "egg";
import { controller } from "egg-controller";

import { FindOptions } from "sequelize";
import { Coin } from "../model/Coin";
import { Wallet } from "../model/Wallet";
import { ExchangePair } from "../model/ExchangePair";

// 定义查询接口的请求参数规则
const indexRule = {
    id: "number?",
    sourceCoinId: "number?",
    targetCoinId: "number?",
    page: { type: "int", min: 1, required: false },
    per_page: { type: "int", min: 1, max: 50, required: false },
};

@controller({ name: "ExchangePair", prefix: "/api/v1/pair", restful: true })
export default class ExchangePairController extends Controller {
    public async index(
        id?: number,
        sourceCoinId?: number,
        targetCoinId?: number,
        page = 1,
        per_page = 10,
    ) {
        const { ctx, app } = this;

        ctx.validate(indexRule, ctx.request.query);

        const where = { deleted: false };

        if (id) {
            where["id"] = id;
        }
        if (sourceCoinId) {
            where["sourceCoinId"] = sourceCoinId;
        }
        if (targetCoinId) {
            where["targetCoinId"] = targetCoinId;
        }

        const query: FindOptions = {
            include: [
                {
                    model: Coin,
                    as: "sourceCoin",
                    include: [
                        {
                            model: Wallet,
                            as: "wallet",
                            attributes: {
                                exclude: ["private", "deleted"],
                            },
                        },
                    ],
                    attributes: {
                        exclude: ["deleted"],
                    },
                },
                {
                    model: Coin,
                    as: "targetCoin",
                    include: [
                        {
                            model: Wallet,
                            as: "wallet",
                            attributes: {
                                exclude: ["private", "deleted"],
                            },
                        },
                    ],
                    attributes: {
                        exclude: ["deleted"],
                    },
                },
            ],
            attributes: {
                exclude: ["deleted"],
            },
            where,
            offset: (page - 1) * per_page,
            limit: per_page,
        };

        const body: { data: ExchangePair[]; sum: number } = { data: [], sum: 0 };
        const result = await app.model.ExchangePair.findAndCountAll(query);
        body.data = result.rows;
        body.sum = result.count;

        return body;
    }
}
