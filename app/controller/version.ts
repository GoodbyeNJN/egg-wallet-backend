import { Controller } from "egg";
import { controller } from "egg-controller";

// 定义新增接口的请求参数规则
const createRule = {
    walletName: "string",
    version: "string",
    versionNumber: "number",
    validVersion: "string",
    validVersionNumber: "number",
    downloadUrl: "string",
};

@controller({ name: "Version", prefix: "/api/v1/version", restful: true })
export default class VersionController extends Controller {
    /**
     * 查询版本号
     */
    public async index() {
        const { app } = this;
        const versions = await app.model.Version.findAll({
            attributes: { exclude: ["id", "deleted"] },
        });

        const versionInfo = {};

        for (const version of versions) {
            versionInfo[version.walletName] = { ...version.toJSON() };
        }

        return versionInfo;
    }

    /**
     * 修改版本号
     */
    public async create(
        walletName: string,
        version: string,
        versionNumber: number,
        validVersion: string,
        validVersionNumber: number,
        downloadUrl: string,
    ) {
        const { ctx, app } = this;

        ctx.validate(createRule);

        const result = await app.model.Version.upsert({
            walletName,
            version,
            versionNumber,
            validVersion,
            validVersionNumber,
            downloadUrl,
        });

        const versions = await app.model.Version.findOne({
            where: { walletName },
            attributes: { exclude: ["id", "deleted"] },
        });

        return versions;
    }
}
