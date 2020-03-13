import { Application, Context } from "egg";
import axios from "axios";

// 定时获取币价
export default (app: Application) => {
    const { cmc } = app.config;

    const instance = axios.create({
        baseURL: cmc.endpoint,
        method: "get",
        timeout: 10000,
        headers: {
            Accept: "application/json",
        },
    });

    const index = Math.floor(Math.random() * (cmc.keys.length - 1));
    const moacParams = {
        headers: { "X-CMC_PRO_API_KEY": cmc.keys[index] },
        params: { symbol: "MOAC", convert: "CNY" },
    };

    const ethParams = {
        headers: { "X-CMC_PRO_API_KEY": cmc.keys[index] },
        params: { symbol: "ETH", convert: "CNY" },
    };

    return {
        schedule: {
            cron: "*/6 * * * *",
            // cron: "*/6 * * * * *",
            type: "all",
            disable: app.config.env === "local",
        },

        async task(ctx: Context) {
            const [moacRes, ethRes] = await Promise.all([
                instance.request(moacParams),
                instance.request(ethParams),
            ]);
            if (moacRes.status === 200 && moacRes.data) {
                const { price, last_updated } = moacRes.data.data.MOAC.quote.CNY;
                console.log(
                    new Date().toLocaleString("zh-CN", { hour12: false }),
                    "\tmoac price:",
                    price,
                );
                app.price.moac = { symbol: "MOAC", price, lastUpdated: last_updated };
            }
            if (moacRes.status === 200 && moacRes.data) {
                const { price, last_updated } = ethRes.data.data.ETH.quote.CNY;
                console.log(
                    new Date().toLocaleString("zh-CN", { hour12: false }),
                    "\teth price:",
                    price,
                );
                app.price.eth = { symbol: "ETH", price, lastUpdated: last_updated };
            }
        },
    };
};
