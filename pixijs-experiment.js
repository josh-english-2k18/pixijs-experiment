/*
 * pixijs-experiment.js
 *
 * A simple experiment to explore sprite rendering with PixiJS.
 *
 * Written by Josh English.
 */


// build pixijs application

const app = new PIXI.Application({ width: 1024, height: 576 });
document.body.appendChild(app.view);


// define sprite constants

const SPRITE_TEXTURE = 'sandrail01.png';

const SPRITE_TOTAL = 128;

//const SPRITE_SPEED = 1.0;
//const SPRITE_SPEED = 2.0;
const SPRITE_SPEED = 4.0;
//const SPRITE_SPEED = 10.0;

const SPRITE_RANDOMLY_ADJUST_SIZING = false;

//const SPRITE_SCALAR = 0.1;
const SPRITE_SCALAR = 0.2;
//const SPRITE_SCALAR = 0.4;

const SPRITE_USE_RANDOM_COLORIZATION = false;

const SPRITE_RENDERING_BOUNDARY_SCALAR = 200;

const SPRITE_RENDERING_BOUNDARY = new PIXI.Rectangle(
	-SPRITE_RENDERING_BOUNDARY_SCALAR,
	-SPRITE_RENDERING_BOUNDARY_SCALAR,
	app.screen.width + SPRITE_RENDERING_BOUNDARY_SCALAR * 2,
	app.screen.height + SPRITE_RENDERING_BOUNDARY_SCALAR * 2,
);


// define fps text

let displayFpsText = new PIXI.Text('(empty)',
		{
			fontFamily : 'Arial',
			fontSize: 18,
			fill : 0x2A5FFF,
			align : 'center'
		});
app.stage.addChild(displayFpsText);


// construct sprite set

const sprites = new PIXI.ParticleContainer(SPRITE_TOTAL, {
	scale: true,
	position: true,
	rotation: true,
	uvs: true,
	alpha: true,
});
app.stage.addChild(sprites);


// construct a set of sprites for the sprite set, as well as an accessor array

const SPRITE_LIST = [];

for(let ii = 0; ii < SPRITE_TOTAL; ii++) {
	const sprite = PIXI.Sprite.from(SPRITE_TEXTURE);

	// center the sprite's anchor point (center of texture)

	sprite.anchor.set(0.5);

	if(SPRITE_RANDOMLY_ADJUST_SIZING) {
		sprite.scale.set(0.8 + Math.random() * 0.3);
	}
	else {
		sprite.scale.set(SPRITE_SCALAR);
	}

	// set random sprite position (within screen)

	sprite.x = (Math.random() * app.screen.width);
	sprite.y = (Math.random() * app.screen.height);

	// picka random offset

	sprite.offset = (Math.random() * 100);

	if(SPRITE_USE_RANDOM_COLORIZATION) {
		sprite.tint = ((Math.random() * 0x010101) % 0xffffff);
	}

	// define a random direction (radians)

	sprite.direction = Math.random() * Math.PI * 2;

	// define random turning speed

	sprite.turningSpeed = (Math.random() - 0.8);

	// define random movement speed

	sprite.speed = ((SPRITE_SPEED + Math.random() * SPRITE_SPEED) *
			(SPRITE_SPEED / 10.0));

	// add sprite to accessor array & particle container

	SPRITE_LIST.push(sprite);
	sprites.addChild(sprite);
}


// construct a graphics instance for drawing bounding boxes

var graphics = new PIXI.Graphics();
app.stage.addChild(graphics);


// define processing loop

let tick = 0;

app.ticker.add(() => {
	// reset graphics

	graphics.clear();
	graphics.lineStyle(1, 0x1032FF);

	// iterate through the sprites and update their position

	for(let ii = 0; ii < SPRITE_LIST.length; ii++) {
		const sprite = SPRITE_LIST[ii];
		if(sprite == null) {
			continue;
		}

		// update sprite movement & rotation

		sprite.x += (Math.sin(sprite.direction) * sprite.speed);
		sprite.y += (Math.cos(sprite.direction) * sprite.speed);

		sprite.direction += sprite.turningSpeed * 0.01;
		sprite.rotation = -sprite.direction + Math.PI;

		// wrap the sprite using the rendering boundary

		if(sprite.x < SPRITE_RENDERING_BOUNDARY.x) {
			sprite.x += SPRITE_RENDERING_BOUNDARY.width;
		}
		else if(sprite.x >
					(SPRITE_RENDERING_BOUNDARY.x +
							SPRITE_RENDERING_BOUNDARY.width)) {
			sprite.x -= SPRITE_RENDERING_BOUNDARY.width;
		}

		if(sprite.y < SPRITE_RENDERING_BOUNDARY.y) {
			sprite.y += SPRITE_RENDERING_BOUNDARY.height;
		}
		else if(sprite.y >
					(SPRITE_RENDERING_BOUNDARY.y +
							SPRITE_RENDERING_BOUNDARY.height)) {
			sprite.y -= SPRITE_RENDERING_BOUNDARY.height;
		}

		// obtain sprite boundary

		bounds = sprite.getBounds();

		// render bounding box

		if(sprite.visible) {
			graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
		}

		// calculate collisions using bounding boxes

		for(let nn = 0; nn < SPRITE_LIST.length; nn++) {
			if(
					(ii == nn) ||
					(SPRITE_LIST[nn] == null) ||
					(!SPRITE_LIST[nn].visible)) {
				continue;
			}
			lBounds = SPRITE_LIST[nn].getBounds();

			if(
					(bounds.x >= lBounds.x) &&
					(bounds.x <= (lBounds.x + lBounds.width)) &&
					(bounds.y >= lBounds.y) &&
					(bounds.y <= (lBounds.y + lBounds.height))) {
				sprite.visible = false;
				SPRITE_LIST[nn].visible = false;
				SPRITE_LIST[nn].destroy();
				SPRITE_LIST[nn] = null;
			}
		}

		if(!sprite.visible) {
			sprite.destroy();
			SPRITE_LIST[ii] = null;
		}
	}

	// increment tick

	let counter = 0;
	for(let ii = 0; ii < SPRITE_LIST.length; ii++) {
		if(SPRITE_LIST[ii] == null) {
			continue;
		}
		counter++;
	}

	if(counter > 0) {
		tick++;
	}

	// display fps

	displayFpsText.text = "FPS: " +
			(Math.round(app.ticker.FPS * 100) / 100).toFixed(2) +
			", Tick: " +
			(Math.round(tick * 100) / 100).toFixed(0) +
			", Sprite(s): " +
			counter;
});

