import { Task } from "egg";

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
