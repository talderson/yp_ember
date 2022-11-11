import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Ember.Controller.extend({
    session: service(),
    breadCrumbs: computed('model',{
        get() {
            let instrument = this.get('model').instrument;
            
            let obj = [{
                label: "Instruments",
            }];
            
            if (instrument != null) {
                obj = [
                    {
                        label: "Dashboard",
                        path: 'index'
                    },
                    {
                        label: "Instruments",
                        path: 'instruments'
                    },
                    {
                        label: instrument.get('id'),
                        path: 'edit-instrument',
                        model: instrument.get('id'),
                    }
                ]
            }
            return obj;
        }
    }),
    hasGraphs: computed('', {
        get() {
            return ('graphing' in this.getPerms() && this.getPerms()['graphing'] == true);
        }
    }),
    hasAlerts: computed('', {
        get() {
            return ('alerts' in this.getPerms() && this.getPerms()['alerts'] == true);
        }
    }),
    getPerms: function() {
        let perms = null;
        try{
            perms = this.session.data.authenticated.modules;
        } catch {}
        return perms;
    },
    actions: {
        viewData(id) {
            this.transitionToRoute('raw-data', id);
        },
        tGraph(id, chart) {
            this.transitionToRoute('temporal-graphs.temporal-graph', id, chart);
        },
        sGraph(id, chart) {
            this.transitionToRoute('spatial-graphs.spatial-graph', id, chart);
        },
        fGraph(id, chart) {
            this.transitionToRoute('frequency-graphs.frequency-graph', id, chart);
        },
    }
});
