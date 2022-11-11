import DS from 'ember-data';

export default DS.Model.extend({
    instrument: DS.attr('string'),
    hasTemp: DS.attr('boolean'),
    units: DS.attr('string'),
    temporalDisplacementName: DS.attr('string'),
    temporalVelocityName: DS.attr(),
    temporalAccelerationName: DS.attr(),
    temporalStrainName: DS.attr(),
    temporalStrainRateName: DS.attr(),
    temporalLoadName: DS.attr(),
    spatialDisplacementName: DS.attr(),
    spatialVelocityName: DS.attr(),
    spatialAccelerationName: DS.attr(),
    spatialStrainName: DS.attr(),
    spatialStrainRateName: DS.attr(),
    spatialLoadName: DS.attr()
});
