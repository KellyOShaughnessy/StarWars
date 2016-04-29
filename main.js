// d3.legend.js 
// (C) 2012 ziggy.jonsson.nyc@gmail.com
// MIT licence

(function() {
d3.legend = function(g) {
  g.each(function() {
    var g= d3.select(this),
        items = {},
        svg = d3.select(g.property("nearestViewportElement")),
        legendPadding = g.attr("data-style-padding") || 5,
        lb = g.selectAll(".legend-box").data([true]),
        li = g.selectAll(".legend-items").data([true])

    lb.enter().append("rect").classed("legend-box",true)
    li.enter().append("g").classed("legend-items",true)

    svg.selectAll("[data-legend]").each(function() {
        var self = d3.select(this)
        items[self.attr("data-legend")] = {
          pos : self.attr("data-legend-pos") || this.getBBox().y,
          color : self.attr("data-legend-color") != undefined ? self.attr("data-legend-color") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke") 
        }
      })

    items = d3.entries(items).sort(function(a,b) { return a.value.pos-b.value.pos})

    
    li.selectAll("text")
        .data(items,function(d) { return d.key})
        .call(function(d) { d.enter().append("text")})
        .call(function(d) { d.exit().remove()})
        .attr("y",function(d,i) { return i+"em"})
        .attr("x","1em")
        .text(function(d) { ;return d.key})
    
    li.selectAll("circle")
        .data(items,function(d) { return d.key})
        .call(function(d) { d.enter().append("circle")})
        .call(function(d) { d.exit().remove()})
        .attr("cy",function(d,i) { return i-0.25+"em"})
        .attr("cx",0)
        .attr("r","0.4em")
        .style("fill",function(d) { console.log(d.value.color);return d.value.color})  
    
    // Reposition and resize the box
    var lbbox = li[0][0].getBBox()  
    lb.attr("x",(lbbox.x-legendPadding))
        .attr("y",(lbbox.y-legendPadding))
        .attr("height",(lbbox.height+2*legendPadding))
        .attr("width",(lbbox.width+2*legendPadding))
  })
  return g
}
})()

// Twinkling Background 
body=document.body;
loop={
	//initializing stars
	start:function(){
		for (var i=0; i <= 300; i++) {
			var star=this.newStar();
			star.style.top=Math.random()*100+"%";
			star.style.left=Math.random()*100+"%";
			star.style.webkitAnimationDelay=Math.random()+"s";
			star.style.mozAnimationDelay=Math.random()+"s";
			body.appendChild(star);
		};
	},

	//creates html circle dom for star
	newStar:function(){
		var d = document.createElement('div');
		var rand = Math.random() * 10;
		if (rand < 4) {
			d.innerHTML = '<figure class="circle_med"></figure>';
		}
		else if (rand < 8 && rand > 4) {
		d.innerHTML = '<figure class="circle_small"></figure>';
 		}
 		else {
		d.innerHTML = '<figure class="circle_big"></figure>';
 		}
 		return d.firstChild;
	}
};
loop.start();

//Dropdown menu functions

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

function drop() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropdown-but')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

//Additional Graphics

