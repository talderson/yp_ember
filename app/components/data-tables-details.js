import Ember from 'ember';

export default Ember.Component.extend({
    dataLegends: Ember.computed('rowDetails', function() {
        let objectKyes = Object.keys( this.get('rowDetails').toJSON() );
        // console.log(objectKyes);
        return objectKyes;
    }),
    recordValues: Ember.computed('rowDetails', function() {

        // let dataLegends = this.get('dataLegends');
        let item = this.get('rowDetails');

        // dataLegends.forEach(function(objectKey) {
        //     // console.log(objectKey);
        //     // console.log( item.get(objectKey) );
        //     // console.log( typeof item.get(objectKey) );

        // });


        // console.log( item.getProperties(this.get('dataLegends')) );

        // let items = item.getProperties(this.get('dataLegends'));





        return item.getProperties(this.get('dataLegends'));
    })
});
