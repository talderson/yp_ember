import Ember from 'ember';
import ENV from "geotechnical-data-platform-new/config/environment";


export default Ember.Component.extend({
    ajax: Ember.inject.service(),
    session: Ember.inject.service(),
    isVisibleExportDataForm: true,
    instrumentId: null,
    fileFormat: 'csv',
    loading: false,
    fileFormats: [
        {
            key: 'csv',
            value: '*.csv',
        },
        {
            key: 'txt',
            value: '*.txt',
        },
        {
            key: 'dlog',
            value: '*.dlog',
        },
        {
            key: 'csv_YYMMDD',
            value: "*.csv_YYMMDD"
        },
        {
            key: 'dlog_YYYYMMDD',
            value: '*.dlog_YYYYMMDD',
        },
        {
            key: 'dlog_DDMMYYYY',
            value: '*.dlog_DDMMYYYY',
        },
        {
            key: 'dlog_MMDDYYYY',
            value: '*.dlog_MMDDYYYY',
        },
        {
            key: 'dlog_MMDDYY',
            value: '*.dlog_MMDDYY',
        },
    ],
    fileName: Ember.computed('fileFormat', 'fileFormats', function() {
        return this.get('instrumentId') + '.' + this.get('fileFormat');
    }),
    fileLink: Ember.computed('fileFormat', 'fileFormats', function() {
        let base = "http://" + document.location.host.split(':')[0] + ":8000";
        return base + '/instruments/' + this.get('instrumentId') + '/displacement-values?format=' + this.get('fileFormat');
        //return ENV.API_URL + '/instruments/' + this.get('instrumentId') + '/displacement-values?format=' + this.get('fileFormat');
    }),
    // look for isVisibleCreateNewForm variable change and reset newDisplacementValuesObject object if create new form was called twice
    handleIsVisibleCreateNewFormChange: Ember.observer('fileFormat', function(){
        this.set('isExportLinkReady', false);
    }),
    isExportLinkReady: false,
    actions: {
        downloadFile() {
            this.set('loading', true);            
            var $t = $(this);
            let request = $.ajax({
                method: "GET",
                url: this.get('fileLink'),
                headers: {
                    'Authorization': 'Basic ' + this.get('session').data.authenticated['login'],
                },
                success: download.bind(true, "text/csv", this.get('fileName')),
            })//This method is added to stop the loading "spinner" from spinning after the download
            request.done(function( msg ) {
                $t[0].set('loading', false);
            });
        },
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
        cancel() {
            this.set('isVisibleExportDataForm', false);
            this.set('loading', false);

        }
    }
});
