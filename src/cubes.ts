import Textures from './textures';

const bedrock_col    = 2; const bedrock_row    = 1;
const dev_marker_col = 2; const dev_marker_row = 0;
const dirt_col       = 1; const dirt_row       = 1;
const grass_side_col = 0; const grass_side_row = 0;
const grass_top_col  = 0; const grass_top_row  = 1;
const oak_leaves_col = 2; const oak_leaves_row = 2;
const oak_side_col   = 0; const oak_side_row   = 2;
const oak_top_col    = 1; const oak_top_row    = 2;
const stone_col      = 1; const stone_row      = 0;
const weeds_col      = 3; const weeds_row      = 2;

class CubeAttrs
{
	breakable:   boolean;
	empty:       boolean;
	groupable:   boolean;
	solid:       boolean;
	transparent: boolean;
	x_shaped:    boolean;
}

export class Cube
{
	attrs:     CubeAttrs;
	uv_bottom: number[];
	uv_side:   number[];
	uv_top:    number[];
	uv_x1:     number[];
	uv_x2:     number[];
}

export class Cubes
{
	public static readonly air: Cube =
	{
		attrs:
		{
			breakable: false,
			empty: true,
			groupable: false,
			solid: false,
			transparent: true,
			x_shaped: false,
		},
		uv_bottom: null,
		uv_side: null,
		uv_top: null,
		uv_x1: null,
		uv_x2: null,
	}

	public static readonly bedrock: Cube =
	{
		attrs:
		{
			breakable: false,
			empty: false,
			groupable: false,
			solid: true,
			transparent: false,
			x_shaped: false,
		},
		uv_bottom: [
			bedrock_col     / Textures.cols, (bedrock_row+1) / Textures.rows,
			(bedrock_col+1) / Textures.cols, (bedrock_row+1) / Textures.rows,
			bedrock_col     / Textures.cols, bedrock_row     / Textures.rows,
			(bedrock_col+1) / Textures.cols, bedrock_row     / Textures.rows,
		],
		uv_side: [
			bedrock_col     / Textures.cols, (bedrock_row+1) / Textures.rows,
			(bedrock_col+1) / Textures.cols, (bedrock_row+1) / Textures.rows,
			bedrock_col     / Textures.cols, bedrock_row     / Textures.rows,
			(bedrock_col+1) / Textures.cols, bedrock_row     / Textures.rows,
		],
		uv_top: [
			bedrock_col     / Textures.cols, (bedrock_row+1) / Textures.rows,
			(bedrock_col+1) / Textures.cols, (bedrock_row+1) / Textures.rows,
			bedrock_col     / Textures.cols, bedrock_row     / Textures.rows,
			(bedrock_col+1) / Textures.cols, bedrock_row     / Textures.rows,
		],
		uv_x1: null,
		uv_x2: null,
	}

	public static readonly dev_marker: Cube =
	{
		attrs:
		{
			breakable: false,
			empty: false,
			groupable: false,
			solid: true,
			transparent: false,
			x_shaped: false,
		},
		uv_bottom: [
			dev_marker_col     / Textures.cols, (dev_marker_row+1) / Textures.rows,
			(dev_marker_col+1) / Textures.cols, (dev_marker_row+1) / Textures.rows,
			dev_marker_col     / Textures.cols, dev_marker_row     / Textures.rows,
			(dev_marker_col+1) / Textures.cols, dev_marker_row     / Textures.rows,
		],
		uv_side: [
			dev_marker_col     / Textures.cols, (dev_marker_row+1) / Textures.rows,
			(dev_marker_col+1) / Textures.cols, (dev_marker_row+1) / Textures.rows,
			dev_marker_col     / Textures.cols, dev_marker_row     / Textures.rows,
			(dev_marker_col+1) / Textures.cols, dev_marker_row     / Textures.rows,
		],
		uv_top: [
			dev_marker_col     / Textures.cols, (dev_marker_row+1) / Textures.rows,
			(dev_marker_col+1) / Textures.cols, (dev_marker_row+1) / Textures.rows,
			dev_marker_col     / Textures.cols, dev_marker_row     / Textures.rows,
			(dev_marker_col+1) / Textures.cols, dev_marker_row     / Textures.rows,
		],
		uv_x1: null,
		uv_x2: null,
	}

