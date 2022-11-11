import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class KeysRoute extends Route {
    @service session;
    
    beforeModel(transition) {
        this.session.requireAuthentication(transition, 'login');
    };

    model(params) {
        const _this = this;
        return new Ember.RSVP.Promise(function(resolve,reject){
            let licenceKeys = _this.get('store').query('licence-key', params);

            licenceKeys.then(function(licenceKeys){
                resolve({
                    licenceKeys:licenceKeys,
                });
            });
        });
    };

    afterModel(resolvedModel, transition) {
        this.controllerFor('keys').send('updateActive', resolvedModel);
        this.session.store.refreshLicence();
    };
}
