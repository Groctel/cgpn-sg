import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import {ModelBase} from './ModelBase';


export class JugadorPrimeraPersona extends ModelBase {
	private materialUp = new THREE.MeshNormalMaterial();

	private brazoAparte: THREE.Object3D;
	private brazoDch: THREE.Object3D;
	private cubo: THREE.Mesh;

	private tweenUp

	constructor(){
		super();

		//Creamos el brazo
		this.brazoDch = new THREE.Mesh(this.geometria, this.material);
		this.brazoDch.scale.x *=0.75;
		this.brazoDch.scale.y *=3;
		this.brazoDch.scale.z *=0.75;

		this.brazoDch.position.y -= 1.3;

		this.brazoAparte = new THREE.Object3D();

		this.brazoAparte.add(this.brazoDch);

		this.brazoAparte.rotation.x = (Math.PI/180)*-70;

		//Creamos EL cubo que señala el objecto que sujeta el jugador
		this.cubo = new THREE.Mesh(this.geometria,this.materialUp);
		this.cubo.scale.x *=0.75;
		this.cubo.scale.y *=0.75;
		this.cubo.scale.z *=0.75;

		this.cubo.position.z += 2.7;
		this.cubo.position.y -= 0.5;
		this.cubo.position.x += 0.5;


		this.character = new THREE.Object3D();
		this.character.add(this.brazoAparte);
		this.character.add(this.cubo);
		this.add(this.character);

		//Animaciones
		this.tweenUp = new TWEEN.Tween(this.character.position)
			.to({y:1.5},1000)
			.easing(TWEEN.Easing.Quadratic.Out)
			.yoyo(true)
			.repeat(Infinity);
	}

	walkRightStop(): void{
		if(this.walking){
			this.tweenUp.stop();
			this.walking = false;
		}

		this.walkingRight = false;

	}

	walkRightStart(): void{
		if(!this.walking){
			this.tweenUp.start();
			this.walking = true;
		}

		this.walkingRight = true;

	}

	walkLeftStop(): void{
		if(this.walking){
			this.tweenUp.stop();
			this.walking = false;
		}

		this.walkingLeft = false;
	}

	walkLeftStart(): void{
		if(!this.walking){
			this.tweenUp.start();
			this.walking = true;
		}

		this.walkingLeft = true;

	}

	walkForwardStop(): void{
		if(this.walking){
			this.tweenUp.stop();
			this.walking = false;
		}

		this.walkingForward = false;
	}

	walkForwardStart(): void{
		if(!this.walking){
			this.tweenUp.start();
			this.walking = true;
		}

		this.walkingForward = true;

	}

	walkBackwardStop(): void{
		if(this.walking){
			this.tweenUp.stop();
			this.walking = false;
		}

		this.walkingBackward = false;
	}

	walkBackwardStart(): void{
		if(!this.walking){
			this.tweenUp.start();
			this.walking = true;
		}

		this.walkingBackward = true;

	}

}

