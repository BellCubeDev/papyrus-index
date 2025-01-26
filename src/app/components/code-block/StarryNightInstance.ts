import { createStarryNight } from "@wooorm/starry-night";
import { PapyrusTMLanguage } from "./Papyrus/papyrusTMLanguage";
import { memoizeDevServerConst } from "../../../utils/memoizeDevServerConst";

declare global {
    interface Window {
        StarryNightInstance: ReturnType<typeof initStarryNightForReal>
    }
    var StarryNightInstance: ReturnType<typeof initStarryNightForReal>; // eslint-disable-line vars-on-top, no-var
}

export function initStarryNightForReal() {
    return createStarryNight([
        PapyrusTMLanguage,
    ]);
}

export async function getStarryNightInstance() {
    //return await initStarryNightForReal(); //-- use this when modifying any of the TextMate languages so your hot reloads work
    return await memoizeDevServerConst('initStarryNightForReal_ReturnValue', initStarryNightForReal);
}

// TODO: Replace this with VS Code's own tokenization engine and just style it from there
// https://github.com/microsoft/vscode-textmate
// needed WASM bindings: https://github.com/microsoft/vscode-oniguruma
