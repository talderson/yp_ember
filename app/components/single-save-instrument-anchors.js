import Ember from 'ember';

export default Ember.Component.extend({
    editChanged: Ember.observer('isEditing', function() {
        if (this.get('isEditing')==true) {
            if(typeof this.editField === "function") {
                this.editField();
            }
        } else {
            if(typeof this.stopEditField === "function") {
                this.stopEditField();
            }
        }
    }),

    isEditing: false,
    store: Ember.inject.service(),
    channelsNum: 0,
    isToe: Ember.computed('headAt', function() {
        return this.get('headAt') === 'HAT';
    }),
    isCollar: Ember.computed('headAt', function() {
        return this.get('headAt') === 'HAC';
    }),
    anchorsAmount: Ember.computed('object', {
        get() {
            if (this._anchorCount) {
                return this._anchorCount;
            }
            return this.get('object').length;
        },

        set(key, value) {
            return this._anchorCount = value;
        }
    }),
    isAllAnchorsPopulated: Ember.computed('object', 'anchorsAmount', function() {
        let objectLength = this.get('object').map(function(obj){
            return obj.get('distance') !== '' && obj.get('distance') !== null;
        });
        if (objectLength.indexOf(false) > -1) {
            return false;
        } else {
            return true;
        }
    }),

    // sort anchors depending on head position
    sortProperties: Ember.computed('isToe', function() {
        if (this.get('isToe')) {
            return ['number:asc'];
        }
        return ['number:desc'];
    }),
    sortedInstrumentAnchors: Ember.computed.sort('object', 'sortProperties'),

    // Binding Style Attributes to prevent console warning
    // https://emberjs.com/deprecations/v1.x/#toc_binding-style-attributes.
    anchorsCSSCounteStyle: Ember.computed('isToe', 'anchorsAmount', function() {
        let anchorsCSSCounteStyle = this.get('isToe') ? -1 : this.get('anchorsAmount');
        return Ember.String.htmlSafe("counter-reset: anchorNumber " + anchorsCSSCounteStyle);
    }),

    actions: {
        updateAnchorsCounter(object){
            let j = 0;
            object.forEach(function(obj){
                if (!obj.get('isDeleted')) {
                    j++;
                }
            });
            this.set('anchorsAmount', j);
        },
        edit(){
            this.set('isEditing', true);
            this.set('newValue', this.get(`object.${this.get('field')}`));
            return this.element.tabindex = 1, this.element.focus(); // brings the view into focus in order to capture keyUps.
        },
        inputNewValue(currentAnchor, newValue) {
            this.notifyPropertyChange('anchorsAmount'); // trigger property change to notify 'isAllAnchorsPopulated' computed property to be recalculated when updating anchors inputs
            currentAnchor.set('distance', newValue);
        },
        prePopulateAnchors() {
            let object = this.get('object'),
                anchorsArray = [],
                emptyAnchorsAmount = this.get('channelsNum') - this.get('anchorsAmount')
            ;

            if ( emptyAnchorsAmount > 0 ) {
                for (var i = emptyAnchorsAmount - 1; i >= 0; i--) {
                    let newAnchor = this.get('store').createRecord('anchor', {
                        number: i,
                        distance: ''
                    });
                    anchorsArray.push(newAnchor);
                }
            }
            if (anchorsArray.length) {
                object.pushObjects(anchorsArray);
                this.send('updateAnchorsCounter', object);
            }

            // Afterthought to fix broken anchor ordering in database. Proabbaly could be removed at some point when there won't be anymore anchors with empty number value.
            let isAnchorNumbersCorrupted = -1;
            object.forEach(function(obj){
                if (obj.get('number') === 0) {
                    isAnchorNumbersCorrupted++;
                }
            });
            if (isAnchorNumbersCorrupted) {
                object.forEach(function(obj, i){
                    obj.set('number', i);
                });
            }

        },
        save(object){
            for (let i = object.length; i >= 0; i--) {
                let currentObject = object.objectAt(i);
                if (typeof currentObject !== 'undefined' && currentObject.get('hasDirtyAttributes')) {
                    currentObject.save();
                    //console.log("anchor count: " + i);
                }
            }
            this.set('isEditing', false);
        },
        cancel(object){
            // rollback all unsaved items
            for (let i = object.length; i >= 0; i--) {
                let currentObject = object.objectAt(i);
                if (typeof currentObject !== 'undefined') {
                    currentObject.rollbackAttributes();
                }
            }
            
            this.send('updateAnchorsCounter', this.get('object'));
            this.notifyPropertyChange('anchorsAmount');
            this.set('isEditing', false);
        }
    },
    didRender(){
        this.send('prePopulateAnchors');
    },
    keyDown: function(e) {
        if (e.keyCode === 27) {
            this.send('cancel', this.get('object'));
        }
        if (e.keyCode === 13) {
            if (this.get('isAllAnchorsPopulated')===true) {
                this.send('save', this.get('object'));
            }
        }
    }
});