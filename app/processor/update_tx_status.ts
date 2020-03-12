import { Application, EthBlock, MoacBlock, Task } from "egg";

export default async (app: Application, base: string, block: MoacBlock | EthBlock, task: Task) => {
    const ctx = app.createAnonymousContext();
    const { hash, exchangePairId } = task;

    if (base === "moac") {
        const status = await ctx.service.chain3.getExchangeStatus(hash);
        await app.model.Exchange.update(
            { receiveStatus: status },
            { where: { exchangePairId, receiveHash: hash } },
        );
    } else if (base === "eth") {
        const status = await ctx.service.web3.getExchangeStatus(hash);
        await app.model.Exchange.update(
            { receiveStatus: status },
            { where: { exchangePairId, receiveHash: hash } },
        );
    }
};