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

    isEditing: false,
    dateTimePicker: null,
    showClear: false,
    actions: {
        edit(){
            originVal = this.object.get(this.field)
            this.set('isEditing', true);
            this.set('newValue', moment(new Date(this.object.get(this.field))).format('HH:mm:ss'));            
            return this.element.tabindex = 1, this.element.focus(); // brings the view into focus in order to capture keyUps.
        },
        save(object){
            let value = this.get('newValue');
//            let newDate = moment(new Date(value)).format('HH:mm:ss');
            let newDate = moment(value,'HH:mm:ss');
            if (newDate == "Invalid date")
                newDate = null;
            object.set(this.get('field'), newDate.format('HH:mm:ss'));

            field = this.get('field');
            object.save().catch(function(reason) {
      
                let editError = document.getElementById("instrumentEditError");
                editError.hidden = false;
                
                if (originVal == null) {
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
    willDestroyElement() {
        if (this.get('dateTimePicker')) {
            this.get('dateTimePicker').datetimepicker("destroy");
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
