import Ember from 'ember';

export function isStrokeLengthRequiredAndSet(instrument) {    

    let type = instrument[0].get('instrumentTypeID');
    let stroke = instrument[0].get('strokeLength');

    //console.log(stroke);

    switch(type) {
        case 1:
        case 2:
        case 4:
        case 5:
            if (stroke === null || stroke === 0) {
                return false;
            } else {
                return true;
            }
            break;
        default:
            return true;
    }
}

export default Ember.Helper.helper(isStrokeLengthRequiredAndSet);
