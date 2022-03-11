import imgColBlue from '../assets/images/color_blue.png';
import imgColWhite from '../assets/images/color_white.png';
import imgColYellow from '../assets/images/color_yellow.png';
import imgColGreen from '../assets/images/color_green.png';
import imgColGrey from '../assets/images/color_grey.png';
import imgColSilver from '../assets/images/color_silver.png';

export const modelH = 4;

export const colArr = [
	{label:'blue', hex:0x4CBCDD, str:'#4CBCDD', img:imgColBlue},
	{label:'white', hex:0xF8F8F8, str:'#F8F8F8', img:imgColWhite},
	{label:'yellow', hex:0xDCDD33, str:'#DCDD33', img:imgColYellow},
	{label:'green', hex:0x647B6B, str:'#647B6B', img:imgColGreen},
	{label:'grey', hex:0x585B5B, str:'#585B5B', img:imgColGrey},
	{label:'silver', hex:0xBDBDBD, str:'#BDBDBD', img:imgColSilver},
]

export const sizeArr = [
	{key:'mini', label:'Mini'},
	{key:'small', label:'Small'},
	{key:'regular', label:'Regular'},
	{key:'xl', label:'XL'},
]

export function SetBottomMesh(selSubPart, modelObj) {
	const disM = 1.618 - 0.982, disL = 1.925 - 0.982;
	var selName = '', dis = 0, pushR = 1;
	switch (selSubPart) {
		case 'easyOne': selName = 'SWB'; dis = 0; pushR = 1; break;
		case 'easyTwo': selName = 'MWB'; dis = disM; pushR = 1.2; break;
		case 'carGolion': selName = 'MWB'; dis = disM; pushR = 1.2; break;
		case 'space': selName = 'MWB'; dis = disM; pushR = 1.2; break;
		case 'spaceXl': selName = 'LWB'; dis = disL; pushR = 1.4; break;
		default: break;
	}
	modelObj.traverse(function (child) {
		if (child.name.includes('PLATTFORM_')) child.visible = child.name==='PLATTFORM_'+selName;
		else if (child.name.includes('back')) child.position.x = child.oriBackPos + dis;
		else if (child.name.includes('LANGDACH')) {child.scale.x = dis/disL * 0.01; child.position.x = selName==='LWB'?1.2:1.23;}
	})
	modelObj.position.x = modelH/-2 * pushR;
}