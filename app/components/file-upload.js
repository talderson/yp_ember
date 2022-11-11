import Ember from 'ember';
import FileField from 'ember-uploader/components/file-field';
import Uploader from 'ember-uploader/uploaders/uploader';
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
            url: "http://" + document.location.host.split(':')[0] + ":8000" + '/import-file/',
            paramName: 'data_file',
            ajaxSettings: this.get('ajaxSettings')
        });

        this.set('uploader', uploader);
        this.set('files', files);
    },
    actions: {
        submitFile(object){
            const _this = this;
            let files = _this.get('files');
            
            //files = null;
            //this.sendAction('importError');
            if (!Ember.isEmpty(files)) {
                // this second argument is optional and can to be sent as extra data with the upload
                //console.log(files);
                //console.log(_this.get('fileSettings'));
                let format = _this.get('fileSettings').file_format;
                let dateFormat = _this.get('fileSettings').date_format;
                let filename = files[0].name.substring(0,files[0].name.lastIndexOf('.'));
                let ext = files[0].name.substring(files[0].name.lastIndexOf('.')+1);
                
                let ok = true;
                let id = this.get('fileSettings').instrument_id;

                let errMsg = "";
                if(id !== filename) {
                    if(confirm("IDs do not match\nInstrument ID: " + id + "\nFile ID: " + filename + "\nYou are about to import this data.")) {
                        ok = true;
                    } else {
                        ok = false;
                    }
                }

                if(!format.includes(ext)) {
                    if(confirm("File format does not match\nSelected Format: " + format + "\nFile format: " + ext + "\nYou are about to import this data.")) {
                        ok = true;
                    } else {
                        ok = false;
                    }                            
                }

                if(dateFormat === '') {
                    ok = false;
                    errMsg = "Date format not selected.";
                }
                
                if(ok) {
                    //$("body").css("cursor", "progress");
                    _this.get('uploader').upload(files[0],_this.get('fileSettings')
                    ).then(data => {
                        // Handle success
                        // Reload the page to show imported data
                        //$("body").css("cursor", "default");
                        window.location.reload(true);
                    }, error => {
                        //console.log(error.statusText);
                        //$("body").css("cursor", "default");
                        if (error.responseJSON) {
                            this.sendAction('errorHappened',error.responseText);
                        } else {
                            this.sendAction('errorHappened',error.statusText);
                        }
                        //this.sendAction('errorHappened',error.statusText);
                        // Handle failure
                    });
                } else {
                    if (errMsg !== "") {
                        this.sendAction('errorHappened',errMsg);
                    } else {
                        this.sendAction('errorHappened',"User cancelled");
                    }
                }
            } else {
                this.sendAction('errorHappened',"No File selected.");
            }
        },
        cancel(){
            // this.set('newValue', this.get(`object.${this.get('field')}`));
            // this.set('isEditing', false);
            // this.$('.has-tooltip-info').tooltip('hide'); //hide any active tooltips
        }
    },
});