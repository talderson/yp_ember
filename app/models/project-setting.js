import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr('string'),
    isRequired: DS.attr('boolean'),
    defaultValue: DS.attr('string'),
    value: DS.attr('string'),
    valueType: DS.attr('string')
});
