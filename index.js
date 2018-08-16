// http://bl.ocks.org/zross/47760925fcb1643b4225

var tags = {
  "English": {
    "color": `cyan`,
    "colorcode": `#00ffff`,
    "layer":{},
    "visible": true
  },
  "Arabic": {
    "color": `magenta`,
    "colorcode": `#eb00ff`,
    "layer":{},
    "visible": true
  }
};

var filters = document.getElementById('filter-buttons');
for (key in tags) {
  filters.innerHTML += `<a id=` +key+ ` class="button is-small is-rounded"> ` + key+ ` </a>`; 
  document.getElementById(key).style.backgroundColor = tags[key]["colorcode"]; 
}

var content = [0];
var contentDiv = document.getElementById('content');

var currentID = 0;

function onEachFeature(feature, layer) {
  var contentHtml = `<a class="open-modal" data-modal-id="#my-modal"><img src="img/` + feature.properties.Name + `"  /></a>`;
  contentHtml += `<h2>` + feature.properties.Title + `</h2>`;
  contentHtml += `<p>` + feature.properties.Description + `</p>`;
  content[feature.properties.id] = contentHtml;
}

function renderThisContent(e) {
  contentDiv.style.opacity = 0;
  currentID = e.target.feature.properties.id;

  setTimeout(function () {
    contentDiv.innerHTML = content[currentID];
    contentDiv.style.opacity = 1;
    $('.open-modal').click(toggleModalClasses);
    document.getElementById("imgModal").src = `img/` + e.target.feature.properties.Name;
  }, 500);

}

// MAP

var Stamen_TonerBackground = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
});
var CartoDB_DarkMatter = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19
});

var CartoDB_DarkMatterNoLabels = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19
});

var map = L.map('map')
  .addLayer(CartoDB_DarkMatterNoLabels)
  .setView([31.7852527, 35.231493600], 20)
  .setZoom(12);

function iconColor(color) {
  return L.icon({
    iconUrl: `icn/circle-` + color + `.svg`,
    iconSize: [10, 10]
  });
}

// Data Promise

var promise = $.getJSON("grafs.json");
promise.then(function (data) {

  L.geoJson(data, {
    onEachFeature: onEachFeature
  });
  
  for (key in tags) {

    tags[key]["layer"] = L.geoJson(data, {
      filter: function (feature, layer) {
        return feature.properties.Tag.includes(key);
      },
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: iconColor(tags[key]["color"]),
          opacity: 0.7
        }).on("click", renderThisContent);  
      }
    });
    tags[key]["layer"].addTo(map);
    console.log(key, tags[key]["color"]);
    
  }
  
  // FILTERS 
  
  $("#alllayers").click(function () {
    for (key in tags) {
      map.addLayer(tags[key]["layer"]);
      tags[key]["visible"] = true;
    }
  });
  $("#nolayers").click(function () {
    for (key in tags) {
      map.removeLayer(tags[key]["layer"]);
      tags[key]["visible"] = false;
    }
  });
  
   $("#English").click(function () {
     var tag = tags["English"];
     if(tag["visible"]){ map.removeLayer(tag["layer"]); }
     else{ map.addLayer(tag["layer"]); }
     tag["visible"] = !tag["visible"];
    });
   $("#Arabic").click(function () {
     var tag = tags["Arabic"];
     if(tag["visible"]){ map.removeLayer(tag["layer"]); }
     else{ map.addLayer(tag["layer"]); }
     tag["visible"] = !tag["visible"];
    });

}); //End Promise

// MODAL

function toggleModalClasses(event) {
  var modalId = event.currentTarget.dataset.modalId;
  var modal = $(modalId);
  modal.toggleClass('is-active');
  $('html').toggleClass('is-clipped');
};

$('.open-modal').click(toggleModalClasses);
$('.modal-close').click(toggleModalClasses);
$('.modal-background').click(toggleModalClasses);


/*
function circleiconColor(color) {
  return {
    radius: 8,
    fillColor: color,
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.5
  }
}
*/