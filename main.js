// Twinkling Background 

body=document.body;
loop={
	//initilizeing stars
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
	d3.csv("planet_info.csv", function(RandCSV) {
	 	var dataset = {planets:[]};
	 	var type_counts = [0,0,0,0,0,0,0];
	 	var d_counts = [0,0];
	 	var diams = [];
	 	var pops = [];

	    RandCSV.forEach(function(planetRow, i) {
	    	//Get pertinent data
	      if (planetRow["PLANET"] != null) {
	      	var episodes = planetRow["FILMS (EP)"].split(", ");
	      	//planet in this episode; ep = 0 if all episodes
	      	if (ep == 0 || episodes.indexOf(ep) != -1) {
		        dataset.planets.push({
		        	id: planetRow["PLANET"],
		        	type: planetRow["TYPE"],
		        	diameter: planetRow["DIAMETER"],
		        	pop: planetRow["POPULATION"],
		        	films: planetRow["FILMS (EP)"],
		        	url: planetRow["IMAGE"]
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

	    	pops.push({id: id, pop:p});

	    	diams.push(d);
	    	if (d < 12742) { d_counts[0] ++;}
	    	if (d > 12742) { d_counts[1] ++;}
	    }
	//Two circle graphics

	var width = 500,
	    height = 550,
	    padding = 0,
	    radius = Math.min((width-padding)/2, (height-padding)/2) / 2;

	var color = ["#993300","#ffd633","#339966","#d9d9d9", "#ccffff", "#80b3ff", "#0000cc"];

	var pie = d3.layout.pie()
	    .sort(null);

	var arc = d3.svg.arc()
	    .innerRadius(radius - 60)
	    .outerRadius(radius - 10);

	var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("align","center");

	var svg_terrain = svg.append("g")
					.attr("class","terrain")
					.attr("transform", "translate(" + (width-padding) / 2 + "," + radius + ")");
	var svg_diam_earth = svg.append("g")
					.attr("class","earth")
					.attr("transform", "translate(" + (width-padding) / 2 + "," + ((height-padding) / 2 + radius) + ")");

	//Breakdown of planet terrain type
	var path = svg_terrain.selectAll("path")
	    .data(pie(type_counts))
	  	.enter().append("path")
	    .attr("fill", function(d, i) { return color[i]; })
	    .attr("d", arc);

	svg_terrain.append("text")
		.attr("x", 0)
		.attr("y", radius)
		.attr("fill", "yellow")
		.attr("font-size","10")
		.text("planet terrain of planets by %")
		.attr("text-anchor", "middle");

	//smaller or bigger than Earth
	var path = svg_diam_earth.selectAll("path")
	    .data(pie(d_counts))
	  	.enter().append("path")
	    .attr("fill", function(d, i) { return color[i]; })
	    .attr("d", arc);

	svg_diam_earth.append("text")
		.attr("x", 0)
		.attr("y", radius)
		.attr("fill", "yellow")
		.text("% planets smaller/larger than earth")
		.attr("font-size","10")
		.attr("text-anchor", "middle");

	//planet population comparison

	var color2 = ["#26518c", "#5f8fd3", "#c3d5ef",
				"#a93f0a", "#f4783e","#fbcdb7", 
				"#298941", "#4fc96e", "#b0e8be",
				"#3e3e75", "#7979b9", "#cdcde5",
				"#a11250", "#eb478e", "#f7bbd6",
				"#595959", "#999999", "#d9d9d9"];

	var width = 800, 
		height = 650,
		padding = 0;

	//extract population data and sort it
	pops.sort(function(a, b){return b.pop-a.pop});
	var data = [];
	pops.forEach(function(elmt){
		data.push(elmt.pop);
	});

	var scale = d3.scale.log().domain([1,1000000000000])
								.range([1,220]);

	console.log(data);

	var svg3 = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .append("g");

	var circles = svg3.selectAll('.circles')
		.data(data)
		.enter().append('circle')
		.attr('r', function(d)  { return scale(d);})
		.attr("cy", (height-padding)/2)
		.attr("cx", function(d,i) {return (width-padding)/2;})
		.attr("fill", function(d, i) { return color2[i]; });

	var pop_box_bg = svg3.append("rect")
						.attr("fill","black")
						.attr("visibility", "hidden")
						.attr("height", 19)
						;

	var pop_box = svg3.append("text")
					.attr("fill", "white")
					.attr("text-decoration","underline overline")
					.attr("font-size","20")
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
					.attr("y", ypos-27);
		})
		.on("mouseout", function(d) {
			d3.select(this).attr("transform","scale(1, 1) translate(0,0)")
							// .attr("opacity","1")
							;
			pop_box.attr("visibility","hidden");
			pop_box_bg.attr("visibility","hidden");
		});

	svg3.append("text")
		.attr("x", (width-padding)/2)
		.attr("y", (height-padding)-5)
		.attr("fill", "yellow")
		.attr("font-size","10")
		.text("planet populations")
		.attr("text-anchor", "middle");
	});
}

