import DS from 'ember-data';

export default DS.Model.extend({
    port: DS.attr('number'),
    tempChan: DS.attr(),
    serial: DS.attr(),
    calcCoef1: DS.attr('number'),
    calcCoef2: DS.attr('number'),
    calcCoef3: DS.attr('number'),
    calcCoef4: DS.attr('number'),
    calcCoef5: DS.attr('number'),
    calcCoef6: DS.attr('number'),
    calcCoef7: DS.attr('number'),
    calcCoef8: DS.attr('number'),
    instrument: DS.belongsTo('instrument', {async: false}),
    vwmodel: DS.belongsTo('vwmodel', {async: true})
});
