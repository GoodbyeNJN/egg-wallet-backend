import { Task } from "egg";

// 任务队列
let moacTasks: Task[] = [];
let ethTasks: Task[] = [];

export default {
    get(base: string) {
        if (base === "moac") {
            return moacTasks;
        } else if (base === "eth") {
            return ethTasks;
        } else {
            return [];
        }
    },

    // 通过add方法新增一条任务，任务中包含某笔交易的hash，截止到某个块高时处理该任务，对应调用的处理器，以及自定义内容
    // 任务队列中的任务按照截止块高升序排列
    add(base: string, task: Task) {
        if (base === "moac") {
            moacTasks.push(task);
            moacTasks.sort((a, b) => {
                return b.endBlockNumber - a.endBlockNumber;
            });
        } else if (base === "eth") {
            ethTasks.push(task);
            ethTasks.sort((a, b) => {
                return b.endBlockNumber - a.endBlockNumber;
            });
        }
    },

    set(base: string, newTasks: Task[]) {
        if (base === "moac") {
            moacTasks = newTasks;
        } else if (base === "eth") {
            ethTasks = newTasks;
        }
    },
};
