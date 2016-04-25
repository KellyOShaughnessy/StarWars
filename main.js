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
