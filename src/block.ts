import * as THREE from 'three';

export default class Block extends THREE.Object3D
{
	protected static tex_bottom_path = "/tex/dirt.png";
	protected static tex_side_path   = "/tex/grass-side.png";
	protected static tex_top_path    = "/tex/grass-top.png";

	protected static tex_bottom = new THREE.TextureLoader().load(Block.tex_bottom_path);
	protected static tex_side   = new THREE.TextureLoader().load(Block.tex_side_path);
	protected static tex_top    = new THREE.TextureLoader().load(Block.tex_top_path);

	constructor ()
	{
		super();

		Block.tex_bottom.magFilter = THREE.NearestFilter;
		Block.tex_bottom.minFilter = THREE.NearestMipmapNearestFilter;
		Block.tex_side.magFilter   = THREE.NearestFilter;
		Block.tex_side.minFilter   = THREE.NearestMipmapNearestFilter;
		Block.tex_top.magFilter    = THREE.NearestFilter;
		Block.tex_top.minFilter    = THREE.NearestMipmapNearestFilter;

		const mat_bottom = new THREE.MeshStandardMaterial({map: Block.tex_bottom});
		const mat_side   = new THREE.MeshStandardMaterial({map: Block.tex_side});
		const mat_top    = new THREE.MeshStandardMaterial({map: Block.tex_top});

		const face_xp = new THREE.PlaneGeometry(1,1)
			.rotateY(Math.PI / 2)
			.translate(0.5, 0, 0);

		const face_xn = new THREE.PlaneGeometry(1,1)
			.rotateY(-Math.PI / 2)
			.translate(-0.5, 0, 0);

		const face_yp = new THREE.PlaneGeometry(1,1)
			.rotateX(-Math.PI / 2)
			.translate(0, 0.5, 0);

		const face_yn = new THREE.PlaneGeometry(1,1)
			.rotateX(Math.PI / 2)
			.translate(0, -0.5, 0);

		const face_zp = new THREE.PlaneGeometry(1,1)
			.translate(0, 0, 0.5);

		const face_zn = new THREE.PlaneGeometry(1,1)
			.rotateY(Math.PI)
			.translate(0, 0, -0.5);

		this.add(new THREE.Mesh(face_xp, mat_side));
		this.add(new THREE.Mesh(face_xn, mat_side));
		this.add(new THREE.Mesh(face_yp, mat_top));
		this.add(new THREE.Mesh(face_yn, mat_bottom));
		this.add(new THREE.Mesh(face_zp, mat_side));
		this.add(new THREE.Mesh(face_zn, mat_side));
	}
}
