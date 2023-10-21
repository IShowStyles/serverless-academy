import readline from "node:readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

const arrInput = [];

const getInput = (promptText) => {
    return new Promise((resolve) => {
        rl.question(promptText, (answer) => {
            resolve(answer);
        });
    });
};

const sortAnswer = (string) => {
    if (!string.length) return false;
    const arr = string.split(' ');
    arrInput.push(...arr);
    return true;
};

const sortDataByTypes = (arr = []) => {
    const dataNum = arr.filter(item => item.match(/\d+/g)).map(item => item.includes('.') ? parseFloat(item) : parseInt(item));
    const dataStr = arr.filter(item => !item.match(/\d+/g));
    return [dataNum, dataStr];
}

const handleNumberOption = (option,arrayNumbers,arrayString) => {
    switch (option) {
        case '1':
            console.log(arrayString.sort().join(' '))
            break;
        case '2':
            console.log(arrayNumbers.sort((a, b) => a - b).join(' '))
            break;
        case '3':
            console.log(arrayNumbers.sort((a, b) => b - a).join(' '))
            break;
        case '4':
            console.log(arrayString.sort((a, b) => a.length - b.length).join(' '))
            break;
        case '5':
            console.log(Array.from(new Set(arrayString)).join(' '));
            break;
        case '6':
            console.log(`Unique words are ${Array.from(new Set(arrayString)).join(' ')}`)
            console.log(`Unique numbers are ${Array.from(new Set(arrayNumbers)).join(' ')}`)
            break;
        case 'exit':
            console.log('Good bye ! Come back again');
            return true;
        default:
            console.log('Invalid option');
    }
    return false;
};

const main = async () => {
    console.log('Hello! Enter random numbers or random words. Type an empty line to stop.');
    while (true) {
        const answer = await getInput("SEND> ");
        if (sortAnswer(answer)) break;
    }
    const [arrayWithNumber, arrayString] = sortDataByTypes(arrInput);
    while (true) {
        const numberOption = await getInput("Select (1 - 6) press ENTER to enter or exit to exit ");
        if (handleNumberOption(numberOption,arrayWithNumber,arrayString)) {
            break;
        }
    }
    rl.close();
};

main();