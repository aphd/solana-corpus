import axios from 'axios';
import solanaWeb3 from '@solana/web3.js';
import { execa } from 'execa';
import { uniq, doesExist } from './utils.js';
import fs from 'fs';

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

export const getTokens = async () => {
    const url = `https://raw.githubusercontent.com/${urls.tokens}`;
    const { data } = await axios.get(url);
    const addresses = Array.from(new Set(data.tokens.map((e) => e.address)));
    console.log(addresses);
};

export const getProgramsFromBlock = async (slot = 107346614) => {
    var connection = new solanaWeb3.Connection(
        solanaWeb3.clusterApiUrl('mainnet-beta'),
        'confirmed'
    );
    const block = await connection.getBlock(slot);
    const programs = JSON.stringify(block).match(/Program (\w{44})/g);
    return uniq(programs.map((e) => e.replace('Program ', '')));
};

export const getProgramInfo = async (id) => {
    const params = ['program', 'show', id];
    const { stdout } = await execa('solana', params);
    console.log(stdout);
};

export const storeProgram = async (id) => {
    const path = `./data/${id}.bytecode`;
    if (doesExist(path)) return null;
    const params = ['program', 'dump', id, path];
    const { stdout } = await execa('solana', params);
    console.log(stdout);
};
