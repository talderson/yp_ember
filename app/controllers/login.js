// app/controllers/login.js
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class LoginController extends Controller {
  @tracked errorMessage;
  @tracked username;
  @tracked password;

  @service session;

  loading = false;

  @action
  dothing() {
    //let model = this.get('model');
    //console.log('pew');

  }

  @action
  async authenticate(e) {
    e.preventDefault();
    let { identification, password } = this;
    this.errorMessage = "";
    //console.log('clicked');
    try {
      await this.session.authenticate('authenticator:myauth', [identification,  password]);
    } catch(error) {
      //console.log('error');
      this.errorMessage = error.error || error;
    }

    if (this.session.isAuthenticated) {
      this.set('loading', true);
      this.session.handleAuthentication();
    }
  }

  @action
  updateIdentification(e) {
    this.identification = e.target.value;
  }

  @action
  updatePassword(e) {
    this.password = e.target.value;
  }
}


// export default Controller.extend({
//   errorMessage: tracked(),
//   session: service(),
 
//   actions: {
//     async authenticate(e) {
//       e.preventDefault();
//       let { identification, password } = this.getProperties('identification', 'password');
//       this.get('session').authenticate('authenticator:oauth2', identification, password).catch((reason) => {
//         this.set('errorMessage', reason.error || reason);
//       });

//       if (this.get('session').isAuthenticated) {
//         console.log("success!");
//       }
//     }
//   }
// });
