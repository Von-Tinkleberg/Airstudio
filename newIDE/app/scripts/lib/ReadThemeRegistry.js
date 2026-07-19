const path = require('path');
const fs = require('fs');
const dir = path.resolve(__dirname, '../../src/UI/Theme/');

function matchAll(pattern, input) {
  return input
    .match(new RegExp(pattern, 'g'))
    .map(index => index.match(new RegExp(pattern)));
}

module.exports = () => {
  const registryFileContents = fs.readFileSync(path.resolve(dir, './ThemeRegistry.js')).toString();

  const pattern = /(?:'(.*?)'|\['(.*?)'\]|(\w+(?:\s+\w+)*))\s*:\s*(.*?),/g;
  const matches = [];
  let match;
  while ((match = pattern.exec(registryFileContents)) !== null) {
    matches.push({
      name: match[1] || match[2] || match[3],
      id: match[4],
    });
  }
  return matches;
};
