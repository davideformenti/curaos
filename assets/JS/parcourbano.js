


var paolo = '#627BC1'

        //////////////////
        // Mapbox stuff
        //////////////////

        // Set-up map
    	mapboxgl.accessToken = 'pk.eyJ1IjoiZGF2aWRlZm9ybWVudGkiLCJhIjoiY2wwYjR6M2tjMDBjbzNiczE0aTF3ZjQxaCJ9.jTD3zSJAN2tIBc0186PTmg';
        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/davideformenti/ckzdbnosb003u14p9o7xve5hp',
            zoom: 11.5, 
            center: [9.15, 45.45 ],
        });



        let hoveredStateId = null;
 
        map.on('load', () => {
map.addSource('states', {
'type': 'geojson',
'data': '../assets/data/geojson/municipiMilano.geojson'
});
 
// The feature-state dependent fill-opacity expression will render the hover effect
// when a feature's hover state is set to true.
      map.addLayer({
        'id': 'state-fills',
        'type': 'fill',
        'source': 'states',
        'layout': {

        },
        'paint': {
          'fill-color': paolo,
          'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          0.3,
          0.6
          ]
        }
      });
 
map.addLayer({
'id': 'state-borders',
'type': 'line',
'source': 'states',
'layout': {},
'paint': {
'line-color': '#ffd056',
'line-width': 2
}
});

map.on('click', 'state-fills', (e) => {
  d3.select('#municipio').text(e.features[0].properties.MUNICIPIO);
  var res = $('#municipio').text();
  var prefisso ='../assets/img/graphs/Milano_inquinanti_2021/';
  $('#municipio-graph').attr('src', prefisso + res + ".png")
  });
 
// When the user moves their mouse over the state-fill layer, we'll update the
// feature state for the feature under the mouse.
map.on('mousemove', 'state-fills', (e) => {
if (e.features.length > 0) {
if (hoveredStateId !== null) {
map.setFeatureState(
{ source: 'states', id: hoveredStateId },
{ hover: false }
);
}
hoveredStateId = e.features[0].id;
map.setFeatureState(
{ source: 'states', id: hoveredStateId },
{ hover: true }
);
}
});
 
// When the mouse leaves the state-fill layer, update the feature state of the
// previously hovered feature.
map.on('mouseleave', 'state-fills', () => {
if (hoveredStateId !== null) {
map.setFeatureState(
{ source: 'states', id: hoveredStateId },
{ hover: false }
);
}
hoveredStateId = null;
});
});




        //////////////////////////
        // Mapbox+D3 Connection
        //////////////////////////

        // Get Mapbox map canvas container
        var canvas = map.getCanvasContainer();

        // Overlay d3 on the map
        var svg = d3.select(canvas).append("svg");
        var m = svg.append("g").attr("class", "municipi");
       var  g = svg.append("g").attr("class", "gruppetto_sensori");
       var p = svg.append("g").attr("class", "gruppetto");
       
        var transform = d3.geoTransform({point:projectPoint});
	    var path = d3.geoPath().projection(transform);



        // Load map and dataset
        /* map.on('load', function () {
            

            d3.json("data/zona9.geojson", function(err, data) {
                drawData(data);
            });
        }); */

queue()
  .defer(d3.json, '../assets/data/geojson/municipiMilano.geojson')
	.defer(d3.json, '../assets/data/geojson/stazionirilievoinquinanti.geojson')
	.defer(d3.json, '../assets/data/geojson/sentinelle_aggiornate.geojson')
	
	.await(makePlot);
	