	public static readonly dirt: Cube =
	{
		attrs: {
			breakable: true,
			empty: false,
			groupable: false,
			solid: true,
			transparent: false,
			x_shaped: false,
		},
		uv_bottom: [
			dirt_col     / Textures.cols, (dirt_row+1) / Textures.rows,
			(dirt_col+1) / Textures.cols, (dirt_row+1) / Textures.rows,
			dirt_col     / Textures.cols, dirt_row     / Textures.rows,
			(dirt_col+1) / Textures.cols, dirt_row     / Textures.rows,
		],
		uv_side: [
			dirt_col     / Textures.cols, (dirt_row+1) / Textures.rows,
			(dirt_col+1) / Textures.cols, (dirt_row+1) / Textures.rows,
			dirt_col     / Textures.cols, dirt_row     / Textures.rows,
			(dirt_col+1) / Textures.cols, dirt_row     / Textures.rows,
		],
		uv_top: [
			dirt_col     / Textures.cols, (dirt_row+1) / Textures.rows,
			(dirt_col+1) / Textures.cols, (dirt_row+1) / Textures.rows,
			dirt_col     / Textures.cols, dirt_row     / Textures.rows,
			(dirt_col+1) / Textures.cols, dirt_row     / Textures.rows,
		],
		uv_x1: null,
		uv_x2: null,
	};

	public static readonly grass: Cube =
	{
		attrs: {
			breakable: true,
			empty: false,
			groupable: false,
			solid: true,
			transparent: false,
			x_shaped: false,
		},
		uv_bottom: [
			dirt_col     / Textures.cols, (dirt_row+1) / Textures.rows,
			(dirt_col+1) / Textures.cols, (dirt_row+1) / Textures.rows,
			dirt_col     / Textures.cols, dirt_row     / Textures.rows,
			(dirt_col+1) / Textures.cols, dirt_row     / Textures.rows,
		],
		uv_side: [
			grass_side_col     / Textures.cols, (grass_side_row+1) / Textures.rows,
			(grass_side_col+1) / Textures.cols, (grass_side_row+1) / Textures.rows,
			grass_side_col     / Textures.cols, grass_side_row     / Textures.rows,
			(grass_side_col+1) / Textures.cols, grass_side_row     / Textures.rows,
		],
		uv_top: [
			grass_top_col     / Textures.cols, (grass_top_row+1) / Textures.rows,
			(grass_top_col+1) / Textures.cols, (grass_top_row+1) / Textures.rows,
			grass_top_col     / Textures.cols, grass_top_row     / Textures.rows,
			(grass_top_col+1) / Textures.cols, grass_top_row     / Textures.rows,
		],
		uv_x1: null,
		uv_x2: null,
	};

	public static readonly oak_leaves: Cube =
	{
		attrs:
		{
			breakable: true,
			empty: false,
			groupable: false,
			solid: true,
			transparent: true,
			x_shaped: false,
		},
		uv_bottom: [
			oak_leaves_col     / Textures.cols, (oak_leaves_row+1) / Textures.rows,
			(oak_leaves_col+1) / Textures.cols, (oak_leaves_row+1) / Textures.rows,
			oak_leaves_col     / Textures.cols, oak_leaves_row     / Textures.rows,
			(oak_leaves_col+1) / Textures.cols, oak_leaves_row     / Textures.rows,
		],
		uv_side: [
			oak_leaves_col     / Textures.cols, (oak_leaves_row+1) / Textures.rows,
			(oak_leaves_col+1) / Textures.cols, (oak_leaves_row+1) / Textures.rows,
			oak_leaves_col     / Textures.cols, oak_leaves_row     / Textures.rows,
			(oak_leaves_col+1) / Textures.cols, oak_leaves_row     / Textures.rows,
		],
		uv_top: [
			oak_leaves_col     / Textures.cols, (oak_leaves_row+1) / Textures.rows,
			(oak_leaves_col+1) / Textures.cols, (oak_leaves_row+1) / Textures.rows,
			oak_leaves_col     / Textures.cols, oak_leaves_row     / Textures.rows,
			(oak_leaves_col+1) / Textures.cols, oak_leaves_row     / Textures.rows,
		],
		uv_x1: null,
		uv_x2: null,
	};

