import process from "node:process";
import { config } from "dotenv";
import { ApiVersions, CompressTypes, EncodingTypes, GatewayManager, Rest } from "nyx.js";

config();

if (!process.env.DISCORD_TOKEN) {
    throw new Error("no discord token");
}

const rest = new Rest(process.env.DISCORD_TOKEN, {
    auth_type: "Bot",
    version: ApiVersions.V10,
});

const gateway = new GatewayManager(process.env.DISCORD_TOKEN, rest, {
    intents: 513,
    v: ApiVersions.V10,
    encoding: EncodingTypes.Etf,
    compress: CompressTypes.ZlibStream,
    // shard: "auto",
});

gateway.on("error", (error) => {
    console.error("Error:", error);
});

gateway.on("close", (event) => {
    console.log("Close:", event);
});

gateway.on("warn", (warning) => {
    console.warn("Warn:", warning);
});

gateway.on("debug", (info) => {
    console.debug("Debug:", info);
});

// gateway.on("dispatch", console.log);

void gateway.connect();

// const client = new Client(process.env.DISCORD_TOKEN, {
//     intents: AllIntents,
//     shard: "auto",
//     ws: {
//         encoding: EncodingTypes.Etf,
//         compress: CompressTypes.ZlibStream,
//     },
// });
//
// client.on("error", console.log);
// client.on("debug", console.log);
// client.on("warn", console.log);
// client.on("close", console.log);
//
// void client.login();