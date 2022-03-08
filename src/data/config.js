
const mainUrl = {
	dev: 'https://mrm.thetunagroup.com',
	production:'https://mrm.thetunagroup.com',
}

export const gameIframeSrc = 'https://metaverse1-aed16.web.app/index.html?scene=avatar';
// export const gameIframeSrc = 'https://mrm-dev-mobile.web.app/';
export const buildIframeSrc = 'https://metaverse1-aed16.web.app/index.html?scene=avatar_creator';
export const gameIframeId = 'gameIframe';
export const buildIframeId = 'buildIframe';

export const baseUrl = mainUrl.dev;
export const prodUrl = mainUrl.production;

export function GetDeviceInfo() {
	const navigator_info = window.navigator;
	const screen_info = window.screen;
	var id = navigator_info.mimeTypes.length;
	id += navigator_info.userAgent.replace(/\D+/g, '');
	id += navigator_info.plugins.length;
	id += screen_info.height || '';
	id += screen_info.width || '';
	id += screen_info.pixelDepth || '';

	return {id, type:'1'};
}
