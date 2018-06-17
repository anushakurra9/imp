'use strict';
module.exports = {
    validate: function(school) {//item.metadata
        if (!school
            || !school.name
            || !school.saId
            || !school.countryCode) 
        {
            return null
        }

        let ret = {
            name: school.name,
            saId: school.saId,
            countryCode: school.countryCode
        }
        if (school.externalRef && school.externalRef.length > 0) {
            ret.externalRef = school.externalRef
        }

        if (school.products && school.products.length > 0) {
            ret.products = school.products
        }

        return ret;
    }
}