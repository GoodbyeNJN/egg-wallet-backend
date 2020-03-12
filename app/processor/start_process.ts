import { Application, EthBlock, MoacBlock } from "egg";

export default (app: Application) => {
    return (base: string, block: MoacBlock | EthBlock) => {
        const tasks = app.processor.tasks.get(base);
        if (tasks.length === 0) {
            return;
        }

        const newTasks = [...tasks];

        for (const task of tasks) {
            // 当最新块高比截止块高大时
            if (block.number ?? 0 >= task.endBlockNumber) {
                // 启动任务
                app.processor?.[task.processor]?.(app, base, block, task);

                // 从任务中剔除这一条
                newTasks.shift();
                app.processor.tasks.set(base, newTasks);
            } else {
                break;
            }
        }
    };
};
