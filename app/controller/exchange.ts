import { Controller } from "egg";
import { controller } from "egg-controller";

import { FindOptions } from "sequelize";
import { Exchange } from "../model/Exchange";
import { Coin } from "../model/Coin";
import { Wallet } from "../model/Wallet";
import { ExchangePair } from "../model/ExchangePair";

// 定义查询接口的请求参数规则
const indexRule = {
    id: "string?",
    exchangePairId: "string?",
    time: "dateTime?",
    payStatus: { type: "enum", values: ["success", "fail", "unknown"], required: false },
    payHash: "string?",
    payAddress: "string?",
    payTime: "dateTime?",
    receiveStatus: { type: "enum", values: ["success", "fail", "unknown"], required: false },
    receiveHash: "string?",
    receiveAddress: "string?",
    receiveTime: "dateTime?",
    page: { type: "int", min: 1, required: false },
    per_page: { type: "int", min: 1, max: 50, required: false },
};

// 定义新增接口的请求参数规则
const createRule = {
    // base: ["moac", "eth"],
    exchangePairId: "number",
    payHash: "string",
    payTime: "dateTime",
};

@controller({ name: "Exchange", prefix: "/api/v1/exchange", restful: true })
export default class ExchangeController extends Controller {
    public async index(
        id?: string,
        exchangePairId?: string,
        time?: Date,
        payStatus?: "success" | "fail" | "unknown",
        payHash?: string,
        payAddress?: string,
        payTime?: Date,
        receiveStatus?: "success" | "fail" | "unknown",
        receiveHash?: string,
        receiveAddress?: string,
        receiveTime?: Date,
        page = 1,
        per_page = 10,
    ) {
        const { ctx, app } = this;

        ctx.validate(indexRule, ctx.request.query);

        const where = { deleted: false };

        if (id) {
            where["id"] = id;
        }
        if (exchangePairId) {
            where["exchangePairId"] = exchangePairId;
        }
        if (time) {
            where["time"] = time;
        }
        if (payStatus) {
            where["payStatus"] = payStatus;
        }
        if (payHash) {
            where["payHash"] = payHash;
        }
        if (payAddress) {
            where["payAddress"] = payAddress;
        }
        if (payTime) {
            where["payTime"] = payTime;
        }
        if (receiveStatus) {
            where["receiveStatus"] = receiveStatus;
        }
        if (receiveHash) {
            where["receiveHash"] = receiveHash;
        }
        if (receiveAddress) {
            where["receiveAddress"] = receiveAddress;
        }
        if (receiveTime) {
            where["receiveTime"] = receiveTime;
        }

        const query: FindOptions = {
            where,
            include: [
                {
                    model: ExchangePair,
                    as: "exchangePair",
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
                },
            ],
            attributes: {
                exclude: ["deleted"],
            },
            offset: (page - 1) * per_page,
            limit: per_page,
        };

        const body: { data: Exchange[]; sum: number } = { data: [], sum: 0 };
        const result = await app.model.Exchange.findAndCountAll(query);
        body.data = result.rows;
        body.sum = result.count;

        return body;
    }

