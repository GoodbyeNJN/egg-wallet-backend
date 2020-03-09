import "tsconfig-paths/register";
import { EggPlugin } from "egg";

const plugin: EggPlugin = {
    // static: true,
    // nunjucks: {
    //   enable: true,
    //   package: 'egg-view-nunjucks',
    // },
    validate: {
        enable: true,
        package: "egg-validate",
    },
    "sequelize-typescript": {
        enable: true,
        package: "egg-sequelize-ts-plugin",
    },
    aop: {
        enable: true,
        package: "egg-aop",
    },
    controller: {
        enable: true,
        package: "egg-controller",
    },
};

export default plugin;
