// GLITCH.ext
// teddavis.org 2021 - 2025 - 

let settings = [
	{
		div:document.getElementById('glitch-toggle'),
		name:'glitch',
		checked:true
	},
	{
		div:document.getElementById('glitch-download'),
		name:'download',
		checked:false
	},
	{
		div:document.getElementById('glitch-links'),
		name:'links',
		checked:true
	},
	{
		div:document.getElementById('glitch-format'),
		name:'format',
		value:'jpeg'
	}
]

let glitchSettings = {
	'glitch':true,
	'download':false,
	'links':true,
	'format':'jpg'
}

for(let s of settings){
	chrome.storage.local.get([s.name], function(obj) {
		if(!obj.hasOwnProperty(s.name)){
			if(s.hasOwnProperty('checked')){
				chrome.storage.local.set({[s.name]: s.checked});
			}else{
				chrome.storage.local.set({[s.name]: s.value});
			}
		}else{
			if(s.hasOwnProperty('checked')){
				s.div.checked = obj[s.name];
			}else{
				s.div.value = obj[s.name];
			}
			sendChange({[s.name]:obj[s.name]});
			glitchSettings[s.name] = obj[s.name];
		}
	});

	s.div.addEventListener('change', function(){
		if(s.hasOwnProperty('checked')){
			s.checked = s.div.checked;
			chrome.storage.local.set({[s.name]: s.div.checked});
			sendChange({[s.name]:s.checked});
			glitchSettings[s.name] = s.checked;
			toggleIcon();
		}else{
			s.value = s.div.value;
			chrome.storage.local.set({[s.name]: s.div.value});
			sendChange({[s.name]:s.value});
			glitchSettings[s.name] = s.value;
		}
	});
}

let infoCredits = document.getElementById('info-credits');
let infoDetails = document.getElementById('info-details');
let infoCreditsOrig = infoCredits.cloneNode(true);

function init(){
	initTypes();
	// setLinks();
	Object.values(document.querySelectorAll('.nav-item')).forEach(elm => {
		elm.addEventListener('mouseenter', function(e){
			infoDetails.innerHTML = elm.getAttribute('data-title');
			infoCredits.style.display = 'none';
			infoDetails.style.display = 'inline';
		})
		elm.addEventListener('mouseleave', function(e){
			infoDetails.style.display = 'none';
			infoCredits.style.display = 'inline';
			// infoCredits.innerHTML = infoCreditsOrig.innerHTML;
			// setInfo(elm.getAttribute('data-title'));
		})
	});
}
init();

function setInfo(val){
	infoCredits.innerHTML = val;
}

function toggleIcon(){
	if(glitchSettings.glitch){
		chrome.runtime.sendMessage({ message: 'toggleIcon', active:true }, function(response) {
			// console.log(response)
		});
	}else{
		chrome.runtime.sendMessage({ message: 'toggleIcon', active:false }, function(response) {
			// console.log(response)
		});
	}
}

function sendChange(setting){
	chrome.tabs.query({}, tabs => {
		tabs.forEach(tab =>
			chrome.tabs.sendMessage(tab.id, { setting } )
			);
	});
}

let resetButton = document.getElementById('glitch-refresh');
resetButton.addEventListener('click', function(){
	chrome.tabs.reload(function(){});
});

// function setLinks(){
// 	document.addEventListener('DOMContentLoaded', function () {
// 		var links = document.getElementsByTagName("a");
// 		for (var i = 0; i < links.length; i++) {
// 			(function () {
// 				var ln = links[i];
// 				var location = ln.href;
// 				ln.onclick = function () {
// 					chrome.tabs.create({active: true, url: location});
// 				};
// 			})();
// 		}
// 	});
// }

function initTypes(){
	const tests = [
		"image/png",
		"image/jpeg",
		"image/jpg",
		"image/webp",
		"image/ico",
		"image/bmp",
		"image/gif",
		"image/tif",
	];
	let glitchSelect = document.getElementById('glitch-format');
	let types = [];
	let tempCanvas = document.createElement("canvas");
	tests.forEach((type) => {
		const url = tempCanvas.toDataURL(type);
		let supported = url.startsWith(`data:${type}`);
		if(supported){
			types.push(type);
			let shortType = type.split('/')[1];
			let sel = '';
			if(shortType == glitchSettings.format){
				sel = 'selected';
			}
			glitchSelect.innerHTML += '<option value="'+shortType+'" '+sel+'>'+shortType.toUpperCase()+'</option>'
		}
	});
	tempCanvas.remove();
}