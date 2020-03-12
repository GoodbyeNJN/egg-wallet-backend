import { Application, EthBlock, MoacBlock } from "egg";

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
                    // 从任务中剔除这一条
                    newTasks.splice(i, 1);
                }
            } else {
                break;
            }
        }

        app.processor.tasks.set(base, newTasks);
    };
};
