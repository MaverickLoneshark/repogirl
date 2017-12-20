/*
	repogirl.js
	Repogirl Game Engine Script
	
	Maverick Loneshark
	MAET, 2012
*/

/** globals **/
var REPO_GIRL;

function RepoGirl() {
	var FPS = 50,
		foreground,
		enemy,
		i;
	
	this.getFPS = function(){ return FPS; },
	this.DEBUG = false;
	
	this.canvas = document.getElementById("Canvas"),
	this.context = this.canvas.getContext("2d"),
	
	this.level = new LevelMap(this.canvas),
	
	//Move all MAETGDK-related devices into MAET_GDK object and expose for game-specific usage
	this.gsm = new MAET_GDK.GameStateMachine(this),
	this.input = MAET_GDK.input_device;
	
	this.objects_manager = new MAET_GDK.ObjectsManager();
	
	for(i = 0; i < 3; i++) {
		enemy = new MAET_GDK.Sprite();
		enemy.color = "#FF0000";
		enemy.y = 300;
		enemy.rotation = 45.0;
		enemy.img.src = "sprites/enemy.png";
		enemy.x = 500 + (Math.random() * 100) - 50;
		
		this.objects_manager.enemy_objects.push(enemy);
	}
	
	foreground = new MAET_GDK.Sprite();
	foreground.color = "#00FF00",
	foreground.x = 300,
	foreground.y = 500,
	foreground.img.src = "sprites/tree.png",
	
	this.objects_manager.foreground_objects.push(foreground);
	
	this.hero = new MAET_GDK.Sprite();
	this.hero.color = "#0000FF",
	this.hero.x = 0,
	this.hero.y = 550,//this.canvas.height - this.hero.frame[this.hero.f_num].height;
	this.hero.img.src = "sprites/hero.png",
	
	//standing
	this.hero.frame[0].x = 0,
	this.hero.frame[0].y = 0,
	this.hero.frame[1].x = 48,
	this.hero.frame[1].y = 0,
	this.hero.frame[2].x = 96,
	this.hero.frame[2].y = 0,
	this.hero.frame[3].x = 144,
	this.hero.frame[3].y = 0,
	this.hero.frame[4].x = 192,
	this.hero.frame[4].y = 0,
	
	//running
	this.hero.frame[5].x = 0,
	this.hero.frame[5].y = 48,
	this.hero.frame[6].x = 48,
	this.hero.frame[6].y = 48,
	this.hero.frame[7].x = 96,
	this.hero.frame[7].y = 48,
	this.hero.frame[8].x = 144,
	this.hero.frame[8].y = 48,
	this.hero.frame[9].x = 192,
	this.hero.frame[9].y = 48;
	
	this.objects_manager.player_objects.push(this.hero);
	
	this.start_pushed = false,
	this.select_pushed = false,
	
	this.frame_duration = 1000 / this.getFPS(),
	this.last_update_time = (new Date).getTime();
	
	return;
}

RepoGirl.prototype.render = function() {
	
	if((this.gsm.game_state === this.gsm.GS_TITLE) || (this.gsm.game_state === this.gsm.GS_GAME_OVER)) {
		//clear screen
		this.context.drawImage(this.level.background, 0, 0);
	}
	else {
		//clear screen
		this.context.drawImage(this.level.background, 0, 0);
		
		//draw objects
		this.objects_manager.drawPlayers(this.context);
		this.objects_manager.drawEnemies(this.context);
		this.objects_manager.drawForeground(this.context);
		
		if(this.DEBUG) {
			this.objects_manager.drawBoundingBoxes(this.context);
		}
	}
	
	return;
}

RepoGirl.prototype.title = function() {
	this.game.handleInput();
	
	this.game.render();
	
	return;
}

RepoGirl.prototype.playLevel = function() {
	this.game.handleInput();
	this.game.handlePlayInput();
	
	var elapsed_time = ((new Date).getTime() - this.game.last_update_time) / this.game.frame_duration;
	this.game.objects_manager.detectCollisions(this.game);
	this.game.objects_manager.updatePlayers(elapsed_time);
	this.game.objects_manager.updateEnemies(elapsed_time);
	this.game.objects_manager.updateForeground(elapsed_time);
	this.game.last_update_time = (new Date).getTime();
	
	this.game.render();
	
	return;
}

RepoGirl.prototype.pause = function() {
	this.game.handleInput();
	
	this.game.last_update_time = (new Date).getTime();
	
	this.game.render();
	
	this.game.context.font="30px Verdana";
	// Create gradient
	var gradient = this.game.context.createLinearGradient(0, 0, 100, 30);
	gradient.addColorStop("0", "#FF0000");
	gradient.addColorStop("0.5", "#00FF00");
	gradient.addColorStop("1.0", "#0000FF");
	// Fill with gradient
	this.game.context.fillStyle = gradient;
	this.game.context.fillText("Paused", 0, 30);
	
	return;
}

RepoGirl.prototype.gameOver = function() {
	this.game.handleInput();
	
	this.game.handlePlayInput();
	
	this.game.render();
	
	return;
}

