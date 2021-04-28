import * as $ from 'jquery';
import { GameScene } from './scene';

$(function (): void
{
	const scene = new GameScene("#WebGL-output");

	window.addEventListener('resize', () => scene.onWindowResize());
	scene.update();
});


