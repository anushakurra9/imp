'use strict';

module.exports = {
    //TODO: should I be validating any more than this?
    validate: function(cartridge) {//item.metadata
        if (!cartridge
            || !cartridge.name
            || !cartridge.grade
            || !cartridge.subject) 
        {
            return null
        }
        let ret = cartridge
        return ret;
    }
}