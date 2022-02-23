import { join } from 'path';
import { uploadData, getBlockData } from './gcp-storage';

export class DataDB {
  // DB should be emptied on every run.
  private path: string;

  constructor(dbPath: string) {
    this.path = join(dbPath, 'data-');
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
