#!/usr/bin/env node

const process = require('process');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const questions = require('../lib/questions');
const defaults = require('../lib/defaults');
const resolvePath = require('../lib/resolver');
const cloneRepo = require('../lib/repo');
const setup = require('../lib/setup');

clear();

console.log(chalk.yellow(figlet.textSync('Ez-Templates')));

const run = async () => {
  const res = [];

  try {
    const { templates } = await questions.askTemplate();
    console.log();

    for (const template of templates) {
      const { defaultName, subrepo, managers } = defaults[template];

      if (managers?.length > 1) {
        var { manager } = await questions.askManager(template, managers);
        console.log();
      } else {
        var manager = managers[0];
      }

      const { folder } = await questions.askFolderName(
        template,
        defaultName ?? ''
      );
      console.log();

      const { path } = await questions.askPath(template);

      console.log();
      res.push({
        template: template,
        folder_name: folder,
        subrepo: subrepo,
        path: resolvePath(path, folder),
        manager: manager ?? '',
      });
    }

    console.table(res);
    const { confirm } = await questions.askConfirm();
    console.log();

    if (!confirm) {
      console.log(chalk.red.bold('Aborted!'));
      process.exit(1);
    }

    console.log(chalk.magenta('Cloning repositories...'));

    for await (const obj of res) {
      const { template, subrepo, path, manager } = obj;

      await cloneRepo(template, subrepo, path);
      console.log();

      if (manager) {
        setup(template, path, manager);
      }
      console.log();
      console.log();
    }
  } catch (err) {
    console.log(chalk.red.bold(`Error setting up template: ${err.message}`));
    process.exit(1);
  }
};

run();
