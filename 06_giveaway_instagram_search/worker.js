const {
    Worker, isMainThread, parentPort, workerData
} = require('worker_threads');

const fs = require('fs');
const path = require('path');

const readFiles = async (file) => {
    return new Promise(async (resolve, reject) => {
        const fileContent = await fs.promises.readFile(path.join(__dirname + '/data', file), 'utf8');
        resolve(fileContent.split('\n'));
    })
}

const threadChild = async () => {
    const data = await readFiles(workerData);
    parentPort.postMessage(data);
}
threadChild();