import DS from 'ember-data';

export default DS.Model.extend({
    isValid: DS.attr('boolean'),
    withinLimit: DS.attr('boolean'),
    companyName: DS.attr('string'),
    modules: DS.attr()
});
