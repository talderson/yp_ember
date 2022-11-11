import Ember from 'ember';

function resetNewSeismicEventObject(_this) {
    _this.set('newSeismicEventObject', {
        isVisible: true
    });
    _this.set('timestamp', null);
    _this.set('east', null);
    _this.set('north', null);
    _this.set('depth', null);
    _this.set('seismicType', '1');
}

export default Ember.Component.extend({
    store: Ember.inject.service(),
    isVisibleCreateNewForm: true,
    newSeismicEventObject: {
        isVisible: true
    },
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    timestamp: null,
    seismicType: '1',
    dateTimePicker: null,
    east: null,
    north: null,
    depth: null,

    selectOptionsArray: Ember.computed.map('seismicTypesSelectOptions', function(item){
        const seismicTypesSelectOptionsKyes = this.get('seismicTypesSelectOptionsKyes').split(",");
        return {
            key: item.get(seismicTypesSelectOptionsKyes[0]),
            value: item.get(seismicTypesSelectOptionsKyes[1])
        };
    }),

    // look for isVisibleCreateNewForm variable change and reset newSeismicEventObject object if create new form was called twice
    handleIsVisibleCreateNewFormChange: Ember.observer('isVisibleCreateNewForm', function(){
        if ( this.get('isVisibleCreateNewForm') ) {
            resetNewSeismicEventObject(this);
        }
    }),

    actions: {
        addNew(object){
            let store = this.get('store');
            // show create new item form
            this.set('isVisibleCreateNewForm', true);
        },
        saveNew(object){
            let _this = this,
                store = this.get('store'),
                newSeismicEventObject = this.get('newSeismicEventObject')
            ;

            if (this.get('timestamp') != null) {
                newSeismicEventObject.timestamp = moment(this.get('timestamp'),'YYYY MM DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            }
            newSeismicEventObject.east = this.get('east');
            newSeismicEventObject.north = this.get('north');
            newSeismicEventObject.depth = this.get('depth');
            newSeismicEventObject.seismicType = store.peekRecord('seismic-type', this.get('seismicType'));

            const newSeismicEvent = store.createRecord('seismic-event', newSeismicEventObject);

            // save new seismic-event to DB
            const savedObject = newSeismicEvent.save().then(function(results){
                // hide create new item form
                _this.set('isVisibleCreateNewForm', false);

                // if seismic-event was successfully saved to DB, then display it
                //object.unshiftObject(results._internalModel); // https://github.com/emberjs/data/issues/3313
                //_this.sendAction('vewRowDetails', results.id);
            })
            .catch(function(reason){
                if (reason.errors[0].status == 403) {
                    _this.setProp('permissionError', true);
                }
            });

        },
        cancelNew(object){
            // hide create new item form
            this.set('isVisibleCreateNewForm', false);
            // reset all variables
            resetNewSeismicEventObject(this);
        }
    },
    didRender() {
        let _this = this;
        // let dateTimePicker = this.$(".datetimepicker-input").datetimepicker({
        //     format: _this.get('dateFormat'),
        // }).on('dp.change', function(e) {
        //     if (e.date) {
        //         _this.set(e.currentTarget.id, e.date.format(_this.get('dateFormat')));
        //     } else {
        //         _this.set(e.currentTarget.id, null);
        //     }
        // });
        //this.set('dateTimePicker', dateTimePicker);
    },
    willDestroyElement() {
        if (this.get('dateTimePicker')) {
            this.get('dateTimePicker').datetimepicker("destroy");
        }
    },
});
