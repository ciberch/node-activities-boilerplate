function AppHelper(){

    this.fuzzy = function(date) {
        // Make a fuzzy time
        var delta = Math.round((+new Date - date) / 1000);

        var minute = 60,
            hour = minute * 60,
            day = hour * 24,
            week = day * 7;

        var fuzzy;

        if (delta < 30) {
            fuzzy = 'just now.';
        } else if (delta < minute) {
            fuzzy = delta + ' seconds ago.';
        } else if (delta < 2 * minute) {
            fuzzy = 'a minute ago.'
        } else if (delta < hour) {
            fuzzy = Math.floor(delta / minute) + ' minutes ago.';
        } else if (Math.floor(delta / hour) == 1) {
            fuzzy = '1 hour ago.'
        } else if (delta < day) {
            fuzzy = Math.floor(delta / hour) + ' hours ago.';
        } else if (delta < day * 2) {
            fuzzy = 'yesterday';
        }

        return fuzzy;
    };

    this.trimForServer = function (items) {
        if (items && items.length > 0) {
            var val = items[0];
            return val.innerText.trimRight().toLowerCase();
        }
        return null;
    };

    this.getLocation = function(position) {
        var mapOptions = {
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        App.map = new google.maps.Map(document.getElementById('map'),mapOptions);
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        App.map.setCenter(pos);
        var marker = new google.maps.Marker({
          position: pos,
          map: App.map,
          title: 'Drag to the proper location',
          draggable:true
        });
        google.maps.event.addListener(marker, 'click', function() {
          console.log("New position is ");
          console.dir(marker.getPosition());
          App.map.setCenter(marker.getPosition());
        });

        $("#map").show();

    }
};
