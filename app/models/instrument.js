import DS from 'ember-data';

export default DS.Model.extend({
    channelsNum: DS.attr(),
    portsNum: DS.attr(),
    name: DS.attr('text'),
    zeroTimestamp: DS.attr(),
    project: DS.attr('text'),
    location: DS.attr('text'),
    east: DS.attr('number'),
    north: DS.attr('number'),
    depth: DS.attr('number'),
    azimuth: DS.attr('text'),
    dip: DS.attr('text'),
    level: DS.attr('text'),
    borehole: DS.attr('text'),
    installDate: DS.attr(),
    installedBy: DS.attr('text'),
    purpose: DS.attr('text'),
    notes: DS.attr('text'),
    anchorCount: DS.attr('digits'),
    anchors: DS.hasMany('anchor', {async: true}),
    vwproperty: DS.hasMany('vwproperty', {async: false}),
    headAt: DS.belongsTo('head-at', {async: false}),
    instrumentType: DS.belongsTo('instrument-type', {async: false}),
    alerts: DS.hasMany('alert', {async: false}),
    instrumentTypeID: DS.attr(),
    instrumentStiffness: DS.attr('digits'),
    instrumentLength: DS.attr('digits'),
    strokeLength: DS.attr('digits'),
    headExclusionLength: DS.attr('digits'),
    gaugeLength: DS.attr('digits'),
    referenceAnchor: DS.attr('text'),
    bulbed: DS.attr('boolean'),
    plated: DS.attr('boolean'),
    stacked: DS.attr('boolean'),
    active: DS.attr('boolean'),
    elasticLimitPct: DS.attr('digits'),
    plasticLimitPct: DS.attr('digits'),
    ultimateLimitPct: DS.attr('digits'),
    elasticLimitFce: DS.attr('digits'),
    plasticLimitFce: DS.attr('digits'),
    ultimateLimitFce: DS.attr('digits'),
});
