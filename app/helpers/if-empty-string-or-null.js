import Ember from 'ember';

export function ifEmptyStringOrNull(params/*, hash*/) {
    if (typeof params[0] !== undefined) {
        if (params[0] === null || params[0] === '' || params[0] === ' ') {
            return true;
        }
    }
}

export default Ember.Helper.helper(ifEmptyStringOrNull);
