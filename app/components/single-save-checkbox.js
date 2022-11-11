import Ember from 'ember';

export default Ember.Component.extend({
    isChecked: Ember.computed('object', 'field', function() {
        let field = this.get('object').get(this.get('field'));
        return field;//this.get('object').get(field);
    }),
    actions: {
        change(object){
            let _this = this;
            var origVal = this.isChecked;
            object.set(this.get('field'), !this.isChecked);
            object.save().catch(function(reason) {

                let editError = document.getElementById("instrumentEditError");
                editError.hidden = false;

                object.set(_this.get('field'), _this.isChecked);

                //Just need to make this line of code work -> change the checkbox to orignal value
                //Active is properly set, just the front end needs to reflect the change back to original value
                let field = document.getElementById(_this.get('field'));
                field.checked = _this.isChecked;

                window.scrollTo(0,0);
            });

            if(typeof this.update === "function"){
                this.update();
            }
        }
    },
});
