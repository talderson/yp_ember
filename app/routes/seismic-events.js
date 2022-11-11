import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SeismicsRoute extends Route.extend({
    queryParams: {
        page: {
            refreshModel: true
        },
        page_size: {
            refreshModel: true
        },
        ordering: {
            refreshModel: true
        },
        search: {
            refreshModel: true
        }
    },
    model(params) {
        return Ember.RSVP.hash({
            seismicEvents: this.get('store').query('seismic-event', params),
            seismicTypes: this.get('store').findAll('seismic-type'),
            //licence: this.get('store').findAll('licence'),
        });
    },
    afterModel: function(resolvedModel) {
        let pageSize = resolvedModel.seismicEvents.query.page_size,
            eventsMeta = resolvedModel.seismicEvents.meta,
            seismicEventsController = this.controllerFor('seismic-events')
        ;

        seismicEventsController.send('updateProperty', 'pageSize', pageSize);
        seismicEventsController.send('updateProperty', 'eventsMeta', eventsMeta);
    }
}) {
    @service session;

    beforeModel(transition) {
      this.session.requireAuthentication(transition, 'login');
    };
}