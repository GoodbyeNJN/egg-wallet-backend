import { Controller } from "egg";
import { controller } from "egg-controller";

import { FindOptions, Op } from "sequelize";
import { MoacErc20 } from "../model/MoacErc20";
import { EthErc20 } from "../model/EthErc20";

// 定义查询接口的请求参数规则
const indexRule = {
    base: ["moac", "eth"],
    keyword: "string?",
    txHash: "string?",
    page: { type: "int", min: 1, required: false },
    per_page: { type: "int", min: 1, max: 50, required: false },
};

// 定义新增接口的请求参数规则
const createRule = {
    base: ["moac", "eth"],
    symbol: "string",
    name: "string",
    address: "string?",
    txHash: "string?",
    decimals: "number",
    supply: "string",
    owner: "string?",
};

@controller({ name: "Erc20", prefix: "/api/v1/erc20", restful: true })
export default class Erc20Controller extends Controller {
    public async index(
        base: "moac" | "eth",
        keyword?: string,
        txHash?: string,
        page = 1,
        per_page = 10,
    ) {
        const { ctx, app } = this;

        ctx.validate(indexRule, ctx.request.query);

        const where = { deleted: false };
        if (keyword) {
            if (keyword.toString().startsWith("0x")) {
                where[Op.or] = [
                    // { symbol: { [Op.like]: `%${keyword}%` } },
                    // { name: { [Op.like]: `%${keyword}%` } },
                    { address: { [Op.like]: `${keyword}%` } },
                ];
            } else {
                where[Op.or] = [
                    { symbol: { [Op.like]: `%${keyword}%` } },
                    // { name: { [Op.like]: `%${keyword}%` } },
                    // { address: { [Op.like]: `%${keyword}%` } },
                ];
            }
            where["address"] = { [Op.ne]: "0x" };
        } else if (txHash) {
            where["txHash"] = txHash;
        }

        const query: FindOptions = {
            attributes: {
                exclude: ["txHash", "deleted"],
            },
            where,
            offset: (page - 1) * per_page,
            limit: per_page,
        };

        const body: { data: (MoacErc20 | EthErc20)[]; sum: number } = { data: [], sum: 0 };
        if (base === "moac") {
            const result = await app.model.MoacErc20.findAndCountAll(query);
            body.data = result.rows;
            body.sum = result.count;
        } else if (base === "eth") {
            const result = await app.model.EthErc20.findAndCountAll(query);
            body.data = result.rows;
            body.sum = result.count;
        }

        return body;
    }

    public async create(
        base: "moac" | "eth",
        symbol: string,
        name: string,
        decimals: number,
        supply: string,
        owner?: string,
        address?: string,
        txHash?: string,
    ) {
        const { ctx, app } = this;

        ctx.validate(createRule);

        if (!address && !txHash) {
            ctx.throw(422, "Validation Failed", {
                code: "invalid_body",
                errors: `one of "address" and "txHash" is required.`,
            });
        }

        const { files } = ctx.request;
        if (!files || files.length !== 1) {
            ctx.throw(422, "Validation Failed", {
                code: "invalid_body",
                errors: "no files uploaded or uploaded multi files.",
            });
        }

        let url = "";
        for (const file of files) {
            await app.nos.putObject({
                objectKey: `coin-logo-${symbol}-${Date.now()}.${file.mime.split("/")[1] ??
                    file.mime}`,
                file: file.filepath,
            });
            url = await app.nos.getObjectUrl({
                objectKey: `coin-logo-${symbol}-${Date.now()}.${file.mime.split("/")[1] ??
                    file.mime}`,
                expires: 1000,
            });
        }
        if (url) {
            url = url.split("?")[0];
        }

        const data = { base, symbol, name, address, txHash, decimals, supply, owner, icon: url };
        if (base === "moac") {
            app.model.MoacErc20.create(data);

            if (txHash && !address) {
                app.processor.tasks.add(base, {
                    hash: txHash,
                    endBlockNumber: app.chain3.mc.blockNumber + 12,
                    processor: "updateContractAddress",
                });
            }
        } else if (base === "eth") {
            app.model.MoacErc20.create(data);
        }

        return { success: true };
    }
}
