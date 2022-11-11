import Component from '@ember/component';
import { inject as service } from "@ember/service";
import { action } from '@ember/object';
import { computed, observer } from "@ember/object";

export default class navbar extends Component {
    @service session;
    //@service currentUser;
    //isAuthenticated = true;

    @computed('session.isAuthenticated')
    get username() {
        return this.get('session').data.authenticated['user'];
    }

    @computed('session.isAuthenticated')
    get isValid() {
        let isValid = this.get('session').data.authenticated['isValid'];
        //console.log(isValid);
        return isValid === undefined ? true : isValid;
    }

    @computed('session.isAuthenticated')
    get isWithinLimit() {
        let limit = this.get('session').data.authenticated['limit']
        return limit === undefined ? true : limit;
    }

    @computed('session.isAuthenticated')
    get modules() {
        return this.get('session').data.authenticated['modules'];
    }

    @computed('session.isAuthenticated')
    get hasAlerts() {
        let perms = null;
        try{
            perms = this.session.data.authenticated.modules;
        } catch {}
        if (perms == null) {
            return false;
        } else {
            return (perms['alerts']);
        }
    }

    @action
    logout() {
        //console.log(this.session.isAuthenticated);
        this.session.invalidate();
    }    
}