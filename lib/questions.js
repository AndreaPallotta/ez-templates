const process = require('process');
const inquirer = require('inquirer');
const isValid = require('is-valid-path');
const templates = require('./defaults');

module.exports = {
  askTemplate: () => {
    return inquirer.prompt([
      {
        type: 'checkbox',
        name: 'templates',
        message: 'Select Template(s) to clone',
        choices: Object.keys(templates),
        default: [],
        validate: (input) => {
          if (input.length) return true;
          return 'Please select at least one framework';
        },
      },
    ]);
  },
  askManager: (template, managers) => {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'manager',
        message: `Select Package Manager for ${template}`,
        choices: managers,
        default: managers[0],
      },
    ]);
  },
  askFolderName: (templateName, defaultDirName) => {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'folder',
        message: `Enter Folder Name for '${templateName}' Template`,
        default: defaultDirName,
        validate: (input) => {
          if (input.length) return true;
          return 'Please enter a folder name';
        },
      },
    ]);
  },
  askPath: (templateName) => {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'path',
        message: `Enter Path for ${templateName} (Only include up to parent folder)`,
        default: `${process.cwd()}`,
        validate: (input) => {
          if (!input.length) return 'Path cannot be empty';
          if (!isValid(input)) return 'Please enter a valid path';
          return true;
        },
      },
    ]);
  },
  askConfirm: () => {
    return inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Is the configuration correct?',
        default: true,
      },
    ]);
  },
};
