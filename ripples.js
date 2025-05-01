/*********************************************************************
Tile object constructor. 
**********************************************************************/
function Tile(x, y, height, width, color_value) {
	this.x = x;
	this.y = y;
	this.height = height;
	this.width = width;
	this.color_value = color_value;
	this.draw = function(canvas) {
		switch (this.color_value) {
			case 0:
				canvas.fillStyle = '#EF13F2';
				canvas.fillRect(this.x, this.y, this.height, this.width);
				break;
			case 1:
				canvas.fillStyle = '#05F2DB';
				canvas.fillRect(this.x, this.y, this.height, this.width);
				break;
		}
	}
	this.remove =  function() {
		delete this.x;
		delete this.y;
		delete this.height;
		delete this.width;
		delete this.color_value;
		delete this.draw;
		delete this.remove;
	}
}
/*********************************************************************
Helper function that flips and draws game tiles on main board
when fed a clicked tile by the event listener.
**********************************************************************/
function flip_game_tiles(clicked_tile, canvas, tile_array) {
	var tiles_to_flip = [clicked_tile];
	for (var i =0; i < tile_array.length; i++) {
		if ((tile_array[i].x == (clicked_tile.x + clicked_tile.width) && tile_array[i].y == clicked_tile.y) ||
			(tile_array[i].x == (clicked_tile.x - clicked_tile.width) && tile_array[i].y == clicked_tile.y) ||
			(tile_array[i].y == (clicked_tile.y + clicked_tile.height) && tile_array[i].x == clicked_tile.x) ||
			(tile_array[i].y == (clicked_tile.y - clicked_tile.height) && tile_array[i].x == clicked_tile.x)
			){
				tiles_to_flip.push(tile_array[i]);
			}
	}
	for (var ii = 0; ii < tiles_to_flip.length; ii++) {
		if (tiles_to_flip[ii].color_value == (colors - 1)) {
			tiles_to_flip[ii].color_value = 0;
		} else {
			tiles_to_flip[ii].color_value += 1;
		}
		tiles_to_flip[ii].draw(canvas);
	}
}
/*********************************************************************
Called to start a new game. redraws the board and goal state, cleans
out left over stuff from last game.
**********************************************************************/
function setup () {
	/*************************************************************
	Reset the clock and moves
	**************************************************************/
	today = new Date();
	startStamp = today.getTime();
	moves = 0;
	document.getElementById("moves").innerHTML = moves.toString();
	/*********************************************************************
	Clear arrays, goal and game canvas
	**********************************************************************/
	for (var i=0; i < game_tileArray.length; i++) {
		game_tileArray[i].remove();
	}
	for (var ii=0; ii < goal_tileArray.length; ii++) {
		goal_tileArray[ii].remove();
	}
	while (game_tileArray.length > 0) {
		game_tileArray.pop();
	}
	while (goal_tileArray.length > 0) {
		goal_tileArray.pop();
	}
	c.clearRect(0, 0, canvas.width, canvas.height);
	c_goal.clearRect(0, 0, goal_canvas.width, goal_canvas.height);
	/*************************************************************
    Hard code the settings for the demo
	**************************************************************/
	board_height = 2;
	board_width = 2;
	colors = 2;
	/*************************************************************
	Generate goal and start tile array, and draw them on screen
	**************************************************************/
	for (var i = 0; i < board_height * board_width; i++) {
		var height = canvas.height / board_height;
		var width = canvas.width / board_width;
		var x = Math.floor(i / board_height) * width;
		var y = width * (i % board_height);	
		var color_value = Math.floor(Math.random() * colors );
		game_tileArray.push(new Tile(x, y, height, width, color_value));
	}
	for (var k = 0; k < game_tileArray.length; k++) {
		game_tileArray[k].draw(c);
	}
	// Now the goal tile array
	for (var ii = 0; ii < board_height * board_width; ii++) {
		var height = goal_canvas.height / board_height;
		var width = goal_canvas.width / board_width;
		var x = Math.floor(ii / board_height) * width;
		var y = width * (ii % board_height);	
		var color_val = game_tileArray[ii].color_value;
		goal_tileArray.push(new Tile(x, y, height, width, color_val));
	}
  /*************************************************************
	Now want to do 1-3 random moves to generate goal state that we 
  know is solvable
	**************************************************************/
	for (var iii = 0; iii < Math.floor(Math.random() * 3 + 1); iii++) {
		flip_game_tiles(goal_tileArray[Math.floor(Math.random() * (goal_tileArray.length - 1))], c_goal, goal_tileArray);	
	}
	/*************************************************************
	Make sure we didn't randomly end up with same goal and start 
  states. If we did, do some random moves and check again
	**************************************************************/
	var samestate = 1;
  for (var n = 0; n < game_tileArray.length; n++) {
    if (game_tileArray[n].color_value != goal_tileArray[n].color_value){
      samestate = 0;
    }
  }
}
/*************************************************************
Called every half second during gameplay to update displayed timer
**************************************************************/
function updatetimer() {
	var now = new Date();
	var newStamp = now.getTime();
    var diff = Math.round((newStamp-startStamp)/1000);
    var d = Math.floor(diff/(24*60*60));
    diff = diff-(d*24*60*60);
    var h = Math.floor(diff/(60*60));
    diff = diff-(h*60*60);
    var m = Math.floor(diff/(60));
    diff = diff-(m*60);
    var s = diff.toString();
    if (s.length == 1) {
    	s = "0" + s;
    }
    display = m + ":" + s;
    if (display == 'NaN:NaN') {
    	display = '0:00';
    }
	document.getElementById("timer").innerHTML = display;
}
/*********************************************************************
Set main canvas height and width to be same, and based on parent div.
Set up the goal canvas to be static size.
**********************************************************************/
function resize() {
	board_ratio = board_width / board_height;
	if (board_ratio == 1) {
		canvas.width = 456;
		canvas.height = 456;
		goal_canvas.height = 96;
		goal_canvas.width = 96;

	} else if (board_ratio < 1) {
		//height greater than width...
		canvas.height = 456;
		canvas.width = canvas.height * (board_width / board_height);
		goal_canvas.height = 96;
		goal_canvas.width = 96 * (board_width / board_height);

	} else {
		//width greater than height...
		canvas.width = 456;
		canvas.height = canvas.width * (board_height / board_width);
		goal_canvas.height = 96 * (board_height / board_width);
		goal_canvas.width = 96;
	}
	for (var k=0; k<game_tileArray.length; k++) {
		game_tileArray[k].height = canvas.height/board_height;
		game_tileArray[k].width = canvas.width/board_width;
		game_tileArray[k].x = Math.floor(k/board_height) * (canvas.width/board_width);
		game_tileArray[k].y = (canvas.width/board_width) * (k % board_height);
		game_tileArray[k].draw(c);
	}
	for (var kk=0; kk<goal_tileArray.length; kk++) {
		goal_tileArray[kk].height = goal_canvas.height/board_height;
		goal_tileArray[kk].width = goal_canvas.width/board_width;
		goal_tileArray[kk].x = Math.floor(kk/board_height) * (goal_canvas.width/board_width);
		goal_tileArray[kk].y = (goal_canvas.width/board_width) * (kk % board_height);
		goal_tileArray[kk].draw(c_goal);
	}
}
/*********************************************************************
Add listener that resizes board as window changes size.
**********************************************************************/
function add_resize() {
	window.addEventListener('resize', function() {
		resize();
	});
}
/*********************************************************************
Updates board and checks for win on each mouse click. Used by event listener in play()
**********************************************************************/
var move = function(event) {
	var rect = canvas.getBoundingClientRect();
	mouse.x = event.x - rect.left;
	mouse.y = event.y - rect.top;
	// Update colors of appropriate squares
	for (var t = 0; t < game_tileArray.length; t++) {
		if (mouse.x > game_tileArray[t].x && 
			mouse.x < (game_tileArray[t].x + game_tileArray[t].width) &&
			mouse.y > game_tileArray[t].y && 
			mouse.y < (game_tileArray[t].y + game_tileArray[t].height)) {
			flip_game_tiles(game_tileArray[t], c, game_tileArray);
		}
	}
	moves += 1; 
	document.getElementById("moves").innerHTML = moves.toString();
	// Check for a win
	var win = 1;
	for (var i = 0; i < game_tileArray.length; i++) {
		if (game_tileArray[i].color_value != goal_tileArray[i].color_value){
			win = 0;
		}
	}
	if (win == 1) {
		clearInterval(timer);
		canvas.removeEventListener('mousedown', move);
		setTimeout(() => { window.alert("Nice job! Press start to play again."); }, 1000);
		won_last_round = 1;
	}
}
/*********************************************************************
Set up global variables
**********************************************************************/
var canvas = document.getElementById("main-canvas");
var goal_canvas = document.getElementById("goal-canvas");
var parent = document.getElementById("parent");
var ratio;
var board_ratio;
var c = canvas.getContext('2d');
var c_goal = goal_canvas.getContext('2d');
var mouse = {
	x: undefined,
	y: undefined
}
var game_tileArray = [];
var goal_tileArray = [];
var board_size;
var board_height;
var board_width;
var colors;
var won_last_round = 1;
var moves = 0;
var today;
var startStamp;
var timer;
var display;
// Place holder values until player starts game and resize is called
goal_canvas.width = 96;
goal_canvas.height = 96;
canvas.width = 456;
canvas.height = 456;
// Color the boards before the game starts as place holder.
c.fillStyle = "#EF13F2";
c_goal.fillStyle = "#05F2DB";
c.fillRect(0, 0, canvas.height, canvas.width);
c_goal.fillRect(0, 0, goal_canvas.height, goal_canvas.width);
/*********************************************************************
Run the game. Called by start button in html
**********************************************************************/
function play() {
	if (won_last_round === 1) {
		canvas.addEventListener('mousedown', move);
		timer = setInterval(updatetimer, 500);
		won_last_round = 0;
	}
	canvas.removeEventListener('mousedown', move);
	canvas.addEventListener('mousedown', move);
	add_resize();
  setup();
	
}
