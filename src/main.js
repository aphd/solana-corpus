import { storeBytecodes, getProgramInfo, storeProgramIds } from './programs.js';
import { uniq, json2csv, getCSVfromJson } from './utils.js';

(async () => {
    storeProgramIds(107_300_025, 5);
    return null;
    storeBytecodes();

    getProgramInfo('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin');
})();
