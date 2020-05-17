'use strict';

const fs = require('fs');
const execSync = require('child_process').execSync;

let rawConfig;
let alreadyConfigured = false;
try {
    rawConfig = fs.readFileSync('./workspace/op-codespace.json');
    let rawAlreadyConfigured = fs.readFileSync('./op-codespace.configured.json');
    if (rawAlreadyConfigured) {
        alreadyConfigured = JSON.parse(rawAlreadyConfigured);
    }
} catch(ex) {}

if (rawConfig && !alreadyConfigured) {
    let config = JSON.parse(rawConfig);
    if (config.extensions) {
        installExtensions(config.extensions);
    }
    if (config.scripts) {
        executeSctipts(config.scripts);
    }
    fs.writeFileSync('./op-codespace.configured.json', JSON.stringify(true));
} else {
    console.info('No config file');
}

function installExtensions(extensions) {
    extensions.forEach(element => {
        try {
            execSync(`code-server --install-extension ${element}`);
            console.info(`Extention "${element}" installed`);
        } catch (ex) {
            console.error(`Not able to install extention "${element}"`);
        }
    });
}

function executeSctipts(scripts) {
    scripts.forEach(script => {
        try {
            execSync(`${script}`);
            console.info(`Script "${script}" executed`);
        } catch (ex) {
            console.error(`Not able to execute sctipt "${script}"`);
        }
    });
}
