#!/usr/bin/env node
const path = require('path');
const forever = require('forever-monitor');
const script = path.format({dir: __dirname, base: 'pager.js'});
const chalk = require('chalk');

const header = `
+---------------------+  
| Facebook Pager v1.0 |
+---------------------+
`;

const child = new (forever.Monitor)(script, {
    max: 2,
    silent: false,
});

child.start();

child.on('start', (process) => {
    console.log(chalk.magenta.bold(header));
});

child.on('restart', () => {
    console.log(`Forever restarting script for ${child.times} time`);
});

child.on('exit:code', (code) => {
    console.log(`Forever detected script exited with code ${code}`);
});

