import assert from "assert";
import { Context } from "egg";
import { app } from "egg-mock/bootstrap";

// describe("test/app/service/Chain3.test.js", () => {
//     let ctx: Context;

//     before(async () => {
//         ctx = app.mockContext();
//     });

//     it("moac转账提取信息", async () => {
//         const result = await ctx.service.chain3.getExchange(
//             "0x7ba2abdcb98e9ae19db1dc5d2cbf0f0091c5d3fa533d2b41fd7f2ec1193a4875",
//         );

//         assert(result, `函数返回null或无返回`);

//         const expectResult = {
//             exchangePairId: 1,
//             payStatus: "success",
//             payHash: "0x7ba2abdcb98e9ae19db1dc5d2cbf0f0091c5d3fa533d2b41fd7f2ec1193a4875",
//             payAddress: "0xb62e5ae15f057bf13ab1fcaae23232310d87acd0",
//             payValue: BigInt(10000000000000000),
//             receiveAddress: "0x1188e75693a6ba76bf9f6d0239e6f0ec5590cc32",
//             toAddress: "0x1188e75693a6ba76bf9f6d0239e6f0ec5590cc32",
//             contractAddress: undefined,
//         };

//         for (const [key, value] of Object.entries(result ?? {})) {
//             assert(value === expectResult[key], `"${key}"不相等，返回值为"${value}"`);
//         }
//     });

//     it("erc20转账提取信息", async () => {
//         const result = await ctx.service.chain3.getExchange(
//             "0x0f5dd0f19782ca12b8418e7ebc02bccf43a5a3a6869ef58f9f57bdff4b3e3359",
//         );

//         assert(result, `函数返回null或无返回`);

//         const expectResult = {
//             exchangePairId: 1,
//             payStatus: "success",
//             payHash: "0x0f5dd0f19782ca12b8418e7ebc02bccf43a5a3a6869ef58f9f57bdff4b3e3359",
//             payAddress: "0xb62e5ae15f057bf13ab1fcaae23232310d87acd0",
//             payValue: BigInt(10000000000000000),
//             receiveAddress: "0x1188e75693a6ba76bf9f6d0239e6f0ec5590cc32",
//             toAddress: "0000000000000000000000001188e75693a6ba76bf9f6d0239e6f0ec5590cc32",
//             contractAddress: "0x383811667ce9646e8bce8aff8ca049751dbec64b",
//         };

//         for (const [key, value] of Object.entries(result ?? {})) {
//             assert(value === expectResult[key], `"${key}"不相等，返回值为"${value}"`);
//         }
//     });
// });
