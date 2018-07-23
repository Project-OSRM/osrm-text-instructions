// Run this script via: npm run languages

var fs = require('fs');

var request = require('request').defaults({maxSockets: 1});

var languages = require(`${__dirname}/../languages.js`);

// Transifex doesn't allow anonymous downloading
// but needs authentication via username and password
// http://docs.transifex.com/api/#authentication
//
// auth is stored in ./transifex.auth as json object
//  {
//      "user": "username",
//      "pass": "password"
//  }
var auth = JSON.parse(fs.readFileSync('./transifex.auth', 'utf8'));
if (!auth.user || !auth.pass) throw 'invalid transifex.auth';

var urls = {};
urls.api = 'https://www.transifex.com/api/2';
urls.project = 'project/osrm-text-instructions';
urls.translation = `${urls.api}/${urls.project}/resource/enjson/translation`;

function writeLocalization(code, content) {
    // Apply language-specific overrides
    var output = content;
    var override = `${__dirname}/../languages/overrides/${code}.js`;
    if (fs.existsSync(override)) {
        output = require(override)(output);
    }

    // Write language file
    fs.writeFileSync(`${__dirname}/../languages/translations/${code}.json`, JSON.stringify(output, null, 4) + '\n');
}

// American English is derived from the base English localization, not a
// localization on Transifex.
var baseContent = JSON.parse(fs.readFileSync(`${__dirname}/../languages/translations/en.json`));
writeLocalization('en-US', baseContent);

languages.supportedCodes.forEach((code) => {
    // no need to download english
    if (code === 'en' || code === 'en-US') return;

    // Download from Transifex
    request.get(`${urls.translation}/${code}`, {auth: auth}, (err, resp, body) => {
        if (err) throw err;
        var content = JSON.parse(JSON.parse(body).content);
        writeLocalization(code, content);
    });
});
