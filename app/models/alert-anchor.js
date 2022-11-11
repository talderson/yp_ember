import DS from 'ember-data';

export default DS.Model.extend({
    selectedCh: DS.attr('string'),
    alert: DS.belongsTo('alert')
});
