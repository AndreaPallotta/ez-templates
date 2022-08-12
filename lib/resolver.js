const path = require('path');

module.exports = (pathName, folderName) => {
  return path.join(pathName, folderName);
};
