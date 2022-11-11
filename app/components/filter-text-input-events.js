import Ember from 'ember';

export default Ember.Component.extend({
    sv: '',
    pv: 1,
    searchValue: Ember.computed('searchValue', {
        get() {
            if (typeof this.attrs.searchValue !== 'undefined') {
                return this.attrs.searchValue.value;
            } else {
                return this.get('sv')
            }    
        },
        set(value) {
            this.set('sv', value)
        }
    }),
    pageValue: Ember.computed('pageValue', {
        get() {
            if (typeof this.attrs.pageValue !== 'undefined') {
                return this.attrs.pageValue.value;
            } else {
                return this.get('pv')
            }
        },
        set(value) {
            this.set('pv',value);
        }
    }),
    actions: {
        updateProperty(propertyName, propertyValue) {
            if (typeof propertyValue !== 'undefined') {
                this.set(propertyName, propertyValue);
                this.set('pageValue', 1);
            }
        },
    },
    keyDown: function(e) {
        if (e.keyCode === 13) {
            this.send('updateProperty', 'searchValue', quickTableFilter.value);
        }
    }
});
