const degit = require('degit');
const chalk = require('chalk');

module.exports = (templateName, subrepo, path) => {
  const emitter = degit(`AndreaPallotta/Templates/${subrepo}`);

  emitter
    .clone(path)
    .then(() => {
      console.log(
        chalk.green(
          `✅ Successfully cloned ${templateName} template to ${path}!`
        )
      );
    })
    .catch((err) => {
      console.error(
        chalk.red(
          chalk.red(
            `❌ Error cloning ${templateName} template to ${path}: ${err}`
          )
        )
      );
      process.exit(1);
    });
};
