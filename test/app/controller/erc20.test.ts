import { app } from "egg-mock/bootstrap";
import assert from "power-assert";
import fs from "fs";

describe("app/controller/erc20.ts index方法", () => {
    before(() => {
        app.model.MoacErc20.upsert({
            base: "moac",
            symbol: "CKT-UT",
            name: "Kaba Token-UT",
            address: "0x1188e75693a6ba76bf9f6d0239e6f0ec5590ccut",
            txHash: "0xc2c7fb717258663eb3ac392de63e60d65ee4628ebe789a0c8d71e2837922ddut",
            decimals: 18,
            supply: "1000",
            owner: "0x1188e75693a6ba76bf9f6d0239e6f0ec5590ccut",
            icon: "http://localhost",
            deleted: false,
        });

        app.model.EthErc20.upsert({
            base: "eth",
            symbol: "CKT-UT",
            name: "Kaba Token-UT",
            address: "0x1188e75693a6ba76bf9f6d0239e6f0ec5590ccut",
            txHash: "0xc2c7fb717258663eb3ac392de63e60d65ee4628ebe789a0c8d71e2837922ddut",
            decimals: 18,
            supply: "1000",
            owner: "0x1188e75693a6ba76bf9f6d0239e6f0ec5590ccut",
            icon: "http://localhost",
            deleted: false,
        });
    });
    after(() => {
        app.model.MoacErc20.destroy({
            where: {
                base: "moac",
                symbol: "CKT-UT",
                name: "Kaba Token-UT",
                address: "0x1188e75693a6ba76bf9f6d0239e6f0ec5590ccut",
                txHash: "0xc2c7fb717258663eb3ac392de63e60d65ee4628ebe789a0c8d71e2837922ddut",
                decimals: 18,
                supply: "1000",
                owner: "0x1188e75693a6ba76bf9f6d0239e6f0ec5590ccut",
                icon: "http://localhost",
                deleted: false,
            },
        });

        app.model.EthErc20.destroy({
            where: {
                base: "eth",
                symbol: "CKT-UT",
                name: "Kaba Token-UT",
                address: "0x1188e75693a6ba76bf9f6d0239e6f0ec5590ccut",
                txHash: "0xc2c7fb717258663eb3ac392de63e60d65ee4628ebe789a0c8d71e2837922ddut",
                decimals: 18,
                supply: "1000",
                owner: "0x1188e75693a6ba76bf9f6d0239e6f0ec5590ccut",
                icon: "http://localhost",
                deleted: false,
            },
        });
    });

    describe("校验参数", () => {
        before(() => {
            app.removeAllListeners("error");
            // eslint-disable-next-line max-nested-callbacks
            app.on("error", () => {});
        });

        it("错误参数校验", async () => {
            const queries = [
                "",
                "?base=test",
                "?base=moac&page=test",
                "?base=moac&page=0",
                "?base=moac&per_page=0",
                "?base=moac&per_page=60",
                "?base=moac&page=test",
            ];

            for (const query of queries) {
                const api = `/api/v1/erc20${query}`;
                const res = await app.httpRequest().get(api);
                assert(res.status === 422, `查询字符串: ${query ?? "空"}`);
            }
        });
    });

    describe("获取moac erc20列表", () => {
        it("使用keyword", async () => {
            const keywords = ["", "0x", "CK", "Kab", "kab", "11"];

            for (const keyword of keywords) {
                const api = `/api/v1/erc20?base=moac&keyword=${keyword}`;
                const res = await app.httpRequest().get(api);
                assert(res.status === 200, `查询字符串: ${keyword ?? "空"}`);
            }
        });

        it("使用txHash", async () => {
            const txHashes = [
                "",
                "0x",
                "11",
                "0xc2c7fb717258663eb3ac392de63e60d65ee4628ebe789a0c8d71e2837922ddut",
            ];

            for (const txHash of txHashes) {
                const api = `/api/v1/erc20?base=moac&txHash=${txHash}`;
                const res = await app.httpRequest().get(api);
                assert(res.status === 200, `查询字符串: ${txHash ?? "空"}`);
            }
        });
    });

    describe("获取eth erc20列表", () => {
        it("使用keyword", async () => {
            const keywords = ["", "0x", "CK", "Kab", "kab", "11"];

            for (const keyword of keywords) {
                const api = `/api/v1/erc20?base=eth&keyword=${keyword}`;
                const res = await app.httpRequest().get(api);
                assert(res.status === 200, `查询字符串: ${keyword ?? "空"}`);
            }
        });

        it("使用txHash", async () => {
            const txHashes = [
                "",
                "0x",
                "11",
                "0xc2c7fb717258663eb3ac392de63e60d65ee4628ebe789a0c8d71e2837922ddut",
            ];

            for (const txHash of txHashes) {
                const api = `/api/v1/erc20?base=eth&txHash=${txHash}`;
                const res = await app.httpRequest().get(api);
                assert(res.status === 200, `查询字符串: ${txHash ?? "空"}`);
            }
        });
    });
});

