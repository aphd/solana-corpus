import fs from 'fs';
import Papa from 'papaparse';
import { config } from './config.js';

export const uniq = (arr) => [...new Set(arr)];

export const doesExist = (path) => fs.existsSync(path);

export const doesFileHasString = async (file, str) =>
    new Promise((resolve) => {
        fs.readFile(file, (_, data) => resolve(data.indexOf(str) >= 0));
    });

export const json2csv = (data) => {
    const csv = Papa.unparse(data);
    fs.writeFileSync(config.program_fn, `${csv}`);
    console.log('result write on', config.program_fn);
};

export const appendDataToCSV = (fileName, data) => {
    const csv = Papa.unparse(data, { header: false });
    fs.appendFileSync(fileName, `${csv}`);
    console.log('result write on', fileName);
};

export const getProgramsId = () => {
    const file = fs.createReadStream(config.program_fn);
    const pConfig = { header: false };
    return new Promise((resolve) => {
        const complete = (results) => resolve(results.data.flat());
        Papa.parse(file, { ...pConfig, complete });
    });
};

export const str2json = (str) => {
    const data = str.trim();
    return data.split('\n').reduce((a, c) => {
        const pair = c.split(':');
        return { ...a, [pair[0].replace(/ /g, '')]: pair[1].trim() };
    }, {});
};




