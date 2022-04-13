#!/usr/bin/env node
import minimist from 'minimist';
import { join } from 'path';
import ArLocal from './app';
import { appData } from './utils/appdata';
import {gcpStorage} from "./gcp-storage";
import {Utils} from "./utils/utils";
import fs from "fs";

import { config } from "dotenv";

const argv = minimist(process.argv.slice(2));

const port = process.env.PORT || 1984;
const showLogs = argv.hidelogs ? false : true;
const fails = argv.fails || 0;

const dbPath = argv.dbpath ? join(process.cwd(), argv.dbpath) : appData('arlocal', '.db');

let app: ArLocal;

config();

setInterval(() => {
  const backupName = `./backup.zip`;
  Utils.zipDirectory(dbPath, backupName).then(() => {
    gcpStorage().uploadFile("arlocal-sqllite-backups", {
      fileContent: fs.readFileSync(backupName),
      fileName: backupName.replace("./", "")
    });
  });
}, Number(process.env.BACKUP_TIME || (1000 * 60) * 5));

(async () => {
  app = new ArLocal(+port, showLogs, dbPath, true, fails);
  await app.start();

  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
})();

async function stop() {
  try {
    await app.stop();
  } catch (e) {}
}
