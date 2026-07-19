const shell = require('shelljs');
const path = require('path');

let versionMetadata = null;
try {
  versionMetadata = require('../../app/src/Version/VersionMetadata');
} catch (e) {
  shell.echo(
    'âŒ Unable to find VersionMetadata.js in newIDE/app/src/Version - have you run npm install?'
  );
  shell.exit(1);
}

// The path containing GDJS Runtime *and* extensions
const gdjsFolder = path.join(__dirname, '../../app/resources/GDJS');
const destination = `s3://resources.AirStudio-app.com/GDJS-${versionMetadata.versionWithHash}`;

shell.echo('â„¹ï¸ Uploading GDJS Runtime (with extensions) to resources.AirStudio-app.com...');
const output = shell.exec(
  `aws s3 sync ${gdjsFolder} ${destination} --acl public-read`
);
if (output.code !== 0) {
  shell.echo(
    'âŒ Unable to upload GDJS Runtime (with extensions) to resources.AirStudio-app.com. Error is:'
  );
  shell.echo(output.stdout);
  shell.echo(output.stderr);
  shell.exit(output.code);
}

shell.echo('âœ… Upload finished');
