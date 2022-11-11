import Ember from 'ember';

function resetNewBlastEventObject(_this) {
    _this.set('newBlastEventObject', {
        isVisible: true
    });
    _this.set('timestamp', null);
    _this.set('delay', 0);
    _this.set('east', null);
    _this.set('north', null);
    _this.set('depth', null);
    _this.set('blastType', '1');
}

export default Ember.Component.extend({
    store: Ember.inject.service(),
    isVisibleCreateNewForm: true,
    newBlastEventObject: {
        isVisible: true
    },
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    timeFormat: 'HH:mm:ss',
    timestamp: null,
    delay: 0,
    blastType: '1',
    dateTimePicker: null,
    datePicker: null,
    east: null,
    north: null,
    depth: null,

    selectOptionsArray: Ember.computed.map('blastTypesSelectOptions', function(item){
        const blastTypesSelectOptionsKyes = this.get('blastTypesSelectOptionsKyes').split(",");
        return {
            key: item.get(blastTypesSelectOptionsKyes[0]),
            value: item.get(blastTypesSelectOptionsKyes[1])
        };
    }),

    // look for isVisibleCreateNewForm variable change and reset newBlastEventObject object if create new form was called twice
    handleIsVisibleCreateNewFormChange: Ember.observer('isVisibleCreateNewForm', function(){
        if ( this.get('isVisibleCreateNewForm') ) {
            resetNewBlastEventObject(this);
        }
    }),

    actions: {
        addNew(object){
            //let store = this.get('store');
            // show create new item form
            this.set('isVisibleCreateNewForm', true);
        },
        saveNew(object){
            let _this = this,
                store = this.get('store'),
                newBlastEventObject = this.get('newBlastEventObject')
            ;

            if (this.get('timestamp') != null) {
                newBlastEventObject.timestamp = moment(this.get('timestamp'),'YYYY MM DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            }

            //console.log('here');
            //newBlastEventObject.delay = this.get('delay');
            newBlastEventObject.east = this.get('east');
            newBlastEventObject.north = this.get('north');
            newBlastEventObject.depth = this.get('depth');
            newBlastEventObject.blastType = store.peekRecord('blast-type', this.get('blastType'));

            const newBlastEvent = store.createRecord('blast-event', newBlastEventObject);

            // save new blast-event to DB
            //const savedObject = newBlastEvent.save().then(function(results){
            newBlastEvent.save().then(function(results){
                // hide create new item form
                _this.set('isVisibleCreateNewForm', false);

                // if blast-event was successfully saved to DB, then display it
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
            resetNewBlastEventObject(this);
        }
    },
    didRender() {
        let _this = this;
        // let dateTimePicker = this.$(".datetimepicker-input").datetimepicker({
        //     format: _this.get('dateFormat'),
        // }).on('dp.change', function(e) {
        //     _this.set(e.currentTarget.id, e.date.format(_this.get('dateFormat')));
        // });
        // this.set('dateTimePicker', dateTimePicker);

        // let datePicker = this.$(".datepicker-input").datetimepicker({
        //     format: _this.get('timeFormat'),
        // }).on('dp.change', function(e) {
        //     if (e.date) {
        //         _this.set(e.currentTarget.id, e.date.format(_this.get('timeFormat')));
        //     } else {
        //         _this.set(e.currentTarget.id, null);
        //     }
        // });
        // this.set('datePicker', datePicker);
    },
    willDestroyElement() {
        if (this.get('dateTimePicker')) {
            this.get('dateTimePicker').datetimepicker("destroy");
        }
        if (this.get('datePicker')) {
            this.get('datePicker').datetimepicker("destroy");
        }
    },
});
