/* variables */
var totalPopulationCountywise = [];
var countywiseAgeDataArray = [];
var countywiseRaceDataArray = [];
var countyArray = {};


// Keep data ready for Population statewise
function getCountywisePopulationData(){

  var width = 960;
  var height = 400;

  d3.select("#graph").selectAll('svg').remove();
  var svg = d3.select("#graph")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  var projection = d3.geoAlbersUsa()
                    .scale(1280)
                    .translate([width / 2, height / 2]);

  var path = d3.geoPath()
                .projection(projection);

  d3.json("http://api.census.gov/data/2015/acs1?get=NAME,B01003_001E&for=county:*&key=",
            function(countyPopulationData) {
              $.each( countyPopulationData, function( i, val ) {
                  if(i > 0){
                    county = val[0];
                    count  = val[1];
                    stateID = val[2];
                    countyID = val[2] + val[3];
                    countyArray[countyID] = count;
                  }
              });
  });

   var quantize = d3.scaleQuantize()
                     .domain([d3.min(d3.values(countyArray)),
                           d3.max(d3.values(countyArray)) ])
                     .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

     d3.json("http://bl.ocks.org/mbostock/raw/4090846/us.json",
    function (error, us) {
      if (error) throw error;

       svg.append("g")
          .attr("class", "counties")
          .selectAll("path")
          .data(topojson.feature(us, us.objects.counties).features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("stroke", "#525252")
          .style("stroke-width", "1")
          .style("fill", function(d) { return quantize(countyArray[d.id]); })
          .attr("d", path);
/*
        svg.selectAll("path")
          .data(topojson.feature(us, us.objects.counties).features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("stroke", "#525252")
          .style("stroke-width", "1")
          .style("fill", function(d) {
                  // Get data value
                  var value =  countyArray[d.id];
                  if (value) {
                    //If value exists…
                    countyID = countyArray[d.id];
                    return quantize( countyID );
                  } else {
                  //If value is undefined…
                    return "rgb(247,251,255)";
                  }
      });*/
      svg.append("path")
          .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
          .attr("class", "states")
          .attr("d", path);
    }
  );

}
