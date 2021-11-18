import {
    storeProgram,
    getProgramInfo,
    getProgramsFromBlock,
    getTokens,
} from './programs.js';
import { uniq } from './utils.js';

(async () => {
    storeProgram('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin');
    return null;
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


    getProgramInfo('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin');
    getTokens();
})();
