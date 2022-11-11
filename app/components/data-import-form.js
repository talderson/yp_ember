import Ember from 'ember';
export default Ember.Component.extend({
    isVisibleImportDataForm: false,
    isVisibleError: false,
    loading: false,
    isVisibleErrorChangeObserver: Ember.observer('isVisibleError', function() {
        if (this.get('isVisibleError')) {
            //console.log('show error!');
        } else {
            //console.log('hide error!');
        }
    }),
    error: "",
    instrumentId: null,
    fileFormat: 'dlog',
    dateFormat: '',
    dateFormats: [{
        key: 'YYYYMMDD',
        value: 'YYYY/MM/DD'
    }, {
        key: 'MMDDYYYY',
        value: 'MM/DD/YYYY',
    }, {
        key: 'DDMMYYYY',
        value: 'DD/MM/YYYY',
    }, {
        key: 'MMDDYY',
        value: 'MM/DD/YY (.csv default)',
    }, {
        key: 'YYMMDD',
        value: 'YY/MM/DD',
    }],
    fileFormats: [{
        key: 'dlog',
        value: '*.dlog',
    }, {
        key: 'csv',
        value: '*.csv',
    }, {
        key: 'txt',
        value: '*.txt',
    }],
        // }, {
        //     key: 'csv_YYMMDD',
        //     value: "*.csv_YYMMDD"
        // }, {
        //     key: 'dlog_YYYYMMDD',
        //     value: '*.dlog_YYYYMMDD',
        // }, {
        //     key: 'dlog_DDMMYYYY',
        //     value: '*.dlog_DDMMYYYY',
        // }, {
        //     key: 'dlog_MMDDYYYY',
        //     value: '*.dlog_MMDDYYYY',
        // }, {
        //     key: 'dlog_MMDDYY',
        //     value: '*.dlog_MMDDYY',
        // }],
    isSubmitting: false,
    fileSettings: {
        instrument_id: null,
        file_format: null,
        date_format: null
    },
    actions: {
        updateProperties(
            propertyNames = [], 
            propertyValues = []) {

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
            // this.set('isVisibleImportDataForm', false);
            this.set('loading', true);
            this.set('isSubmitting', true);
            this.set('fileSettings.instrument_id', this.get('instrumentId'));
            this.set('fileSettings.file_format', this.get('fileFormat'));
            this.set('fileSettings.date_format', this.get('dateFormat'));
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
            this.set('error', message.replace(/['"]+/g, ''));
            Ember.run.scheduleOnce('afterRender', this, function() {
                this.set('isSubmitting',false);
                this.set('loading', false);
            });
        }
    }
});