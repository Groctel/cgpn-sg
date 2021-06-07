import GameScene from './scene';
import Player from './player';

export default class Controls
{
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

	public static onWindowResize (): void
	{
		Player.camera.aspect = window.innerWidth / window.innerHeight;
		Player.camera.updateProjectionMatrix();
		GameScene.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}
