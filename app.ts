import { Application, IBoot } from "egg";
import { EventEmitter } from "events";
import path from "path";
import Chain3 from "chain3";
import Web3 from "web3";
import { NosClient } from "@xgheaven/nos-node-sdk";

export default class Boot implements IBoot {
    private readonly app: Application;

    public constructor(app: Application) {
        this.app = app;
    }

    public configWillLoad() {
        // Ready to call configDidLoad,
        // Config, plugin files are referred,
        // this is the last chance to modify the config.
    }

    public configDidLoad() {
        // Config, plugin files have loaded.
    }

    public async didLoad() {
        // All files have loaded, start plugin here.
        loadProcessor(this.app);
        loadNos(this.app);
        loadChain3(this.app);
        loadWeb3(this.app);
        this.app.price = {};
    }

    public async willReady() {
        // All plugins have started, can do some thing before app ready.
    }

    public async didReady() {
        // Worker is ready, can do some things
        // don't need to block the app boot.
    }

    public async serverDidReady() {
        // Server is listening.
    }

    public async beforeClose() {
        // Do some thing before app close.
    }
}

const loadNos = (app: Application) => {
    app.addSingleton("nos", (config) => {
        const client = new NosClient(config);
        return client;
    });
};

const loadChain3 = (app: Application) => {
    app.addSingleton("chain3", (config) => {
        const chain3 = new Chain3(new Chain3.providers.HttpProvider(config.rpc));
        return chain3;
    });

    const event = new EventEmitter();
    // app.block = event;

    const latestFilter = app.chain3.mc.filter("latest");
    latestFilter.watch((err, hash) => {
        if (err) {
            return;
        }
        const block = app.chain3.mc.getBlock(hash, true);
        // app.block.emit("NewBlock", block);
        event.emit("NewBlock", block);
    });
    // app.block.on("NewBlock", (block) => {
    event.on("NewBlock", (block) => {
        app.processor.startProcess("moac", block);
    });
};

const loadWeb3 = (app: Application) => {
    app.addSingleton("web3", (config) => {
        const web3 = new Web3(new Web3.providers.WebsocketProvider(config.rpc));
        return web3;
    });

    app.web3.eth.subscribe("newBlockHeaders").on("data", (blockHeader) => {
        app.processor.startProcess("eth", blockHeader);
    });
};

const loadProcessor = (app: Application) => {
    const directory = path.join(app.config.baseDir, "app/processor");
    app.loader.loadToApp(directory, "processor");
};
