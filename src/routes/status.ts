import { gcpStorage } from '../gcp-storage';
import { RouterContext } from 'koa-router';

export async function statusRoute(ctx: RouterContext) {
  const initResultFile = await gcpStorage().fetchFileContent("arlocal-sqllite-backups", "init-result.json");
  const initResultFileJson = JSON.parse(initResultFile || '{}');
  ctx.body = {
    ...ctx.network,
    init: { ...initResultFileJson }
  };
}
