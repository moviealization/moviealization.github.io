//set width and height
var width = document.getElementById('vis')
    .clientWidth;
var height = document.getElementById('vis')
    .clientHeight;

//set attributes
var margin = {
    top: 10,
    bottom: 70,
    left: 70,
    right: 20
}

var svg = d3.select('#vis')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var data = {};

var x_scale = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1);

var y_scale = d3.scaleLinear()
    .range([height, 0]);

var colour_scale = d3.scaleQuantile()
    .range(["#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"]);

var y_axis = d3.axisLeft(y_scale);
var x_axis = d3.axisBottom(x_scale);

	svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
	.style("font", "11px times");

svg.append('g')
    .attr('class', 'y axis');




//create function draw
function draw(year) {

    var csv_data = data[year];

    var t = d3.transition()
        .duration(2000);

    var genres = csv_data.map(function(d) {
        return d.genre;
    });
    x_scale.domain(genres);

    var max_value = d3.max(csv_data, function(d) {
        return +d.value;
    });

    y_scale.domain([0, max_value]);
    colour_scale.domain([0, max_value]);

    var bars = svg.selectAll('.bar')
        .data(csv_data)

    bars
        .exit()
        .remove();



    var new_bars = bars
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
            return x_scale(d.genre);
        })
        .attr('width', x_scale.bandwidth())
        .attr('y', height)
        .attr('height', 0)
		.on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("display", "none");

function mouseover(d) {
  div.style("display", "inline")
  div.text(d.value);
}

function mousemove(d) {
  div
      .text(d.value)
      .style("left", (d3.event.pageX - 34) + "px")
      .style("top", (d3.event.pageY - 12) + "px");
}

function mouseout() {
  div.style("display", "none");
}
	
    new_bars.merge(bars)
        .transition(t)
        .attr('y', function(d) {
            return y_scale(+d.value);
        })
        .attr('height', function(d) {
            return height - y_scale(+d.value)
        })
        .attr('fill', function(d) {
            return colour_scale(+d.value);
        })
		

    svg.select('.x.axis')
        .call(x_axis);
	

    svg.select('.y.axis')
        .transition(t)
        .call(y_axis);

	svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 50) + ")")
      .style("text-anchor", "middle")
    .style("font", "16px times") 
	.text("Film Genre")
	


// text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
	  .style("font", "16px times") 
      .text("Facebook Likes / Number of Films"); 


//read json file
d3.json("readme.json", function(error, root) {
  if (error) throw error;
	hierarchy.nodes(root);
  y.domain([0, root.value]).nice();
  down(root, 0);
});
}

d3.queue()
    .defer(d3.csv, 'data/p11.csv')
    .defer(d3.csv, 'data/p10.csv')
    .defer(d3.csv, 'data/p9.csv')
    .defer(d3.csv, 'data/p8.csv')
    .defer(d3.csv, 'data/p7.csv')
    .defer(d3.csv, 'data/p6.csv')
	.defer(d3.csv, 'data/p5.csv')
	.defer(d3.csv, 'data/p4.csv')
	.defer(d3.csv, 'data/p3.csv')
	.defer(d3.csv, 'data/p2.csv')
	.defer(d3.csv, 'data/p1.csv')
    .await(function(error, d2016, d2006, d1996, d1986, d1976, d1966, d1956, d1946, d1936, d1926) {
        data['1926'] = d1926;
        data['1936'] = d1936;
        data['1946'] = d1946;
        data['1956'] = d1956;
        data['1966'] = d1966;
        data['1976'] = d1976;
		data['1986'] = d1986;
		data['1996'] = d1996;
		data['2006'] = d2006;
		data['2016'] = d2016;
        draw('2016');
    });


var slider = d3.select('#year');
slider.on('change', function() {
    draw(this.value);
});

