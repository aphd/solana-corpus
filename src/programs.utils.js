import solanaWeb3 from '@solana/web3.js';
import { execa } from 'execa';
import { uniq, doesExist, json2csv, getProgramsId } from './utils.js';
import { config } from './config.js';

const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl('mainnet-beta'),
    'confirmed'
);

export const getProgramsFromBlock = async (slot) => {
    try {
        const block = await connection.getBlock(slot);
        const programs = JSON.stringify(block).match(/Program (\w{44})/g);
        return uniq(programs.map((e) => e.replace('Program ', '')));
    } catch (error) {
        console.log('error in block: ', slot);
        return [];
    }
};

export const getProgramInfo = async (id) => {
    const params = ['program', 'show', id];
    const { stdout } = await execa('solana', params);
    return stdout;
};

export const cleanProgramInfo = async (data) => {
    const { stdout } = await execa('head', ['-n', '1', config.programInfoFn]);
    const programInfoHeader = stdout.split(',');
    return programInfoHeader.reduce((a, c) => {
        return { ...a, [c]: data[c] || 'n/a' };
    }, {});
};

export const storeBytecode = async (id) => {
    const path = `${config.bytecode_path}/${id}.bytecode`;
    if (doesExist(path)) return null;
    const params = ['program', 'dump', id, path];
    const { stdout } = await execa('solana', params);
    console.log(stdout);
};
