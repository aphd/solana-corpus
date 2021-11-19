import fs from 'fs';
import Papa from 'papaparse';
import { config } from './config.js';

export const uniq = (arr) => [...new Set(arr)];

export const doesExist = (path) => fs.existsSync(path);

export const json2csv = (data) => {
    const csv = Papa.unparse(data);
    fs.writeFileSync(config.program_fn, `${csv}`);
    console.log('result write on', config.program_fn);
};

export const getCSVfromJson = () => {
    const file = fs.createReadStream(config.program_fn);
    const pConfig = { header: false };
    return new Promise((resolve) => {
        const complete = (results) => resolve(results.data.flat());
        Papa.parse(file, { ...pConfig, complete });
    });
};

