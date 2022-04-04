import imgOptionFrontMini from '../assets/images/side-option/front-mini.jpg';
import imgOptionFrontSmall from '../assets/images/side-option/front-small.jpg';
import imgOptionFrontRegular from '../assets/images/side-option/front-regular.jpg';
import imgOptionFrontSpace from '../assets/images/side-option/front-xl.jpg';
import imgOptionBasic from '../assets/images/side-option/option-basic.jpg';
import imgOptionPassenger from '../assets/images/side-option/option-passenger.jpg';
import imgOptionEppBox from '../assets/images/side-option/option-box.jpg';
import imgOptionPickup from '../assets/images/side-option/option-pickUp.jpg';
import imgOptionCargo from '../assets/images/side-option/option-cargo.jpg';

export const modelH = 4;

export const colArr = [
	{label:'blue', hex:0x4CBCDD, str:'#4CBCDD', backCol:'#52bede 20%, #77cce5 49.9%, #52bede 50%'},
	{label:'white', hex:0xF8F8F8, str:'#F8F8F8', backCol:'#eeeeee 20%, #F8F8F8 49.9%, #eeeeee 50%'},
	{label:'yellow', hex:0xDCDD33, str:'#DCDD33', backCol:'#dcdd3b 20%, #e3e463 49.9%, #dcdd3b 50%'},
	{label:'green', hex:0x647B6B, str:'#647B6B', backCol:'#6d8374 20%, #8e9f93 49.9%, #6d8374 50%'},
	{label:'grey', hex:0x585B5B, str:'#585B5B', backCol:'#606363 20%, #848686 49.9%, #606363 50%'},
	{label:'silver', hex:0xBDBDBD, str:'#BDBDBD', backCol:'#bebebe 20%, #cccccc 49.9%, #bebebe 50%'},
]

export const sizeArr = [
	{key:'mini', label:'Mini', img:imgOptionFrontMini, description:'Your basic Windshield that offers a bit of  wind protection.'},
	{key:'small', label:'Small', img:imgOptionFrontSmall, description:'A Windshield similar to that of a scooter. Offers great wind protection'},
	{key:'regular', label:'Regular', img:imgOptionFrontRegular, description:'Our maximum weather protection for you. Stay dry.'},
	{key:'xl', label:'XL', img:imgOptionFrontSpace, description:'XL description'},
]

export const easyTwoArr = [
	{key:'basic', label:'Basic', inArr:['easyTwo', 'carGolion', 'space', 'spaceXl'], img:imgOptionBasic, description:'Our basic option offers the possibility to customize your Emogon rear.'},
	{key:'passenger', label:'Passenger', inArr:['easyTwo'], img:imgOptionPassenger, description:'Want to have an Emogon Two-Seater? Here you go!'},
	{key:'eppBox', label:'EPP Box', inArr:['easyTwo'], img:imgOptionEppBox, description:'EPP Box description'},
	{key:'pickUp', label:'Pick-Up', inArr:['easyTwo', 'carGolion', 'space', 'spaceXl'], img:imgOptionPickup, description:'Pick-Up description'},
	{key:'cargo', label:'Cargo', inArr:['carGolion', 'space', 'spaceXl'], img:imgOptionCargo, description:'Cargo description'},
]

// export const middleArr = [
// 	{key:'basic', label:'Basic'},
// 	{key:'pickUp', label:'Pick-Up'},
// 	{key:'basic', label:'Basic'},
// ]
