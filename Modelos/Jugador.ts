import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

export class Jugador extends THREE.Object3D {
	private geometria = new THREE.BoxGeometry(1,1,1);
	private material = new THREE.MeshBasicMaterial({color: 0xff0000});

	private cabeza: THREE.Mesh;
	private cuerpo: THREE.Mesh;
	private brazoIzq: THREE.Mesh;
	private brazoDch: THREE.Mesh;
	private piernaIzq: THREE.Mesh;
	private piernaDch: THREE.Mesh;

	private LegGroup1: THREE.Object3D;
	private LegGroup2: THREE.Object3D;

	private tweenBackLeftLeg;
	private tweenForthLeftLeg;

	private tweenBackRightLeg;
	private tweenForthRightLeg;

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

		this.LegGroup1.position.y -= 1.7;
		this.piernaDch.position.x += 0.5;
		this.piernaIzq.position.x += -0.5;

		//Creación de los Brazos
		this.brazoIzq = new THREE.Mesh(this.geometria, this.material);
		this.brazoIzq.scale.x *=0.75;
		this.brazoIzq.scale.y *=3;
		this.brazoIzq.scale.z *=0.75;

		this.brazoDch = new THREE.Mesh(this.geometria, this.material);
		this.brazoDch.scale.x *=0.75;
		this.brazoDch.scale.y *=3;
		this.brazoDch.scale.z *=0.75;

		this.brazoDch.position.x += -1.375;
		this.brazoIzq.position.x += 1.375;


		this.add(this.cabeza);
		this.add(this.cuerpo);
		this.add(this.LegGroup2);
		this.add(this.LegGroup1);
		this.add(this.brazoIzq);
		this.add(this.brazoDch);

	}

	walkAnimation(): void{

		this.tweenBackLeftLeg.start();
		this.tweenForthRightLeg.start();

	}

	update():void{
		TWEEN.update();
	}


}

