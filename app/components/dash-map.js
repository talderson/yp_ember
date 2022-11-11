import Component from '@glimmer/component';
import Ember from 'ember';

// export default class DashMapComponent extends Component {
//     zoom = 12;
//     mapBounds = Ember.computed(function() {
//         return [[40.574706, -112.178131],[40.492465, -112.099509]];
//     });
// }

export default Ember.Component.extend({
    didInsertElement() {
        var map = L.map('dashMap', {
            center: [this.lat, this.lng],
            zoom: this.zoom
        });
        //L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(map);
        L.imageOverlay("/assets/images/mine.png",this.mapBounds).addTo(map);
        let marker = L.marker([40.561220,-112.142008]);

        let popupContent = "<h4>ID: " + "<a href=\"/instrument/190171001/\">190171001</a>" + "<br />" +
                            "Type: " + "Exto" + "<br />" +
                            "Level: " + "AC1" + "<br />" +
                            "State: " + "Normal</h4>";


        marker.bindPopup(popupContent).openPopup();
        marker.addTo(map);
    },
    lat: 40.530220,
    lng: -112.142008,
    zoom: 14,
    mapBounds: Ember.computed(function() {
        return [[40.574706, -112.178131],[40.492465, -112.099509]];
    }),

})