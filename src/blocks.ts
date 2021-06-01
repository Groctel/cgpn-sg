import Textures from './textures';

const bedrock_row    = 2; const bedrock_col    = 1;
const dirt_row       = 1; const dirt_col       = 1;
const grass_side_row = 0; const grass_side_col = 0;
const grass_top_row  = 0; const grass_top_col  = 1;
const stone_row      = 1; const stone_col      = 0;

class BlockAttrs
{
	breakable: boolean;
	empty:     boolean;
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
		},
	}

	public static readonly bedrock: Block =
	{
		attrs:
		{
			breakable: false,
			empty: false,
		},
		uv_bottom: [
			bedrock_row     / Textures.rows, (bedrock_col+1) / Textures.cols,
			(bedrock_row+1) / Textures.rows, (bedrock_col+1) / Textures.cols,
			bedrock_row     / Textures.rows, bedrock_col     / Textures.cols,
			(bedrock_row+1) / Textures.rows, bedrock_col     / Textures.cols,
		],
		uv_side: [
			bedrock_row     / Textures.rows, (bedrock_col+1) / Textures.cols,
			(bedrock_row+1) / Textures.rows, (bedrock_col+1) / Textures.cols,
			bedrock_row     / Textures.rows, bedrock_col     / Textures.cols,
			(bedrock_row+1) / Textures.rows, bedrock_col     / Textures.cols,
		],
		uv_top: [
			bedrock_row     / Textures.rows, (bedrock_col+1) / Textures.cols,
			(bedrock_row+1) / Textures.rows, (bedrock_col+1) / Textures.cols,
			bedrock_row     / Textures.rows, bedrock_col     / Textures.cols,
			(bedrock_row+1) / Textures.rows, bedrock_col     / Textures.cols,
		],
	}
	public static readonly dirt: Block =
	{
		attrs:
		{
			breakable: true,
			empty: false,
		},
		uv_bottom: [
			dirt_row     / Textures.rows, (dirt_col+1) / Textures.cols,
			(dirt_row+1) / Textures.rows, (dirt_col+1) / Textures.cols,
			dirt_row     / Textures.rows, dirt_col     / Textures.cols,
			(dirt_row+1) / Textures.rows, dirt_col     / Textures.cols,
		],
		uv_side: [
			dirt_row     / Textures.rows, (dirt_col+1) / Textures.cols,
			(dirt_row+1) / Textures.rows, (dirt_col+1) / Textures.cols,
			dirt_row     / Textures.rows, dirt_col     / Textures.cols,
			(dirt_row+1) / Textures.rows, dirt_col     / Textures.cols,
		],
		uv_top: [
			dirt_row     / Textures.rows, (dirt_col+1) / Textures.cols,
			(dirt_row+1) / Textures.rows, (dirt_col+1) / Textures.cols,
			dirt_row     / Textures.rows, dirt_col     / Textures.cols,
			(dirt_row+1) / Textures.rows, dirt_col     / Textures.cols,
		],
	};

	public static readonly grass: Block =
	{
		attrs:
		{
			breakable: true,
			empty: false,
		},
		uv_bottom: [
			dirt_row     / Textures.rows, (dirt_col+1) / Textures.cols,
			(dirt_row+1) / Textures.rows, (dirt_col+1) / Textures.cols,
			dirt_row     / Textures.rows, dirt_col     / Textures.cols,
			(dirt_row+1) / Textures.rows, dirt_col     / Textures.cols,
		],
		uv_side: [
			grass_side_row     / Textures.rows, (grass_side_col+1) / Textures.cols,
			(grass_side_row+1) / Textures.rows, (grass_side_col+1) / Textures.cols,
			grass_side_row     / Textures.rows, grass_side_col     / Textures.cols,
			(grass_side_row+1) / Textures.rows, grass_side_col     / Textures.cols,
		],
		uv_top: [
			grass_top_row     / Textures.rows, (grass_top_col+1) / Textures.cols,
			(grass_top_row+1) / Textures.rows, (grass_top_col+1) / Textures.cols,
			grass_top_row     / Textures.rows, grass_top_col     / Textures.cols,
			(grass_top_row+1) / Textures.rows, grass_top_col     / Textures.cols,
		],
	};

	public static readonly stone: Block =
	{
		attrs:
		{
			breakable: true,
			empty: false,
		},
		uv_bottom: [
			stone_row     / Textures.rows, (stone_col+1) / Textures.cols,
			(stone_row+1) / Textures.rows, (stone_col+1) / Textures.cols,
			stone_row     / Textures.rows, stone_col     / Textures.cols,
			(stone_row+1) / Textures.rows, stone_col     / Textures.cols,
		],
		uv_side: [
			stone_row     / Textures.rows, (stone_col+1) / Textures.cols,
			(stone_row+1) / Textures.rows, (stone_col+1) / Textures.cols,
			stone_row     / Textures.rows, stone_col     / Textures.cols,
			(stone_row+1) / Textures.rows, stone_col     / Textures.cols,
		],
		uv_top: [
			stone_row     / Textures.rows, (stone_col+1) / Textures.cols,
			(stone_row+1) / Textures.rows, (stone_col+1) / Textures.cols,
			stone_row     / Textures.rows, stone_col     / Textures.cols,
			(stone_row+1) / Textures.rows, stone_col     / Textures.cols,
		],
	};
}