    public async create(exchangePairId: number, payHash: string, payTime: Date) {
        const { ctx, app } = this;

        ctx.validate(createRule);

        // 根据传入的交易对id查询交易对
        const exchangePair = await app.model.ExchangePair.findOne({
            where: {
                id: exchangePairId,
                deleted: false,
            },
            include: [
                {
                    model: Coin,
                    as: "sourceCoin",
                    include: [
                        {
                            model: Wallet,
                            as: "wallet",
                        },
                    ],
                },
                {
                    model: Coin,
                    as: "targetCoin",
                    include: [
                        {
                            model: Wallet,
                            as: "wallet",
                        },
                    ],
                },
            ],
        });
        if (!exchangePair) {
            return {
                error: "Can not find exchange pair.",
                detail: {
                    message:
                        "Error: Can not find exchange pair by `exchangePairId` got from request.",
                },
            };
        }

        console.log("exchangePairId:", typeof exchangePairId);
        // 根据传入的交易对id和payHash查询交易记录
        const dbExchange = await app.model.Exchange.findOne({
            where: { exchangePairId, payHash, deleted: false },
            include: [
                {
                    model: ExchangePair,
                    as: "exchangePair",
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
                },
            ],
            attributes: {
                exclude: ["deleted"],
            },
        });

        // 从链上获取交易信息
        let rawExchange: {
            exchangePairId: number;
            payStatus: "success" | "fail" | "unknown";
            payAddress: string;
            payValue: bigint;
            receiveAddress: string;
            toAddress: string;
            contractAddress: string | undefined;
        };
        try {
            rawExchange = await ctx.service.chain3.getExchange(payHash);
        } catch (error) {
            return {
                error: "Get exchange error.",
                detail: {
                    message: error.toString(),
                },
            };
        }

        // 交易已存在的情况下更新第二笔交易状态
        if (dbExchange) {
            if (dbExchange.receiveStatus === "unknown") {
                const receiveStatus = await ctx.service.chain3.getExchangeStatus(
                    dbExchange.receiveHash,
                );

                await dbExchange.update({ receiveStatus });
            }
            return dbExchange;
        }

        // 校验传入的交易对id与链上获取的交易对id是否一致
        if (exchangePairId !== rawExchange.exchangePairId) {
            return {
                error: "Exchange pair does not match.",
                detail: {
                    message:
                        "Error: `exchangePairId` parsed from transaction input data does not match `exchangePairId` got from request.",
                },
            };
        }

        // 校验转账的toAddress与项目方给定的钱包地址是否一致
        let validate = true;
        // 判断是否是erc20转账
        if (rawExchange.contractAddress) {
            // 判断erc20转账的contractAddress是否是对应币种的合约地址，且toAddress是否是项目方给定的钱包地址
            if (
                rawExchange.contractAddress !== exchangePair.sourceCoin.address ||
                rawExchange.toAddress !== exchangePair.sourceCoin.wallet.address
            ) {
                validate = false;
            }
        } else {
            // 判断底层转账的toAddress是否是项目方给定的钱包地址
            if (rawExchange.toAddress !== exchangePair.sourceCoin.wallet.address) {
                validate = false;
            }
        }
        if (!validate) {
            return {
                error: "Exchange info invalid.",
                detail: {
                    message: "Error: Exchange address does not match recorded address.",
                },
            };
        }

        // 判断交易是否成功
        if (rawExchange.payStatus !== "success") {
            return {
                error: "Transaction is not success.",
                detail: {
                    message: "Error: Transaction is not success.",
                },
            };
        }

        // 判断是否到达兑换上限
        const payAmount = Number(rawExchange.payValue) / 10 ** exchangePair.sourceCoin.decimals;
        if (payAmount > exchangePair.hourLimit) {
            return {
                error: "Exchange reach limit.",
                detail: {
                    message: "Error: Exchange reach hourly limit.",
                },
            };
        }
        if (payAmount > exchangePair.dayLimit) {
            return {
                error: "Exchange reach limit.",
                detail: {
                    message: "Error: Exchange reach daily limit.",
                },
            };
        }

        // 计算转出数量
        const receiveAmount = Number(
            (payAmount * exchangePair.rate).toFixed(exchangePair.targetCoin.decimals),
        );
        const receiveValue = receiveAmount * 10 ** exchangePair.targetCoin.decimals;

        // 开始转账
        let receiveHash = "";
        const { wallet } = exchangePair.targetCoin;
        try {
            // 判断是否是erc20转账
            if (exchangePair.targetCoin.address) {
                if (exchangePair.targetCoin.base === "moac") {
                    receiveHash = await ctx.service.chain3.sendErc20({
                        privateKey: wallet.private,
                        contractAddress: exchangePair.targetCoin.address,
                        from: wallet.address,
                        to: rawExchange.receiveAddress,
                        value: receiveValue,
                        exchangePairId: rawExchange.exchangePairId,
                        payHash,
                    });
                } else if (exchangePair.targetCoin.base === "eth") {
                    console.log("eth");
                }
            } else {
                if (exchangePair.targetCoin.base === "moac") {
                    receiveHash = await ctx.service.chain3.sendMoac({
                        privateKey: wallet.private,
                        from: wallet.address,
                        to: rawExchange.receiveAddress,
                        value: receiveValue,
                        exchangePairId: rawExchange.exchangePairId,
                        payHash,
                    });
                } else if (exchangePair.targetCoin.base === "eth") {
                    console.log("eth");
                }
            }
        } catch (error) {
            return {
                error: "Send transaction error.",
                detail: {
                    message: error.toString(),
                },
            };
        }

        // 增加交易额
        await exchangePair.update({
            hourAmount: exchangePair.hourAmount + payAmount,
            dayAmount: exchangePair.dayAmount + payAmount,
        });

        // 写入数据库
        const data = {
            exchangePairId: rawExchange.exchangePairId,
            rate: exchangePair.rate,
            time: new Date(),

            payStatus: rawExchange.payStatus,
            payHash,
            payAddress: rawExchange.payAddress,
            payAmount,
            payTime: new Date(payTime),

            receiveStatus: "unknown",
            receiveHash,
            receiveAddress: rawExchange.receiveAddress,
            receiveAmount,
            receiveTime: new Date(),
        };
        await app.model.Exchange.create(data);
        const newExchange = await app.model.Exchange.findOne({
            where: { exchangePairId, payHash, deleted: false },
            include: [
                {
                    model: ExchangePair,
                    as: "exchangePair",
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
                },
            ],
            attributes: {
                exclude: ["deleted"],
            },
        });

        // app.processor.tasks.add({
        //     hash: txHash,
        //     endBlockNumber: app.chain3.mc.blockNumber + 12,
        //     processor: "updateContractAddress",
        // });

        return newExchange;
    }
}
