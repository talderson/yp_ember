import DS from 'ember-data';

export default DS.Model.extend({
    modelName: DS.attr(),
    vwproperty: DS.hasMany('vwproperty', {async: false}),
    vwvendor: DS.belongsTo('vwvendor', {async: false})
});
