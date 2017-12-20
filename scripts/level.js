/*
	level.js
	Level Definitions Script
	
	Maverick Loneshark
	MAET, 2012
*/

/* objects */
/**
Object that contains level map data
**/
function LevelMap(canvas)
{
	this.level;
	this.levelDirectory = "levels/";
	
	this.backgroundDirectory = "backgrounds/";
	this.background = new Image(),
	this.background.height = canvas.height,
	this.background.width = canvas.width,
	this.background.src = "backgrounds/titlescreen.png",
	
	this.audioDirectory = "audio/";
	this.BGM = document.getElementById("BGM"),
	this.BGM.src = this.audioDirectory + "BASICpass.ogg",
	this.BGM.autoplay = false,
	this.BGM.loop = true;
	this.BGM.play();
	
	this.screenMap = new ScreenMap(canvas);
	
	return;
}

/**
The ScreenMap represents the current tilemap data on the screen
**/
function ScreenMap(canvas)
{
	//a single tile's width in pixels (square tiles)
	this.tilewidth = 8;
	
	//800x600 resolution = 100x75 (8x8 pixel tiles); 50x38 (16x16 pixel tiles)
	this.mapwidth = Math.ceil(canvas.width / this.tilewidth);
	this.mapheight = Math.ceil(canvas.height / this.tilewidth);
	
	//the tilemap's upperleft corner is 0, 0, and the bottom right is 50, 38
	this.tilemap = new Array();
	this.tilemap.length = this.mapwidth * this.mapheight;
	
	return;
}

/* functions */
/**
Loads a level via XMLHttpRequest
**/
LevelMap.prototype.loadLevel = function(level)
{
	this.level = level,
	this.background.src = this.backgroundDirectory + "level" + this.level +".png",
	
	this.BGM.src = this.audioDirectory + "level" + this.level + ".ogg";
	
	var request = new XMLHttpRequest(),
		response,
		map = new Array();
	
	if (window.XMLHttpRequest) //code for IE7+, Firefox, Chrome, Opera, Safari
	{
		request = new XMLHttpRequest();
	}
	else //unsupported
	{
		//code for IE6, IE5
		//request = new ActiveXObject("Microsoft.XMLHTTP");
		return;
	}
	
	request.onreadystatechange = function()
	{
		if((request.readyState === 4) && ((request.status === 200) || (request.status === 0)))
		{
			response = request.responseText;
			//document.getElementById("debug").innerHTML = response;
			
			//while(/*rows*/)
			{
				//while(/*cols*/)
				{
					//level = ;
				}
			}
		}
		else
		{
			response = "State: " + request.readyState;//+ "\nStatus: " + request.status;
			//document.getElementById("debug").innerHTML = response;
		}
	}
	
	request.open("GET", this.levelDirectory + "level" + level + ".txt", true);
	request.send();
	
	return;
}
