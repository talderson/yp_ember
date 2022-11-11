import Ember from 'ember';

export default Ember.Component.extend({
    isVisibleImportDataForm: false,
    isVisibleError: false,
    instrumentId: null,
    loading: false,
    fileFormat: 'IMS',
    fileFormats: [
        {
            key: 'IMS',
            value: 'IMS (*.txt)',
        },
        {
            key: 'EVP',
            value: 'EVP (*.csv)',
        },
        {
            key: 'ESG',
            value: 'ESG (*.csv)',
        },
        {
            key: 'ESGS',
            value: 'ESG Source (*.src)',
        },
    ],
    isSubmitting: false,
    fileSettings: {
        instrument_id: null,
        file_format: null
    },
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
        importFile() {
            this.set('loading', true);
            this.set('isSubmitting', true);
            this.set('fileSettings.file_format', this.get('fileFormat'));
        },
        cancelImport() {
            this.set('isSubmitting', false);
            this.set('isVisibleError',false);
            this.set('isVisibleImportDataForm', false);
            this.set('loading', false);
        },
        notSubmitting() {
            this.set('isSubmitting',false);
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