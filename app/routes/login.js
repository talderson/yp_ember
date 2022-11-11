// app/routes/login.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class LoginRoute extends Route {
  @service session;

  beforeModel(transition) {
    if(transition.from == null)
      transition = "/"
    this.session.prohibitAuthentication(transition);
  }
}