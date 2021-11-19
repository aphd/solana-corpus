import {
    storeBytecodes,
    storeProgramsInfo,
    storeProgramIds,
} from './programs.js';
import { uniq, json2csv, getProgramsId } from './utils.js';

(async () => {
    storeProgramsInfo();
    return null;
    storeBytecodes();
    return null;
    storeProgramIds(107_300_025, 5);
})();
