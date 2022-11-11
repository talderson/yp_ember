import DS from 'ember-data';

export default DS.Model.extend({
    isValidKey: DS.attr('boolean'),
    startDate: DS.attr('string'),
    endDate: DS.attr('string'),
    numInst: DS.attr('number'),
    softwareVersion: DS.attr('string'),
    companyName: DS.attr('string'),
    modules: DS.attr()
});
