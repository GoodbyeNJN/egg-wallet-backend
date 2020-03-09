import { Controller } from "egg";
import { controller } from "egg-controller";

import { FindOptions, Includeable } from "sequelize";
import { Wallet } from "../model/Wallet";
import { Coin } from "../model/Coin";
import { ExchangePair } from "../model/ExchangePair";

// 定义查询接口的请求参数规则
const indexRule = {
    id: "number?",
    base: "string?",
    symbol: "string?",
    name: "string?",
    contractAddress: "string?",
    sourceCoinId: "number?",
    targetCoinId: "number?",
    page: { type: "int", min: 1, required: false },
    per_page: { type: "int", min: 1, max: 50, required: false },
};

@controller({ name: "Coin", prefix: "/api/v1/coin", restful: true })
export default class CoinController extends Controller {
    public async index(
        id?: number,
        base?: string,
        symbol?: string,
        name?: string,
        contractAddress?: string,
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
        if (base) {
            where["base"] = base;
        }
        if (symbol) {
            where["symbol"] = symbol;
        }
        if (name) {
            where["name"] = name;
        }
        if (contractAddress) {
            where["address"] = contractAddress;
        }

        if (sourceCoinId) {
            const count: FindOptions = {
                include: [
                    {
                        model: Coin,
                        as: "targetCoin",
                        attributes: {
                            exclude: ["walletId", "deleted"],
                        },
                    },
                ],
                attributes: ["targetCoinId"],
                where: { sourceCoinId },
            };
            const query: FindOptions = {
                ...count,
                offset: (page - 1) * per_page,
                limit: per_page,
            };

            const body: {
                data: {
                    id: number;
                    base: string;
                    symbol: string;
                    name: string;
                    address: string;
                    decimals: number;
                    supply: string;
                    owner: string;
                    icon: string;
                }[];
                sum: number;
            } = { data: [], sum: 0 };
            const exchangePair = await app.model.ExchangePair.findAll(query);
            body.data = exchangePair.map((pair) => pair.targetCoin);
            body.sum = await app.model.ExchangePair.count(count);

            return body;
        } else if (targetCoinId) {
            const count: FindOptions = {
                include: [
                    {
                        model: Coin,
                        as: "sourceCoin",
                        attributes: {
                            exclude: ["walletId", "deleted"],
                        },
                    },
                ],
                attributes: ["sourceCoinId"],
                where: { targetCoinId },
            };
            const query: FindOptions = {
                ...count,
                offset: (page - 1) * per_page,
                limit: per_page,
            };

            const body: {
                data: {
                    id: number;
                    base: string;
                    symbol: string;
                    name: string;
                    address: string;
                    decimals: number;
                    supply: string;
                    owner: string;
                    icon: string;
                }[];
                sum: number;
            } = { data: [], sum: 0 };
            const exchangePair = await app.model.ExchangePair.findAll(query);
            body.data = exchangePair.map((pair) => pair.sourceCoin);
            body.sum = await app.model.ExchangePair.count(count);

            return body;
        }

        // const include: Includeable[] = [
        //     {
        //         model: Wallet,
        //         as: "wallet",
        //         attributes: {
        //             exclude: ["private", "deleted"],
        //         },
        //     },
        // ];
        // if (sourceCoinId) {
        //     include.push({
        //         model: ExchangePair,
        //         as: "targetCoins",
        //         include: [
        //             {
        //                 model: Coin,
        //                 as: "targetCoin",
        //                 include: [
        //                     {
        //                         model: Wallet,
        //                         as: "wallet",
        //                         attributes: {
        //                             exclude: ["private", "deleted"],
        //                         },
        //                     },
        //                 ],
        //                 attributes: {
        //                     exclude: ["deleted"],
        //                 },
        //             },
        //         ],
        //         // attributes: ["targetCoinId"],
        //         where: { deleted: false },
        //     });
        // } else if (targetCoinId) {
        //     include.push({
        //         model: ExchangePair,
        //         as: "sourceCoins",
        //         include: [
        //             {
        //                 model: Coin,
        //                 as: "sourceCoin",
        //                 include: [
        //                     {
        //                         model: Wallet,
        //                         as: "wallet",
        //                         attributes: {
        //                             exclude: ["private", "deleted"],
        //                         },
        //                     },
        //                 ],
        //                 attributes: {
        //                     exclude: ["deleted"],
        //                 },
        //             },
        //         ],
        //         // attributes: ["sourceCoinId"],
        //         where: { deleted: false },
        //     });
        // }
        const query: FindOptions = {
            // include,
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
            where,
            offset: (page - 1) * per_page,
            limit: per_page,
        };

        const body: { data: Coin[]; sum: number } = { data: [], sum: 0 };
        const result = await app.model.Coin.findAndCountAll(query);
        body.data = result.rows;
        body.sum = result.count;

        return body;
    }
}