function graphics(ep) {
	console.log("EP: " + ep)
	d3.csv("planet_info.csv", function(RandCSV) {
	 	var dataset = {planets:[]};
	 	var type_counts = [0,0,0,0,0,0,0];
	 	var d_counts = [0,0];
	 	var diams = [];
	 	var pops = [];

	 	var color2 = ["#26518c", "#5f8fd3", "#c3d5ef",
				"#a93f0a", "#f4783e","#fbcdb7", 
				"#298941", "#4fc96e", "#b0e8be",
				"#3e3e75", "#7979b9", "#cdcde5",
				"#a11250", "#eb478e", "#f7bbd6",
				"#595959", "#999999", "#d9d9d9"];

	    RandCSV.forEach(function(planetRow, i) {
	    	//Get pertinent data
	      if (planetRow["PLANET"] != null) {
	      	var episodes = planetRow["FILMS (EP)"].split(",").map(function(x) { return +x; });
	      	console.log(episodes);
	      	//planet in this episode; ep = 0 if all episodes
	      	if (ep == 0 || episodes.includes(ep)) {
	      		console.log(ep + " " + episodes)
		        dataset.planets.push({
		        	id: planetRow["PLANET"],
		        	type: planetRow["TYPE"],
		        	diameter: planetRow["DIAMETER"],
		        	pop: planetRow["POPULATION"],
		        	films: planetRow["FILMS (EP)"],
		        	url: planetRow["IMAGE"],
		        	color: color2[i]
		        });
					}
	      }
	    });
	    //Turn planet type into number
	    for (var i=0; i<dataset.planets.length; i++) {
	    	var t = dataset.planets[i].type;
	    	if (t == "Terrestrial") { type_counts[0] ++; }
	    	if (t == "Gas") { type_counts[1] ++; }
	    	if (t == "Swamp") { type_counts[2] ++; }
	    	if (t == "Metal") { type_counts[3] ++;}
	    	if (t == "Ice") { type_counts[4] ++;}
	    	if (t == "Oceanic") { type_counts[5] ++;}
	    	if (t == "Urban") { type_counts[6] ++;}
	    }
	    //Get population and diameter of planets
	    for (var i=0; i<dataset.planets.length; i++) {
	    	var id = dataset.planets[i].id;
	    	var d = dataset.planets[i].diameter;
	    	var p = dataset.planets[i].pop;
	    	var c = dataset.planets[i].color;

	    	pops.push({id: id, pop:p, color:c});

	    	diams.push(d);
	    	if (d < 12742) { d_counts[0] ++;}
	    	if (d > 12742) { d_counts[1] ++;}
	    }
	//Two circle graphics

	var width = 800,
		full_width = 1200,
	    height = 750,
	    padding = 100,
	    radius = Math.min((width-padding)/2, (height-padding)/2) / 2;

	var color = ["#993300","#ffd633","#339966","#d9d9d9", "#ccffff", "#80b3ff", "#0000cc"];
	var terrains = ["Terrestrial", "Gas", "Swamp", "Metal", "Ice", "Oceanic", "Urban"]

	    	if (t == "Terrestrial") { type_counts[0] ++; }
	    	if (t == "Gas") { type_counts[1] ++; }
	    	if (t == "Swamp") { type_counts[2] ++; }
	    	if (t == "Metal") { type_counts[3] ++;}
	    	if (t == "Ice") { type_counts[4] ++;}
	    	if (t == "Oceanic") { type_counts[5] ++;}
	    	if (t == "Urban") { type_counts[6] ++;}
	var pie = d3.layout.pie()
	    .sort(null);

	var arc = d3.svg.arc()
	    .innerRadius(radius - 20)
	    .outerRadius(radius - 50);

	var svg = d3.select("#graphics").append("svg")
	    .attr("width", full_width)
	    .attr("height", height)
	    .attr("align","center");	

	for (var i = 0; i < color.length; i++) {
		var y = 55 + i * 200 / 7;
		svg.append("rect")
			 .attr("x", 10)
			 .attr("y", y)
			 .attr("height", 10)
			 .attr("width", 10)
			 .style("fill", color[i]);
		svg.append("text")
			 .attr("x", 24)
			 .attr("y", y + 10)
			 .style("fill", "white")
			 .style("font-size", 12)
			 .text(terrains[i]);
	}

	colors = ["#99ccff","#ccff99"]
	for (var i = 0; i < 2; i++) {
		var y = 415 + i * 50 / 2;
		svg.append("rect")
			 .attr("x", 10)
			 .attr("y", y)
			 .attr("height", 10)
			 .attr("width", 10)
			 .style("fill", colors[i]);
		svg.append("text")
			 .attr("x", 24)
			 .attr("y", y + 10)
			 .style("fill", "white")
			 .style("font-size", 12)
			 .text((i == 0 ? "Greater " : "Less ") + "than Earth");
	}

	var svg_terrain = svg.append("g")
					.attr("class","terrain")
					.attr("transform", "translate(" + (width-padding)/4 + "," + (10+radius) + ")");
	var svg_diam_earth = svg.append("g")
					.attr("class","earth")
					.attr("transform", "translate(" + (width-padding)/4 + "," + ((height-padding) / 2 + radius+10) + ")");

	var translation = "translate(100px,0px)";

	//Breakdown of planet terrain type
	var path = svg_terrain.selectAll("path")
	    .data(pie(type_counts))
	  	.enter().append("path")
	  	.attr("x", padding)
	    .attr("fill", function(d, i) { return color[i]; })
	    .attr("d", arc)
	    .style("transform", translation);

	// var sum = 0;
	// var terrain_percents = [];
	// type_counts.forEach(function(e){sum += e;});
	// type_counts.forEach(function(e){terrain_percents.push((e/sum)*100 + "%")});
	// console.log(terrain_percents);

	// svg_terrain.selectAll("text")
	// 			.data(terrain_percents)
	// 			.enter()
	// 			.append("text")
	// 			.text("9")
	// 			.attr("d",arc);

	svg_terrain.append("text")
		.attr("x", 0)
		.attr("y", radius+10)
		.attr("fill", "yellow")
		.attr("font-size","11")
		.text("Breakdown of planets by terrain")
		.attr("text-anchor", "middle")
	  .style("transform", translation);;
	//smaller or bigger than Earth
	var path = svg_diam_earth.selectAll("path")
	    .data(pie(d_counts))
	  	.enter().append("path")
	    .attr("fill", function(d, i) { return colors[i]; })
	    .attr("d", arc)
	    .style("transform", translation);

	svg_diam_earth.append("text")
		.attr("x", 0)
		.attr("y", radius+10)
		.attr("fill", "yellow")
		.text("% planets larger/smaller than Earth")
		.attr("font-size","11")
		.attr("text-anchor", "middle")
	  .style("transform", translation);	

	//planet population comparison graphic:

	//extract population data and sort it
	pops.sort(function(a, b){return b.pop-a.pop});
	var data = [];
	pops.forEach(function(elmt){
		data.push(elmt.pop);
	});

	var scale = d3.scale.log().domain([1,1000000000000])
								.range([1,220]);

	var svg_pop = svg.append("g").attr("class","pop")
					.attr("transform", "translate(" + (full_width-padding) / 3.2 + ",0)");

	var circles = svg_pop.selectAll('.circles')
		.data(data)
		.enter().append('circle')
		.attr('r', function(d)  { return scale(d);})
		.attr("cy", (height-padding)/2)
		.attr("cx", (width-padding)/2)
		.attr("fill", function(d, i) { console.log(pops[data.indexOf(d)].color); return pops[data.indexOf(d)].color; });

	var pop_box_bg = svg_pop.append("rect")
						.attr("fill","black")
						.attr("visibility", "hidden")
						.attr("height", 15)
						;

	var pop_box = svg_pop.append("text")
					.attr("fill", "white")
					.attr("text-decoration","underline overline")
					.attr("font-size","16")
					.attr("text-anchor", "middle")
					.attr("visibility", "hidden");
	
	circles.on("mouseover", function(d,i) {
			d3.select(this).attr("transform","scale(1.01) translate(-3.1,-3.1)")
							// .attr("opacity","0.7")
							;
			var id = pops[data.indexOf(d)].id;
			var xpos = d3.mouse(this)[0]
			var ypos = d3.mouse(this)[1]

			pop_box.attr("visibility","visible").text(id + " Population: "+ d)
					.attr("x", xpos)
					.attr("y", ypos-10);

			bbox = pop_box.node().getBBox();
			pop_box_bg.attr("visibility","visible")
					.attr("width", bbox.width)
					.attr("x", xpos - bbox.width/2)
					.attr("y", ypos-24);
		})
		.on("mouseout", function(d) {
			d3.select(this).attr("transform","scale(1, 1) translate(0,0)")
							// .attr("opacity","1")
							;
			pop_box.attr("visibility","hidden");
			pop_box_bg.attr("visibility","hidden");
		});

		svg_pop.append("text")
			.attr("x", (width-padding)/2)
			.attr("y", (height-padding)-5)
			.attr("fill", "yellow")
			.attr("font-size","14")
			.text("Planet populations")
			.attr("text-anchor", "middle");
		});
}

