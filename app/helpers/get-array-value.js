import Ember from 'ember';

export function getArrayValue(array, idx) {
  try {
    console.log(array);
    console.log(idx);
    return array[idx];
  } catch {
    return false;
  }
}
 

export default Ember.Helper.helper(getArrayValue);
