const fs = require('fs');
const path = require('path');
const threads = require('worker_threads');
const {Worker} = threads;


const filesNames = [];

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
    console.log(filesNames)
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

const main = async () => {
    await getFilesNames(path.join(__dirname + '/data'))
        .then((files) => {
            filesNames.push(...files)
        })
    const lengthFirstFile = await readFileFirstLen(filesNames[19])
    const fileContent = await runWorker(filesNames)
     console.log(fileContent.length)
    console.log(uniqueData(fileContent).length)
    console.log(fileContent.length - lengthFirstFile)
}
const uniqueData = (arr) => (Array.from(new Set(arr)))
main()