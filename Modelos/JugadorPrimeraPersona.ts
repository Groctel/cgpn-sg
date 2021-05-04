import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';


export class JugadorPrimeraPersona extends THREE.Object3D {
	private geometria = new THREE.BoxGeometry(1,1,1);
	private material = new THREE.MeshBasicMaterial({color: 0xff0000});
	private materialUp = new THREE.MeshNormalMaterial();

	private brazoDch: THREE.Mesh;
	private brazoAparte: THREE.Object3D;
	private cubo: THREE.Mesh;

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


		this.add(this.brazoAparte);
		this.add(this.cubo);


		//Animaciones
	}




}

