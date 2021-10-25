# pixijs-experiment
A simple animated sprite system with collisions experiment using PixiJS.


Setup:

```
$ npm install http-server
$ http-server . --port 8080 -a 0.0.0.0 --ext html --no-dotfiles
```

After starting `http-server` instance, you can navigate to http://0.0.0.0:8080/index.html to see the experiment.

Hacking:

- the following constants (found in `index.html`) can be used to modify this experiement's behavior

```
const SPRITE_TEXTURE = 'sandrail01.png';

const SPRITE_TOTAL = 128;

const SPRITE_SPEED = 4.0;

const SPRITE_RANDOMLY_ADJUST_SIZING = false;

const SPRITE_SCALAR = 0.1;

const SPRITE_USE_RANDOM_COLORIZATION = false;

const SPRITE_RENDERING_BOUNDARY_SCALAR = 200;
```
