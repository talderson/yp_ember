import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

//import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

//export default class InstrumentsRoute extends Route.extend(AuthenticatedRouteMixin, {
export default class SettingsRoute extends Route.extend({
    model(params) {
      return this.get('store').query('project-setting', params);
    }
  }) {
    
    @service session;

    beforeModel(transition) {
      this.session.requireAuthentication(transition, 'login');
    };
}
