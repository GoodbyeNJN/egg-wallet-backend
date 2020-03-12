import { Application, MoacBlock, Task } from "egg";

export default async (app: Application, base: string, block: MoacBlock, task: Task) => {
    console.log(
        new Date().toLocaleString("zh-CN", { hour12: false }),
        "\tprocessor start:",
        `\tprocessor=${task.processor}`,
    );

    if (base !== "moac") {
        return true;
    }

    const { chain3 } = app;
    const { hash } = task;

    const contractAddress = chain3.getContractAddress(hash);
    if (!contractAddress) {
        console.log("Get contract address error:", hash);
        return false;
    }
    if (!chain3.isValidContract(contractAddress)) {
        console.log("Address is not a valid contract address:", contractAddress);
        return true;
    }

    const [number] = await app.model.MoacErc20.update(
        { address: contractAddress },
        { where: { hash } },
    );
    if (number !== 0) {
        console.log("Update contract address success:", contractAddress);
        return true;
    } else {
        console.log("Update contract address fail:", contractAddress);
        return false;
    }
};
