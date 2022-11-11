import DS from 'ember-data';

export default DS.Model.extend({
    active: DS.attr('number'),
    inactive: DS.attr('number'),
    total: DS.attr('number'),
    alert: DS.attr('number')
});
