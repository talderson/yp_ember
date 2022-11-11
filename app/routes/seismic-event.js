import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SeismicEventRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  };

  model(params) {
    const _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject){
        let seismic = _this.get('store').findAll('seismic', params);

        seismic.then(function(seismic){
            resolve({
                seismic:seismic,
            });
        });
    });
  }
}
