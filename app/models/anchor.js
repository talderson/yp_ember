import DS from 'ember-data';

export default DS.Model.extend({
    number: DS.attr('number'),
    distance: DS.attr('number'),
    instrument: DS.belongsTo('instrument')
});
