'use strict';
module.exports = {
    validate: function(coursesection) {//item.metadata
        if (!coursesection
            || !coursesection.name
            || !coursesection.subject
            || !coursesection.grade) 
        {
            return null
        }

        return coursesection;
    }
}