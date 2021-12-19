import async from 'async';
import { getBlockData, storeBlockInfo, getBlocksIds } from './block.utils.js';
import * as utils from './utils.js';
import { config } from './config.js';
import fs from 'fs';
const { getProgramsId } = utils;

let stream, prevBlocks, prevPrograms;

const callbackBlock = async (blockId) => {
    if (prevBlocks.indexOf(blockId) !== -1) return null;
    queue.push(blockId);
};

const callbackProgam = async (newProgram) => {
    if (prevPrograms.indexOf(newProgram) !== -1) return null;
    console.log('newProgram: ', newProgram);
    stream.write(`${newProgram}\n`);
    prevPrograms.push(newProgram);
};

const storeProgramIdsAndBlockInfo = async (slot, length = 1) => {
    const blocks = Array.from({ length }, (_, i) => i + slot);
    const callbackStrem = () => blocks.forEach((e) => callbackBlock(e));
    stream.once('open', callbackStrem);
};

const queue = async.queue(async (blockId) => {
    const { programs, block } = await getBlockData(blockId);
    storeBlockInfo(block, blockId);
    console.log(`finished processing block ${blockId}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    programs.forEach((e) => callbackProgam(e));
}, 1);

queue.drain(async function () {
    console.log('all items have been processed');
    stream.end();
});

(async function () {
    prevBlocks = await getBlocksIds();
    prevPrograms = await getProgramsId();
    stream = fs.createWriteStream(config.program_fn, { flags: 'a' });
    // 90_000_000 -> 90_005_000
    // 100_000_000-> 100_000_500
    // 101_000_000, 5_000
    // 107_300_000->107_300_500
    storeProgramIdsAndBlockInfo(100_000, 200_000);
})();
