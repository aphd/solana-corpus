import fs from 'fs';

export const uniq = (arr) => [...new Set(arr)];

export const doesExist = (path) => fs.existsSync(path);
