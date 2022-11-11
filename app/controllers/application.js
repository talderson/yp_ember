// app/controllers/application.js
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
 
export default class ApplicationController extends Controller {
  @service session;

  @action
  invalidateSession() {
    console.log("LOGOUT!");
    this.session.invalidate();
  }
}
