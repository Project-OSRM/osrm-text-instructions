module.exports = function(content) {
    content.meta.capitalizeFirstLetter = false;

    delete content.v5.continue.straight;
    delete content.v5.continue['slight left'];
    delete content.v5.continue['slight right'];

    delete content.v5.fork['slight left'];
    delete content.v5.fork['slight right'];
    delete content.v5.fork['sharp left'];
    delete content.v5.fork['sharp right'];

    delete content.v5.merge['slight left'];
    delete content.v5.merge['slight right'];
    delete content.v5.merge['sharp left'];
    delete content.v5.merge['sharp right'];

    delete content.v5['new name']['slight left'];
    delete content.v5['new name']['slight right'];
    delete content.v5['new name']['sharp left'];
    delete content.v5['new name']['sharp right'];

    delete content.v5['off ramp']['slight left'];
    delete content.v5['off ramp']['slight right'];
    delete content.v5['off ramp']['sharp left'];
    delete content.v5['off ramp']['sharp right'];

    delete content.v5['on ramp']['slight left'];
    delete content.v5['on ramp']['slight right'];
    delete content.v5['on ramp']['sharp left'];
    delete content.v5['on ramp']['sharp right'];

    return content;
};
