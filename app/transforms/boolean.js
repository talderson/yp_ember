import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    return serialized; //do nothing
  },

  serialize(deserialized) {
    if(deserialized == null) {
      deserialized = false;
    }
    return deserialized; // returns value or null
  }
});