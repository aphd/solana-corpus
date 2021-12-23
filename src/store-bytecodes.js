import * as utils from './utils.js';
import { storeBytecode } from './block.utils.js';

const storeBytecodes = async () => {
    const programIds = await utils.getProgramsId();
    const promises = programIds.map((id) => storeBytecode(id));
    await Promise.all(promises);
};

storeBytecodes();
