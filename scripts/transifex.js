// Run this script via: npm run languages

const fs = require('fs');

const request = require('request').defaults({maxSockets: 1});
const transifexApi = require('@transifex/api').transifexApi;

const languages = require(`${__dirname}/../languages.js`);

// Transifex doesn't allow anonymous downloading
// but needs authentication via username and bearer token
// https://developers.transifex.com/reference/api-authentication
//
// auth is stored in ./transifex.auth as json object
//  {
//      "token": "1/0b4e75552e481aeae813aebad53f3de3fcc67ccd"
//  }
const auth = JSON.parse(fs.readFileSync('./transifex.auth', 'utf8'));
if (!auth.token) throw 'invalid transifex.auth';
transifexApi.setup({auth: auth.token});

(async function() {
    const organization = await transifexApi.Organization.get({slug: 'project-osrm'});
    const projects = await organization.fetch('projects');
    const project = await projects.get({slug: 'osrm-text-instructions'});
    const resources = await project.fetch('resources');
    const resource = await resources.get({slug: 'enjson'});

    languages.supportedCodes.forEach(async (code) => {
        // no need to download english
        if (code === 'en') return;

        // Download from Transifex
        const language = await transifexApi.Language.get({code: code.replace(/-(\w\w)$/g, '_$1')});
        const url = await transifexApi.ResourceTranslationsAsyncDownload.download({
            resource,
            language
        });
        const options = {
            uri: url,
            json: true
        };
        request.get(options, (err, resp, body) => {
            if (err) throw err;
            let content = body;

            // Apply language-specific overrides
            const override = `${__dirname}/../languages/overrides/${code}.js`;
            if (fs.existsSync(override)) {
                content = require(override)(content);
            }

            // Write language file
            fs.writeFileSync(`${__dirname}/../languages/translations/${code}.json`, JSON.stringify(content, null, 4) + '\n');
        });
    });
}());
