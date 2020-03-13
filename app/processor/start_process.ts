import { Application, EthBlock, MoacBlock } from "egg";

// 收到新块时的处理过程
// 流程：
// 1. 监听器接收到新块时调用函数，触发该处理过程
// 2. 根据base获取对应底层的任务队列
// 3. 遍历任务队列，取出某一条任务进行处理
// 4. 判断新块高是否大于等于某一任务的截止块高，即判断该任务是否需要立即被处理
// 4.1. 若是，启动给定的处理器
// 4.1.1. 若处理器返回true，表示该任务处理完成，可以从任务队列中剔除
// 4.1.2. 若处理器返回false或异常退出，则保留该任务等待下次处理
// 4.2. 若否，说明队列中已无需要立即处理的任务，退出遍历
// 5. 继续下一条任务，直到遍历完整个队列或退出遍历
// 6. 更新任务队列
// 7. 结束整个处理流程
export default (app: Application) => {
    return async (base: string, block: MoacBlock | EthBlock) => {
        const tasks = app.processor.tasks.get(base);
        console.log(
            new Date().toLocaleString("zh-CN", { hour12: false }),
            "\ttask start:",
            `\tbase=${base}`,
            `\tblockNumber=${block.number}`,
            `\ttaskLength=`,
            tasks.length,
        );
        if (tasks.length === 0) {
            return;
        }

        const newTasks = [...tasks];

        // 遍历任务队列
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];

            console.log(
                new Date().toLocaleString("zh-CN", { hour12: false }),
                "\tprocessing task:",
                `\thash=${task.hash}`,
            );

            // 当最新块高比截止块高大时
            if (block.number ?? 0 >= task.endBlockNumber) {
                // 启动任务
                const result: true | false = await app.processor?.[task.processor]?.(
                    app,
                    base,
                    block,
                    task,
                );

                if (result) {
                    // 从任务队列中剔除这一条
                    newTasks.splice(i, 1);
                }
            } else {
                break;
            }
        }

        // 更新任务队列
        app.processor.tasks.set(base, newTasks);
    };
};
