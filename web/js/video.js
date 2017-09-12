var bannerId = 1;
var itemId = 1;
var focusX = 1;
var flag = null;
var butState = 0;
var butId = 1;

var arrVideoMod = new Array("自动","NTSC","PAL");
var arrScreenMod = new Array("4:3","16:9","全屏");
var arrVideoOut = new Array("1080i","1080p","576i","720p");

var arrAudioCon = new Array("单频道更改","全局更改");
var arrAudioChannel = new Array("局部","全局");
var arrAudioChannelMod = new Array("左声道","右声道", "立体声");
var arrAudioOutput = new Array("PCM音频","HDMI透传","光纤透传");

var videoMod = 0;
var screenMod = 0;
var videoOut = 0;

var audioCon = parseInt(System.getConfig("volumeChannel", '0'));
var audioChannel = parseInt(System.getConfig("trackChannel", '0'));
var audioChannelMod = 0;
var audioOutput = 0;

var inputId = 1;

var showOkDlg = false;

function getId(array,string){
	for(var i=0 ; i<array.length ; i++){
		if(array[i]==string){
			return i;
		}
	}
	return -1;
}
function formatNum(i){
	var temp = "";
	if(i<10){
		temp = "0"+i;
	}else{
		temp = i+"";
	}
	return temp;
}
function myload(){
        videoMod = AvConfig.getTVmode();
        screenMod = AvConfig.getShowRatio();
        videoOut = AvConfig.getVideoOutput();
	var bright = formatNum(AvConfig.getBrightness());
	var saturation = formatNum(AvConfig.getSaturation());
	var contrast = formatNum(AvConfig.getContrast());
	document.getElementById("videoItem1").innerHTML = arrVideoMod[videoMod];
	document.getElementById("videoItem2").innerHTML = arrScreenMod[screenMod];
	document.getElementById("videoItem6").innerHTML = arrVideoOut[videoOut];
	
	/*document.getElementById("vitem31").innerHTML = saturation.charAt(0);
	document.getElementById("vitem32").innerHTML = saturation.charAt(1);
	document.getElementById("vitem41").innerHTML = bright.charAt(0);
	document.getElementById("vitem42").innerHTML = bright.charAt(1);*/
	
	document.getElementById("vitem31").innerHTML = bright.charAt(0);
    document.getElementById("vitem32").innerHTML = bright.charAt(1);
    document.getElementById("vitem41").innerHTML = saturation.charAt(0);
    document.getElementById("vitem42").innerHTML = saturation.charAt(1)
	
	document.getElementById("vitem51").innerHTML = contrast.charAt(0);
	document.getElementById("vitem52").innerHTML = contrast.charAt(1);
	audioOutput = AvConfig.getAudioOutput();
	audioCon = parseInt(System.getConfig("volumeChannel", '0'));
	audioChannel = parseInt(System.getConfig("trackChannel", '0'));
	var tempVol;
			if(audioCon == 0)
			{
				tempVol = DVBPlayer.getCurrentVolume();
			}
			else
			{
				tempVol = AvConfig.getVolume();
			}

			if(audioChannel == 0)
			{
				audioChannelMod  = DVBPlayer.getCurrentSndTrack(audioChannelMod);
			}
			else
			{
				audioChannelMod  = AvConfig.getSoundTrackMode(audioChannelMod);
			}

	var vol = formatNum(tempVol);
	
	document.getElementById("audioItem1").innerHTML = arrAudioCon[audioCon];
	document.getElementById("audioItem3").innerHTML = arrAudioChannel[audioChannel];
	document.getElementById("audioItem4").innerHTML = arrAudioChannelMod[audioChannelMod];
	document.getElementById("audioItem5").innerHTML = arrAudioOutput[audioOutput];
	document.getElementById("aitem21").innerHTML = vol.charAt(0);
	document.getElementById("aitem22").innerHTML = vol.charAt(1);
}
function changeColor(i){
	document.getElementById("list"+i).style.color = "white";
	flag=null;
}
function audioMoveDown(){
	document.getElementById("auinputFocus").style.left = "260px";
	inputId = 1;
	var topItem = parseInt(document.getElementById("auitemFocus").style.top);
	if(itemId<6){
		itemId++;
		if(itemId==6){
			document.getElementById("auitemFocus").style.display = "none";
			butState = 1;
			document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText1.png)";
		}
		document.getElementById("auitemFocus").style.top = (topItem+63)+"px";
	}
	if(itemId==2){
		document.getElementById("aitem21").style.color = "black";
		document.getElementById("auinputFocus").style.display = null;
	}else{
		document.getElementById("aitem21").style.color = "white";
		document.getElementById("aitem22").style.color = "white";
		document.getElementById("auinputFocus").style.display = "none";
	}
	
}
function videoMoveDown(){
	document.getElementById("inputFocus").style.left = "260px";
	if(itemId>2&&itemId<6){
		document.getElementById("vitem"+itemId+inputId).style.color = "white";
	}
	inputId = 1;
	if(itemId==2){
		document.getElementById("inputFocus").style.display = null;
	}
	if(itemId==5){
		document.getElementById("inputFocus").style.display = "none";
	}
	
		if(bannerId==1){
			var topItem = parseInt(document.getElementById("itemFocus").style.top);
			if(itemId<7){
				itemId++;
				if(itemId==7){
					document.getElementById("itemFocus").style.display = "none";
					butState = 1;
					document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText1.png)";
				}
				document.getElementById("itemFocus").style.top = (topItem+63)+"px";
			}
		}
	if(itemId<6&&itemId>2){
	document.getElementById("vitem"+itemId+inputId).style.color = "black";
	}
}

