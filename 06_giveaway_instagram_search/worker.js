const {
    Worker, isMainThread, parentPort, workerData
} = require('worker_threads');

const fs = require('fs');
const path = require('path');
//
// const filesD = [
//     'out0.txt', 'out1.txt',
//     'out10.txt', 'out11.txt',
//     'out12.txt', 'out13.txt',
//     'out14.txt', 'out15.txt',
//     'out16.txt', 'out17.txt',
//     'out18.txt', 'out19.txt',
//     'out2.txt', 'out3.txt',
//     'out4.txt', 'out5.txt',
//     'out6.txt', 'out7.txt',
//     'out8.txt', 'out9.txt'
// ]

const readFiles = async (files) => {
    return new Promise((resolve, reject) => {
        let data = [];
        files.forEach(async (file, idx) => {
            const fContent = await fs.promises.readFile(path.join(__dirname + '/data', file), 'utf8');
            data.push(...fContent.split('\n'));
            if (idx === files.length - 1) resolve(data);
        })
    })
}

const threadChild = async () => {
    const data = await readFiles(workerData);
    console.log(data.length)
    parentPort.postMessage(data);
}
threadChild();