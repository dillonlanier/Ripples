
/*********************************************************************
Tile object constructor. 
**********************************************************************/
function Tile(x, y, height, width, color_value) {
	this.x = x;
	this.y = y;
	this.height = height;
	this.width = width;
	this.color_value = color_value;

	this.draw = function() {
		switch (this.color_value) {
			case 0:
				c.fillStyle = 'black';
				c.fillRect(this.x, this.y, this.height, this.width);
				break;
			case 1:
				c.fillStyle = '#4B9CD3';
				c.fillRect(this.x, this.y, this.height, this.width);
				break;
			case 2:
				c.fillStyle = 'yellow';
				c.fillRect(this.x, this.y, this.height, this.width);
				break;
		}
	}
	this.draw_goal = function() {
		switch (this.color_value) {
			case 0:
				c_goal.fillStyle = 'black';
				c_goal.fillRect(this.x, this.y, this.height, this.width);
				break;
			case 1:
				c_goal.fillStyle = '#4B9CD3';
				c_goal.fillRect(this.x, this.y, this.height, this.width);
				break;
			case 2:
				c_goal.fillStyle = 'yellow';
				c_goal.fillRect(this.x, this.y, this.height, this.width);
				break;
		}
	}
	// this.clear = function() {
	// 	c.clearRect(this.x, this.y, this.height, this.width);
	// }
}

/*********************************************************************
Set main canvas height and width to be same, and based on parent div.
Set up the goal canvas to be static size.
**********************************************************************/
var canvas = document.getElementById("main-canvas");
var parent = document.getElementById("parent");
var ratio = parent.clientWidth / parent.offsetHeight;
if (ratio > 1) {
	canvas.height = parent.offsetHeight - 50;
	canvas.width = canvas.height;
} else {
	canvas.width = parent.clientWidth - 50;
	canvas.height = canvas.width;
}
var goal_canvas = document.getElementById("goal-canvas");
goal_canvas.height = 100;
goal_canvas.width = 100;

/*********************************************************************
Set up global variables
**********************************************************************/
var c = canvas.getContext('2d');
var c_goal = goal_canvas.getContext('2d');
var mouse = {
	x: undefined,
	y: undefined
}
var game_tileArray;
var goal_tileArray;
var board_size;
var colors;
var moves = 0;

/*******************************************************
********************************************************
********************************************************/
function setup () {
	// Create the game tile array
	game_tileArray = [];
	for (var i = 0; i < board_size * board_size; i++) {
		var height = canvas.height / board_size;
		var width = canvas.width / board_size;
		var y = Math.floor(i / board_size) * width;
		var x = width * (i % board_size);	
		var color_value = Math.floor(Math.random() * (colors) );
		game_tileArray.push(new Tile(x, y, height, width, color_value));
	}
	for (var k = 0; k < game_tileArray.length; k++) {
		game_tileArray[k].draw();
	}
	// Now the goal tile array
	goal_tileArray = [];
	for (var ii = 0; ii < board_size * board_size; ii++) {
		var height = goal_canvas.height / board_size;
		var width = goal_canvas.width / board_size;
		var y = Math.floor(ii / board_size) * width;
		var x = width * (ii % board_size);	
		var color_value = Math.floor(Math.random() * (colors) );
		goal_tileArray.push(new Tile(x, y, height, width, color_value));
	}
	for (var l = 0; l < goal_tileArray.length; l++) {
		goal_tileArray[l].draw_goal();
	}
}

// GET BOARD SIZE AND COLORS FROM USER
// USE THEM TO CREATE THE CORRECT NUMBER AND SIZE TILES
// window.onload = function() {
// function play() {

// 	//remove old event listerners
// 	try {
// 		canvas.removeEventListener('mousedown', move);
// 	} catch {  }
// 	//clear the old board
// 	c.clearRect(0, 0, canvas.width, canvas.height);


// board_size = document.getElementById("input_board_size").value;
// colors = document.getElementById('input_num_colors').value;
board_size = 2;
colors = 2;

setup();

//start_time = Date.now()
// Look for mouse clicks only on main canvas and 
// nomalize coordinates to be relative to the canvas.
canvas.addEventListener('mousedown', function move(event) {
	var rect = canvas.getBoundingClientRect();
	mouse.x = event.x - rect.left;
	mouse.y = event.y - rect.top;

	// Update colors of appropriate squares
	for (var t = 0; t < game_tileArray.length; t++) {
		if (mouse.x > game_tileArray[t].x && 
			mouse.x < (game_tileArray[t].x + game_tileArray[t].width) &&
			mouse.y > game_tileArray[t].y && 
			mouse.y < (game_tileArray[t].y + game_tileArray[t].height)) {

			clicked_tile = game_tileArray[t];
			tiles_to_flip = [clicked_tile];
			for (var i =0; i < game_tileArray.length; i++) {
				if ((game_tileArray[i].x == (clicked_tile.x + clicked_tile.width) && game_tileArray[i].y == clicked_tile.y) ||
					(game_tileArray[i].x == (clicked_tile.x - clicked_tile.width) && game_tileArray[i].y == clicked_tile.y) ||
					(game_tileArray[i].y == (clicked_tile.y + clicked_tile.height) && game_tileArray[i].x == clicked_tile.x) ||
					(game_tileArray[i].y == (clicked_tile.y - clicked_tile.height) && game_tileArray[i].x == clicked_tile.x)
					){
						tiles_to_flip.push(game_tileArray[i]);
					}
			}

			for (var ii = 0; ii < tiles_to_flip.length; ii++) {
				if (tiles_to_flip[ii].color_value == (colors - 1)) {
					tiles_to_flip[ii].color_value = 0;
				} else {
					tiles_to_flip[ii].color_value += 1;
				}
				tiles_to_flip[ii].draw();
			}
		}
	}
	// Check for a win
	var win = 1;
	for (var i = 0; i < game_tileArray.length; i++) {
		if (game_tileArray[i].color_value != goal_tileArray[i].color_value){
			win = 0;
		}
	}
	if (win == 1) {
		canvas.removeEventListener('mousedown', move);
		setTimeout(() => { window.alert("YOU WON in "+moves+' moves!'); }, 2000);
		// Freeze timer
		//pop up window with time, moves
	}
	moves += 1; 
	document.getElementById("moves").innerHTML = moves.toString();
})
//}
// }





//Event listener that resizes window dynamically
// window.addEventListener('resize', function() {

// 	var ratio = parent.clientWidth / parent.offsetHeight;
// 	if (ratio > 1) {
// 		canvas.height = parent.offsetHeight;
// 		canvas.width = canvas.height;
// 	} else {
// 		canvas.width = parent.clientWidth;
// 		canvas.height = canvas.width;
// 	}	
// 	console.log(canvas.width)
// 	console.log(canvas.height)
// 	for (var k=0; k<game_tileArray.length; k++) {
// 		game_tileArray[k].height = canvas.height/board_size;
// 		game_tileArray[k].width = canvas.width/board_size;
// 		game_tileArray[k].y = Math.floor(k/board_size) * width;
// 		game_tileArray[k].x = width * (k % board_size);
// 		game_tileArray[k].draw();
// 	}
// 	console.log(game_tileArray);
// });

