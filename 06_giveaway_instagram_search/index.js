const fs = require('fs');
const path = require('path');
const threads = require('worker_threads');
const {Worker} = threads;
const filesNames = [];

const uniqueData = (arr) => (Array.from(new Set(arr)))
const allDataLength = (arr) => (arr.length)
const diff = (a, b) => (a - b)

const getFilesNames = (dir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) reject(err);
            resolve(files);
        });
    })
}

const readFileFirstLen = async (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname + '/data', file), 'utf8', (err, fileData) => {
            if (err) reject(err);
            resolve(fileData.length);
        });
    })
}


const runWorker = (workerData) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js', {workerData});
        worker.on('message', (data) => {
            resolve(data);
        })
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        })
    })
}
const getFullData = async () => {
    const resultData = [];
    for (const file of filesNames) {
        const fileContent = await runWorker(file);
        resultData.push(...fileContent);
    }
    return resultData;
}

const main = async () => {
    await getFilesNames(path.join(__dirname + '/data'))
        .then((files) => {
            filesNames.push(...files)
        })
    const lengthFirstFile = await readFileFirstLen(filesNames[19])
    const data = await getFullData();
    console.log(`All words : ${allDataLength(data)}`)
    console.log(`Unique words : ${allDataLength(uniqueData(data))}`)
    console.log(`out1-19.txt : ${diff(data.length, lengthFirstFile)}`)
}
main()