const test = require('node:test');
const assert = require('node:assert');
const cp = require('node:child_process');
const path = require('node:path');

const cliPath = path.join(__dirname, '..', 'bin', 'cli.js');

test('CLI --help outputs usage instructions', () => {
  const result = cp.execSync(`node "${cliPath}" --help`).toString();
  assert.match(result, /Usage: ezp \[options\]/);
  assert.match(result, /-t, --template <name>/);
  assert.match(result, /-y, --yes/);
});

test('CLI -h outputs usage instructions', () => {
  const result = cp.execSync(`node "${cliPath}" -h`).toString();
  assert.match(result, /Usage: ezp \[options\]/);
});

test('CLI --version outputs current version', () => {
  const result = cp.execSync(`node "${cliPath}" --version`).toString();
  const pkg = require('../package.json');
  assert.strictEqual(result.trim(), `ez-templates v${pkg.version}`);
});

test('CLI -v outputs current version', () => {
  const result = cp.execSync(`node "${cliPath}" -v`).toString();
  const pkg = require('../package.json');
  assert.strictEqual(result.trim(), `ez-templates v${pkg.version}`);
});

test('CLI handles unknown template and exits with error code 1', () => {
  let errorCaught = null;
  try {
    cp.execSync(`node "${cliPath}" -t non_existent_template`, { stdio: 'pipe' });
  } catch (err) {
    errorCaught = err;
  }
  
  assert.notStrictEqual(errorCaught, null);
  assert.strictEqual(errorCaught.status, 1);
  assert.match(errorCaught.stderr.toString(), /Error: Unknown template 'non_existent_template'/);
});

test('CLI handles invalid package manager and exits with error code 1', () => {
  let errorCaught = null;
  try {
    // Express only supports npm/yarn. Setting cargo should fail.
    cp.execSync(`node "${cliPath}" -t express -m cargo`, { stdio: 'pipe' });
  } catch (err) {
    errorCaught = err;
  }

  assert.notStrictEqual(errorCaught, null);
  assert.strictEqual(errorCaught.status, 1);
  assert.match(errorCaught.stderr.toString(), /Error: Package manager 'cargo' is not supported for template 'Express'/);
});

test('CLI successfully copies template locally and runs setup', () => {
  const fs = require('fs');
  const targetDir = path.join(__dirname, '..', 'test-out-temp');
  
  // Clean up if it somehow existed
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }

  try {
    const result = cp.execSync(`node "${cliPath}" -t express -n test-app -p "${targetDir}" -y`).toString();
    
    assert.match(result, /Successfully cloned Express/);
    assert.ok(fs.existsSync(path.join(targetDir, 'test-app', 'package.json')));
    assert.ok(fs.existsSync(path.join(targetDir, 'test-app', 'tsconfig.json')));
    assert.ok(fs.existsSync(path.join(targetDir, 'test-app', 'server.ts')));
  } finally {
    // Clean up
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
  }
});
