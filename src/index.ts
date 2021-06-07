import $ from 'jquery';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

import Controls from './controls';
import GameScene from './scene';
import Player from './player';

$(() =>
{
	const scene = new GameScene("#WebGL-output");
	const cam_controls = new PointerLockControls(
		Player.camera,
		GameScene.renderer.domElement
	);

	window.addEventListener('click', () =>
	{
		cam_controls.lock();
	}, false);

	window.addEventListener('keydown', (event) =>
	{
		Controls.onKeyDown(event);
	}, false);

	window.addEventListener('keyup', (event) =>
	{
		Controls.onKeyUp(event);
	}, false);

	window.addEventListener('mousedown', (event) =>
	{
		Controls.onMouseDown(event);
	}, false);

	window.addEventListener('resize', () =>
	{
		Controls.onWindowResize();
	}, false);

	scene.update();
});
