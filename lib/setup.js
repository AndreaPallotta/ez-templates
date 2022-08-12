const process = require('process');
const cp = require('child_process');
const chalk = require('chalk');
const path = require('path');

const getScriptExtension = () => {
  console.log(chalk.green(`OS detected: ${process.platform}`));
  if (process.platform === 'android') {
    throw new Error('Android is not supported');
  }
  if (process.platform === 'win32') {
    console.log(chalk.green(`Executing setup batch script`));
    return 'bat';
  }
  console.log(chalk.green(`Executing setup bash script`));
  return 'sh';
};

const installNpmDependencies = (path) => {
  if (!path) throw new Error('Path not specified');
  const originalPath = process.cwd();
  process.chdir(path);
  cp.execSync('npm install', {
    stdio: [0, 1, 2],
  });
  process.chdir(originalPath);
};

const installMixDependencies = (path) => {
  if (!path) throw new Error('Path not specified');
  const originalPath = process.cwd();
  process.chdir(path);
  cp.execSync('mix deps.get', {
    stdio: [0, 1, 2],
  });
  process.chdir(originalPath);
};

const runSetupScript = (pathName, ext) => {
  if (!path) throw new Error('Path not specified');
  if (!ext) throw new Error('Extension not specified');

  const file = require.resolve(`${pathName}/setup/env-gen.${ext}`);

  if (!file) throw new Error('Setup file not found. Skipping...');

  cp.execSync(`${file} ${path.join(pathName, '.env')}`, { stdio: [0, 1, 2] });
};

module.exports = (template, path, type, useSetupScript = false) => {
  console.log(chalk.magenta.bold(`Setting up template ${template}`));
  try {
    if (type === 'npm') {
      console.log(chalk.magenta('Installing npm dependencies...'));
      installNpmDependencies(path);
    }
    if (type === 'elixir') {
      console.log(chalk.magenta('Installing mix dependencies...'));
      installMixDependencies(path);
    }
    if (useSetupScript) {
      console.log(chalk.magenta('Running setup script...'));
      const ext = getScriptExtension();
      runSetupScript(path, ext);
    }

    console.log(chalk.green.bold(`Successfully setup ${template} template!`));
  } catch (err) {
    throw new Error(`Error setting up template: ${err.message}`);
  }
};
