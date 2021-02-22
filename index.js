#!/usr/bin/env node
const path = require('path');
const forever = require('forever-monitor');
const script = path.format({dir: __dirname, base: 'pager.js'});
const chalk = require('chalk');
const commander = require('commander');

const header = `
+---------------------+  
| Facebook Pager v1.3 |
+---------------------+
`;

commander.version('1.3.0')
.option('-m, --message <text>', 'set custom bot message')
.action( (options) => {
    const child = new (forever.Monitor)(script, {
        max: 2,
        silent: false,
        args: [options.message]
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

}).parse();
