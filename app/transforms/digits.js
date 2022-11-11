import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    return serialized; //do nothing
  },

  serialize(deserialized) {
    if(deserialized === "") {
      deserialized = null;
    }
    return deserialized; // returns value or null
  }
});