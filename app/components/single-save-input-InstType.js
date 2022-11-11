import Ember from 'ember';



export default Ember.Component.extend({
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
            
            this.set('isEditing', true);
            this.set('newValue', this.get(`object.${this.get('field')}`));
            return this.element.tabindex = 1, this.element.focus(); // brings the view into focus in order to capture keyUps.
        },
        save(object){
            object.set(this.get('field'), this.get('newValue'));
            
            object.save();
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
