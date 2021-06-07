import { Blocks } from './blocks';
import GameScene from './scene';
import Player from './player';

const placeable_blocks = [
	Blocks.dirt,
	Blocks.grass,
	Blocks.oak_leaves,
	Blocks.oak_wood,
	Blocks.stone,
];

export default class Controls
{
	private static selected_block = 0;
	private static key_a = false;
	private static key_d = false;
	private static key_s = false;
	private static key_w = false;

	public static onKeyDown (event: KeyboardEvent): void
	{
		const key = event.key;

		if (key === "a")
		{
			Controls.key_a = true;
			Player.moveLeft();
		}
		else if (key === "d")
		{
			Controls.key_d = true;
			Player.moveRight();
		}
		else if (key === "s")
		{
			Controls.key_s = true;
			Player.moveBackwards();
		}
		else if (key === "w")
		{
			Controls.key_w = true;
			Player.moveForward();
		}
		else if (key === " ")
		{
			Player.jump();
		}
	}

	public static onKeyUp (event: KeyboardEvent): void
	{
		const key = event.key;

		if (key === "a")
		{
			Controls.key_a = false;

			if (Controls.key_d)
				Player.moveRight();
			else
				Player.stopMovingSide();
		}
		else if (key === "d")
		{
			Controls.key_d = false;

			if (Controls.key_a)
				Player.moveLeft();
			else
				Player.stopMovingSide();
		}
		else if (key === "s")
		{
			Controls.key_s = false;

			if (Controls.key_w)
				Player.moveForward();
			else
				Player.stopMovingFront();
		}
		else if (key === "w")
		{
			Controls.key_w = false;

			if (Controls.key_s)
				Player.moveBackwards();
			else
				Player.stopMovingFront();
		}
	}

	public static onMouseDown (event: MouseEvent): void
	{
		switch(event.button)
		{
		case 0:
			GameScene.delBlock();
			break;

		case 2:
			GameScene.addBlock(placeable_blocks[Controls.selected_block]);
			break;
		}
	}

	public static onWheel (event: WheelEvent): void
	{
		let offset = 0;

		if (event.deltaY > 0)
			offset = 1;
		else if (event.deltaY < 0)
			offset = -1;

		Controls.selected_block += offset;
		Controls.selected_block %= placeable_blocks.length;

		if (offset !== 0)
			Player.updateCube(placeable_blocks[Controls.selected_block]);
	}

	public static onWindowResize (): void
	{
		Player.camera.aspect = window.innerWidth / window.innerHeight;
		Player.camera.updateProjectionMatrix();
		GameScene.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
