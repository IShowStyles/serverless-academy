import inquirer from 'inquirer';
import fs from 'fs';


const dbFilePath = 'db.txt';
let database = [];
if (fs.existsSync(dbFilePath)) {
    const rawData = fs.readFileSync(dbFilePath, 'utf-8');
    database = rawData ? JSON.parse(rawData) : [];
}


const questions = [
    {
        type: 'input',
        name: 'name',
        message: 'Enter the user\'s name:',
        validate: value => {
            if (!value.length) {
                return true;
            }
            if (!value.match(/^[a-zA-Z]+$/)) {
                return "Please enter english letters only";
            }
            return true;
        },
    },
    {
        type: 'list',
        name: 'gender',
        message: 'Choose your Gender:',
        choices: ['male', 'female'],
        when: answers => answers.name.length > 0,
    },
    {
        type: 'input',
        name: 'age',
        message: 'Enter your age:',
        validate: value => {
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
        },
        filter: Number,
        when: answers => answers.name.length > 0,
    }
];

function addUserAndContinue() {
    inquirer.prompt(questions).then(async (answer) => {
        if (answer.name.length === 0) {
            displayDatabase();
        } else {
            database.push(answer);  // Directly pushing the answer to database
            fs.writeFileSync(dbFilePath, JSON.stringify(database));
            console.log('Enter details for the next user:');
            addUserAndContinue();
        }
    });
}


function displayDatabase() {
    console.log('Database content:');
    console.log(database);
    searchUser();
}

function searchUser() {
    const db = []
    fs.readFile(dbFilePath, 'utf-8', (err, data) => {
        if (err) throw err;
        db.push(JSON.parse(data));
    });
    inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter user\'s name you wanna find in DB:',
        validate: value => {
            if (!value.length) {
                return "Please enter a name";
            }
            if (!value.match(/^[a-zA-Z]+$/)) {
                return "Please enter english letters only";
            }
            return true;
        },
    }).then(answers => {
        if (!database.length) {
            console.log('Database is empty.');
            return;
        }
        const user = database.find(u => u.name.toLowerCase() === answers.name.toLowerCase());
        if (user) {
            console.log(`User ${user.name} was found.`, user);
        } else {
            console.log(`User ${answers.name} was not found.`);
        }
    });
}

console.log('Enter details for the first user:');
addUserAndContinue();
