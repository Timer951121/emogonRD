import imgMenuSkin from '../assets/images/menu-main/skin.png';
import imgMenuHair from '../assets/images/menu-main/hair.png';
import imgMenuHat from '../assets/images/menu-main/hat.png';
import imgMenuFace from '../assets/images/menu-main/face.png';
import imgMenuClothes from '../assets/images/menu-main/clothes.png';
import imgMenuShoes from '../assets/images/menu-main/shoes.png';
import imgMenuSize from '../assets/images/menu-main/size.png';
import imgMenuTool from '../assets/images/menu-main/tool.png';

import imgMRMBronze from '../assets/images/btn-mrm-bronze.png';
import imgMRMGold from '../assets/images/btn-mrm-gold.png';
import imgMRMPurple from '../assets/images/btn-mrm-purple.png';
import imgMRMSilver from '../assets/images/btn-mrm-silver.png';

const skinInfo = {label:'Skin Color', folder:'skin', endStr:'_color_Base_color.jpg', preStr:''};
const hairInfo = {label:'Hair Style', folder:'hair', endStr:'.png', preStr:''};
const hatInfo = {label:'Headwear', folder:'hat', endStr:'.png', preStr:''};
const eyeInfo = {label:'Eye', folder:'eye', endStr:'.png', preStr:''};
const glassInfo = {label:'Glasses', folder:'glass', endStr:'.png', preStr:''};
const noseInfo = {label:'Nose', folder:'nose', endStr:'.png', preStr:''};
const mouthInfo = {label:'Mouth', folder:'mouth', endStr:'.png', preStr:''};
const beardInfo = {label:'Beard', folder:'beard', endStr:'.png', preStr:''};
const shirtInfo = {label:'Shirt', folder:'shirt', endStr:'.png', preStr:''};
const pantsInfo = {label:'Pants', folder:'pants', endStr:'.png', preStr:''};
const shoeInfo = {label:'Shoes', folder:'shoe', endStr:'.png', preStr:''};
const toolInfo = {label:'Tool', folder:'tools', endStr:'.png', preStr:''};

export const menuArr = [
	{key:'skin', img:imgMenuSkin, catArr:[skinInfo]},
	{key:'hair', img:imgMenuHair, catArr:[hairInfo]},
	{key:'hat', img:imgMenuHat, catArr:[hatInfo]},
	{key:'face', img:imgMenuFace, catArr:[eyeInfo, glassInfo, noseInfo, mouthInfo, beardInfo]},
	{key:'clothes', img:imgMenuClothes, catArr:[shirtInfo, pantsInfo]},
	{key:'shoes', img:imgMenuShoes, catArr:[shoeInfo]},
	// {key:'size', img:imgMenuSize, catArr:[]},
	{key:'tool', img:imgMenuTool, catArr:[toolInfo]},
]

export const levelInfo = [
	{key:'bronze', tier_id:1, label:'Bronze', img:imgMRMBronze},
	{key:'silver', tier_id:2, label:'Silver', img:imgMRMSilver},
	{key:'gold', tier_id:3, label:'Gold', img:imgMRMGold},
	{key:'purple', tier_id:4, label:'Purple', img:imgMRMPurple},
]

export function DisplayInput() {
	const inputArr = document.getElementsByTagName('input');
	for (let i = 0; i < inputArr.length; i++) {
		const inputItem = inputArr[i];
		inputItem.setAttribute('style', 'display:none');
	}
	document.body.focus();
	setTimeout(() => {
		for (let i = 0; i < inputArr.length; i++) {
			const inputItem = inputArr[i];
			inputItem.setAttribute('style', 'display:initial');
		}
	}, 0);
}
