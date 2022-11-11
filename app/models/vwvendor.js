import DS from 'ember-data';

export default DS.Model.extend({
    vendorName: DS.attr(),
    vwmodel: DS.hasMany('vwmodel', {async: false})
});
