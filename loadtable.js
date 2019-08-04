var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1U5e1D69IhQ9d9dO2Qt9dM-0K1WTuIOChEkDyXkOU86s/pubhtml';


function loadTable() {
    Tabletop.init( 
        { key: publicSpreadsheetUrl,
        callback: parseAndMap,
        simpleSheet: true } 
        )
}

function parseAndMap(dataRaw, tabletop) {
    //console.log(dataRaw);

    let data ={
        "type": "FeatureCollection",
        "features": []
    };

    dataRaw.forEach(element => { 

        let dataPoint = {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Point",
              "coordinates": []
            }
        };

        dataPoint.properties = {
          "id": parseInt(element.id),
          "Photo": element.Photo,
          "Tag": element.Tag,
          "Title": element.Title,
          "Description": element.Description
        };
        dataPoint.geometry.coordinates = 
        element["Location (Longitude, Latitude)"].split(", ").reverse().map(x=>parseFloat(x));
        data.features.push(dataPoint);
    });

    //console.log(data);
    mapTheData(data);
   
}

window.addEventListener('DOMContentLoaded', loadTable);

/* 
// FROM JSON
var promise = $.getJSON("grafs.json");
promise.then(function (data) { mapTheData(data);});
*/

