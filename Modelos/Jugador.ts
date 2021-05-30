import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import {ModelBase} from './ModelBase';

export class Jugador extends ModelBase {
	protected geometria = new THREE.BoxGeometry(1,1,1);
	protected material = new THREE.MeshBasicMaterial({color: 0xff0000});

	protected cabeza: THREE.Mesh;
	protected cuerpo: THREE.Mesh;
	protected brazoIzq: THREE.Mesh;
	protected brazoDch: THREE.Mesh;
	protected piernaIzq: THREE.Mesh;
	protected piernaDch: THREE.Mesh;

	//Groups so that rotations are around the center
	protected armGroup1: THREE.Object3D;
	protected armGroup2: THREE.Object3D;
	protected LegGroup1: THREE.Object3D;
	protected LegGroup2: THREE.Object3D;
	protected noHead: THREE.Object3D;

	//Tweens for the walking animation
	protected tweenBackLeftArm;
	protected tweenForthLeftArm;

	protected tweenBackRightArm;
	protected tweenForthRightArm;

	protected tweenBackLeftLeg;
	protected tweenForthLeftLeg;

	protected tweenBackRightLeg;
	protected tweenForthRightLeg;

	protected tweenMovingUp;

	protected walking: boolean;
	protected walkingForward: boolean;
	protected walkingBackward: boolean;
	protected walkingLeft: boolean;
	protected walkingRight: boolean;
	protected mov_spd: number;


	constructor(){
		super();

		//Creación de la cabeza y traslado a su posición
		this.cabeza = new THREE.Mesh(this.geometria,this.material);
		this.cabeza.scale.x *= 1.5;
		this.cabeza.scale.y *= 1.5;
		this.cabeza.scale.z *= 1.5;

		this.cabeza.position.y = 2.25;

		//Creación del cuerpo
		this.cuerpo = new THREE.Mesh(this.geometria, this.material);
		this.cuerpo.scale.x *=2;
		this.cuerpo.scale.y *=3;
		this.cuerpo.scale.z *=0.75;

		//Creación de las piernas

		//Pierna Izquierda
		//Con su Animación
		this.piernaIzq = new THREE.Mesh(this.geometria, this.material);
		this.piernaIzq.scale.x *= 0.75;
		this.piernaIzq.scale.y *= 3;
		this.piernaIzq.scale.z *= 0.75;

		this.piernaIzq.position.y += -1.3;

		this.LegGroup2 = new THREE.Object3D();
		this.LegGroup2.add(this.piernaIzq);

		this.tweenForthLeftLeg = new TWEEN.Tween(this.LegGroup2.rotation)
			.to({x: this.LegGroup2.rotation.x + 45*(Math.PI/180)},1000)
			.easing(TWEEN.Easing.Quadratic.Out)
			.yoyo(true)
			.repeat(Infinity);

		this.tweenBackLeftLeg = new TWEEN.Tween(this.LegGroup2.rotation)
			.to({x: this.LegGroup2.rotation.x - 45*(Math.PI/180)},1000)
			.easing(TWEEN.Easing.Quadratic.Out)
			.yoyo(true);

		this.tweenBackLeftLeg.chain(this.tweenForthLeftLeg);
		this.tweenForthLeftLeg.chain(this.tweenBackLeftLeg);
		this.LegGroup2.position.y -= 1.7;

		//Pierna Derecha
		//Con su Animación
		this.piernaDch = new THREE.Mesh(this.geometria, this.material);
		this.piernaDch.scale.x *= 0.75;
		this.piernaDch.scale.y *= 3;
		this.piernaDch.scale.z *= 0.75;

		this.piernaDch.position.y -= 1.3;
		this.LegGroup1 = new THREE.Object3D();
		this.LegGroup1.add(this.piernaDch);

		this.tweenForthRightLeg = new TWEEN.Tween(this.LegGroup1.rotation)
			.to({x: this.LegGroup1.rotation.x + 45*(Math.PI/180)},1000)
			.easing(TWEEN.Easing.Quadratic.Out)
			.yoyo(true);

		this.tweenBackRightLeg = new TWEEN.Tween(this.LegGroup1.rotation)
			.to({x: this.LegGroup1.rotation.x - 45*(Math.PI/180)},1000)
			.easing(TWEEN.Easing.Quadratic.Out)
			.yoyo(true)
			.repeat(Infinity);

		this.tweenForthRightLeg.chain(this.tweenBackRightLeg);
		this.tweenBackRightLeg.chain(this.tweenForthRightLeg);

		this.LegGroup1.position.y -= 1.7;
		this.piernaDch.position.x += 0.5;
		this.piernaIzq.position.x += -0.5;

		//Creación de los Brazos
		//Left Arm Creation and animation
		this.brazoIzq = new THREE.Mesh(this.geometria, this.material);
		this.brazoIzq.scale.x *=0.75;
		this.brazoIzq.scale.y *=3;
		this.brazoIzq.scale.z *=0.75;

		this.armGroup1 = new THREE.Object3D();
		this.brazoIzq.position.y += -1.3;
		this.armGroup1.add(this.brazoIzq);

		this.tweenForthLeftArm = new TWEEN.Tween(this.armGroup1.rotation)
			.to({x: this.armGroup1.rotation.x + 25*(Math.PI/180)},1000)
			.easing(TWEEN.Easing.Quadratic.Out)
			.yoyo(true);

		this.tweenBackLeftArm = new TWEEN.Tween(this.armGroup1.rotation)
			.to({x: this.armGroup1.rotation.x - 25*(Math.PI/180)},1000)
			.easing(TWEEN.Easing.Quadratic.Out)
			.yoyo(true)
			.repeat(Infinity);

		this.tweenForthLeftArm.chain(this.tweenBackLeftArm);
		this.tweenBackLeftArm.chain(this.tweenForthLeftArm);
		//Right Arm Creation and animation
		this.brazoDch = new THREE.Mesh(this.geometria, this.material);
		this.brazoDch.scale.x *=0.75;
		this.brazoDch.scale.y *=3;
		this.brazoDch.scale.z *=0.75;


		this.armGroup2 = new THREE.Object3D();
		this.brazoDch.position.y += -1.3;
		this.armGroup2.add(this.brazoDch);

		this.tweenForthRightArm = new TWEEN.Tween(this.armGroup2.rotation)
			.to({x: this.armGroup2.rotation.x + 25*(Math.PI/180)},1000)
			.easing(TWEEN.Easing.Quadratic.Out)
			.yoyo(true)
			.repeat(Infinity);

		this.tweenBackRightArm = new TWEEN.Tween(this.armGroup2.rotation)
			.to({x: this.armGroup2.rotation.x - 25*(Math.PI/180)},1000)
			.easing(TWEEN.Easing.Quadratic.Out)
			.yoyo(true);

		this.tweenBackRightArm.chain(this.tweenForthRightArm);
		this.tweenForthRightArm.chain(this.tweenBackRightArm);

		this.armGroup1.position.y += 1.3;
		this.armGroup2.position.y += 1.3;
		this.brazoDch.position.x += -1.375;
		this.brazoIzq.position.x += 1.375;


		this.character = new THREE.Object3D();
		this.noHead = new THREE.Object3D();
		this.noHead.add(this.cuerpo);
		this.noHead.add(this.LegGroup2);
		this.noHead.add(this.LegGroup1);
		this.noHead.add(this.armGroup1);
		this.noHead.add(this.armGroup2);
		this.character.add(this.cabeza);
		this.character.add(this.noHead);


		this.tweenMovingUp = new TWEEN.Tween(this.character.position)
			.to({y: 1.5},1000)
			.easing(TWEEN.Easing.Quadratic.Out)
			.yoyo(true)
			.repeat(Infinity);


		this.add(this.character);
		this.mov_spd = 0.1;

		this.walking = false;
		this.walkingForward = false;
		this.walkingBackward = false;
		this.walkingLeft = false;
		this.walkingRight = false;

	}