	public static readonly oak_wood: Cube =
	{
		attrs: {
			breakable: true,
			empty: false,
			groupable: false,
			solid: true,
			transparent: false,
			x_shaped: false,
		},
		uv_bottom: [
			oak_top_col     / Textures.cols, (oak_top_row+1) / Textures.rows,
			(oak_top_col+1) / Textures.cols, (oak_top_row+1) / Textures.rows,
			oak_top_col     / Textures.cols, oak_top_row     / Textures.rows,
			(oak_top_col+1) / Textures.cols, oak_top_row     / Textures.rows,
		],
		uv_side: [
			oak_side_col     / Textures.cols, (oak_side_row+1) / Textures.rows,
			(oak_side_col+1) / Textures.cols, (oak_side_row+1) / Textures.rows,
			oak_side_col     / Textures.cols, oak_side_row     / Textures.rows,
			(oak_side_col+1) / Textures.cols, oak_side_row     / Textures.rows,
		],
		uv_top: [
			oak_top_col     / Textures.cols, (oak_top_row+1) / Textures.rows,
			(oak_top_col+1) / Textures.cols, (oak_top_row+1) / Textures.rows,
			oak_top_col     / Textures.cols, oak_top_row     / Textures.rows,
			(oak_top_col+1) / Textures.cols, oak_top_row     / Textures.rows,
		],
		uv_x1: null,
		uv_x2: null,
	};

	public static readonly stone: Cube =
	{
		attrs: {
			breakable: true,
			empty: false,
			groupable: false,
			solid: true,
			transparent: false,
			x_shaped: false,
		},
		uv_bottom: [
			stone_col     / Textures.cols, (stone_row+1) / Textures.rows,
			(stone_col+1) / Textures.cols, (stone_row+1) / Textures.rows,
			stone_col     / Textures.cols, stone_row     / Textures.rows,
			(stone_col+1) / Textures.cols, stone_row     / Textures.rows,
		],
		uv_side: [
			stone_col     / Textures.cols, (stone_row+1) / Textures.rows,
			(stone_col+1) / Textures.cols, (stone_row+1) / Textures.rows,
			stone_col     / Textures.cols, stone_row     / Textures.rows,
			(stone_col+1) / Textures.cols, stone_row     / Textures.rows,
		],
		uv_top: [
			stone_col     / Textures.cols, (stone_row+1) / Textures.rows,
			(stone_col+1) / Textures.cols, (stone_row+1) / Textures.rows,
			stone_col     / Textures.cols, stone_row     / Textures.rows,
			(stone_col+1) / Textures.cols, stone_row     / Textures.rows,
		],
		uv_x1: null,
		uv_x2: null,
	};

	public static readonly weeds: Cube =
	{
		attrs:
		{
			breakable: true,
			empty: false,
			groupable: false,
			solid: false,
			transparent: true,
			x_shaped: true,
		},
		uv_bottom: null,
		uv_side: null,
		uv_top: null,
		uv_x1: [
			weeds_col     / Textures.cols, (weeds_row+1) / Textures.rows,
			(weeds_col+1) / Textures.cols, (weeds_row+1) / Textures.rows,
			weeds_col     / Textures.cols, weeds_row     / Textures.rows,
			(weeds_col+1) / Textures.cols, weeds_row     / Textures.rows,
		],
		uv_x2: [
			(weeds_col+1) / Textures.cols, (weeds_row+1) / Textures.rows,
			weeds_col     / Textures.cols, (weeds_row+1) / Textures.rows,
			(weeds_col+1) / Textures.cols, weeds_row     / Textures.rows,
			weeds_col     / Textures.cols, weeds_row     / Textures.rows,
		],
	}
}
