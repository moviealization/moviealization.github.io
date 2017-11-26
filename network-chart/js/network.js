d3.select("svg").remove();
// get the data

d3.csv("data/action.csv", function(error, links) {
    var drag = d3.behavior.drag()
        .origin(function(d) { return d; })
        .on("dragstart", dragstarted)
        .on("drag", dragged)
        .on("dragend", dragended);
    var nodes = {};
    var person = [];
    // Compute the distinct nodes from the links.
    var i = 0;
    links.forEach(function(link) {
        person[i] = link.target; i++;
        link.source = nodes[link.source] ||
            (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] ||
            (nodes[link.target] = {name: link.target});
        link.value = +link.value;
    });
    var //width=1300,
        height=540;
        //color = d3.scale.category20c();

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
     //   .size([width,height])
        .linkDistance(100)
        .charge(-300)
        .on("tick", tick)
        .start();
    var svg = d3.select("body").append("svg")
        .attr("width", '100%')
        .attr("height", height)
        .call(d3.behavior.zoom().on("zoom", function () {
            svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
          }))
        .append("g");    

    // add the links and the arrows
    var path = svg.append("svg:g").selectAll("path")
        .data(force.links())
        .enter().append("svg:path")
        .attr("class", function(d) { return "link " + d.type; })
        //.attr("class", "link")
        //.attr("marker-end", "url(#end)");

    // define the nodes
    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .call(drag);
    // add the nodes
    node.append("circle")
        .attr("r", function(d) { return d.weight * 2+ 12; })
        //.attr("r", 5);
    // add the text
    node.append("text")
        .attr("x", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });
    //exit
    $('g.node').each(function(i, obj) {
        var name = $(this).children("text").text();
        if(jQuery.inArray(name, person) > -1){
            $(this).children("circle").attr("class", "red");
        }
    });

    // add the curvy lines
    function tick() {
        path.attr("d", function(d) {
        //trasnformation - curve between links
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" +
                d.source.x + "," +
                d.source.y + "A" +
                dr + "," + dr + " 0 0,1 " +
                d.target.x + "," +
                d.target.y;
        });
        node
            .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")"; });
    }

    function dragstarted(d) {
        //d3.event.sourceEvent.stopPropagation();
        //d3.select(this).classed("dragging", true);
        d3.event.sourceEvent.stopPropagation();
        
        d3.select(this).classed("dragging", true);
        force.start();
      }
      
      function dragged(d) {
        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
      }
      
      function dragended(d) {
        d3.select(this).classed("dragging", false);
      }
 });