


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
       var  g = svg.append("g").attr("class", "gruppetto");
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
	.defer(d3.json, '../assets/data/geojson/zona9.geojson')
	
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
        var circles;
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
            circles = g.selectAll("circle")
                .data(data.features)
                .enter()
                .append("circle")
                    .attr("r", 10).attr("fill","#ffd056")
                    .on("click", function(d) {
                        alert(d.properties.name);
                    });

            // Call the update function
            update();

            // Update on map interaction
            map.on("zoomend", update);
            map.on("move",      update);
            map.on("moveend",   update);

            function update() {
            circles.attr("cx", function(d) { return project(d.geometry.coordinates).x })
                   .attr("cy", function(d) { return project(d.geometry.coordinates).y });
        }

        }
        
        function drawstazioni(data) {
           

            // Add circles
            stazioni =p.selectAll("circle")
                .data(data.features)
                .enter()
                .append("circle")
                    .attr("r", 10).attr("fill","red")
                    .on("click", function(d) {
                        d3.select(this).style('fill', 'white'); 
                        d3.select('#location').text(d.properties.nome);
                        d3.select('#pollutants').text(d.properties.inquinanti);
                        d3.select('#LastName').text(d.properties.id_arpa);
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
            stazioni.attr("cx", function(d) { return project(d.geometry.coordinates).x })
                   .attr("cy", function(d) { return project(d.geometry.coordinates).y });
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
        