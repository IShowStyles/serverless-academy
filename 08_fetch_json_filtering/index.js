const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
const arrEndpoints = [
    "https://jsonbase.com/sls-team/json-793",
    "https://jsonbase.com/sls-team/json-955",
    "https://jsonbase.com/sls-team/json-231",
    "https://jsonbase.com/sls-team/json-931",
    "https://jsonbase.com/sls-team/json-93",
    "https://jsonbase.com/sls-team/json-342",
    "https://jsonbase.com/sls-team/json-770",
    "https://jsonbase.com/sls-team/json-491",
    "https://jsonbase.com/sls-team/json-281",
    "https://jsonbase.com/sls-team/json-718",
    "https://jsonbase.com/sls-team/json-310",
    "https://jsonbase.com/sls-team/json-806",
    "https://jsonbase.com/sls-team/json-469",
    "https://jsonbase.com/sls-team/json-258",
    "https://jsonbase.com/sls-team/json-516",
    "https://jsonbase.com/sls-team/json-79",
    "https://jsonbase.com/sls-team/json-706",
    "https://jsonbase.com/sls-team/json-521",
    "https://jsonbase.com/sls-team/json-350",
    "https://jsonbase.com/sls-team/json-64"
]

const getJson = async (url) => {
    const response = await fetch(url);
    const json = await response.json();
    return json;
}

const binaryTreeSearch = (object, key, endpoint) => {
    const arr = Object.keys(object);
    const res = arr.find((item) => item === key && object[item] === true);
    if (!res) {
        return console.log(`[Error] ${endpoint} isDone false`);
    }
    if (res) {
        return console.log(`[Success] ${endpoint} isDone true`);
    }else{
        for (let i = 0; i < arr.length; i++) {
            if (typeof object[arr[i]] === "object") {
                binaryTreeSearch(object[arr[i]], key);
            }
        }
    }
}

const main = async () => {
    for await (const endpoint of arrEndpoints) {
        const json = await getJson(endpoint);
        binaryTreeSearch(json, "isDone" , endpoint)
    }
}
main();

