#!/usr/bin/env node
const forever = require('forever-monitor');
const path = require('path');
const script = path.format({dir: __dirname, base: 'pager.js'});

const child = new (forever.Monitor)(script, {
    max: 2,
    silent: false
});

child.start();

child.on('start', (process) => {
    console.log('pager.js script started.', process);
});

child.on('restart', () => {
    console.error(`Forever restarting script for ${child.times} time`);
});

child.on('exit:code', (code) => {
    console.log(`Forever detected script exited with code ${code}`);
});

