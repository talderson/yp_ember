import Ember from 'ember';

var originEast;
var originNorth;
var originDepth;

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
    east: null,
    north: null,
    depth: null,
    actions: {
        edit(){
            originEast = this.get('east');
            originNorth = this.get('north');
            originDepth = this.get('depth');
            
            this.set('isEditing', true);
            this.set('newEast', this.get('east'));
            this.set('newNorth', this.get('north'));
            this.set('newDepth', this.get('depth'));
            return this.element.tabindex = 1, this.element.focus(); // brings the view into focus in order to capture keyUps.
        },
        save(object){
            // object.set(this.get('field'), this.get('geoPoint').toEwkt());
            object.set('east', this.get('newEast'));
            object.set('north', this.get('newNorth'));
            object.set('depth', this.get('newDepth'));
            
            object.save().catch(function(reason) {
      
                let editError = document.getElementById("instrumentEditError");
                editError.hidden = false;
                
                if (originEast == undefined) {
                    originEast = "";
                }
                if (originNorth == undefined) {
                    originNorth = "";
                }
                if (originDepth == undefined) {
                    originDepth = "";
                }

                object.set('east', originEast);
                object.set('north', originNorth);
                object.set('depth', originDepth);

                window.scrollTo(0,0);
            });
            this.set('isEditing', false);
        },
        cancel(){
            this.set('newEast', this.get('east'));
            this.set('newNorth', this.get('north'));
            this.set('newDepth', this.get('depth'));
            this.set('isEditing', false);
        }
    },
    keyDown: function(e) {
        if (e.keyCode === 27) {
            this.send('cancel', this.get('object'));
        }
        if (e.keyCode === 13) {
            this.send('save', this.get('object'));
        }
    }
});
