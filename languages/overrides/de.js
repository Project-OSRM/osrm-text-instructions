module.exports = function(content) {
    content.meta.capitalizeFirstLetter = true;

    // No special handling needed in German for this one
    delete content.v5.continue.straight;

    return content;
};