function makePlot(error, municipi, stazioni, sentinelle ){
  if (error) throw error;
console.log(stazioni)
console.log(sentinelle)
console.log(municipi)

drawstazioni(stazioni)
  drawData(sentinelle)
//   Municipi(municipi)
  
        };

        // Project GeoJSON coordinate to the map's current state
      
        //////////////
        // D3 stuff
        //////////////

        // Draw GeoJSON data with d3
        var sensori;
        var stazioni;
        var municipi;

        function project(d) {
            return map.project(new mapboxgl.LngLat(+d[0], +d[1]));
        }
                
        function projectPoint(lon, lat) {
            var point = map.project(new mapboxgl.LngLat(lon, lat));
            this.stream.point(point.x, point.y);
        }
        
        function drawData(data) {
            console.log("draw data");

            // Add circles
/* 
            .append("svg:image")
            .attr("xlink:href", "img/icons/sun.svg")
            .attr("width", 40)
            .attr("height", 40)
            .attr("x", 228)
            .attr("y",53); */
            sensori = g.selectAll("circle")
                .data(data.features)
                .enter()
                .append("svg:image")
                
                .attr("xlink:href", function (d){
                  return d.properties.icon_path
                })
                    
                    .attr("width", 40)
                    .attr("height", 40)
                    .attr("class","sensore")
                    .attr("style","cursor:pointer")
                    .on("click", function(d) {
                        d3.select('#NomeStazione').text(d.properties.Zona);
                        d3.select('#SinossiQualitativa').text(d.properties.descrizione);
                        d3.select('#StatoSentinella').text(d.properties.StatoSentinella);
                        d3.select('#Inquinanti').text(d.properties.Inquinanti);
                        d3.select('#ValoriInquinanti').text(d.properties.Valori_inquinanti);

                    });
                    
                    
              
            // Call the update function
            update();

            // Update on map interaction
            map.on("zoomend", update);
            map.on("move",      update);
            map.on("moveend",   update);

            function update() {
            sensori.attr("x", function(d) { return project(d.geometry.coordinates).x })
                   .attr("y", function(d) { return project(d.geometry.coordinates).y });
        }

        }
        
        function drawstazioni(data) {
           

            // Add circles
            stazioni =p.selectAll("circle")
                .data(data.features)
                .enter()
                .append("image")
                .attr("xlink:href", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNzUycHQiIGhlaWdodD0iNzUycHQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDc1MiA3NTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiA8Zz4KICA8cGF0aCBkPSJtNzUyIDM3NmMwIDEzNC4zMy03MS42NjQgMjU4LjQ2LTE4OCAzMjUuNjItMTE2LjM0IDY3LjE2OC0yNTkuNjYgNjcuMTY4LTM3NiAwLTExNi4zNC02Ny4xNjQtMTg4LTE5MS4yOS0xODgtMzI1LjYyczcxLjY2NC0yNTguNDYgMTg4LTMyNS42MmMxMTYuMzQtNjcuMTY4IDI1OS42Ni02Ny4xNjggMzc2IDAgMTE2LjM0IDY3LjE2NCAxODggMTkxLjI5IDE4OCAzMjUuNjIiIGZpbGw9IiNmZmYiLz4KICA8cGF0aCBkPSJtMzc2IDE1MS4wNWMtMTI0LjA4IDAtMjI0Ljk1IDEwMC44Ny0yMjQuOTUgMjI0Ljk1czEwMC44NyAyMjQuOTUgMjI0Ljk1IDIyNC45NWMxMjQuMDggMC4wMDM5MDYgMjI0Ljk1LTEwMC44NyAyMjQuOTUtMjI0Ljk1cy0xMDAuODgtMjI0Ljk1LTIyNC45NS0yMjQuOTV6bTEwOC45MyAyMDQuNTktNDEuMjAzIDM3Ljg4N2MtMi4zNjcyIDIuMzY3Mi0zLjMxNjQgNS42ODM2LTIuODM5OCA4Ljk5NjFsMTEuMzYzIDUzLjk5MmMyLjgzOTggMTMuMjYyLTExLjM2NyAyMy4yMDctMjMuMjA3IDE2LjU3NGwtNDguMzAxLTI3LjQ2OWMtMi44Mzk4LTEuNDIxOS02LjYyODktMS40MjE5LTkuNDcyNyAwbC00OC4zMDUgMjcuNDY5Yy0xMS44NCA2LjYyODktMjUuNTc0LTMuNzg5MS0yMy4yMDctMTYuNTc0bDExLjM2Ny01NC40NjFjMC40NzI2Ni0zLjMxNjQtMC40NzI2Ni02LjYyODktMi44Mzk4LTguOTk2MWwtNDEuMjAzLTM3Ljg4N2MtOS45NDUzLTguOTk2MS00LjczNDQtMjUuNTc0IDguOTk2MS0yNi45OTJsNTUuNDEtNi4xNTYyYzMuMzE2NC0wLjQ3MjY2IDYuMTU2Mi0yLjM2NzIgNy41NzgxLTUuNjgzNmwyMi43My01MC42OGM1LjY4MzYtMTIuMzEyIDIyLjczLTEyLjMxMiAyOC40MTQgMGwyMy4yMDcgNTAuNjcyYzEuNDIxOSAyLjgzOTggNC4yNjE3IDUuMjEwOSA3LjU3ODEgNS42ODM2bDU1LjQxIDYuMTU2MmMxMy4yNTggMS40MjE5IDE4LjQ2OSAxNy45OTYgOC41MjM0IDI3LjQ2OXoiIGZpbGw9IiMzYjZhZjkiLz4KIDwvZz4KPC9zdmc+Cg==")
                    
                .attr("width", 30)
                .attr("height", 30)
                .attr("class","sensore_arpa_milano")

/*                     .attr("r", 10).attr("fill","red")*/       
                      .on("click", function(d) {
                        d3.select(this).style('fill', 'white'); 
                        d3.select('#location').text(d.properties.nome);
                        d3.select('#pollutants').text(d.properties.inquinanti);
                        d3.select('#IDARPA').text(d.properties.id_amat);
                        d3.select('#Company').text(d.properties.Company);
                        d3.select('#job').text(d.properties.Job);
                        d3.select('#bnsstrt').text(d.properties.BusinessStreet);
                        d3.select('#bnsst').text(d.properties.BusinessState);
                        d3.select('#bnscnt').text(d.properties.BusinessCountry);
                        d3.select('#hmcty').text(d.properties.HomeCity);
                        d3.select('#mass').text(d.properties.mass);
                        d3.select('#tooltip')
                          .style('left', (d3.event.pageX + 20) + 'px')
                          .style('top', (d3.event.pageY - 80) + 'px')
                          .style('display', 'block')
                          .style('opacity', 0.9)
                      })
                      //Add Event Listeners | mouseout
                      .on('mouseout', function(d) { 
                        d3.select(this).style('fill', 'red');
                        d3.select('#tip')
                          .style('display', 'none');
                      });
                    
                    console.log(stazioni);
            // Call the update function
            update();

            // Update on map interaction
            map.on("zoomend", update);
            map.on("move",      update);
            map.on("moveend",   update);
            

            function update() {
            stazioni.attr("x", function(d) { return project(d.geometry.coordinates).x })
                   .attr("y", function(d) { return project(d.geometry.coordinates).y });
        }


        }

        /* function Municipi(data) {
            console.log("draw data");

            // Add polygons
            municipi = m.selectAll("path")
        		.data([data])
        		.enter()
        		.append("path");

            // Call the update function
            update();

            // Update on map interaction
            map.on("viewreset", update);
            map.on("move",      update);
            map.on("moveend",   update);

            function update() {
            console.log("update");

            municipi.attr("d", path)
            .attr('stroke', 'white')
    .attr('fill', 'transparent')
    .attr('opacity', '50%');
  }
        } */
       

        // Update d3 shapes' positions to the map's current state
        