	walkRightStop(): void{
		if(this.walking){
			this.noHead.rotateY(45*(Math.PI/180));
			this.tweenForthLeftLeg.stop();
			this.tweenBackRightLeg.stop();

			this.tweenForthRightArm.stop();
			this.tweenBackLeftArm.stop();
			this.tweenMovingUp.stop();
			this.walking = false;
		}

		this.walkingRight = false;

	}

	walkRightStart(): void{
		if(!this.walking){
			this.noHead.rotateY(-45*(Math.PI/180));
			this.tweenBackLeftLeg.start();
			this.tweenForthRightLeg.start();

			this.tweenForthLeftArm.start();
			this.tweenBackRightArm.start();
			this.tweenMovingUp.start();
			this.walking = true;
		}

		this.walkingRight = true;

	}

	walkLeftStop(): void{
		if(this.walking){
			this.noHead.rotateY(-45*(Math.PI/180));
			this.tweenForthLeftLeg.stop();
			this.tweenBackRightLeg.stop();

			this.tweenForthRightArm.stop();
			this.tweenBackLeftArm.stop();
			this.tweenMovingUp.stop();
			this.walking = false;
		}

		this.walkingLeft = false;
	}

	walkLeftStart(): void{
		if(!this.walking){
			this.noHead.rotateY(45*(Math.PI/180));
			this.tweenBackLeftLeg.start();
			this.tweenForthRightLeg.start();

			this.tweenForthLeftArm.start();
			this.tweenBackRightArm.start();
			this.tweenMovingUp.start();
			this.walking = true;
		}

		this.walkingLeft = true;

	}

	walkForwardStop(): void{
		if(this.walking){
			this.tweenForthLeftLeg.stop();
			this.tweenBackRightLeg.stop();

			this.tweenForthRightArm.stop();
			this.tweenBackLeftArm.stop();
			this.tweenMovingUp.stop();
			this.walking = false;
		}

		this.walkingForward = false;
	}

	walkForwardStart(): void{
		if(!this.walking){
			this.tweenBackLeftLeg.start();
			this.tweenForthRightLeg.start();

			this.tweenForthLeftArm.start();
			this.tweenBackRightArm.start();
			this.tweenMovingUp.start();
			this.walking = true;
		}

		this.walkingForward = true;

	}

	walkBackwardStop(): void{
		if(this.walking){
			this.tweenForthLeftLeg.stop();
			this.tweenBackRightLeg.stop();

			this.tweenForthRightArm.stop();
			this.tweenBackLeftArm.stop();
			this.tweenMovingUp.stop();
			this.walking = false;
		}

		this.walkingBackward = false;
	}

	walkBackwardStart(): void{
		if(!this.walking){
			this.tweenBackLeftLeg.start();
			this.tweenForthRightLeg.start();

			this.tweenForthLeftArm.start();
			this.tweenBackRightArm.start();
			this.tweenMovingUp.start();
			this.walking = true;
		}
		this.walkingBackward = true;

	}

}

