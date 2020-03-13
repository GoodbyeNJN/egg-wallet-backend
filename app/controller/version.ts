import { Controller } from "egg";
import { route } from "egg-controller";

export default class VersionController extends Controller {
    @route("/api/v1/version")
    public async index() {
        return {
            "kaba-wallet": {
                version: "0.6.4",
                versionNumber: 604,
                validVersion: "0.0.0",
                validVersionNumber: 0,
                downloadUrl:
                    "https://moac-wallet.nos-eastchina1.126.net/kaba-wallet/kaba-wallet-latest.apk",
            },
        };
    }
}