function populate_planets(selectedFilm) {
	var PLANET_STATE = {
		ORBIT : 0,
		HOVER : 1,
		SELECT : 2
	}

	var t0 = Date.now(),
	  	planets = [],
		 	width = 750,
			height = 750,
			padding = 65,
			mid = {
	      x: width / 2,
	      y: height / 2
	    },
	  	circle = [],
	  	selected = null;

	var svg = d3.select("#svg").append("svg")
	  .attr("height", height)
	  .attr("width", width)
	  .attr("fill", "black");

	var planetInfo1 = svg.append("text").attr("class", "info").attr("x", width/1.4)
	  .attr("y", height/2.3)
	  .attr("fill", "white")
	  .attr("visibility", "visible")
	.style("font-size", "12px");

	var planetInfo2 = svg.append("text").attr("class", "info").attr("x", width/1.4)
	  .attr("y", height/2.2)
	  .attr("fill", "white")
	  .attr("visibility", "visible")
	.style("font-size", "12px");

	var planetInfo3 = svg.append("text").attr("class", "info").attr("x", width/1.4)
	  .attr("y", height/2.1)
	  .attr("fill", "white")
	  .attr("visibility", "visible")
	.style("font-size", "12px");

	var planetInfo4 = svg.append("text").attr("class", "info").attr("x", width/1.4)
	  .attr("y", height/2)
	  .attr("fill", "white")
	  .attr("visibility", "visible")
	.style("font-size", "12px");

	var planetInfo5 = svg.append("text").attr("class", "info").attr("x", width/1.4)
	.attr("y", height/2.5)
	.attr("fill", "white")
	.attr("visibility", "visible")
	.style("font-size", "30px");


	var img_size = 100;

  svg.append("image")
	  .attr("x", mid.x - img_size / 2)
	  .attr("y", mid.y - img_size / 2)
	  .attr("height", img_size)
	  .attr("width", img_size)
    .style("vertical-align", "middle")
    .style("text-align", "center")
    .attr("xlink:href", "img/jarjar.svg");

	d3.csv("planet_info.csv", function(planetsCSV) {

	  var orbitSpeedScale = d3.scale.linear().domain([0,1]).range([.5,.9]);
	  		orbitScale 			= d3.scale.linear().domain([0,1]).range([padding, width - padding - mid.x]),
	  		radiusScale			= d3.scale.log().domain(d3.extent(planetsCSV, function(x) {
	  			return Number(x["DIAMETER"]);
	  		})).range([25,100]);

	  planetsCSV.forEach(function(planetRow, i) {
	    if (planetRow["PLANET"] != null && planetRow["PLANET"] != "Earth") {
	    	var films = planetRow["FILMS (EP)"].split(',').map(function(x) { return +x; });
	    	if (selectedFilm == 0 || films.includes(selectedFilm)) {
	    		var orbit = orbitScale(Math.random());
	    		console.log(orbit);
		      planets.push({
		        orbitSpeed: orbitSpeedScale(Math.random()),
		        orbit: orbit,
		        radius: radiusScale(Number(planetRow["DIAMETER"])),
		        delta: orbit * 50,
		        state: PLANET_STATE.ORBIT,
		        opacity: 1,
		        //offset: planetRow["OFFSET"],
		        id: planetRow["PLANET"],
		  		  climate: planetRow["CLIMATE"],
		  		  population: planetRow["POPULATION"],
		  		  type: planetRow["TYPE"],
		  		  size: planetRow["DIAMETER"],
		        url: planetRow["IMAGE"]
		      });
	    	}
	    }
	  })

	  var planetName = svg.append("text")
	  	.attr("x", padding).attr("y", padding)
	  	.style("fill", "white")
	  	.style("font-size", "26px")
	  	.attr("visibility", "hidden")

	  svg.selectAll("circle").data(planets)
  	  .enter()
  	  .append("circle")
  	  .attr("class", "orbit")
  	  .attr("cx", mid.x)
  	  .attr("cy", mid.y)
	    .style("vertical-align", "middle")
	    .style("text-align", "center")
	    .attr("r", function(d) {
		 		return d.orbit + d.radius / 2;
		  })
		  .style("fill", "none")
		  .style("stroke", "white")
		  .style("stroke-width", 4)
		  .style("opacity", 0.2);

	  svg.selectAll("image").data(planets)
	    .enter()
	    .append("image")
	    .attr("class", "planet")
	    .attr("id", planets.id)
	    .style("vertical-align", "middle")
	    .style("text-align", "center")
	    .attr("height", function(d) {
	      return d.radius;
	    })
	    .attr("width", function(d) {
	      return d.radius;
	    })
	    .attr("x", function(d) {
	      return (mid.x + d.orbit /*+ d.offset*/ );
	    })
	    .attr("y", function(d) {
	      return (mid.y /*+ d.offset*/ );
	    })
	    .attr("opacity", function(d) {
	      return d.opacity;
	    })
	    .attr("xlink:href", function(d) {
	      return ("img/" + d.url);
	    })
	    .on("mouseover", function(d) {
	      d.state = d.state == PLANET_STATE.SELECT ? 
	      					d.state = PLANET_STATE.SELECT :
	      					d.state = PLANET_STATE.HOVER;

	     	planetName.attr("visibility", "visible").text(d.id);

	    })
	    .on("mouseout", function(d) {
	      d.state = d.state == PLANET_STATE.SELECT ? 
	      					d.state = PLANET_STATE.SELECT :
	      					d.state = PLANET_STATE.ORBIT;
	      planetName.attr("visibility", "hidden").text("");
	    })
	    .on("click", function(d) {
	    	if (d.state == PLANET_STATE.SELECT) {
	  			selected = null;
	  			d.state = PLANET_STATE.ORBIT;
					d3.selectAll(".info").text("").attr("visibility", "hidden");
	    	} else {
	  		  if (selected) 
	  		 		selected.state = PLANET_STATE.ORBIT;
	  		 	selected = d;
	  		 	d.state = PLANET_STATE.SELECT;
				
					planetInfo5.text(d.id);
					planetInfo1.text("PLANET TYPE: "+d.type);
					planetInfo2.text("DIAMETER: "+d.size+" km")
					planetInfo3.text("CLIMATE: "+d.climate)
					planetInfo4.text("POPULATION: "+d.population);
					d3.selectAll(".info").attr("visibility", "visible");
	    	}     
	    });

	  d3.timer(function() {
	    var circles = svg.selectAll(".planet");
	    //stops rotating on hover or click
	    circles.attr("transform", function(d) {
	        d.delta += d.state == PLANET_STATE.ORBIT ? d.orbitSpeed : 0;
	        return d.state == PLANET_STATE.SELECT ? 
	        			 "rotate({0},{1},{2})".format(d.delta, mid.x, mid.y) : 
	        			 "rotate({0},{1},{2})".format(d.delta, mid.x, mid.y);
	      })
	      .attr("opacity", function(d) {
	        switch(d.state) {
	        	case PLANET_STATE.ORBIT:
	        		return selected == null ? 1 : .05;
	        	case PLANET_STATE.HOVER:
	        		return selected == null ? .8 : .3;
	        	case PLANET_STATE.SELECT:
	        		return 1;
	        }
	      })
	      .transition().attr("height", function(d) {
	        //get multiplying factor
	        if (d.clicked) {
	         // planetInfo.style("visibility", "visible")
	        } else {
	         // planetInfo.style("visibility", "hidden");
	        }
	        return d.state != PLANET_STATE.SELECT ? d.radius : height / 2.5;
	      })
	      .attr("width", function(d) {
	        return d.state != PLANET_STATE.SELECT ? d.radius : width / 2.5;
	      })
	      .attr("x", function(d) {
	      	return d.state != PLANET_STATE.SELECT ? mid.x + d.orbit : mid.x - width / 5;
	      })        
	      .attr("y", function(d) {
	      	return d.state != PLANET_STATE.SELECT ? mid.y : mid.y - height / 5;
	      })
	      .duration(130);

        svg.selectAll(".orbit").attr("visibility", selected == null ? "visible" : "hidden");
	  });
	});
}

