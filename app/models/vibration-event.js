import DS from 'ember-data';

export default DS.Model.extend({
    timestamp: DS.attr('string', {defaultValue: ""}),
    instrument: DS.attr('string', {defaultValue: ""}),
    frequency: DS.attr('number', {defaultValue: null}),
    amplitude: DS.attr('number', {defaultValue: null}),
    ppv: DS.attr('number', {defaultValue: null}),
    ppa: DS.attr('number', {defaultValue: null}),
    duration: DS.attr('number', {defaultValue: null}),
});
