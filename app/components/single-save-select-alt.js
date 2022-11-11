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
    store: Ember.inject.service(),
    isEditable: true,
    isEditing: false,
    isRelational: true,
    selectOptionsArray: Ember.computed.map('selectOptions', function(item){
        const selectOptionsKyes = this.get('selectOptionsKyes').split(",");
        return {
            key: Ember.get(item, selectOptionsKyes[0]),
            value: Ember.get(item, selectOptionsKyes[1])
        };
    }),
    modelName: Ember.computed('selectOptions', function() {
        return this.get('selectOptions.type.modelName');
    }),
    actions: {
        selectNewValue(value){
            this.set('newValue', value);
        },
        edit(){
            this.set('isEditing', true);
            this.set('newValue', this.get(`object.${this.get('valueSource')}`));
            //this.$('.has-tooltip-info').tooltip('hide'); //hide any active tooltips
            return this.element.tabindex = 1, this.element.focus(); // brings the view into focus in order to capture keyUps.
        },
        save(object){
            let modelName = this.get('modelName');
            //console.log(this.get('newValue'));
            object.set(this.get('valueSource'), this.get('newValue'));
            object.save();
            this.set('isEditing', false);
            //this.$('.has-tooltip-info').tooltip('hide'); //hide any active tooltips
        },
        cancel(){
            this.set('newValue', this.get(`object.${this.get('field')}`));
            this.set('isEditing', false);
            //this.$('.has-tooltip-info').tooltip('hide'); //hide any active tooltips
        }
    },
    didRender(){
        //this.$('.has-tooltip-info').tooltip(); //activate tooltips
    },
    keyDown: function(e) {
        if (e.keyCode === 27) {
            this.send('cancel', this.get('object'));
        }
    }
});