describe("app/controller/erc20.ts create方法", () => {
    describe("校验参数", () => {
        before(() => {
            app.removeAllListeners("error");
            // eslint-disable-next-line max-nested-callbacks
            app.on("error", () => {});
        });

        //     it("错误参数校验", async () => {
        //         const bodies = [
        //             undefined,
        //             { base: "test" },
        //             { base: "moac" },
        //             { base: "eth" },
        //             { base: "moac", symbol: "CKT-T" },
        //             { base: "moac", symbol: "CKT-T", name: "Kaba Token-T" },
        //             {
        //                 base: "moac",
        //                 symbol: "CKT-T",
        //                 name: "Kaba Token-T",
        //                 address: "0x1188e75693a6ba76bf9f6d0239e6f0ec5590ccut",
        //             },
        //             {
        //                 base: "moac",
        //                 symbol: "CKT-T",
        //                 name: "Kaba Token-T",
        //                 txHash: "0xc2c7fb717258663eb3ac392de63e60d65ee4628ebe789a0c8d71e2837922ddut",
        //             },
        //             {
        //                 base: "moac",
        //                 symbol: "CKT-T",
        //                 name: "Kaba Token-T",
        //                 address: "0x1188e75693a6ba76bf9f6d0239e6f0ec5590ccut",
        //                 txHash: "0xc2c7fb717258663eb3ac392de63e60d65ee4628ebe789a0c8d71e2837922ddut",
        //             },
        //             {
        //                 base: "moac",
        //                 symbol: "CKT-T",
        //                 name: "Kaba Token-T",
        //                 address: "0x1188e75693a6ba76bf9f6d0239e6f0ec5590ccut",
        //                 decimals: "1",
        //             },
        //             {
        //                 base: "moac",
        //                 symbol: "CKT-T",
        //                 name: "Kaba Token-T",
        //                 address: "0x1188e75693a6ba76bf9f6d0239e6f0ec5590ccut",
        //                 decimals: 1,
        //             },
        //             {
        //                 base: "moac",
        //                 symbol: "CKT-T",
        //                 name: "Kaba Token-T",
        //                 address: "0x1188e75693a6ba76bf9f6d0239e6f0ec5590ccut",
        //                 decimals: 1,
        //                 supply: 100,
        //             },
        //         ];

        //         for (const body of bodies) {
        //             const api = `/api/v1/erc20`;
        //             let test = app.httpRequest().post(api);
        //             if (!body) {
        //                 test = test.attach("logo", "test/app/public/logo.png");
        //             } else {
        //                 for (const [key, value] of Object.entries(body)) {
        //                     test = test.field(key, value ?? "");
        //                 }
        //                 test.attach("logo", "test/app/public/logo.png");
        //             }
        //             const res = await test;
        //             assert(res.status === 422, `查询字符串: ${body ?? "空"}`);
        //         }
        //     });
    });
});
