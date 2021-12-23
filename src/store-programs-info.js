import * as utils from './utils.js';
import { getProgramInfo, cleanProgramInfo } from './block.utils.js';
import { config } from './config.js';
const { programInfoFn } = config;

const checkFileExist = async (id) => {
    const doesExist = await utils.doesFileHasString(programInfoFn, id);
    return { id, doesExist };
};

const getMissingPrograms = async () => {
    const allPrograms = await utils.getProgramsId();
    const allProgramsInfo = await Promise.all(allPrograms.map(checkFileExist));
    return allProgramsInfo.filter((e) => !e.doesExist);
};

const storeProgramsInfo = async () => {
    const missingPrograms = await getMissingPrograms();
    const programsInfo = [];
    const promises = missingPrograms.map(async ({ id }) => {
        const programInfo = await getProgramInfo(id);
        if (!programInfo) return;
        const programInfoClean = await cleanProgramInfo(utils.str2json(programInfo));
        programsInfo.push(programInfoClean);
    });
    await Promise.all(promises);
    utils.appendDataToCSV(programInfoFn, programsInfo);
};

storeProgramsInfo();
