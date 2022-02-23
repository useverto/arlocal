#!/usr/bin/env node
import minimist from 'minimist';
import { join } from 'path';
import ArLocal from './app';
import { appData } from './utils/appdata';

import { config } from "dotenv";
config();

const argv = minimist(process.argv.slice(2));

const port = process.env["PORT"] || (argv._.length && !isNaN(+argv._[0]) ? argv._[0] : 1984);
const showLogs = argv.hidelogs ? false : true;
const persist = argv.persist;

const dbPath = argv.dbpath ? join(process.cwd(), argv.dbpath) : appData('arlocal', '.db');

let app: ArLocal;

process.on('uncaughtException', (err) => { console.error(err); });
process.on('unhandledRejection', (reason, p) => { console.error(reason, 'Unhandled Rejection at Promise', p); });

(async () => {
  app = new ArLocal(+port, showLogs, dbPath, !!persist);
  await app.start();

  // process.on('SIGINT', stop);
  // process.on('SIGTERM', stop);
})();

// async function stop() {
//   try {
//     await app.stop();
//   } catch (e) {}
// }
