import fs from 'fs';
import Papa from 'papaparse';
import { config } from './config.js';

export const uniq = (arr) => [...new Set(arr)];

export const doesExist = (path) => fs.existsSync(path);

export const json2csv = () => {
    var csv = Papa.unparse([
        {
            column_1: 'abc',
            column_2: 'def',
        },
        {
            column_1: 'abc',
            column_2: 'def',
        },
    ]);
    fs.writeFileSync(config.program_fn, csv);
};

export const csv2json = () => {
    var buffer = [];
    const step = (row) => {
        buffer.push(row.data);
    };
    const complete = () => console.log('buffer: ', buffer);
    const config = {
        delimiter: ',',
        header: true,
        worker: true,
        step,
        complete,
    };
    Papa.parse(fs.createReadStream(config.program_fn), config);
};
