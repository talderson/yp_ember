import CookieStore from 'ember-simple-auth/session-stores/cookie';
import ENV from "geotechnical-data-platform-new/config/environment";

export default class ApplicationSessionStore extends CookieStore {

    async refreshLicence() {
        //console.log('refresh');
        
        let cookie = await this.restore();

        //let url = ENV.API_URL;
        let url = "http://" + document.location.host.split(':')[0] + ":8000";
        url += url.endsWith("/") ? "" : "/"
        url += "licences/"
    
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + cookie.authenticated.login
            },
        });
        //console.log('auth');
        if (response.ok) {
            try {
            let licence = await response.json();
            licence = licence.data[0]
            cookie.authenticated.isValid = licence.attributes['is-valid'];
            cookie.authenticated.limit =  licence.attributes['within-limit'];
            cookie.authenticated.modules = licence.attributes['modules'];

            await this.persist(cookie);
            } catch {}
        }    
    }
}