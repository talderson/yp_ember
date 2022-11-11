import Ember from 'ember';

export function activeClass([val]) {
    if (val) {
        return 'active';
    }
}

export default Ember.Helper.helper(activeClass);
