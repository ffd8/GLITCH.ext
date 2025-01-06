// set ext icon
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.message == 'setIcon'){
		let curCursor = Math.floor(Math.random()*7);
		let curPath = 'assets/cursors/glitch_hand_'+curCursor+'.png';
		chrome.action.setIcon({path: curPath});
		sendResponse('iconChanged');
	}else if(request.message == 'toggleIcon'){
		toggleIcon(request.active);
		sendResponse('iconChanged');
	}
	// return true;
});

// check if active
chrome.storage.local.get(['glitch'], function(obj) {
	if(obj.hasOwnProperty('glitch')){
		toggleIcon(obj.glitch);
	}
});

function toggleIcon(mode){
	let curPath = 'assets/cursors/glitch_hand_';
	if(mode){
		chrome.action.setIcon({path: curPath+'6.png'});
	}else{
		chrome.action.setIcon({path: curPath+'off.png'});
	}
}