function audioMoveUp(){
	document.getElementById("auinputFocus").style.left = "260px";
	inputId = 1;
	var topItem = parseInt(document.getElementById("auitemFocus").style.top);
	if(itemId>1){
		if(itemId==6){
			document.getElementById("auitemFocus").style.display = null;
			butState = 0;
			document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText0.png)";
			butId = 1;
		}
		itemId--;
		document.getElementById("auitemFocus").style.top = (topItem-63)+"px";
	}
	if(itemId==2){
		document.getElementById("aitem21").style.color = "black";
		document.getElementById("auinputFocus").style.display = null;
	}else{
		document.getElementById("aitem21").style.color = "white";
		document.getElementById("aitem22").style.color = "white";
		document.getElementById("auinputFocus").style.display = "none";
	}
}
function videoMoveUp(){
	if(itemId<6&&itemId>2){
		document.getElementById("vitem"+itemId+inputId).style.color = "white";
	}
	inputId = 1;
	document.getElementById("inputFocus").style.left = "260px";
	if(itemId==6){
		document.getElementById("inputFocus").style.display = null;
	}
	if(itemId==3){
		document.getElementById("inputFocus").style.display = "none";
	}
	
		if(bannerId==1){
			var topItem = parseInt(document.getElementById("itemFocus").style.top);
			if(itemId>1){
				if(itemId==7){
					document.getElementById("itemFocus").style.display = null;
					butState = 0;
					document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText0.png)";
					butId = 1;
				}
				itemId--;
				document.getElementById("itemFocus").style.top = (topItem-63)+"px";
			}
		}
	
	if(itemId<6&&itemId>2){
		document.getElementById("vitem"+itemId+inputId).style.color = "black";
		}
}
function audioMoveLeft(){
	if(butState==0){
		if(focusX == 2){
			if(inputId==1){
				document.getElementById("aitem21").style.color = "white";
				document.getElementById("auitemFocus").style.display ="none";
				document.getElementById("auinputFocus").style.display = "none";
				document.getElementById("auitemFocus").style.top = "17px";
				document.getElementById("bannerFocus").style.display = null;
				focusX = 1;
				itemId = 1;
			}else{
				document.getElementById("aitem22").style.color = "white";
				inputId = 1;
				document.getElementById("aitem21").style.color = "black";
				document.getElementById("auinputFocus").style.left = "260px";
			}
		}
	}else{
		document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText0.png)";
		if(butId==1){
			butId = 2;
		}else{
			butId--;
		}
		document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText1.png)";
	}
}
function videoMoveLeft(){
	if(inputId==1){
	if(butState==0){
		if(itemId<6&&itemId>2){
			document.getElementById("vitem"+itemId+inputId).style.color = "white";
		}
		document.getElementById("bannerFocus").style.display = null;
		document.getElementById("itemFocus").style.display = "none";
		document.getElementById("itemFocus").style.top = "17px";
		document.getElementById("inputFocus").style.display = "none";
		itemId =1;
		focusX = 1;
	}else{
		document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText0.png)";
		if(butId==1){
			butId = 2;
		}else{
			butId--;
		}
		document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText1.png)";
	}
	}else{
		document.getElementById("vitem"+itemId+inputId).style.color = "white";
		inputId = 1;
		document.getElementById("inputFocus").style.left = "260px";
		document.getElementById("vitem"+itemId+inputId).style.color = "black";
	}
}

