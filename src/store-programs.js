const axios = require('axios');
const solanaWeb3 = require('@solana/web3.js');
const fs = require('fs');

const urls = {
    tokens: 'solana-labs/token-list/main/src/tokens/solana.tokenlist.json',
    programs: 'project-serum/serum-ts/master/packages/serum/src/markets.json',
};

const uniq = (arr) => Array.from(new Set(arr));

const getProgramsFromBlock = async (slot = 107346614) => {
    var connection = new solanaWeb3.Connection(
        solanaWeb3.clusterApiUrl('mainnet-beta'),
        'confirmed'
    );
    const block = await connection.getBlock(slot);
    const programs = JSON.stringify(block).match(/Program (\w{44})/g);
    return uniq(programs.map((e) => e.replace('Program ', '')));
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

(async () => {
    // getTokens();
    const START = 107353000;
    const programs = [];
    const blocks = Array.from({ length: 1 }, (_, i) => i + START);

    const promises = blocks.map(async (e) => {
        const items = await getProgramsFromBlock(e);
        console.log('block number:', e);
        programs.push(...items);
    });
    await Promise.all(promises);

    console.log('programs....', uniq(programs));
})();
