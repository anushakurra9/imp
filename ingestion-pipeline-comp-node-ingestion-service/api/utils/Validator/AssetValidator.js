'use strict';

module.exports = {
    //TODO: should I be validating any more than this?
    validate: function(asset) {//item.metadata
        if (asset
            && asset.name
            && asset.contentTypeValue
            && asset.fileType
            ) 
        {
            return asset
        }
        return null;
    }
}