const chalk = require('chalk');
const clear = require('clear');
const degit = require('degit');
const figlet = require('figlet');

const questions = require('../lib/questions');
const defaults = require('../lib/defaults');
const resolvePath = require('../lib/resolver');

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
      console.log(chalk.red('Aborted!'));
      return;
    }

    
  } catch (err) {
    console.log(chalk.red(`Error: ${err}`));
  }
};

run();
