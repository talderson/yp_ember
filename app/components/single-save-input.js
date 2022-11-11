import Ember from 'ember';

var originVal;
var field;

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
    isEditable: true,
    isEditing: false,
    
    isTextInput: Ember.computed('inputType', function() {
        return this.get('inputType') === 'text';
    }),
    isTextarea: Ember.computed('inputType', function() {
        return this.get('inputType') === 'textarea';
    }),
    actions: {
        
        edit(){
            originVal = this.get(`object.${this.get('field')}`);
            this.set('isEditing', true);
            this.set('newValue', this.get(`object.${this.get('field')}`));
            return this.element.tabindex = 1, this.element.focus(); // brings the view into focus in order to capture keyUps.
        },
        save(object){
            
            object.set(this.get('field'), this.get('newValue'));

            field = this.get('field');
            
            object.save().catch(function(reason) {
      
                let editError = document.getElementById("instrumentEditError");
                editError.hidden = false;
                
                if (originVal == undefined) {
                    originVal = "";
                }

                object.set(field, originVal);

                window.scrollTo(0,0);
            });
            this.set('isEditing', false);
        },
        cancel(){
            this.set('newValue', this.get(`object.${this.get('field')}`));
            this.set('isEditing', false);
        }
    },
    keyDown: function(e) {
        if (e.keyCode === 27) {
            this.send('cancel', this.get('object'));
        }
        if (e.keyCode === 13) {
            if (this.get('isTextarea') === true && e.ctrlKey === false) {
                return;
            }
            this.send('save', this.get('object'));
        }
    }
});
