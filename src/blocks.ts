import Textures from './textures';

const bedrock_col    = 2; const bedrock_row    = 1;
const dirt_col       = 1; const dirt_row       = 1;
const grass_side_col = 0; const grass_side_row = 0;
const grass_top_col  = 0; const grass_top_row  = 1;
const oak_leaves_col = 2; const oak_leaves_row = 2;
const oak_side_col   = 0; const oak_side_row   = 2;
const oak_top_col    = 1; const oak_top_row    = 2;
const stone_col      = 1; const stone_row      = 0;

class BlockAttrs
{
	breakable: boolean;
	empty: boolean;
	transparent: boolean;
}

export class Block
{
	attrs:      BlockAttrs;
	uv_bottom?: number[];
	uv_side?:   number[];
	uv_top?:    number[];
}

export class Blocks
{
	public static readonly air: Block =
	{
		attrs:
		{
			breakable: false,
			empty: true,
			transparent: true,
		},
	}

	public static readonly bedrock: Block =
	{
		attrs:
		{
			breakable: false,
			empty: false,
			transparent: false,
		},
		uv_bottom: [
			bedrock_col     / Textures.rows, (bedrock_row+1) / Textures.cols,
			(bedrock_col+1) / Textures.rows, (bedrock_row+1) / Textures.cols,
			bedrock_col     / Textures.rows, bedrock_row     / Textures.cols,
			(bedrock_col+1) / Textures.rows, bedrock_row     / Textures.cols,
		],
		uv_side: [
			bedrock_col     / Textures.rows, (bedrock_row+1) / Textures.cols,
			(bedrock_col+1) / Textures.rows, (bedrock_row+1) / Textures.cols,
			bedrock_col     / Textures.rows, bedrock_row     / Textures.cols,
			(bedrock_col+1) / Textures.rows, bedrock_row     / Textures.cols,
		],
		uv_top: [
			bedrock_col     / Textures.rows, (bedrock_row+1) / Textures.cols,
			(bedrock_col+1) / Textures.rows, (bedrock_row+1) / Textures.cols,
			bedrock_col     / Textures.rows, bedrock_row     / Textures.cols,
			(bedrock_col+1) / Textures.rows, bedrock_row     / Textures.cols,
		],
	}
	public static readonly dirt: Block =
	{
		attrs:
		{
			breakable: true,
			empty: false,
			transparent: false,
		},
		uv_bottom: [
			dirt_col     / Textures.rows, (dirt_row+1) / Textures.cols,
			(dirt_col+1) / Textures.rows, (dirt_row+1) / Textures.cols,
			dirt_col     / Textures.rows, dirt_row     / Textures.cols,
			(dirt_col+1) / Textures.rows, dirt_row     / Textures.cols,
		],
		uv_side: [
			dirt_col     / Textures.rows, (dirt_row+1) / Textures.cols,
			(dirt_col+1) / Textures.rows, (dirt_row+1) / Textures.cols,
			dirt_col     / Textures.rows, dirt_row     / Textures.cols,
			(dirt_col+1) / Textures.rows, dirt_row     / Textures.cols,
		],
		uv_top: [
			dirt_col     / Textures.rows, (dirt_row+1) / Textures.cols,
			(dirt_col+1) / Textures.rows, (dirt_row+1) / Textures.cols,
			dirt_col     / Textures.rows, dirt_row     / Textures.cols,
			(dirt_col+1) / Textures.rows, dirt_row     / Textures.cols,
		],
	};

	public static readonly grass: Block =
	{
		attrs:
		{
			breakable: true,
			empty: false,
			transparent: false,
		},
		uv_bottom: [
			dirt_col     / Textures.rows, (dirt_row+1) / Textures.cols,
			(dirt_col+1) / Textures.rows, (dirt_row+1) / Textures.cols,
			dirt_col     / Textures.rows, dirt_row     / Textures.cols,
			(dirt_col+1) / Textures.rows, dirt_row     / Textures.cols,
		],
		uv_side: [
			grass_side_col     / Textures.rows, (grass_side_row+1) / Textures.cols,
			(grass_side_col+1) / Textures.rows, (grass_side_row+1) / Textures.cols,
			grass_side_col     / Textures.rows, grass_side_row     / Textures.cols,
			(grass_side_col+1) / Textures.rows, grass_side_row     / Textures.cols,
		],
		uv_top: [
			grass_top_col     / Textures.rows, (grass_top_row+1) / Textures.cols,
			(grass_top_col+1) / Textures.rows, (grass_top_row+1) / Textures.cols,
			grass_top_col     / Textures.rows, grass_top_row     / Textures.cols,
			(grass_top_col+1) / Textures.rows, grass_top_row     / Textures.cols,
		],
	};

