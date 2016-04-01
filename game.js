window.onload = function() {

	var game = new Phaser.Game(1300, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

	function preload(){
		game.load.image('background', 'assets/background.jpg');
		game.load.image('plane', 'assets/plane.png',150,109);
		game.load.image('boat', 'assets/boat.png',500,500);
		game.load.image('parachute', 'assets/parachute.png',500,500);
	}

	var player,
		plane,
	 	parachutes,
		cursors,
		dropTimer,
		scoreString,
		scoreText,
		lifeString,
		lifeText,
		introText;
	var score = 0;
	var lives = 3;
	var boatVelocity = 250;
	var parachuteGravity = 100;
	var planeVelocity = -125;

	function create(){
		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.add.sprite(0,-150,'background');

		scoreString = 'Score : ';
    	scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });
    	lifeString = 'Lives : '
    	lifeText = game.add.text(10, 60, lifeString + lives, { font: '34px Arial', fill: '#fff' });
    	introText = game.add.text(game.world.centerX-100, 300, '', { font: "40px Arial", fill: "#ffffff", align: "center" });
    

		plane = game.add.sprite(1200, 100, 'plane');
		game.physics.arcade.enable(plane);
		plane.animations.add('fly',null,10,true);
		plane.body.velocity.x = planeVelocity;
    	plane.animations.play('fly');


		player = game.add.sprite(700, 400, 'boat');
		game.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;
		player.animations.add('move', null, 10, true);

		parachutes = game.add.group();
		parachutes.enableBody = true;
    	parachutes.physicsBodyType = Phaser.Physics.ARCADE;
    	parachutes.setAll('gravity.y', 100);
    
		cursors = game.input.keyboard.createCursorKeys();

		dropTimer = game.time.create(false);
		dropTimer.loop(2000 * (1 + Math.random(2)) ,createParachute,this);
		dropTimer.start();



	}


	function update(){

		player.body.velocity.x = 0;

		if (cursors.left.isDown)
    	{
	        player.body.velocity.x = -boatVelocity;
	        player.animations.play('move');
    	}
    	if (cursors.right.isDown)
    	{
	        player.body.velocity.x = boatVelocity;
	        player.animations.play('move');
    	}

    	if (plane.body.x < -150)
    	{
    		plane.body.x = 1300;
    	}
    	

    	
    	game.physics.arcade.overlap(player, parachutes, collisionHandler, null, this);
    	game.physics.arcade.collide(game, parachutes, missParachute, null, this);

    	
	}

	function createParachute(){

		if (plane.x > 10 && plane.x < 1250){
			var parachute = parachutes.create(plane.x + 20 ,plane.y + 70, 'parachute');
			parachute.body.gravity.y = parachuteGravity;
			parachute.checkWorldBounds = true;
			parachute.events.onOutOfBounds.add(missParachute,this);
			
		}
	}

	function collisionHandler(boat, parachute){
		parachute.kill();
		score +=10;
		scoreText.text = scoreString + score;
	}

	function missParachute(){
		lives--;
		lifeText.text = lifeString + lives;
		if (lives ===0)
		{
			gameOver();
		}
	}

	function gameOver(){
		dropTimer.stop();
		plane.body.velocity.setTo = (0,0);
		plane.animations.stop('fly');
		introText.text = 'Game Over!'
		introText.visible = true;
	}

	
}
