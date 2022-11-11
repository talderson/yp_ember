import Ember from 'ember';

export function range(values) {
    var start = values[0];
    var count = values[1];
  
    var ret = [];
    for(var i = 0; i < count; i++) {
      ret.push(i+start);
    }
    return ret;
}

export default Ember.Helper.helper(range);
