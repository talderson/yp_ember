import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'th',
    orderingAscending: false,

    isSelectedSort: Ember.computed('selectedSortProperty', 'sortProperty', function() {
        let selectedSortProperty = this.get('selectedSortProperty');
        if ( selectedSortProperty ) {
            if ( selectedSortProperty.indexOf('-') === 0 ) {
                selectedSortProperty = selectedSortProperty.substr(1);
            }
            return selectedSortProperty === this.get('sortProperty');
        }
    }),

    actions: {
        sortBy: function(sortProperty) {
            //console.log('sorting');
            this.toggleProperty('orderingAscending');

            if ( this.get('orderingAscending') ) {
                sortProperty = '-' + sortProperty;
            }
            this.sort(sortProperty);
        }
    }

})