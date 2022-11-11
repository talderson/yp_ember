import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from "@ember/service";

export default class CreateInstrumentController extends Controller {
    @service store;
    instType = 0;
    isVisibleError = false;
    duplicateError = false;
    typeError = false;
    fieldError = false;

    breadCrumbs = [
        {
            label: "Dashboard",
            path: "index"
        },
        {
            label: "Instruments",
            path: 'instruments'
        },
        {
            label: 'Create Instrument',
            path: 'create-instrument',
        }
    ];

    actions = {
        choseForm(value) {
            Ember.set(this, 'instType', value);
        },
        submit(id) {
            if (id != null) {
                this.transitionToRoute('edit-instrument', id);
            } else {
                this.transitionToRoute('instruments');
            }
        },
        setError(error,value) {
            Ember.set(this, error, value);
        },
    };
}

// export default Ember.Controller.extend({
//     instType: 0,
//     id: "",
//     store: Ember.inject.service(),
    
//     isVisibleError: false,
//     duplicateError: false,
//     typeError: false,
//     fieldError: false,

//     breadCrumbs: computed({
//         get() {
//             let obj = [
//                 {
//                     label: "Instruments",
//                     path: 'instruments'
//                 },
//                 {
//                     label: 'Create Instrument',
//                     path: 'create-instrument',
//                 }
//             ]
        
//             return obj;
//         }
//     }),
//     actions: {
//         choseForm(value) {
//             Ember.set(this, 'instType', value);
//         },
//         submit(id) {
//             if (id != null) {
//                 this.transitionToRoute('edit-instrument', id);
//             } else {
//                 this.transitionToRoute('instruments');
//             }
//         },
//         setError(error,value) {
//             Ember.set(this, error, value);
//         }
//     }
// });
