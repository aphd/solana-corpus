import * as utils from './utils.js';
import { getProgramInfo, cleanProgramInfo } from './block.utils.js';
import { config } from './config.js';

const storeProgramsInfo = async () => {
    const programsId = await utils.getProgramsId();
    const { programInfoFn } = config;
    const programsInfo = [];
    const promises = programsId.map(async (id) => {
        const doesExist = await utils.doesFileHasString(programInfoFn, id);
        if (doesExist) return null;
        const programInfo = await getProgramInfo(id);
        const programInfoClean = await cleanProgramInfo(
            utils.str2json(programInfo)
        );
        programsInfo.push(programInfoClean);
    });

    await Promise.all(promises);
    utils.appendDataToCSV(programInfoFn, programsInfo);
};

storeProgramsInfo();
