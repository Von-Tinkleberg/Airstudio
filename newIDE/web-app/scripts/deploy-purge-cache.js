const shell = require('shelljs');
const axios = require('axios');
const args = require('minimist')(process.argv.slice(2));

if (!args['cf-zoneid'] || !args['cf-token']) {
  shell.echo(
    'âŒ You must pass --cf-zoneid, --cf-token to purge the CloudFare cache.'
  );
  shell.exit(1);
}

shell.echo('â„¹ï¸ Purging Cloudflare cache...');

const zoneId = args['cf-zoneid'];
const purgeCacheUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`;

axios
  .post(
    purgeCacheUrl,
    {
      files: [
        // Update index.html:
        'https://editor.AirStudio.io/',
        'https://editor.AirStudio.io/index.html',
        // Purge service worker (otherwise old service worker will serve the old index.html):
        'https://editor.AirStudio.io/service-worker.js',
        // Purge libGD.js to avoid incompatibilities:
        'https://editor.AirStudio.io/libGD.js',
        'https://editor.AirStudio.io/libGD.mem',
        // Purge other files:
        'https://editor.AirStudio.io/manifest.json',
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${args['cf-token']}`,
        'Content-Type': 'application/json',
      },
    }
  )
  .then(response => response.data)
  .then(() => {
    shell.echo('âœ… Cache purge done.');
  })
  .catch(error => {
    shell.echo('âŒ Error while requesting cache purge (are your identifiers correct?)');
    shell.echo(error.message || '(unknown error)');
    shell.exit(1);
  });
