import $ from 'jquery';
import * as THREE from 'three';

import Player from './player';
import World from './world';

export default class GameScene extends THREE.Scene
{
	public static renderer = new THREE.WebGLRenderer();

	private world: World;

	constructor (canvas: string)
	{
		super();

		this.constructRenderer(canvas);
		this.constructLights();

		this.world = new World(this);

		Player.spawn();
		this.add(Player.camera);
	}

	constructLights (): void
	{
		const light     = new THREE.AmbientLight(0xccddee, 1);
		const spotlight = new THREE.SpotLight(0xffffff, 1);

		spotlight.position.set(0, 100, 0);

		this.add(light);
		this.add(spotlight);
	}

	constructRenderer (canvas: string): void
	{
		GameScene.renderer = new THREE.WebGLRenderer();
		GameScene.renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
		GameScene.renderer.setSize(window.innerWidth, window.innerHeight);
		$(canvas).append(GameScene.renderer.domElement);
	}

	update (): void
	{
		Player.updatePosition();
		GameScene.renderer.render(this, Player.camera);

		requestAnimationFrame(() => this.update());
	}
}
