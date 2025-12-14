import path from "node:path";
import url from "node:url";

const thisFilePath = url.fileURLToPath(import.meta.url);
const thisFolder = path.dirname(thisFilePath);
export const socketPath = path.join(thisFolder, "stepSummarySocket.sock");
