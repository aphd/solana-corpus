import axios from 'axios';
import solanaWeb3 from '@solana/web3.js';
import { execa } from 'execa';
import { uniq, doesExist, json2csv, getCSVfromJson } from './utils.js';
import { config } from './config.js';

const urls = {
    tokens: 'solana-labs/token-list/main/src/tokens/solana.tokenlist.json',
    programs: 'project-serum/serum-ts/master/packages/serum/src/markets.json',
};

const getPrograms = async () => {
    const url = `https://raw.githubusercontent.com/${urls.programs}`;
    const { data } = await axios.get(url);
    const programs = Array.from(new Set(data.map((e) => e.programId)));
    console.log(programs);
};

const getTokens = async () => {
    const url = `https://raw.githubusercontent.com/${urls.tokens}`;
    const { data } = await axios.get(url);
    const addresses = Array.from(new Set(data.tokens.map((e) => e.address)));
    console.log(addresses);
};

const getProgramsFromBlock = async (slot) => {
    const connection = new solanaWeb3.Connection(
        solanaWeb3.clusterApiUrl('mainnet-beta'),
        'confirmed'
    );
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
    console.log(stdout);
};

export const storeBytecodes = async () => {
    const programIds = await getCSVfromJson();
    const promises = programIds.map((id) => storeBytecode(id));
    await Promise.all(promises);
};

const storeBytecode = async (id) => {
    const path = `${config.bytecode_path}/${id}.bytecode`;
    if (doesExist(path)) return null;
    const params = ['program', 'dump', id, path];
    const { stdout } = await execa('solana', params);
    console.log(stdout);
};

export const storeProgramIds = async (slot, length = 1) => {
    const programs = [];
    const blocks = Array.from({ length }, (_, i) => i + slot);

    const promises = blocks.map(async (e) => {
        const items = await getProgramsFromBlock(e);
        console.log('block number:', e);
        programs.push(...items);
    });
    await Promise.all(promises);
    const prev = await getCSVfromJson();
    json2csv(uniq([...prev, ...programs]).map((e) => [e]));
}; 
