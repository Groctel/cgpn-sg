import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

export class ModelBase extends THREE.Object3D {
	protected geometria = new THREE.BoxGeometry(1,1,1);
	protected material = new THREE.MeshBasicMaterial({color: 0xff0000});

	protected character: THREE.Object3D;

	protected walking: boolean;
	protected walkingForward: boolean;
	protected walkingBackward: boolean;
	protected walkingLeft: boolean;
	protected walkingRight: boolean;
	protected mov_spd: number;


	constructor(){
		super();

		this.add(this.character);
		this.mov_spd = 0.03;

		this.walking = false;
		this.walkingForward = false;
		this.walkingBackward = false;
		this.walkingLeft = false;
		this.walkingRight = false;

	}

	walkRightStop(): void{
		if(this.walking){
			this.walking = false;
		}

		this.walkingRight = false;

	}

	walkRightStart(): void{
		if(!this.walking){
			this.walking = true;
		}

		this.walkingRight = true;

	}

	walkLeftStop(): void{
		if(this.walking){
			this.walking = false;
		}

		this.walkingLeft = false;
	}

	walkLeftStart(): void{
		if(!this.walking){
			this.walking = true;
		}

		this.walkingLeft = true;

	}

	walkForwardStop(): void{
		if(this.walking){
			this.walking = false;
		}

		this.walkingForward = false;
	}

	walkForwardStart(): void{
		if(!this.walking){
			this.walking = true;
		}

		this.walkingForward = true;

	}

	walkBackwardStop(): void{
		if(this.walking){
			this.walking = false;
		}

		this.walkingBackward = false;
	}

	walkBackwardStart(): void{
		if(!this.walking){
			this.walking = true;
		}
		this.walkingBackward = true;

	}

	modelPosition(): THREE.Vector3{
		return this.character.position;
	}

	update():void{
		TWEEN.update();

		if(this.walkingForward){
			this.character.position.z += this.mov_spd;
		}else if(this.walkingBackward){
			this.character.position.z -= this.mov_spd;
		}

		if(this.walkingLeft){
			this.character.position.x += this.mov_spd;
		}
		else if(this.walkingRight){
			this.character.position.x -= this.mov_spd;
		}

	}


}

