import { Controller } from "egg";
import { route } from "egg-controller";

// 定义查询接口的请求参数规则
const indexRule = {
    symbol: "string?",
};

export default class PriceController extends Controller {
    @route("/api/v1/price")
    public index(symbol?: string) {
        const { ctx, app } = this;

        ctx.validate(indexRule, ctx.request.query);

        if (!symbol) {
            return app.price;
        } else if (symbol === "moac" || symbol === "MOAC") {
            app.logger.warn(app.price);
            return app.price.moac;
        } else if (symbol === "eth" || symbol === "ETH") {
            return app.price.eth;
        }
    }
}
