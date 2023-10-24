const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');


const IS_DONE_COUNT = {
    done: 0,
    failure: 0
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
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
    "https://jsonbase/.com/sls-team/json-718",
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
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (e) {

    }
}

const binaryTreeSearch = (object, key, endpoint) => {
    const keys = Object.keys(object);
    const res = keys.find((item) => item === key && object[item] === true);
    if (res === key) {
        return object[res];
    } else {
        for (const key of keys) {
            if (typeof object[key] === 'object') {
             return binaryTreeSearch(object[key], "isDone", endpoint);
            }
        }
    }

}
const main = async () => {
    for (const endpoint of arrEndpoints) {
        const json = await getJson(endpoint);
        if (!json) {
            IS_DONE_COUNT.failure++;
            console.log(`[Failure] Endpoint: ${endpoint} unreachable`);
            continue;
        }
        const isDone = binaryTreeSearch(json, "isDone", endpoint);
        if (isDone) {
            IS_DONE_COUNT.done++;
            console.log(`[Success] Endpoint: ${endpoint} is Done - true`)
        } else {
            IS_DONE_COUNT.failure++;
            console.log(`[Error] Endpoint: ${endpoint} is Done - false`)
        }
    }
    console.log(`Found True values: ${IS_DONE_COUNT.done},\nFound False values: ${IS_DONE_COUNT.failure}`)
}
main();

