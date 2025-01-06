// // GLITCH.ext
// // teddavis.org 2021 - 2025 - 

// // this is the code which will be injected into a given page...
function genCursor(setIcon = false){
	let curCursor = Math.floor(Math.random()*7);
	let curPath = 'assets/cursors/glitch_hand_'+curCursor+'.png';
	var elms = document.getElementsByTagName('*');
	Object.values(document.querySelectorAll('*')).forEach(elm => elm.style.cursor = 'url('+chrome.runtime.getURL(curPath)+'), default');

	if(setIcon){
		chrome.runtime.sendMessage({ message: 'setIcon' }, function(response) {
		});
	}
}

function getStorage(key){
	chrome.storage.local.get([key], function(obj) {
		if(obj.hasOwnProperty(key)){
			return obj[key];
		}else{
			return undefined;
		}
	});
}

let glitchSettings = {
	'glitch':true,
	'download':false,
	'links':true,
	'format':'jpg'
}

chrome.storage.local.get(null, (response) => {
	for(let gs in glitchSettings){
		if(response.hasOwnProperty(gs)){
			glitchSettings[gs] = response[gs];
			if(glitchSettings.glitch){
				initGlitch();
			}
		}
	}
});

chrome.runtime.onMessage.addListener(request => {
	for(let gs in glitchSettings){
		let curSetting = glitchSettings.glitch;
		if(request.setting.hasOwnProperty(gs)){
			glitchSettings[gs] = request.setting[gs];
			if(glitchSettings.glitch){
				initGlitch();
			}else if(curSetting != glitchSettings.glitch){
				location.reload();
			}
		}
	}
});

function initGlitch(){
	genCursor(true);
	fixLinks(document);
}

// // don't mess with input elements
// var inputs = document.getElementsByTagName('input');
// for (var i = 0; i < inputs.length; i++) {
// 	inputs[i].addEventListener("click", function(event){event.stopPropagation()}, false);
// }

// // rest is fair game
document.addEventListener('click', function(e){
	// disable if one hates fun
	if(!glitchSettings.glitch || e.target.localName == 'input'){
		return false;
	} else {
		genCursor(true);
	}

	let elm = e.srcElement;
	let parent = elm;

	if(elm.localName !== 'canvas'){
		if(elm.localName === 'img' && !elm.src.includes('svg')){
			let imgsrc = elm.src;
			genGlitch(imgsrc, elm.parentNode, elm.offsetWidth, elm.offsetHeight)
		}else{
			grabBody(elm, parent)
		}
	}
	e.preventDefault();
});


function grabBody(elm, parent){
	html2canvas(elm, {
		logging:false,
		scale:1,
		width:elm.offsetWidth,
		height:elm.offsetHeight,
		x: window.scrollX + elm.getBoundingClientRect().left,
		y: window.scrollY + elm.getBoundingClientRect().top
	}).then((canvas) => {
		let src = canvas.toDataURL('image/png');
		genGlitch(src, parent, canvas.width, canvas.height)
	});
}

function genGlitch(src, parent, w, h){
	let tempHTML = parent.cloneNode(true);
	parent.innerHTML = ''
	new p5( function(sketch){
		'use strict';
		sketch.glitch;
		sketch.parentHTML = tempHTML;

		sketch.setup = () => {
			let cvn = sketch.createCanvas(w, h);
			sketch.glitch = new Glitch(sketch);
			sketch.glitch.loadType(glitchSettings.format);
			sketch.glitch.loadQuality(sketch.random(.4, .8));
			sketch.glitch.loadImage(src, function(){
				sketch.glitched();
			});
			cvn.mouseMoved(sketch.glitched);
			cvn.mousePressed(function(){
				if(glitchSettings.download){
					sketch.glitch.saveSafe('GLITCH.ext');
				}else{
					parent.innerHTML = sketch.parentHTML.innerHTML;
					fixLinks(parent);
				}
			});
			sketch.glitch.errors(false);
			sketch.disableFriendlyErrors = true;
		};

		sketch.glitched = () => {
			sketch.glitch.resetBytes();
			sketch.glitch.randomBytes(5); // randomize 10 bytes
			sketch.glitch.buildImage(function(){
				sketch.image(sketch.glitch.image, 0, 0, sketch.width, sketch.height);
			});
		}
	}, parent);
}

function fixLinks(elm){
	var observed = elm.getElementsByTagName('a');
	for (var i = 0; i < observed.length; i++) {
		let href = observed[i].href
		observed[i].addEventListener('click', function (e) {
			if(glitchSettings.glitch){
				if(glitchSettings.links){
					location.href = href;
				}else{
					e.preventDefault();
				}
			}
	 	});
	}
}