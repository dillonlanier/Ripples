// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
// mess around with basic rectangles
// c.fillStyle = 'rgba(255, 0, 0, 0.5)';
// c.fillRect(100, 100, 100, 100);
// c.fillStyle = 'rgba(255, 100, 200, 0.5)';
// c.fillRect(500, 600, 200, 400);
// c.fillRect(400, 200, 400, 100);
// console.log(canvas);

// //lines
// c.beginPath();
// c.moveTo(50, 400);
// c.lineTo(300, 100);
// c.lineTo(600, 600);
// c.strokeStyle = "black";
// c.stroke();

// //arc or circle
// c.beginPath();
// c.arc(300, 300, 30, 0, Math.PI*2, false);
// c.strokeStyle = "blue";
// c.stroke();

// //create box that is 4x4 of smaller boxes
// c.fillStyle = 'black';
// for (var i=0; i < 4; i++) {
// 	for (var ii=0; ii<4; ii++) {
// 		c.fillRect(100*i + 500, 100*ii+500, 100, 100);
// 	}
// }

// // generate a ton of circles
// for (var j=0; j<199; j++) {
// 	var x = Math.random() * window.innerWidth;
// 	var y = Math.random() * window.innerHeight;
// 	c.beginPath();
// 	c.arc(x, y, 30, 0, Math.PI*2, false);
// 	c.strokeStyle = "blue";
// 	c.stroke();
// }

/*********************************************************************
This section creates rectangle objects that zoom from one point out
**********************************************************************/
// function Rectangle(x, y, height, width, dx, dy) {
// 	this.x = x;
// 	this.y = y;
// 	this.height = height;
// 	this.width = width;
// 	this.dx = dx;
// 	this.dy = dy;

// 	this.draw = function() {
// 		c.beginPath();
// 		c.fillStyle = "black";
// 		c.fillRect(this.x, this.y, this.height, this.width);
// 	}

// 	this.update = function() {
// 		this.x += this.dx;
// 		this.y += this.dy;
// 		this.draw();
// 	}
// }
// var rectArray = [];
// for (var i = 0; i < 200; i++) {
// 	var x = 450;
// 	var y = 300;
// 	var height = 20;
// 	var width = 20;
// 	var dx = (Math.random() - 1)  * 10;
// 	var dy = Math.random()  * 10; 
// 	rectArray.push(new Rectangle(x, y, height, width, dx, dy))
// }
/*********************************************************************
This section creates a circle object, then animates them on a canvas
**********************************************************************/


/*********************************************************************
Set main canvas height and width to be same, and based on parent div.
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

/*********************************************************************
Set goal canvas height and width to be same, hard coded value
**********************************************************************/
var goal_canvas = document.getElementById("goal-canvas");
goal_canvas.height = 100;
goal_canvas.width = 100;


var c = canvas.getContext('2d');
var c_goal = goal_canvas.getContext('2d');
var mouse = {
	x: undefined,
	y: undefined
}

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
				c.fillStyle = 'red';
				c.fillRect(this.x, this.y, this.height, this.width);
				break;
			case 1:
				c.fillStyle = 'orange';
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
				c_goal.fillStyle = 'red';
				c_goal.fillRect(this.x, this.y, this.height, this.width);
				break;
			case 1:
				c_goal.fillStyle = 'orange';
				c_goal.fillRect(this.x, this.y, this.height, this.width);
				break;
			case 2:
				c_goal.fillStyle = 'yellow';
				c_goal.fillRect(this.x, this.y, this.height, this.width);
				break;
		}
	}
	// this.update = function() {
	// 	// DO I NEED THIS??
	// }
}


// GET BOARD SIZE AND COLORS FROM USER
// USE THEM TO CREATE THE CORRECT NUMBER AND SIZE TILES
board_size = 3;
colors = 2;


/*******************************************************
Create the game tile array and goal tile array
******************************************************/
var game_tileArray = [];
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
var goal_tileArray = [];
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

// Look for mouse clicks only on main canvas and 
// nomalize coordinates to be relative to the canvas.
canvas.addEventListener('mouseup', function(event) {
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
		console.log("YOU WON!!!!");
		// Freeze timer
		//pop up window with time, moves
	}
})



// function play() {
// 	//start timer
// 	//set moves = 0
// 	this.animate = function() {
// 		

// 			// IF THE CLICK IS ON A TILE:
// 			// 		moves += 1
// 			// 		each relevant tile color_value += 1
// 			//      Check if win
// 			//		Else, call animate again
// 			requestAnimationFrame(this.animate);
// 		})
// 	}
// }
// play();





/******************************************************
/******************************************************
/******************************************************/



// 	this.update = function() {
// 		if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
// 			this.dx = -this.dx;
// 		}
// 		if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
// 			this.dy = -this.dy;
// 		}
// 		this.x += this.dx;
// 		this.y += this.dy;

// 		//interactivity
// 		if (mouse.x - this.x < 50 && mouse.x - this.x > -50
// 			&& mouse.y - this.y < 50 && mouse.y - this.y > -50) {
// 			if (this.radius < maxRadius) {
// 				this.radius += 1;
// 			}
// 		} else if (this.radius > this.minRadius) {
// 			this.radius -= 1;
// 		}

// 		this.draw();
// 	}
// }

// function animate() {
// 	//loop through over and over...
// 	requestAnimationFrame(animate);
// 	c.clearRect(0, 0, canvas.width, canvas.height);
// 	for (j=0; j < circleArray.length; j++) {
// 		circleArray[j].update();
// 	}	
// }

// animate();
