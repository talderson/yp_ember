import DS from 'ember-data';

export default DS.Model.extend({
    timestamp: DS.attr('string', {defaultValue: ""}),
    location: DS.attr('string', {defaultValue: ""}),
    east: DS.attr('number', {defaultValue: null}),
    north: DS.attr('number', {defaultValue: null}),
    depth: DS.attr('number', {defaultValue: null}),
    comments: DS.attr('string', {defaultValue: ""}),
    isVisible: DS.attr('boolean', {defaultValue: true}),
    delay: DS.attr('string', {defaultValue: 0}),
    level: DS.attr('string', {defaultValue: ""}),
    stope: DS.attr('string', {defaultValue: ""}),
    tonnes: DS.attr('number', {defaultValue: 0}),
    size: DS.attr('number', null),
    blastType: DS.belongsTo('blast-type', { async: false })
});
