import $ from 'jquery';
import { GameScene } from './scene';

$(function (): void
{
	const scene = new GameScene("#WebGL-output");

	window.addEventListener('resize', () => scene.onWindowResize());
	window.addEventListener('keydown', (event) => scene.onKeyDown(event),true);
	window.addEventListener('keyup', (event) => scene.onKeyUp(event));
	scene.update();
});


