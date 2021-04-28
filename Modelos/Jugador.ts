import * as THREE from 'three';


export class Jugador extends THREE.Object3D {
	private geometria = new THREE.BoxGeometry(1,1,1);
	private material = new THREE.MeshBasicMaterial({color: 0xff0000});

	private cabeza: THREE.Mesh;
	private cuerpo: THREE.Mesh;
	private brazoIzq: THREE.Mesh;
	private brazoDch: THREE.Mesh;
	private piernaIzq: THREE.Mesh;
	private piernaDch: THREE.Mesh;

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
		this.piernaIzq = new THREE.Mesh(this.geometria, this.material);
		this.piernaIzq.scale.x *= 0.75;
		this.piernaIzq.scale.y *= 3;
		this.piernaIzq.scale.z *= 0.75;

		this.piernaIzq.position.y += -3;

		this.piernaDch = new THREE.Mesh(this.geometria, this.material);
		this.piernaDch.scale.x *= 0.75;
		this.piernaDch.scale.y *= 3;
		this.piernaDch.scale.z *= 0.75;

		this.piernaDch.position.y += -3;

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
		this.add(this.piernaIzq);
		this.add(this.piernaDch);
		this.add(this.brazoIzq);
		this.add(this.brazoDch);


	}


}

