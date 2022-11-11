import DS from 'ember-data';

export default DS.Model.extend({
    isPerm: DS.attr('boolean'),
    isActive: DS.attr('boolean'),
    isTriggered: DS.attr('boolean'),
    isHandled: DS.attr('boolean'),
    repeats: DS.attr('boolean'),
    repeatWindow: DS.attr('number'),
    initTriggerStamp: DS.attr(),
    handleStamp: DS.attr(),
    metric: DS.attr('string'),
    direction: DS.attr('string'),
    value: DS.attr('number'),
    severity: DS.attr('string'),
    response: DS.attr('string'),
    target: DS.attr('string'),
    inverted: DS.attr('boolean'),
    refAnchor: DS.attr('string'),
    message: DS.attr('string'),
    windowType: DS.attr('string'),
    windowLength: DS.attr('number'),
    method: DS.attr('string'),
    creator: DS.attr('string'),
    creationDate: DS.attr(),
    lastStamp: DS.attr(),
    instrument: DS.belongsTo('instrument', {async: true}),
    anchors: DS.hasMany('alertAnchor', {async: false})
});
