import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr(),
    seismicEvent: DS.hasMany('seismic-event')
});
