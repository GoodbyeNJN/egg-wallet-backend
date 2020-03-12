import { Subscription } from "egg";

export default class ResetHourAmount extends Subscription {
    public static get schedule() {
        return {
            cron: "0 */1 * * *",
            type: "worker",
        };
    }

    public async subscribe() {
        const { ctx } = this;
        const [number] = await ctx.model.ExchangePair.update({ hourAmount: 0 }, { where: {} });

        if (number !== 0) {
            console.log(
                new Date().toLocaleString("zh-CN", { hour12: false }),
                "\treset exchange hour amount: success",
            );
        } else {
            console.log(
                new Date().toLocaleString("zh-CN", { hour12: false }),
                "\treset exchange hour amount: fail",
            );
        }
    }
}
