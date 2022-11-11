import Ember from 'ember';

export function getArrayElement(params/*, hash*/) {
  if (params[0] && typeof params[1] !== undefined) {
        let index = params[1];
        return params[0][ index ];
    }
}

export default Ember.Helper.helper(getArrayElement);
