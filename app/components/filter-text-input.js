import Ember from 'ember';

export default Ember.Component.extend({
    // searchValue: Ember.computed('searchValue', function() {
    //     if (typeof this.attrs.searchValue !== 'undefined') {
    //         return this.attrs.searchValue.value;
    //     }
    // }),
    // pageValue: Ember.computed('pageValue', function() {
    //     if (typeof this.attrs.pageValue !== 'undefined') {
    //         return this.attrs.pageValue.value;
    //     }
    // }),
    pageValue: 1,
    actions: {
        updateProperty(propertyName, propertyValue) {
            if (typeof propertyValue !== 'undefined') {
                if (propertyValue == "")
                    this.set('target', "");
                else
                    this.set('target', this.get('targetName'));
                    
                this.set(propertyName, propertyValue);
                this.set('pageValue', 1);
             
                window.location.href = `/instruments?search=${propertyValue}`;
            }
        },
    },
    keyDown: function(e) {
        if (e.keyCode === 13) {
            let caller = e.target;
            this.send('updateProperty', 'searchValue', caller.value);
        }
    }
});
