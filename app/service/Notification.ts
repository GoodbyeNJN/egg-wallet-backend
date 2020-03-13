import { Service } from "egg";
import axios from "axios";

export default class Notification extends Service {
    /**
     * @description 使用Server酱向绑定的微信账号发送提醒，说明：http://sc.ftqq.com/
     * @param {string} text 消息标题，最长为256，必填
     * @param {string} [desp] 消息内容，最长64Kb，可空，支持MarkDown
     * @memberof Notification
     */
    public send(text: string, desp?: string) {
        const { url, sckey } = this.app.config.server;

        for (const key of sckey) {
            axios.get(`${url}/${key}.send`, {
                params: desp ? { text, desp } : { text },
            });
        }
    }
}
