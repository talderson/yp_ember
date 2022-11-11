import Ember from 'ember';
//import EmberUploader from 'ember-uploader';
import FileField from 'ember-uploader/components/file-field';
import Uploader from 'ember-uploader/uploaders/uploader';
import ENV from "geotechnical-data-platform-new/config/environment";
import { inject as service } from '@ember/service';
import { computed, observer } from '@ember/object';

export default FileField.extend({
    session: service(),
    isSubmitting: false,
    isSubmittingChangeObserver: Ember.observer('isSubmitting', function() {
        if (this.get('isSubmitting')) {
            this.send('submitFile');
        }
    }),
    uploader: null,
    files: null,
    ajaxSettings: computed({
        get() {
            return {
                headers: {
                    Accept: 'application/vnd.api+json',
                    withCredentials: true,
                    Authorization: 'Basic ' + this.get('session').data.authenticated['login']
                }
            }
        }
    }),    
    fileSettings: {},
    filesDidChange: function(files) {
        const uploader = Uploader.create({
            url: ENV.API_URL + '/import-key/',
            paramName: 'key_data',
            ajaxSettings: this.get('ajaxSettings')
        });

        this.set('uploader', uploader);
        this.set('files', files);
    },
    async updateLicence(){
        
        //await new Promise(r => setTimeout(r, 1500));

        //let url = ENV.API_URL;
        let url = "http://" + document.location.host.split(':')[0] + ":8000";
        url += url.endsWith("/") ? "" : "/";
        url += "licences/";

        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + this.get('session').data.authenticated['login']
            },
        });

        if (response.ok) {
            let licence = await response.json();
            licence = licence.data[0];
            let session = this.get('session');
            session.data.authenticated['is-valid'] = licence.attributes['is-valid'];
            session.data.authenticated['limit'] = licence.attributes['within-limit'];
            session.data.authenticated['modules'] = licence.attributes['modules'];
            this.set('session',session);

            location.reload();
        }
    },
    actions: {
        async submitFile(object){
            console.log('submitting');
            const _this = this;
            let files = _this.get('files');

            //files = null;
            //this.sendAction('importError');

            if (!Ember.isEmpty(files)) {
                // this second argument is optional and can to be sent as extra data with the upload
                let value = _this.get('uploader')
                $("body").css("cursor", "progress");
                _this.get('uploader').upload(
                    files[0],
                    _this.get('fileSettings')
                ).then(data => {
                    // Handle success
                    // Reload the page to show imported data
                    _this.updateLicence();
                    $("body").css("cursor", "default");
                    //window.location.reload(true);
                }, error => {
                    $("body").css("cursor", "default");
                    //this.get('controllers.raw-data-values').sendAction('toggleProperty','isVisibleError');
                    // Handle failure
                    this.sendAction('errorHappened',error.statusText);
                });
            }
        },
        cancel(){
            // this.set('newValue', this.get(`object.${this.get('field')}`));
            // this.set('isEditing', false);
            // this.$('.has-tooltip-info').tooltip('hide'); //hide any active tooltips
        }
    },
});