function audioMoveRight(){
	if(butState==0){
		if(focusX == 1){
			document.getElementById("bannerFocus").style.display = "none";
			document.getElementById("auitemFocus").style.display = null;
			focusX = 2;
		}else{
			if(itemId==2){
				document.getElementById("aitem2"+inputId).style.color = "white";
				if(inputId==2){
					inputId=1;
					document.getElementById("auinputFocus").style.left = "260px";
				}else{
					inputId++;
					document.getElementById("auinputFocus").style.left = "290px";
				}
				document.getElementById("aitem2"+inputId).style.color = "black";
			}else{
				if(itemId==1){
					if(audioCon==1){
						audioCon=0;
					}else{
						audioCon++;
					}
				document.getElementById("audioItem1").innerHTML = arrAudioCon[audioCon];
				}
				if(itemId==3){
					if(audioChannel==1){
						audioChannel=0;
					}else{
						audioChannel++;
					}
					document.getElementById("audioItem3").innerHTML = arrAudioChannel[audioChannel];
				}
				if(itemId==4){
					if(audioChannelMod==2){
						audioChannelMod=0;
					}else{
						audioChannelMod++;
					}
					document.getElementById("audioItem4").innerHTML = arrAudioChannelMod[audioChannelMod];
				}
				if(itemId==5){
					if(audioOutput==2){
						audioOutput=0;
					}else{
						audioOutput++;
					}
					document.getElementById("audioItem5").innerHTML = arrAudioOutput[audioOutput];
				}
			}
		}
	}else{
		document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText0.png)";
		if(butId==2){
			butId = 1;
		}else{
			butId++;
		}
		document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText1.png)";
	}
}

function videoMoveRight(){
	if(butState==0){
		if(focusX ==1){
			document.getElementById("bannerFocus").style.display = "none";
			document.getElementById("itemFocus").style.display = null;
			focusX = 2;
		}else{
			if(itemId==1){
				if(videoMod == (arrVideoMod.length-1)){
					videoMod = 0;
				}else{
					videoMod++;
				}
				document.getElementById("videoItem"+itemId).innerHTML = arrVideoMod[videoMod];
			}else{
				if(itemId==2){
					if(screenMod == (arrScreenMod.length-1)){
						screenMod = 0;
					}else{
						screenMod++;
					}
					document.getElementById("videoItem"+itemId).innerHTML = arrScreenMod[screenMod];
				}else{
					if(itemId==6){
						if(videoOut == (arrVideoOut.length-1)){
							videoOut = 0;
						}else{
							videoOut++;
						}
						document.getElementById("videoItem"+itemId).innerHTML = arrVideoOut[videoOut];
					}else{
						if(inputId==1){
							document.getElementById("vitem"+itemId+inputId).style.color = "white";
							inputId=2;
							document.getElementById("vitem"+itemId+inputId).style.color = "black";
							document.getElementById("inputFocus").style.left = "290px";
						}else{
							document.getElementById("vitem"+itemId+inputId).style.color = "white";
							inputId=1;
							document.getElementById("vitem"+itemId+inputId).style.color = "black";
							document.getElementById("inputFocus").style.left = "260px";
						}
						
					}
				}
				
			}
		}
		
	}else{
		document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText0.png)";
		if(butId==2){
			butId = 1;
		}else{
			butId++;
		}
		document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText1.png)";
	}
}

