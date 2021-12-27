import { execa } from 'execa';
import { readFile } from 'fs/promises';
import fs from 'fs';

const errorCallback = (err) => {
    // console.error(err);
    return { stdout: false };
};

const writeProgramInfo = async (address) => {
    // > objdump -t -arch-name x86-64  --source data/bytecode/CLs66NQrh6MWYzkgxrC79tfepMt5neTTCgguzpYo1LCW.bytecode
    const fPath = 'data/bytecode'.concat('/', `${address}.bytecode`);
    console.log('fPath:', fPath);
    const params = ['-t', '-T', '-arch-name', 'x86', '--source', fPath];
    const subprocess = execa('objdump', params);
    const output = 'data/objdump'.concat('/', `${address}.x86`);
    console.log('output:', output);
    subprocess.stdout.pipe(fs.createWriteStream(output));
};

const getBlackList = () => ['', '<unknown>', 'elf64-bpf', '.text:'];

const filterInstruciotns = (e) => !getBlackList().includes(e) && /^[a-zA-Z]/.test(e);

const getInstructionList = async (address) => {
    const fPath = 'data/objdump'.concat('/', `${address}.instructions`);
    console.log('fPath:', fPath);
    const data = await readFile(fPath, 'utf8').catch(errorCallback);
    if (Array.isArray(data)) return;
    return data.split('\n').filter(filterInstruciotns);
};

const getFrequency = (arr) => arr.reduce((a, c) => ({ ...a, [c]: a[c] + 1 || 1 }), {});

const writeInstructions = (address) => {
    // awk '{ print$4 }' data/objdump/CLs66NQrh6MWYzkgxrC79tfepMt5neTTCgguzpYo1LCW.x86
    const fPath = 'data/objdump'.concat('/', `${address}.x86`);
    console.log('fPath:', fPath);
    const params = ['{ print $4 }', fPath];
    const subprocess = execa('awk', params);
    const output = 'data/objdump'.concat('/', `${address}.instructions`);
    console.log('output:', output);
    subprocess.stdout.pipe(fs.createWriteStream(output));
};

const sortObjByValue = (obj) => {
    const sortedKeys = Object.keys(obj).sort((a, b) => obj[b] - obj[a]);
    return sortedKeys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {});
};

const writeProgramsDataset = () => {
    // read/write the Symbol table (souce file name)
    // sourceFileName, [instructions]
};

(async () => {
    await writeProgramInfo('CLs66NQrh6MWYzkgxrC79tfepMt5neTTCgguzpYo1LCW');
    // await writeInstructions('CLs66NQrh6MWYzkgxrC79tfepMt5neTTCgguzpYo1LCW');
    // const instructions = await getInstructionList('CLs66NQrh6MWYzkgxrC79tfepMt5neTTCgguzpYo1LCW');
    // const instructionFrequency = getFrequency(instructions);
    // console.log('instructionFrequency:', sortObjByValue(instructionFrequency));
})();