	public static readonly oak_leaves: Block =
	{
		attrs:
		{
			breakable: true,
			empty: false,
			transparent: true,
		},
		uv_bottom: [
			oak_leaves_col     / Textures.rows, (oak_leaves_row+1) / Textures.cols,
			(oak_leaves_col+1) / Textures.rows, (oak_leaves_row+1) / Textures.cols,
			oak_leaves_col     / Textures.rows, oak_leaves_row     / Textures.cols,
			(oak_leaves_col+1) / Textures.rows, oak_leaves_row     / Textures.cols,
		],
		uv_side: [
			oak_leaves_col     / Textures.rows, (oak_leaves_row+1) / Textures.cols,
			(oak_leaves_col+1) / Textures.rows, (oak_leaves_row+1) / Textures.cols,
			oak_leaves_col     / Textures.rows, oak_leaves_row     / Textures.cols,
			(oak_leaves_col+1) / Textures.rows, oak_leaves_row     / Textures.cols,
		],
		uv_top: [
			oak_leaves_col     / Textures.rows, (oak_leaves_row+1) / Textures.cols,
			(oak_leaves_col+1) / Textures.rows, (oak_leaves_row+1) / Textures.cols,
			oak_leaves_col     / Textures.rows, oak_leaves_row     / Textures.cols,
			(oak_leaves_col+1) / Textures.rows, oak_leaves_row     / Textures.cols,
		],
	};

	public static readonly oak_wood: Block =
	{
		attrs:
		{
			breakable: true,
			empty: false,
			transparent: false,
		},
		uv_bottom: [
			oak_top_col     / Textures.rows, (oak_top_row+1) / Textures.cols,
			(oak_top_col+1) / Textures.rows, (oak_top_row+1) / Textures.cols,
			oak_top_col     / Textures.rows, oak_top_row     / Textures.cols,
			(oak_top_col+1) / Textures.rows, oak_top_row     / Textures.cols,
		],
		uv_side: [
			oak_side_col     / Textures.rows, (oak_side_row+1) / Textures.cols,
			(oak_side_col+1) / Textures.rows, (oak_side_row+1) / Textures.cols,
			oak_side_col     / Textures.rows, oak_side_row     / Textures.cols,
			(oak_side_col+1) / Textures.rows, oak_side_row     / Textures.cols,
		],
		uv_top: [
			oak_top_col     / Textures.rows, (oak_top_row+1) / Textures.cols,
			(oak_top_col+1) / Textures.rows, (oak_top_row+1) / Textures.cols,
			oak_top_col     / Textures.rows, oak_top_row     / Textures.cols,
			(oak_top_col+1) / Textures.rows, oak_top_row     / Textures.cols,
		],
	};

	public static readonly stone: Block =
	{
		attrs:
		{
			breakable: true,
			empty: false,
			transparent: false,
		},
		uv_bottom: [
			stone_col     / Textures.rows, (stone_row+1) / Textures.cols,
			(stone_col+1) / Textures.rows, (stone_row+1) / Textures.cols,
			stone_col     / Textures.rows, stone_row     / Textures.cols,
			(stone_col+1) / Textures.rows, stone_row     / Textures.cols,
		],
		uv_side: [
			stone_col     / Textures.rows, (stone_row+1) / Textures.cols,
			(stone_col+1) / Textures.rows, (stone_row+1) / Textures.cols,
			stone_col     / Textures.rows, stone_row     / Textures.cols,
			(stone_col+1) / Textures.rows, stone_row     / Textures.cols,
		],
		uv_top: [
			stone_col     / Textures.rows, (stone_row+1) / Textures.cols,
			(stone_col+1) / Textures.rows, (stone_row+1) / Textures.cols,
			stone_col     / Textures.rows, stone_row     / Textures.cols,
			(stone_col+1) / Textures.rows, stone_row     / Textures.cols,
		],
	};
}