function inputText(i){
	if(bannerId==1){
	if(itemId>2&&itemId<6){
		document.getElementById("vitem"+itemId+inputId).innerHTML = i;
		videoMoveRight();
	}
	}else{
		if(itemId==2){
			document.getElementById("aitem2"+inputId).innerHTML = i;
			audioMoveRight();
		}
	}
}
function moveUp(){
	if(focusX==1){
		var top = parseInt(document.getElementById("bannerFocus").style.top);
		if(bannerId==2){
			document.getElementById("videoItemText"+bannerId).style.display = "none";
			document.getElementById("videoAudioItem"+bannerId).style.display = "none";
			document.getElementById("list2").style.color = "gray";
			bannerId--;
			document.getElementById("bannerFocus").style.top = (top-90)+"px";
			if(flag!=null){
				clearTimeout(flag);
			}
			flag = setTimeout("changeColor(1)", 300);
			document.getElementById("videoItemText"+bannerId).style.display = null;
			document.getElementById("videoAudioItem"+bannerId).style.display = null;
		}
	}else{
	if(bannerId==1){
		videoMoveUp();
	}else{
		audioMoveUp();
	}
	}
}
function moveDown(){
	if(focusX==1){
		
		var top = parseInt(document.getElementById("bannerFocus").style.top);
		if(bannerId==1){
			document.getElementById("videoItemText"+bannerId).style.display = "none";
			document.getElementById("videoAudioItem"+bannerId).style.display = "none";
			document.getElementById("list1").style.color = "gray";
			bannerId++;
			document.getElementById("bannerFocus").style.top = (top+90)+"px";
			if(flag!=null){
				clearTimeout(flag);
			}
			flag = setTimeout("changeColor(2)", 300);
			document.getElementById("videoItemText"+bannerId).style.display = null;
			document.getElementById("videoAudioItem"+bannerId).style.display = null;
		}
	}else{
	if(bannerId==1){
		videoMoveDown();
	}else{
		audioMoveDown();
	}
	}
}
function moveLeft(){
	if(bannerId==1){
		videoMoveLeft();
	}else{
		audioMoveLeft();
	}
}
function moveRight(){
	if(bannerId==1){
		videoMoveRight();
	}else{
		audioMoveRight();
	}
}

