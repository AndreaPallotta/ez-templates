const process = require('process');
const cp = require('child_process');
const chalk = require('chalk');
const path = require('path');
const { MANAGERS } = require('./constants');

const getScriptExtension = () => {
  console.log(chalk.green(`OS detected: ${process.platform}`));
  if (process.platform === 'android') {
    throw new Error('Android is not supported');
  }
  if (process.platform === 'win32') {
    console.log(chalk.green(`Trying to execute batch setup script`));
    return 'bat';
  }
  console.log(chalk.green(`Trying to execute bash setup script`));
  return 'sh';
};

const installJsDependencies = (path, type) => {
  if (!path) throw new Error('Path not specified');
  const originalPath = process.cwd();
  process.chdir(path);
  cp.execSync(`${type} install --silent`, {
    stdio: [0, 1, 2],
  });
  process.chdir(originalPath);
};

const installMixDependencies = (path) => {
  if (!path) throw new Error('Path not specified');
  const originalPath = process.cwd();
  process.chdir(path);
  cp.execSync('mix deps.get --quiet', {
    stdio: [0, 1, 2],
  });
  process.chdir(originalPath);
};

const installCargoDependencies = (path) => {
  if (!path) throw new Error('path not specified');
  const originalPath = process.cwd();
  process.chdir(path);
  cp.execSync('cargo build --quiet', {
    stdio: [0, 1, 2],
  });
  process.chdir(originalPath);
};

const runSetupScript = (pathName, ext) => {
  try {
    const file = require.resolve(`${pathName}/setup/env-gen.${ext}`);

    if (file) {
      console.log(chalk.magenta('Running setup script...'));
      cp.execSync(`${file} ${path.join(pathName, '.env')}`, {
        stdio: [0, 1, 2],
      });
    }
  } catch {
    console.log(chalk.blue('Setup file not found. Skipping...'));
  }
};

module.exports = (template, path, manager) => {
  console.log(chalk.magenta.bold(`Setting up template ${template}`));
  try {
    console.log(chalk.magenta(`Installing ${manager} dependencies...`));
    switch (manager) {
      case (MANAGERS.NPM, MANAGERS.YARN):
        installJsDependencies(path, manager);
        break;
      case MANAGERS.MIX:
        installMixDependencies(path);
        break;
      case MANAGERS.CARGO:
        installCargoDependencies(path);
        break;
      default:
        throw new Error('Unknown package manager');
    }
    runSetupScript(path, getScriptExtension());
  } catch (err) {
    throw new Error(err.message);
  }
};
