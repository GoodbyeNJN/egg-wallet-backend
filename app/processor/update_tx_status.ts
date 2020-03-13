import { Application, EthBlock, MoacBlock, Task } from "egg";

// 更新交易状态的处理过程
export default async (app: Application, base: string, block: MoacBlock | EthBlock, task: Task) => {
    console.log(
        new Date().toLocaleString("zh-CN", { hour12: false }),
        "\tprocessor start:",
        `\tprocessor=${task.processor}`,
    );

    const ctx = app.createAnonymousContext();
    const { hash, exchangePairId } = task;

    if (base === "moac") {
        const status = await ctx.service.chain3.getExchangeStatus(hash);
        if (status === "pending") {
            return false;
        }
        const [number] = await app.model.Exchange.update(
            { receiveStatus: status },
            { where: { exchangePairId, receiveHash: hash } },
        );
        if (number !== 0) {
            console.log("Update moac tx status success:", hash);
            return true;
        } else {
            console.log("Update moac tx status fail:", hash);
            return false;
        }
    } else if (base === "eth") {
        const status = await ctx.service.web3.getExchangeStatus(hash);
        if (status === "pending") {
            return false;
        }
        const [number] = await app.model.Exchange.update(
            { receiveStatus: status },
            { where: { exchangePairId, receiveHash: hash } },
        );
        if (number !== 0) {
            console.log("Update eth tx status success:", hash);
            return true;
        } else {
            console.log("Update eth tx status fail:", hash);
            return false;
        }
    }

    return true;
};
