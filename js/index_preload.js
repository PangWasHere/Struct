var preload_array = [
	"css/imgs/World.png",
	"css/imgs/bldg-canteen.png",
	"css/imgs/bldg-dorm.png",
	"css/imgs/bldg-science.png",
	"css/imgs/bldg-library.png",
	"css/imgs/chalkboard_struct.png"
];

preload_array.forEach( function(link) {
	var img = new Image();
	img.src=link;
});