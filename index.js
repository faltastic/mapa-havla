// http://bl.ocks.org/zross/47760925fcb1643b4225

var colors = {
  "english": {
    "name": `cyan`,
    "code": `#00ffff`
  },
  "arabic": {
    "name": `magenta`,
    "code": `#eb00ff`
  }
};

document.getElementById("arabic").style.backgroundColor = colors.arabic.code;
document.getElementById("english").style.backgroundColor = colors.english.code;

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

var promise = $.getJSON("grafs.json");
promise.then(function (data) {

  L.geoJson(data, {
    onEachFeature: onEachFeature
  });

  var arabic = L.geoJson(data, {
    filter: function (feature, layer) {
      return feature.properties.Tag.includes("Arabic");
    },
    pointToLayer: function (feature, latlng) {
      var thisMarker = L.marker(latlng, {
        icon: iconColor(colors.arabic.name),
        opacity: 0.7
      });
      thisMarker.on("click", renderThisContent);
      return thisMarker;
    }
  });

  var english = L.geoJson(data, {
    filter: function (feature, layer) {
      return feature.properties.Tag.includes("English");
    },
    pointToLayer: function (feature, latlng) {
      var thisMarker = L.marker(latlng, {
        icon: iconColor(colors.english.name),
        opacity: 0.7
      });
      thisMarker.on("click", renderThisContent);
      return thisMarker;
    }
  });

  var layersArray = [english, arabic];

  layersArray.forEach(function (element) {
    element.addTo(map)
  });

  // FILTER 

  $("#english").click(function () {
    map.addLayer(english)
  });
  $("#arabic").click(function () {
    map.addLayer(arabic)
  });
  $("#alllayers").click(function () {
    layersArray.forEach(function (element) {
      map.addLayer(element)
    });
  });
  $("#nolayers").click(function () {
    layersArray.forEach(function (element) {
      map.removeLayer(element)
    });
  });

});

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