//Game-specific general input handling
RepoGirl.prototype.handleInput = function() {
	if(this.input.start_button) {
		//register only the initial push (holding is ignored)
		if(!this.start_pushed) {
			if(this.gsm.game_state === this.gsm.GS_TITLE) {
				this.level.loadLevel(1);
				this.gsm.setGameState(this.gsm.GS_PLAY_LEVEL);
				this.level.BGM.play();
			}
			else if(this.gsm.game_state === this.gsm.GS_GAME_OVER) {
				this.level.BGM.src = this.level.audioDirectory + "BASICpass.ogg";
				this.level.BGM.play();
				this.level.background.src = "backgrounds/titlescreen.png";
				this.gsm.setGameState(this.gsm.GS_TITLE);
			}
			else if(this.gsm.game_state != this.gsm.GS_PAUSE) {
				this.last_state = this.game_state;
				this.gsm.setGameState(this.gsm.GS_PAUSE);
				this.level.BGM.pause();
			}
			else {
				this.gsm.setGameState(this.gsm.last_state);
				this.level.BGM.play();
			}
			
			this.start_pushed = true;
		}
	}
	else /*if(!this.input.start_button)*/ {
		this.start_pushed = false;
	}
	
	if(this.input.select_button) {
		if(!this.select_pushed) /*register only the initial push (holding is ignored)*/ {
			this.level.BGM.src = this.level.audioDirectory + "gameover.ogg";
			this.level.BGM.play();
			this.level.background.src = "backgrounds/gameover.png";
			this.gsm.setGameState(this.gsm.GS_GAME_OVER);
			
			this.select_pushed = true;
		}
	}
	else /*(!this.input.select_button)*/ {
		this.select_pushed = false;
	}
	
	return;
}

//Game-specific gameplay input handling
RepoGirl.prototype.handlePlayInput = function() {
	if(this.input.left_button) {
		this.hero.xscale = -1.0;
		this.hero.anim_state = 5;
		
		if(this.input.special_button) {
			if(this.hero.xvel > -6) {
				this.hero.xvel -= 3;
			}
		}
		else {
			if(this.hero.xvel > -4) {
				this.hero.xvel -= 2;
			}
			else {
				this.hero.xvel += 1;
			}
		}
	}
	else if(this.input.right_button) {
		this.hero.xscale = 1.0;
		this.hero.anim_state = 5;
		
		if(this.input.special_button) {
			if(this.hero.xvel < 6) {
				this.hero.xvel += 3;
			}
		}
		else {
			if(this.hero.xvel < 4) {
				this.hero.xvel += 2;
			}
			else {
				this.hero.xvel -= 1;
			}
		}
	}
	else {
		this.hero.anim_state = 0;
	}
	
	if(this.input.up_button) {
		//
	}
	else if(this.input.down_button) {
		//
	}
	
	if(this.input.jump_button) {
		if(!this.hero.falling) {
			if(this.hero.yvel > -8) {
				this.hero.yvel -= 2;
				this.hero.has_jumped = true;
			}
			else {
				this.hero.falling = true;
			}
		}
		else if(this.hero.can_doublejump) {
			if(!this.hero.has_doubled) {
				this.hero.has_doubled = true;
				this.hero.falling = false;
				this.hero.yvel = 0;
			}
		}
	}
	else if(!this.hero.contact_down) {
		this.hero.falling = true;
		
		if(this.hero.doublejump_power) {
			this.hero.can_doublejump = true;
		}
	}
	
	if(this.input.special_button) {
		//
	}
	
	return;
}

//The Game Loop
function gameLoop() {
	//REPO_GIRL.loop();
	
	return;
}

//Game Object Update
function update(elapsed_time) {
	function resolveCollisions(object) {
		if(object.contact_down) {
			if(object.yvel > 0)
			{
				object.yvel = 0;
			}
			
			object.falling = false;
			object.has_doubled = false;
			object.can_doublejump = false;
		}
		else if(object.yvel < 8) /*hasn't reached terminal fall velocity*/ {
			object.yvel += 1; //gravity
		}
		
		if(object.contact_up) {
			if(object.yvel < 0) {
				object.yvel = 0;
			}
			
			object.falling = true;
		}
		
		if(object.contact_left) {
			if(object.xvel < 0) {
				object.xvel = 0;
			}
		}
		
		if(object.contact_right) {
			if(object.xvel > 0) {
				object.xvel = 0;
			}
		}
		
		return;
	}
	resolveCollisions(this);
	
	this.frame[this.f_num].time += REPO_GIRL.frame_duration;
	
	if(this.frame[this.f_num].time >= 200) {
		this.frame[this.f_num].time = 0;
		this.f_num++;
		
		if((this.f_num > (this.anim_state + 4)) || (this.f_num < this.anim_state)) {
			this.f_num = this.anim_state;
		}
	}
	
	
	/*
	if(this.contact_down && on_ice) {
		this.xvel *= 0.95;
	}
	else-
	*/
	if(!(REPO_GIRL.input.left_button) && !(REPO_GIRL.input.right_button)) {
		REPO_GIRL.hero.xvel = 0;
	}
	
	this.x += (this.xvel * elapsed_time);
	this.y += (this.yvel * elapsed_time);
	
	return;
}

//entry point
function main() {
	REPO_GIRL = new RepoGirl();
	REPO_GIRL.gsm.startGame(REPO_GIRL.getFPS());
	
	return;
}
