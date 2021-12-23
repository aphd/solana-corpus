import solanaWeb3 from '@solana/web3.js';
import { execa } from 'execa';
import { uniq, doesExist, appendDataToCSV } from './utils.js';
import { config } from './config.js';
import fs from 'fs';
import Papa from 'papaparse';

const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl('mainnet-beta'),
    'confirmed'
);

const keys = [
    'blockHeight',
    'blockTime',
    'parentSlot',
    'blockhash',
    'previousBlockhash',
];

export const getBlockData = async (slot) => {
    try {
        const block = await connection.getBlock(slot);
        const progMatch = JSON.stringify(block).match(/Program (\w{44})/g);
        const programs = uniq(progMatch.map((e) => e.replace('Program ', '')));
        return { programs, block };
    } catch (error) {
        console.log('error in block: ', slot);
        return { programs: [], block: [{ blockId: slot }] };
    }
};

export const getProgramInfo = async (id) => {
    const params = ['program', 'show', id];
    const { stdout } = await execa('solana', params).catch(() => ({ stdout: false }));
    return stdout;
};

export const cleanProgramInfo = async (data) => {
    const { stdout } = await execa('head', ['-n', '1', config.programInfoFn]);
    const programInfoHeader = stdout.split(',');
    return programInfoHeader.reduce((a, c) => {
        return { ...a, [c]: data[c] || 'NA' };
    }, {});
};

export const storeBytecode = async (id) => {
    const path = `${config.bytecode_path}/${id}.bytecode`;
    if (doesExist(path)) return null;
    const params = ['program', 'dump', id, path];
    const { stdout } = await execa('solana', params);
    console.log(stdout);
};

export const storeBlockInfo = async (block, blockId) => {
    const blockInfo = keys.reduce((a, c) => ({ ...a, [c]: block[c] || 'NA' }), { blockId });
    blockInfo['transactions'] = block?.transactions?.length || 'NA';
    appendDataToCSV(config.block_info_fn, [blockInfo], false);
};

export const getBlocksIds = () => {
    const file = fs.createReadStream(config.block_info_fn);
    const pConfig = { header: true };
    return new Promise((resolve) => {
        const complete = (results) =>
            resolve(results.data.map((e) => parseInt(e.blockId)));
        Papa.parse(file, { ...pConfig, complete });
    });
};
