// http://bl.ocks.org/zross/47760925fcb1643b4225

var tags = {
  "English": {
    "color": `cyan`,
    "colorcode": `#00ffff`,
    "layer": {},
    "visible": true
  },
  "Arabic": {
    "color": `magenta`,
    "colorcode": `#eb00ff`,
    "layer": {},
    "visible": true
  },
  "DickPic": {
    "color": `yellow`,
    "colorcode": `#faed27`,
    "layer": {},
    "visible": true
  }

};

var filters = document.getElementById('filter-buttons');
for (key in tags) {
  filters.innerHTML += `<br /> <a id=` + key + ` class="button is-small is-rounded"> ` + key + ` </a>`;
  document.getElementById(key).style.backgroundColor = tags[key]["colorcode"];
}

var content = [0];
var contentDiv = document.getElementById('content');

var currentID = 0;

function onEachFeature(feature, layer) {
  var contentHtml = `<a class="open-modal" data-modal-id="#my-modal"><img src="img/` + feature.properties.Photo + `"  /></a>`;
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
    document.getElementById("imgModal").src = `img/` + e.target.feature.properties.Photo;
  }, 500);

}

// MAP

/*
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
*/

var CartoDB_DarkMatterNoLabels = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19
});

var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  maxZoom: 19
});


var map = L.map('map')
  //.addLayer(CartoDB_Positron)
  .addLayer(CartoDB_Positron)

  .setView([50.0825011, 14.4266144], 2)
  .setZoom(13);

function iconColor(color) {
  return L.icon({
    iconUrl: `icn/circle-` + color + `.svg`,
    iconSize: [10, 10]
  });
}

// Data Handling

function mapTheData(data) {

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

  for (key in tags) {
    console.log(document.getElementById(key));
    let tag = tags[key];
    document.getElementById(key).onclick = function(){
      if (tag["visible"]) {
        map.removeLayer(tag["layer"]);
      } else {
        map.addLayer(tag["layer"]);
      }
      tag["visible"] = !tag["visible"];
    };
  }  

}; 


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

$(".switch").each(function (i) {
  var classes = $(this).attr("class"),
    id = $(this).attr("id"),
    name = $(this).attr("name");
  console.log($(this).attr("value"));

  $(this).wrap('<div class="switch" id="' + name + '"></div>');
  $(this).after('<label for="switch-' + i + '"></label>');
  $(this).attr("id", "switch-" + i);
  $(this).attr("name", name);
});
$(".switch input").change(function () {
  $("body").toggleClass("light");
  switchMap();
});

function switchMap() {

  if (map.hasLayer(CartoDB_DarkMatterNoLabels)) {
    map.removeLayer(CartoDB_DarkMatterNoLabels);
    map.addLayer(CartoDB_Positron);
  } else {
    map.removeLayer(CartoDB_Positron);
    map.addLayer(CartoDB_DarkMatterNoLabels);
  }
}