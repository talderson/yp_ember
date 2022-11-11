import Ember from 'ember';

export function isInstrumentAnchorsSet([instrumentAnchors]) {

    let instrumentAnchorsDistances = instrumentAnchors.map(function(obj){
        return obj.get('distance') !== '' && obj.get('distance') !== null;
    });

    if (instrumentAnchorsDistances.indexOf(false) > -1 || instrumentAnchorsDistances.length === 0) {
        return false;
    } else {
        return true;
    }
}

export default Ember.Helper.helper(isInstrumentAnchorsSet);
