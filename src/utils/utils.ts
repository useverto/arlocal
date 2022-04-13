import { Tag } from '../graphql/types';
import { fromB64Url } from './encoding';
import archiver from 'archiver';
import fs from "fs";

export class Utils {
  static randomID(len?: number): string {
    // tslint:disable-next-line: no-bitwise
    return [...Array(len || 43)].map(() => (~~(Math.random() * 36)).toString(36)).join('');
  }

  static atob(a: string) {
    return Buffer.from(a, 'base64').toString('binary');
  }

  static btoa(b: string) {
    return Buffer.from(b).toString('base64');
  }

  static tagValue(tags: Tag[], name: string): string {
    for (const tag of tags) {
      if (fromB64Url(tag.name).toString().toLowerCase() === name.toLowerCase()) {
        return fromB64Url(tag.value).toString();
      }
    }
    return '';
  }

  static zipDirectory(sourceDir, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = fs.createWriteStream(outPath);

    return new Promise<void>((resolve, reject) => {
      archive
          .directory(sourceDir, false)
          .on('error', err => reject(err))
          .pipe(stream)
      ;

      stream.on('close', () => resolve());
      archive.finalize();
    });
  }

}

export const groupBy = (obj, key) => {
  return obj.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};
