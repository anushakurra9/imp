'use strict';
/**
 * Created by manikkakar on 2/21/17.
 */

module.exports = {
  getKeys: function(arr, keyPath) {
    var ret = []

    arr.forEach(function(element) {
      ret[ret.length] = element[keyPath]
    })

    return ret
  },
  dictionarize: function(arr, keyPath) {
    var ret = {}
    arr.forEach(function(element) {
      if (element && element[keyPath]) {
        ret[element[keyPath]] = element
      }
    })

    return ret
  },
  dictionarizeAsList: function(arr, keyPath) {
    var ret = {}
    arr.forEach(function(element) {
      let key = element[keyPath]
      if (!ret[key]) {
          ret[key] = []
      }
      let collection = ret[key]
      collection[collection.length] = element      
    })

    return ret
  },

  mergeDictionary: function(from, to) {
    if (!from || !to) {
        return
    }

    for (var key in from) {
        let p = from[key]
        if (p) {
            to[key] = p
        }
    }
}
}
