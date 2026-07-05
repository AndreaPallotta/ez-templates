const process = require('process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

module.exports = (templateName, subrepo, targetPath) => {
  return new Promise((resolve) => {
    try {
      const sourcePath = path.join(__dirname, '..', 'templates', subrepo);

      if (!fs.existsSync(sourcePath)) {
        throw new Error(`Template source folder not found: ${sourcePath}`);
      }

      // Ensure target folder exists
      fs.mkdirSync(targetPath, { recursive: true });

      // Copy template files recursively
      fs.cpSync(sourcePath, targetPath, { recursive: true });

      console.log(
        chalk.green(
          `✅ Successfully cloned ${templateName} template to ${targetPath}!`
        )
      );
      resolve();
    } catch (err) {
      console.error(
        chalk.red(
          `❌ Error cloning ${templateName} template to ${targetPath}: ${err.message}`
        )
      );
      process.exit(1);
    }
  });
};
