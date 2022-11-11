import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class VibrationsRoute extends Route.extend({
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
            vibrationEvents: this.get('store').query('vibration-event', params),
            //licence: this.get('store').findAll('licence')
        });
    },
    afterModel: function(resolvedModel) {
        let pageSize = resolvedModel.vibrationEvents.query.page_size,
            eventsMeta = resolvedModel.vibrationEvents.meta,
            vibeEventsController = this.controllerFor('vibration-events')
        ;

        vibeEventsController.send('updateProperty', 'pageSize', pageSize);
        vibeEventsController.send('updateProperty', 'eventsMeta', eventsMeta);
    }
}) {
    @service session;

    beforeModel(transition) {
      this.session.requireAuthentication(transition, 'login');
    };
}
