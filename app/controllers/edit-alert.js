import Controller from '@ember/controller';
import { computed, observer } from '@ember/object';

export default Ember.Controller.extend({
    breadCrumbs: computed('model',{
        get() {
            let alert = this.get('model').alert;
            
            let obj = [
                {
                    label: "Dashboard",
                    path: 'index'
                },    
            {
                label: "Alerts",
            }];
            
            if (alert != null) {
                obj = [
                    {
                        label: "Dashboard",
                        path: 'index'
                    },
                    {
                        label: "Alerts",
                        path: 'alerts'
                    },
                    {
                        label: alert.get('id'),
                        path: 'edit-alert',
                        model: alert.get('id'),
                    }
                ]
            }
            return obj;
        }
    }),
    instrumentTypeName: computed('', function() {
        // console.log(this.get('model').alert.instrument.get('instrumentType').title);
        this.set('instType', this.get('model').alert.instrument.get('instrumentType'));
        this.set('id',this.get('alert_id'));
        return 'test';
    }),
    actions: {
        saved() {
            this.transitionToRoute('alerts');
        },
        setError(error,value) {
            Ember.set(this, error, value);
        },
    },
})
