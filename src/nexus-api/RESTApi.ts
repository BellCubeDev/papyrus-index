import NexusModsAPI_ from '@nexusmods/nexus-api';
import packageJson from '../../package.json';

const NexusModsAPI = NexusModsAPI_ as unknown as typeof import('@nexusmods/nexus-api');
const {default: NexusModsAPIClient} = NexusModsAPI;

const apiKey = process.env.NEXUS_API_KEY!;
if (!apiKey) throw new Error('NEXUS_API_KEY environment variable is not set!');

const basicClientPromise = NexusModsAPIClient.create(apiKey, "Papyrus Index", packageJson.version, "", 60000);

const memoization60s = new Map<string, any>();

type AllMethodsAreAPromise<T extends {}> = {
    [K in keyof T]: T[K] extends (...args: any[])=>any ? T[K] extends (...args: any[])=>Promise<any> ? T[K] : (...args: Parameters<T[K]>)=>Promise<ReturnType<T[K]>> : T[K];
};

/** Contains a Nexus Mods API REST client with a pre-filled API key (from ENV) and 60-second memoization for all requests. */
export const nexusModsREST60sMemo = new Proxy<AllMethodsAreAPromise<InstanceType<typeof NexusModsAPIClient>>>(basicClientPromise as any, {
    get(target, prop, _receiver) {
        return async (...args: any[]) => {
            const memoKey = JSON.stringify([prop, ...args]);
            const memoized = memoization60s.get(memoKey);
            if (memoized) return memoized;

            const res = (await (await target as any)[prop] as (...args_: any[])=>any).call((await target as any), ...args);
            memoization60s.set(memoKey, res);
            setTimeout(() => memoization60s.delete(memoKey), 60000).unref();
            return res;
        };
    }
});

export const nexusModsRESTRefetch = new Proxy<AllMethodsAreAPromise<InstanceType<typeof NexusModsAPIClient>>>(basicClientPromise as any, {
    get(target, prop, _receiver) {
        return async (...args: any[]) => (await (await target as any)[prop] as (...args_: any[])=>any).call((await target as any), ...args);
    }
});
