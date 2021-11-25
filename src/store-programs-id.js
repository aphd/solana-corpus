import async from 'async';
import { getProgramsFromBlock } from './programs.utils.js';
import * as utils from './utils.js';

const new_programs = [];

const storeProgramIds = async (slot, length = 1) => {
    const blocks = Array.from({ length }, (_, i) => i + slot);
    blocks.forEach(async (blockId) => queue.push(blockId));
};

const queue = async.queue(async function (blockId) {
    const programs = await getProgramsFromBlock(blockId);
    console.log(`finished processing block ${blockId}`);
    new_programs.push(...programs);
}, 1);

queue.drain(async function () {
    const { json2csv, uniq, getProgramsId } = utils;
    const old_programs = await getProgramsId();
    console.log('all items have been processed');
    json2csv(uniq([...old_programs, ...new_programs]).map((e) => [e]));
});

// 90_000_000 -> 90_000_500
// 100_000_000-> 100_000_500
// 107_300_000->107_300_500
storeProgramIds(90_000_500, 500);
