var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1GxeT-u0qHCKC6knmYKuZed7NXTb6pI0xW_4cfkUz-MY/pubhtml';
// https://docs.google.com/spreadsheets/d/e/2PACX-1vQpitgwgSdSCdNZt1vHbBKizbucDmnlOcHxOySlprnGh0192kTPh7UStHuNOjHBw-SxWoG1sangl4DG/pubhtml?gid=0&single=true
//1GxeT-u0qHCKC6knmYKuZed7NXTb6pI0xW_4cfkUz-MY


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

