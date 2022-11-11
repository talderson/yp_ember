import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');
  this.route('index', { path: '/' });
  this.route('create-instrument');
  this.route('edit-instrument', { path: '/instrument/:instrument_id' });
  this.route('settings');
  this.route('create-alert');
  this.route('edit-alert', { path: '/alert/:alert_id' });
  this.route('instruments');
  this.route('alerts');
  this.route('seismic-events');
  this.route('blast-events');
  this.route('vibration-events');
  this.route('keys');
  this.route('raw-data', { path: '/instrument/:instrument_id/raw-data' });


  this.route('temporal-graphs', { path: '/instrument/:instrument_id/temporal-graph'}, function() {
    this.route('temporal-graph', { path: '/:model_name' });
  });

  this.route('spatial-graphs', { path: '/instrument/:instrument_id/spatial-graph'}, function() {
    this.route('spatial-graph', { path: '/:model_name' });
  });

  this.route('frequency-graphs', { path: '/instrument/:instrument_id/frequency-graph'}, function() {
    this.route('frequency-graph', { path: '/:model_name' });
  });
});
