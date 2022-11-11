import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
    queryParams = {
        page: {
            refreshModel: true
        },
        page_size: {
            refreshModel: true
        },
        ordering: {
            refreshModel: true
        },
        search: {
            refreshModel: true
        },
        searchTgt: {
            refreshModel: true
        }
    };

    @service session;

    beforeModel(transition) {
      this.session.requireAuthentication(transition, 'login');
    };

    model(params) {
        const _this = this;

        return new Ember.RSVP.Promise(function(resolve, reject){
            //console.log("router");
            let alertsParams = {}
            _this.queryParams.ordering;
            if (params.ordering != null) {
                let test = params.ordering.slice(1,2)
                if (test == ":") {
                    let opt = params.ordering.slice(0,1);
                    params.ordering = params.ordering.slice(2);
                    if (opt == 'a') {
                        //console.log('alert');
                        alertsParams.ordering = params.ordering;
                        params.ordering = null;
                        console.log(alertsParams.ordering);
                    } else if (opt == 'i') {
                        //console.log('instrument');
                        console.log(params.ordering);
                    } else {
                        //console.log('niether');
                    }
                }
            }

            alertsParams.page_size = 5
            if (alertsParams == null)
                alertsParams.ordering = '-is_triggered,-is_active,instrument'

            if(params.searchTgt=="alert")
                alertsParams.search = params.search

            let alerts = _this.get('store').query('alert', alertsParams);
            
            //console.log(alertsParam);
            //c/onsole.log(alerts);

            params.page_size = 20

            if (params.ordering == null)
                params.ordering = 'id'
            if(params.searchTgt != "inst")
                params.search = ""


            let instruments = _this.get('store').query('instrument', params);
            let alertStats = _this.get('store').queryRecord('alert-stat',{});
            let instrumentStats = _this.get('store').queryRecord('instrument-stat',{});


            if(params.searchTgt != null) {
                if(params.searchTgt == "alert") {
                    alerts = _this.get('store').query('alert', alertsParams);
                    instruments = _this.get('store').query('instrument',params);
                } else if (params.searchTgt == "inst") {
                    alerts = _this.get('store').query('alert',alertsParams);
                    instruments = _this.get('store').query('instrument', params);
                } 
            }

            alerts.then(function(alerts){
                instruments.then(function(instruments){
                    alertStats.then(function(stats){
                        resolve({
                            alerts:alerts,
                            instruments:instruments,
                            stats:stats,
                            instrumentStats: instrumentStats,
                        });
                    });
                });
            });
        });
    }

    afterModel = function(resolvedModel) {
        //console.log(resolvedModel.stats);
        //console.log(resolvedModel);
        this.session.store.refreshLicence();
    }
}
