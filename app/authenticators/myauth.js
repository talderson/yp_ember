// app/authenticators/custom.js
import Ember from 'ember';
import ENV from "geotechnical-data-platform-new/config/environment";
import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';
import base64 from 'base-64';

export default class CustomAuthenticator extends Base {
    @service session;

    restore(data) {
        //console.log('restore');
        if(data) {
            let promise = new Ember.RSVP.Promise(function(resolve, reject) {
                if (data['auth'] == true) {
                    resolve(data);
                } else {
                    reject(new Error("session no longer exists"));
                }
            });
            return promise;
        }
    }
    
    async authenticate(auth) {
        //console.log('authenticate');

        //let url = ENV.API_URL;
        let url = "http://" + document.location.host.split(':')[0] + ":8000";
        url += url.endsWith("/") ? "" : "/";
        url += "licences/";

        let login = base64.encode(auth[0]+":"+auth[1]);

        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + login
            },
        });
        //console.log('auth');
        if (response.ok) {
            let expirationTime = ( 60 * 10 );
            this.set('session.store.cookieExpirationTime', expirationTime);
            let licence;
            let isValid = false;
            let limit = 0;
            let modules = {};
            try {
                licence = await response.json();
                licence = licence.data[0];
                isValid = licence.attributes['is-valid'];
                limit = licence.attributes['within-limit'];
                modules = licence.attributes['modules'];
            } catch (ex) {
            }
            return { auth: true, user: auth[0], isValid:isValid, limit:limit, modules:modules, login:login };
        } else {
            let error = await response.text();
            //console.log('error');
            try {
                let er = JSON.parse(error);
                if (er.hasOwnProperty('detail')) {
                    error = er.detail;
                }
            } catch(error) {
                //console.log(error);
                //error = errorText;
            }
            throw new Error(error);
        }
    }
}