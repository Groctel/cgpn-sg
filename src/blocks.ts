import Textures from './textures';

interface BlockAttrs
{
	breakable: boolean;
	empty:     boolean;
}

export interface Block
{
	attrs:      BlockAttrs;
	uv_bottom?: number[];
	uv_side?:   number[];
	uv_top?:    number[];
}

interface BlockList
{
	[key: string]: Block;
}

export const Blocks: BlockList = {
	air:
	{
		attrs:
		{
			breakable: false,
			empty: true,
		},
	},
	dirt:
	{
		attrs:
		{
			breakable: true,
			empty: false,
		},
		uv_bottom: [
			0.5, 0.5,
			1.0, 0.5,
			0.5, 1.0,
			1.0, 1.0,
		],
		uv_side: [
			0.5, 0.5,
			1.0, 0.5,
			0.5, 1.0,
			1.0, 1.0,
		],
		uv_top: [
			0.5, 0.5,
			1.0, 0.5,
			0.5, 1.0,
			1.0, 1.0,
		],
	},
	grass:
	{
		attrs:
		{
			breakable: true,
			empty: false,
		},
		uv_bottom: [
			0.5, 0.5,
			1.0, 0.5,
			0.5, 1.0,
			1.0, 1.0,
		],
		uv_side: [
			0.0, 0.5,
			0.5, 0.5,
			0.0, 0.0,
			0.5, 0.0,
		],
		uv_top: [
			0.0, 0.5,
			0.5, 0.5,
			0.0, 1.0,
			0.5, 1.0,
		],
	},
};
