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
      const { defaultName, subrepo } = defaults[template];

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
      });
    }

    const { confirm } = await questions.askConfirm(res);
    console.log();

    if (!confirm) {
      console.log(chalk.red.bold('Aborted!'));
      process.exit(1);
    }

    console.log(chalk.magenta('Cloning repositories...'));

    for await (const { template, subrepo, path } of res) {
      await cloneRepo(template, subrepo, path);
      console.log(chalk.green(`Cloned ${template} repo to ${path}`));

      if (subrepo === 'express' || subrepo === 'react') {
        setup(template, path, 'npm', true);
      } else if (subrepo === 'elixir_server') {
        setup(template, path, 'elixir', false);
      }
    }
    console.log();
  } catch (err) {
    console.log(chalk.red.bold(`Error: ${err}`));
    process.exit(1);
  }
};

run();
