import { GcpStorageService } from "verto-internals/services/gcp/gcp-storage.service";

export const gcpStorage = () => new GcpStorageService();
export const BUCKET_NAME = 'arlocal-testnet-stage';

// @ts-ignore
function jsonUpdate(original: any, newJson: any) {
    Object.keys(newJson).forEach((key) => {
        const newKeyVal = newJson[key];
        const originalKeyVal = original[key];

        if(Array.isArray(originalKeyVal) && Array.isArray(newKeyVal)) {
            original[key].push(...newKeyVal);
        } else if(typeof originalKeyVal === 'object' && typeof newKeyVal === 'object') {
            original[key] = jsonUpdate(originalKeyVal, newKeyVal);
        } else {
            original[key] = newKeyVal;
        }
    }); return original;
}

export const updateStorage = async (section: string, name: string, data: any, json: boolean = true) => {
    await gcpStorage().uploadFile(BUCKET_NAME, {
        fileName: `${section}/${name}.json`,
        fileContent: json ? JSON.stringify(data) : data
    });
}

export const fileExists = async (section: string, name: string) => {
    const fileExists = (await gcpStorage().getFile(BUCKET_NAME, `${section}/${name}.json`).exists())[0];
    return fileExists;
}

export const uploadData = async (data: string, txId: string) => {
    await updateStorage(`BLOCKS`, txId, data, false);

}

export const getBlockData = async (txId: string) => {
    try {
        return await gcpStorage().fetchFileContent(BUCKET_NAME, `BLOCKS/${txId}.json`);
    } catch {
        return undefined;
    }
}