function pressEnter(){
	if(butState==1){
		if(butId==2){
			if(bannerId==2){
				
				audioCon = 1;
				audioChannel = 1;
				audioChannelMod = 2;
				audioOutput = 1;
				
				document.getElementById("audioItem1").innerHTML = arrAudioCon[audioCon];
				document.getElementById("aitem21").innerHTML = "2";
				document.getElementById("aitem22").innerHTML = "5";
				document.getElementById("audioItem3").innerHTML = arrAudioChannel[audioChannel];
				document.getElementById("audioItem4").innerHTML = arrAudioChannelMod[audioChannelMod];
				document.getElementById("audioItem5").innerHTML = arrAudioOutput[audioOutput];				
				
			}else{
				videoMod = 0;
				screenMod = 0;
				videoOut = 3;
				
				document.getElementById("videoItem1").innerHTML = arrVideoMod[videoMod];
				document.getElementById("videoItem2").innerHTML = arrScreenMod[screenMod];
				document.getElementById("videoItem6").innerHTML = arrVideoOut[videoOut];
				document.getElementById("vitem31").innerHTML = "5";
				document.getElementById("vitem32").innerHTML = "0";
				document.getElementById("vitem41").innerHTML = "5";
				document.getElementById("vitem42").innerHTML = "0";
				document.getElementById("vitem51").innerHTML = "5";
				document.getElementById("vitem52").innerHTML = "0";

				AvConfig.setTVmode(videoMod);
				AvConfig.setShowRatio(screenMod);
				AvConfig.setVideoOutput(videoOut);
				AvConfig.setBrightness(bright);
				AvConfig.setSaturation(saturation);
				AvConfig.setContrast(contrast);
				//System.debug("run");
				showOk();
				
			}
		}else{
			if(bannerId==1){
				var bright = parseInt(document.getElementById("vitem31").innerHTML+document.getElementById("vitem32").innerHTML);
				var saturation = parseInt(document.getElementById("vitem41").innerHTML+document.getElementById("vitem42").innerHTML);
				var contrast = parseInt(document.getElementById("vitem51").innerHTML+document.getElementById("vitem52").innerHTML);
				//System.debug(saturation+","+bright+","+contrast);
				//var flag = AvConfig.configVideo(videoMod,screenMod,videoOut,bright,saturation,contrast);
				AvConfig.setTVmode(videoMod);
				AvConfig.setShowRatio(screenMod);
				AvConfig.setVideoOutput(videoOut);
				AvConfig.setBrightness(bright);
				AvConfig.setSaturation(saturation);
				AvConfig.setContrast(contrast);
				//System.debug("run");
				showOk();
			}else{
				
				var vol = parseInt(document.getElementById("aitem21").innerHTML+document.getElementById("aitem22").innerHTML);
				//System.debug(vol+","+audioChannelMod+","+audioOutput);
				//var flag = AvConfig.configAudio(vol,audioChannelMod,audioOutput);
				System.setConfig("volumeChannel", audioCon);
				System.setConfig("trackChannel", audioChannel);
				if(audioCon == 0)
				{
					DVBPlayer.setCurrentVolume(vol);
				}
				else
				{
					AvConfig.setVolume(vol);
				}

				if(audioChannel == 0)
				{
					DVBPlayer.setCurrentSndTrack(audioChannelMod);
				}
				else
				{
					AvConfig.setSoundTrackMode(audioChannelMod);
				}

				AvConfig.setAudioOutput(audioOutput);
				//System.debug("run");
				showOk();
			}
		}
	}
}
function showOk()
{
	document.getElementById('note').style.display = '';
	showOkDlg = true;
}

function myKeyEvent(){
	var e = event.keyCode;
	
	if (showOkDlg)
	{
		if (e == RETURN || e == EXIT)
		{
			window.location.href = 'setting.html?focus=5';
			return false;
		}
		
		if (e == ENTER)
		{
			showOkDlg = false;
			document.getElementById('note').style.display = 'none';
		}
		return;
	}
	
	switch (e) {
	case RETURN:
	case EXIT:
		window.location.href = 'setting.html?focus=5';
		return false;
	case NUM_0: 
		inputText(0);
		break;
	case NUM_1: 
		inputText(1);
		break;
	case NUM_2: 
		inputText(2);
		break;
	case NUM_3: 
		inputText(3);
		break;
	case NUM_4: 
		inputText(4);
		break;
	case NUM_5: 
		inputText(5);
		break;
	case NUM_6: 
		inputText(6);
		break;
	case NUM_7: 
		inputText(7);
		break;
	case NUM_8: 
		inputText(8);
		break;
	case NUM_9: 
		inputText(9);
		break;
	case LEFT: 
		
			moveLeft();
			break;
	case RIGHT:
			moveRight();
			
			break;
	case UP: 
		 	moveUp();
			break;
	case DOWN: 
			moveDown();
			break;
	case ENTER:
			pressEnter();
			break;
	default:
		break;
	}
}
document.onkeydown = myKeyEvent;
window.onload = myload;
