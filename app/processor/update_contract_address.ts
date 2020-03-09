import { Application, MoacBlock, Task } from "egg";

export default async (app: Application, base: string, block: MoacBlock, task: Task) => {
    if (base !== "moac") {
        return;
    }

    const { chain3 } = app;
    const { hash } = task;

    const contractAddress = chain3.getContractAddress(hash);
    if (!contractAddress) {
        console.log("Get contract address error:", hash);
        return;
    }
    if (!chain3.isValidContract(contractAddress)) {
        console.log("Address is not a valid contract address:", contractAddress);
        return;
    }

    const [number] = await app.model.Erc20.update(
        { address: contractAddress },
        { where: { hash } },
    );
    if (number !== 0) {
        console.log("Update contract address success:", contractAddress);
    } else {
        console.log("Update contract address fail:", contractAddress);
    }
};
