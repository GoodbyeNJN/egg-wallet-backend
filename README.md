# 钱包配套后端（重写版）

使用 Egg.js 和 TypeScript 重写的钱包后端。

## 使用说明

### 开发

```bash
$ yarn
$ yarn dev
$ open http://localhost:7001/
```

### 部署

无需使用 pm2，框架自带进程管理工具。

```bash
$ yarn tsc
$ yarn stop
$ yarn start
```

## 插件

1. egg-controller：https://github.com/zhang740/egg-controller ，使用 ts 的装饰器语法快速开发 Restful Api。

2. egg-validate：https://github.com/eggjs/egg-validate ，校验接口接收的参数是否符合规则。

3. egg-sequelize-ts-plugin：https://www.npmjs.com/package/egg-sequelize-ts-plugin ，ts 版的 egg-sequelize 插件，用法见 https://www.npmjs.com/package/sequelize-typescript 。

## 目录结构

### database

通过 sequelize 提供的 migration 工具来管理表结构。可参考 https://eggjs.org/zh-cn/tutorials/sequelize.html ，https://sequelize.org/master/manual/migrations.html 。

其中 `config.json` 文件保存了数据库的连接信息，`migrations` 文件夹下存放表结构的定义信息。

```
# 升级数据库，文件夹中的数字顺序代表执行顺序
npx sequelize db:migrate
# 如果有问题需要回滚，可以通过 `db:migrate:undo` 回退一个变更
npx sequelize db:migrate:undo
# 可以通过 `db:migrate:undo:all` 回退到初始状态，数字顺序和执行顺序为倒序关系
npx sequelize db:migrate:undo:all
```

### processor

自定义的文件夹，用于监听到新块时的处理。

### model

表结构的模型定义，与数据库表一一对应。
