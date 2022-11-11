import Ember from 'ember';

export default Ember.Component.extend({
    isVisibleImportKeyForm: true,
    isVisibleError: false,
    isSubmitting: false,
    loading: false,
    actions: {
        updateProperties(propertyNames = [], propertyValues = []) {
            const _this = this;
            if (propertyNames.length > 0 && propertyValues.length > 0 && propertyNames.length === propertyValues.length) {
                propertyNames.forEach( function(propertyName, i) {
                    _this.set(propertyName, propertyValues[i]);
                });
            } else if (!Array.isArray(propertyNames) && propertyNames !== '' && propertyValues !== '') {
                _this.set(propertyNames, propertyValues);
            }
        },
        importKey() {
            // this.set('isVisibleImportDataForm', false);
            this.set('isSubmitting', true);
        },
        cancelImport() {
            this.set('isVisibleImportDataForm', false);
        },
        errorHappened(message) {
            console.log('error happened: ' + message);
            this.set('isVisibleError',true);
            Ember.run.scheduleOnce('afterRender', this, function() {
                this.set('isSubmitting',false);
                this.set('loading', false);
            });
        }
    }
});