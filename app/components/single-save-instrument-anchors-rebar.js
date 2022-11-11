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
    isStacked: Ember.computed('stacked', function() {
        return this.get('stacked');
    }),
    anchorsAmount: Ember.computed('object', function() {
        return this.get('object').length;
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
    sortedInstrumentAnchors: Ember.computed.sort('anchors', 'sortProperties'),

    listedAnchors: Ember.computed(function() {
        let object = this.get('object');
        let newSet = [];
        let anchorCount = this.get('anchorsAmount');
        if(this.get('isStacked')) {
            object.forEach(function(obj){
                if(obj.get('number') > 0) {
                    let anchor = (obj.get('number')-1) % ((anchorCount-1) / 2);
                    var hash={};
                    if(obj.get('number')-1 < (anchorCount-1) / 2) {
                        hash={'number-a':" - " + (anchor + 1),'distance-a': obj.get('distance')};
                        newSet.push(hash);
                    } else {
                        hash=newSet.shift();
                        hash['number-b'] = anchor + 1 + ((anchorCount-1)/2) + " - ";
                        hash['distance-b'] = obj.get('distance');
                        newSet.push(hash);
                    }
                }
            });   
        } else {
            object.forEach(function(obj){
                if(obj.get('number') > 0) {
                    let anchor = (obj.get('number')-1) % ((anchorCount-1) / 2);
                    var hash={};
                    if(obj.get('number')-1 < (anchorCount-1) / 2) {
                        hash={'number-a':" - " + (anchor + 1),'distance-a':obj.get('distance')};
                        newSet.push(hash);
                    } else {
                        let temp=newSet.shift();
                        hash={'number-b': (anchor + 1 + ((anchorCount-1)/2)) + " - ",'distance-b':obj.get('distance')};
                        newSet.push(temp);
                        newSet.push(hash);
                    }
                }
            });   
            
        }
        return newSet.reverse();
    }),

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
            /* this.set('isEditing', true);
            this.set('newValue', this.get(`object.${this.get('field')}`));
            this.$('.has-tooltip-info').tooltip('hide'); //hide any active tooltips
            return this.$().attr({ tabindex: 1 }), this.$().focus(); // brings the view into focus in order to capture keyUps. */
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

/*             for(let ctr = 0; ctr < object.length; ctr++) {
                object.get(ctr).set('distance-a',5);
            }
 */

            //console.log(object);
            
            
            //console.log(newSet);

            //object = newSet;
            
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
            object.save();
            this.set('isEditing', false);
            this.$('.has-tooltip-info').tooltip('hide'); //hide any active tooltips
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
            if (this.isAllAnchorsPopulated===true) {
                this.send('save', this.get('object'));
            }
        }
    }
});