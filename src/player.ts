import * as THREE from 'three';

import { AdyChunks, Chunk } from './chunk';
import World from './world';

const y_axis = new THREE.Vector3(0, 1, 0);

export default class Player
{
	// private materialUp = new THREE.MeshNormalMaterial();
	// private material = new THREE.MeshBasicMaterial({color:0xff0000});
	// private geometria = new THREE.BoxGeometry(1, 1, 1);

	// private character: THREE.Object3D;
	// private brazoAparte: THREE.Object3D;
	// private brazoDch: THREE.Object3D;
	// private cubo: THREE.Mesh;

	private static speed       = 0.15;
	private static fall_speed  = 0;
	private static front_speed = 0;
	private static right_speed = 0;

	private static look       = new THREE.Vector3(0, 0, 0);
	private static next_block  = new THREE.Vector3(0, 0, 0);
	private static next_step  = new THREE.Vector3(0, 0, 0);
	private static step_fwd   = new THREE.Vector3(0, 0, 0);
	private static step_side  = new THREE.Vector3(0, 0, 0);
	private static curr_block = new THREE.Vector3(0, 0, 0);
	private static curr_chunk = new THREE.Vector3(-1, 0, -1);

	private static ady_chunks: AdyChunks;
	private static chunk: Chunk;

	private static grounded = false;
	private static jumping = false;
	private static prev_time = new Date().getTime();

