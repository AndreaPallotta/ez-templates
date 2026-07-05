#!/usr/bin/env node

const process = require('process');
const { parseArgs } = require('node:util');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const questions = require('../lib/questions');
const defaults = require('../lib/defaults');
const resolvePath = require('../lib/resolver');
const cloneRepo = require('../lib/repo');
const setup = require('../lib/setup');

// Parse args first
let values;
try {
  const parsed = parseArgs({
    options: {
      template: { type: 'string', short: 't', multiple: true },
      name: { type: 'string', short: 'n', multiple: true },
      path: { type: 'string', short: 'p' },
      manager: { type: 'string', short: 'm', multiple: true },
      yes: { type: 'boolean', short: 'y' },
      help: { type: 'boolean', short: 'h' },
      version: { type: 'boolean', short: 'v' },
    },
    allowPositionals: true,
  });
  values = parsed.values;
} catch (err) {
  console.error(chalk.red(`Error parsing arguments: ${err.message}`));
  console.log(`Run 'ezp --help' to see usage.`);
  process.exit(1);
}

if (values.help) {
  console.log(`
Usage: ezp [options]

Options:
  -t, --template <name>   Template(s) to clone (Express, Socket.io, Elixir, ReactJS + MUI, Rust + Axum)
                          Aliases: express, socket, elixir, react, rust
  -n, --name <name>       Custom folder name(s) for the cloned templates
  -p, --path <path>       Target parent directory path (default: current directory)
  -m, --manager <name>    Package manager to use (npm, yarn, mix, cargo)
  -y, --yes               Skip confirmation and use defaults for missing values
  -h, --help              Show help information
  -v, --version           Show version information

Examples:
  ezp -t express -y
  ezp -t express -t react -p ./my-workspace
  ezp --template express --name my-server --manager npm --yes
  `);
  process.exit(0);
}

if (values.version) {
  const pkg = require('../package.json');
  console.log(`ez-templates v${pkg.version}`);
  process.exit(0);
}

clear();

console.log(chalk.yellow(figlet.textSync('Ez-Templates')));

const getCanonicalTemplate = (input) => {
  const normalized = input.toLowerCase().replace(/[^a-z0-9]/g, '');
  const mapping = {
    express: 'Express',
    socketio: 'Socket.io',
    socket: 'Socket.io',
    elixir: 'Elixir',
    react: 'ReactJS + MUI',
    reactjs: 'ReactJS + MUI',
    rust: 'Rust + Axum',
    axum: 'Rust + Axum',
    go: 'Go HTTP API',
    golang: 'Go HTTP API',
  };
  if (mapping[normalized]) {
    return mapping[normalized];
  }
  // Try case-insensitive matching against keys
  const match = Object.keys(defaults).find(
    (key) => key.toLowerCase() === input.toLowerCase()
  );
  return match || null;
};

const run = async () => {
  const res = [];

  try {
    let inputTemplates = [];
    if (values.template) {
      for (const t of values.template) {
        const split = t.split(',').map((x) => x.trim()).filter(Boolean);
        inputTemplates.push(...split);
      }
    }

    let inputNames = [];
    if (values.name) {
      for (const n of values.name) {
        const split = n.split(',').map((x) => x.trim()).filter(Boolean);
        inputNames.push(...split);
      }
    }

    let inputManagers = [];
    if (values.manager) {
      for (const m of values.manager) {
        const split = m.split(',').map((x) => x.trim()).filter(Boolean);
        inputManagers.push(...split);
      }
    }

    const templatesToClone = [];
    for (const raw of inputTemplates) {
      const canonical = getCanonicalTemplate(raw);
      if (canonical) {
        templatesToClone.push(canonical);
      } else {
        console.error(chalk.red(`Error: Unknown template '${raw}'`));
        console.error(chalk.yellow(`Available templates: ${Object.keys(defaults).join(', ')}`));
        process.exit(1);
      }
    }

    let templates = templatesToClone;
    if (templates.length === 0) {
      const answer = await questions.askTemplate();
      templates = answer.templates;
      console.log();
    }

    let i = 0;
    for (const template of templates) {
      const { defaultName, subrepo, managers } = defaults[template];

      let manager = '';
      if (inputManagers[i]) {
        const selected = inputManagers[i].toLowerCase();
        if (managers.includes(selected)) {
          manager = selected;
        } else {
          console.error(chalk.red(`Error: Package manager '${selected}' is not supported for template '${template}'.`));
          console.error(chalk.yellow(`Supported managers: ${managers.join(', ')}`));
          process.exit(1);
        }
      } else if (managers?.length === 1) {
        manager = managers[0];
      } else if (values.yes) {
        manager = managers[0];
      } else {
        const answer = await questions.askManager(template, managers);
        manager = answer.manager;
        console.log();
      }

      let folder = '';
      if (inputNames[i]) {
        folder = inputNames[i];
      } else if (values.yes) {
        folder = defaultName ?? '';
      } else {
        const answer = await questions.askFolderName(
          template,
          defaultName ?? ''
        );
        folder = answer.folder;
        console.log();
      }

      let targetPath = '';
      if (values.path) {
        targetPath = values.path;
      } else if (values.yes) {
        targetPath = process.cwd();
      } else {
        const answer = await questions.askPath(template);
        targetPath = answer.path;
        console.log();
      }

      res.push({
        template: template,
        folder_name: folder,
        subrepo: subrepo,
        path: resolvePath(targetPath, folder),
        manager: manager ?? '',
      });
      i++;
    }

    console.table(res);

    let confirm = false;
    if (values.yes) {
      confirm = true;
    } else {
      const answer = await questions.askConfirm();
      confirm = answer.confirm;
      console.log();
    }

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
