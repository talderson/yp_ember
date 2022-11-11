import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class BlastsRoute extends Route.extend({
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
            blastEvents: this.get('store').query('blast-event', params),
            blastTypes: this.get('store').findAll('blast-type'),
            //licence: this.get('store').findAll('licence')
        });
    },
    afterModel: function(resolvedModel) {
        let pageSize = resolvedModel.blastEvents.query.page_size,
            eventsMeta = resolvedModel.blastEvents.meta,
            blastEventsController = this.controllerFor('blast-events')
        ;

        blastEventsController.send('updateProperty', 'pageSize', pageSize);
        blastEventsController.send('updateProperty', 'eventsMeta', eventsMeta);
    }
}) {
    @service session;

    beforeModel(transition) {
      this.session.requireAuthentication(transition, 'login');
    };
}