	public static camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);
	public static position  = Player.camera.position;
	public static direction = new THREE.Vector3(0, 0, 0);

	constructor ()
	{
		//Creamos el brazo
		// this.brazoDch = new THREE.Mesh(this.geometria, this.material);
		// this.brazoDch.scale.x *=0.75;
		// this.brazoDch.scale.y *=3;
		// this.brazoDch.scale.z *=0.75;

		// this.brazoDch.position.y -= 1.3;

		// this.brazoAparte = new THREE.Object3D();

		// this.brazoAparte.add(this.brazoDch);
		// this.brazoAparte.rotation.x = 70*(Math.PI/180);

		////Creamos El cubo que señala el objeto que sujeta el jugador
		//this.cubo = new THREE.Mesh(this.geometria,this.materialUp);
		//this.cubo.scale.x *=0.75;
		//this.cubo.scale.y *=0.75;
		//this.cubo.scale.z *=0.75;

		// this.cubo.position.z -= 2.7;
		// this.cubo.position.y -= 0.5;
		// this.cubo.position.x -= 0.5;


		// this.character = new THREE.Object3D();
		// this.character.add(this.brazoAparte);
		// this.character.add(this.cubo);
		// this.add(this.character);
	}

	private static willCollideAt (x: number, z: number, y: number): boolean
	{
		let collide = true;

		if (
			x >= 0 && x < Chunk.base &&
			z >= 0 && z < Chunk.base &&
			y >= 0 && y < Chunk.height
		) {
			collide = Player.chunk.struct()[x][z][y].attrs.solid;
		}
		else if (x < 0)
		{
			if (z < 0)
				collide = Player.ady_chunks.nxnz === null
					? true
					: Player.ady_chunks.nxnz.struct()[Chunk.base-1][z][y].attrs.solid;
			else
				collide = Player.ady_chunks.nx === null
					? true
					: Player.ady_chunks.nx.struct()[Chunk.base-1][z][y].attrs.solid;
		}
		else if (x >= Chunk.base)
		{
			if (z >= Chunk.base)
				collide = this.ady_chunks.pxpz === null
					? true
					: Player.ady_chunks.pxpz.struct()[0][z][y].attrs.solid;
			else
				collide = this.ady_chunks.px === null
					? true
					: Player.ady_chunks.px.struct()[0][z][y].attrs.solid;
		}
		else if (z < 0)
		{
			if (x >= Chunk.base)
				collide = this.ady_chunks.pxnz === null
					? true
					: Player.ady_chunks.pxnz.struct()[x][Chunk.base-1][y].attrs.solid;
			else
				collide = this.ady_chunks.nz === null
					? true
					: Player.ady_chunks.nz.struct()[x][Chunk.base-1][y].attrs.solid;
		}
		else if (z >= Chunk.base)
		{
			if (x < 0)
				collide = Player.ady_chunks.nxpz === null
					? true
					: this.ady_chunks.nxpz.struct()[x][0][y].attrs.solid;
			else
				collide = Player.ady_chunks.pz === null
					? true
					: this.ady_chunks.pz.struct()[x][0][y].attrs.solid;
		}

		return collide;
	}

	private static updatePositionAgainstCollisions (): void
	{
		const time = new Date().getTime();
		Player.step_fwd = Player.look.clone()
			.multiplyScalar(Player.front_speed);

		Player.step_side = Player.look.clone()
			.applyAxisAngle(y_axis, Math.PI/2)
			.multiplyScalar(Player.right_speed);

		Player.next_step.addVectors(Player.step_fwd, Player.step_side);
		Player.next_block.addVectors(Player.curr_block, Player.next_step);

		if(Player.jumping){
			const delta = ( time - Player.prev_time ) / 1000;

			Player.fall_speed -= 9.8 * 30 * delta;

			if(Player.fall_speed < 0){
				Player.jumping = false;
			}

		}
		else{
			if (!Player.willCollideAt(
				~~Player.curr_block.x,
				~~Player.curr_block.z,
				~~(Player.position.y-1.3)
			)) {
				if (Player.fall_speed > 0 && Player.fall_speed <= 1.5)
					Player.fall_speed += World.gravity * Player.fall_speed;
				else
					Player.fall_speed = 0.15;

				this.grounded = false;
			}
			else
			{
				Player.fall_speed = 0;
				this.grounded = true;

				if (Player.willCollideAt(
					~~Player.curr_block.x,
					~~Player.curr_block.z,
					~~Player.position.y-1
				)) {
					Player.position.y += 1;
				}
			}

			if (Player.willCollideAt(
				~~Player.next_block.x,
				~~Player.next_block.z,
				~~Player.position.y-1
			)) {
				Player.next_step.setScalar(0);
			}
		}

		Player.prev_time = time;

		if(this.jumping)
			Player.next_step.y = Player.fall_speed;
		else
			Player.next_step.y = -Player.fall_speed;

		Player.position.add(Player.next_step);

	}

	private static updateWorldPosition (): void
	{
		const curr_chunk = Player.position.clone()
			.divideScalar(Chunk.base)
			.addScalar(World.size/2);

		const x_chunk = ~~curr_chunk.x;
		const z_chunk = ~~curr_chunk.z;

		if (
			x_chunk !== Player.curr_chunk.x ||
			z_chunk !== Player.curr_chunk.z
		) {
			Player.ady_chunks   = World.adyChunksAt(x_chunk, z_chunk);
			Player.chunk        = World.chunkAt(x_chunk, z_chunk);
			Player.curr_chunk.x = x_chunk;
			Player.curr_chunk.z = z_chunk;
		}

		Player.curr_block.x = (curr_chunk.x - x_chunk) * Chunk.base + 0.5;
		Player.curr_block.z = (curr_chunk.z - z_chunk) * Chunk.base + 0.5;
	}

	public static moveForward   (): void { Player.front_speed =  Player.speed; }
	public static moveBackwards (): void { Player.front_speed = -Player.speed; }
	public static moveLeft      (): void { Player.right_speed =  Player.speed; }
	public static moveRight     (): void { Player.right_speed = -Player.speed; }
	public static jump			 (): void { Player.jumping = true; Player.fall_speed = 10; }
	public static isGrounded	 (): boolean {return this.grounded;}

	public static stopMovingFront    (): void { Player.front_speed = 0; }
	public static stopMovingSide     (): void { Player.right_speed = 0; }

	public static spawn (): void
	{
		Player.position.set(0, 23, 0);
		Player.updateWorldPosition();
	}

	public static updatePosition (): void
	{
		Player.camera.getWorldDirection(Player.look);
		Player.look.y = 0;
		Player.look.normalize();

		Player.updatePositionAgainstCollisions();
		Player.updateWorldPosition();
	}
}
