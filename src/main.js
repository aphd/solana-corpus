import {
    storeProgram,
    getProgramInfo,
    storeProgramIds,
    getTokens,
} from './programs.js';
import { uniq, json2csv, getCSVfromJson } from './utils.js';

(async () => {
    storeProgramIds(107_300_020, 5);
    return null;
    storeProgram('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin');
    getProgramInfo('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin');
    getTokens();
})();
