import { uploadData, getBlockData } from './gcp-storage';

export class DataDB {

  // @ts-ignore
  constructor(dbPath: string) {
  }

  async insert(obj: { txid: string; data: string }): Promise<{ txid: string; data: string }> {
    try {
      await uploadData(obj.data, obj.txid);
      return obj;
    } catch (error) {
      console.error({ error });
    }
  }

  async findOne(txid: string): Promise<{ txid: string; data: string }> {
    const data = await getBlockData(txid);
    return { txid, data };
  }
}
