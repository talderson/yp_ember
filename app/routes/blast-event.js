import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class BlastEventRoute extends Route {
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  };

  model(params) {
    const _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject){
        let blast = _this.get('store').findAll('blast', params);

        blast.then(function(blast){
            resolve({
              blast:blast,
            });
        });
    });
  }
}
