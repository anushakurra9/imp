'use strict';
module.exports = {
    validate: function(user) {//item.metadata
        if (!user
            || !user.username
            || !user.email) 
        {
            return null
        }

        return user;
    }
}