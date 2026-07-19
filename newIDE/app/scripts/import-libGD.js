const shell = require('shelljs');
const path = require('path');

const sourceDirectory = '../../../Binaries/embuild/GDevelop.js';
const destinationTestDirectory = '../node_modules/libGD.js-for-tests-only';

if (shell.mkdir('-p', destinationTestDirectory).stderr) {
  shell.echo('❌ Error while creating node_modules folder for libGD.js');
}

if (shell.test('-f', path.join(sourceDirectory, 'libGD.js'))) {
  shell.echo(
    'ℹ️  Copying libGD.js and associated files built locally to newIDE...'
  );
  const copyToNewIDEScriptPath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'GDevelop.js',
    'scripts',
    'copy-to-newIDE.js'
  );
  shell.exec(`node ${copyToNewIDEScriptPath}`);
} else {
  // Using pre-committed libGD.js and libGD.wasm from the repo.
  if (
    !shell.test('-f', '../public/libGD.js') ||
    !shell.test('-f', '../public/libGD.wasm')
  ) {
    shell.echo(
      '❌ libGD.js or libGD.wasm not found in public/. They are committed in the repo as part of AirStudio.'
    );
    shell.exit(1);
    return;
  }

  shell.echo('ℹ️  Using pre-committed libGD.js and libGD.wasm from the repo.');
  if (
    !shell.cp('../public/libGD.js', destinationTestDirectory + '/index.js')
      .stderr &&
    !shell.cp(
      '../public/libGD.wasm',
      destinationTestDirectory + '/libGD.wasm'
    ).stderr
  ) {
    shell.echo('✅ Copied libGD.js to node_modules folder');
  } else {
    shell.echo('❌ Error while copying libGD.js to node_modules folder');
  }
}
