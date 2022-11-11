function initMap() {
    console.log("init map");
    const bingham = { lat: 40.5378, lng: -112.1291 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: bingham,
    });
}