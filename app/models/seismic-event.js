import DS from 'ember-data';

export default DS.Model.extend({
    timestamp: DS.attr('string', {defaultValue: ""}),
    location: DS.attr('string', {defaultValue: ""}),
    east: DS.attr('number', {defaultValue: null}),
    north: DS.attr('number', {defaultValue: null}),
    depth: DS.attr('number', {defaultValue: null}),
    comments: DS.attr('string', {defaultValue: ""}),
    isVisible: DS.attr('boolean', {defaultValue: true}),
    momentMagnitude: DS.attr('number', {defaultValue: 0}),
    seismicMoment: DS.attr('number', {defaultValue: 0}),
    sourceRadius: DS.attr('number', {defaultValue: 0}),
    peakParticleVelocity: DS.attr('number', {defaultValue: 0}),
    peakParticleAcceleration: DS.attr('number', {defaultValue: 0}),
    energy: DS.attr('number', {defaultValue: 0}),
    size: DS.attr('number', null),
    seismicType: DS.belongsTo('seismic-type', { async: false })
});
