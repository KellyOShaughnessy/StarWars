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
	    	var d = dataset.planets[i].diameter;
	    	var p = dataset.planets[i].pop;

	    	pops.push(p);

	    	diams.push(d);
	    	if (d < 12742) { d_counts[0] ++;}
	    	if (d > 12742) { d_counts[1] ++;}
	    }
	    console.log(dataset.planets);

	//Breakdown of planet terrain type
	var width = 250,
	    height = 250,
	    padding = 20,
	    radius = Math.min(width-padding, height-padding) / 2;

	var color = ["#993300","#ffd633","#339966","#d9d9d9", "#ccffff", "#80b3ff", 
	"#0000cc", "blue", "red","black","orange","yellow","green","purple","pink"];

	var pie = d3.layout.pie()
	    .sort(null);

	var arc = d3.svg.arc()
	    .innerRadius(radius - 60)
	    .outerRadius(radius - 10);

	var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .append("g")
	    .attr("transform", "translate(" + (width-padding) / 2 + "," + (height-padding) / 2 + ")");

	var path = svg.selectAll("path")
	    .data(pie(type_counts))
	  	.enter().append("path")
	    .attr("fill", function(d, i) { return color[i]; })
	    .attr("d", arc);

	svg.append("text")
		.attr("x", 0)
		.attr("y", height/2)
		.attr("fill", "yellow")
		.attr("font-size","10")
		.text("planet terrain of planets by %")
		.attr("text-anchor", "middle");

	//smaller or bigger than Earth
	var width = 250,
	    height = 250,
	    padding = 20,
	    radius = Math.min(width-padding, height-padding) / 2;

	var color = ["#993300","#ffd633","#339966","#d9d9d9", "#ccffff", "#80b3ff", "#0000cc"];

	var pie = d3.layout.pie()
	    .sort(null);

	var arc = d3.svg.arc()
	    .innerRadius(radius - 60)
	    .outerRadius(radius - 10);

	var svg2 = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .append("g")
	    .attr("transform", "translate(" + (width-padding) / 2 + "," + (height-padding) / 2 + ")");

	var path = svg2.selectAll("path")
	    .data(pie(d_counts))
	  	.enter().append("path")
	    .attr("fill", function(d, i) { return color[i]; })
	    .attr("d", arc);

	svg2.append("text")
		.attr("x", 0)
		.attr("y", height/2)
		.attr("fill", "yellow")
		.text("% planets smaller/larger than earth")
		.attr("font-size","10")
		.attr("text-anchor", "middle");

	//planet population comparison

	var color = ["#26518c", "#5f8fd3", "#c3d5ef",
				"#e6550d", "#f4783e","#fbcdb7", 
				"#298941", "#000", "#c4edce",
				"#3e3e75", "#7979b9", "#cdcde5",
				"#a11250", "#eb478e", "#f7bbd6",
				"#595959", "#999999", "#d9d9d9"];

	var width = 800, 
		height = 800,
		padding = 70;

	var scale = d3.scale.log().domain([1,d3.max(pops)]).range([1,220]);

	pops.sort(function(a, b){return b-a});

	var svg3 = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .append("g");

	svg3.selectAll('.circles').data(pops).enter().append('circle')
		.attr('r', function(d)  { return scale(d);})
		.attr("cy", (height-padding)/2)
		.attr("cx", function(d,i) {return (width-padding)/2;})
		.attr("fill", function(d, i) { return color[i]; })
		.on("mouseover", function(d) {
			d3.select(this).attr("transform","scale(1.15)" );
		})
		.on("mouseout", function(d) {
			d3.select(this).attr("transform","scale(1)");
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

