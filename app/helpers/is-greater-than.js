import Ember from 'ember';

export function isGreaterThan(params) {
    if (params[0] && params[1]) {
        return params[0] > params[1];
    }
}

export default Ember.Helper.helper(isGreaterThan);
