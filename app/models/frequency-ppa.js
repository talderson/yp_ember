import DS from 'ember-data';

export default DS.Model.extend({
    frequency: DS.attr(),
    values: DS.attr()
});
