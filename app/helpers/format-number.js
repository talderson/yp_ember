import Ember from 'ember';

export function formatNumber(params) {
    return parseFloat(params[0]).toFixed(params[1]);
}

export default Ember.Helper.helper(formatNumber);
