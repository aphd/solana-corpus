import { storeBytecodes, getProgramInfo, storeProgramIds } from './programs.js';
import { uniq, json2csv, getCSVfromJson } from './utils.js';

(async () => {
    storeBytecodes();
    return null;
    storeProgramIds(107_300_020, 5);

    getProgramInfo('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin');
})();
