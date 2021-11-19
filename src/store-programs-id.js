import { getProgramsFromBlock } from './programs.utils.js';
import * as utils from './utils.js';

const storeProgramIds = async (slot, length = 1) => {
    const { json2csv, uniq, getProgramsId } = utils;
    const new_programs = [];
    const blocks = Array.from({ length }, (_, i) => i + slot);
    const old_programs = await getProgramsId();
    const promises = blocks.map(async (e) => {
        const programs = await getProgramsFromBlock(e);
        console.log('block number:', e);
        new_programs.push(...programs);
    });

    await Promise.all(promises);
    json2csv(uniq([...old_programs, ...new_programs]).map((e) => [e]));
};

storeProgramIds(107_300_100, 20);
