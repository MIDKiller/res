// JavaScript Document

var radioChanCnt = 0;
var currentChanIndex = 1;
var volKeyTimer = null;
var currentVol = 0;
var isMute = false;
var curDivIndex = 2;
var channelTimer = null;
var currentTrack = 0;
var isMute;

/* 声音控制 */
var volumeChannel = 0;
var trackChannel = 0;


var radioLists = [];


function setSndTrack(track)
{
	if (trackChannel == '0')
	{
		DVBPlayer.setCurrentSndTrack(track);
		AvConfig.setSoundTrackDirect(track);
	}
	else
	{
		AvConfig.setSoundTrackMode(track);
	}
}

function initSndTrack()
{
	var sndTrack;
	if (trackChannel == '0')
	{
		sndTrack = DVBPlayer.getCurrentSndTrack();
		AvConfig.setSoundTrackDirect(sndTrack);
		return sndTrack;
	}
	else
	{
		sndTrack = AvConfig.getSoundTrackMode();
		AvConfig.setSoundTrackMode(sndTrack);
		return sndTrack;
	}
}

function setVolume(volume)
{
	if (volumeChannel == '0')
	{
		DVBPlayer.setCurrentVolume(volume);
		AvConfig.setVolume(volume);
	}
	else
	{
		AvConfig.setVolume(volume);
	}
}

function initVolume()
{
	var volume;
	if (volumeChannel == '0')
	{
		volume = DVBPlayer.getCurrentVolume();
		AvConfig.setVolumeDirect(volume);
		
		return volume;
	}
	else
	{
		volume = AvConfig.getVolume();
		AvConfig.setVolume(volume);
		
		return volume;
	}
	
	
}
/* 声音控制 end */

var trackTimerId = null;
function soundTrack()
{
	var trackString = ['左声道', '右声道', '立体声'];
	currentTrack++;
	if (currentTrack == 3)
		currentTrack = 0;
		
	setSndTrack(currentTrack);
	document.getElementById("volTrack").innerHTML = trackString[currentTrack];
	document.getElementById("volTrack").style.display = '';
	if (trackTimerId != null)
	{
		clearTimeout(trackTimerId);
		trackTimerId = null;
	}
	
	trackTimerId = setTimeout(function(){
		trackTimerId = null;
		document.getElementById("volTrack").style.display = 'none';
	}, 3000);
}

function volKeyTimerOut()
{
	volKeyTimer = null;
	showCtrl(false, 'volbar');
}

function startVolKeyTimer()
{
	if (volKeyTimer != null)
	{
		clearTimeout(volKeyTimer);
		volKeyTimer = null;
	}
	
	volKeyTimer = setTimeout('volKeyTimerOut()', 2000);
}

function showVolume()
{
	var obj = document.getElementById('curvol');
	if (obj == null)
		return;
	obj.style.width = parseInt((currentVol * 730) / 100) + 'px';
	obj = document.getElementById('volnum');
	if (obj == null)
		return;
	obj.innerHTML = currentVol;
	
	
}

function dealVolKey(up)
{
	if (up == true)
	{
		currentVol += 5;
		if (currentVol > 100)
			currentVol = 100;
	}
	else
	{
		currentVol -= 5;
		if (currentVol < 0)
			currentVol = 0;
	}
	
	showCtrl(true, 'volbar');
	if (isMute == true)
	{
		isMute = false;
		showCtrl(isMute, 'mutepan');
		AvConfig.volumeUnMute();
	}
	showVolume();
	setVolume(currentVol);
	startVolKeyTimer();
}

function mute()
{
	isMute = !isMute;
	showCtrl(isMute, 'mutepan');
	if (isMute == true)
	{
		AvConfig.volumeMute();
	}
	else
	{
		AvConfig.volumeUnMute();
	}
}

function moveDown()
{
	var divIndex = curDivIndex + 2;
	var i;
	var html;
	var chanIndex;
	
	if (divIndex >= 5)
		divIndex -= 5;
	
	chanIndex = currentChanIndex - 2;
	if (chanIndex <= 0)
		chanIndex += radioChanCnt;
	var obj = document.getElementById('chan' + divIndex);
	obj.style.webkitTransitionDuration = "0s";
	obj.style.top = '-68px';
	if (chanIndex < 10)
		html = '0' + chanIndex;
	else
		html = chanIndex;
	//html += '&nbsp;&nbsp;' + DVBPlayer.getRadioChannelName(chanIndex);
	
	html += '&nbsp;&nbsp;' + radioLists[chanIndex - 1]["name"];
	obj.innerHTML = html;
	
	divIndex = curDivIndex + 1;
	if (divIndex >= 5)
		divIndex = 0;
	
	var topPx = 204;
	
	for (i = 0; i < 4; i++)
	{
		obj = document.getElementById('chan' + divIndex);
		obj.style.webkitTransitionDuration = "0.5s";
		obj.style.top = topPx + 'px';
		topPx -= 68;
		divIndex--;
		if (divIndex < 0)
			divIndex = 4;
	}
	
	curDivIndex--;
	if (curDivIndex < 0)
		curDivIndex = 4; 
}

function moveUp()
{
	var divIndex = curDivIndex - 2;
	var i;
	var html;
	var chanIndex;
	
	if (divIndex < 0)
		divIndex += 5;
	
	chanIndex = currentChanIndex + 2;
	if (chanIndex > radioChanCnt)
		chanIndex -= radioChanCnt;
	var obj = document.getElementById('chan' + divIndex);
	obj.style.webkitTransitionDuration = "0s";
	obj.style.top = '204px';
	if (chanIndex < 10)
		html = '0' + chanIndex;
	else
		html = chanIndex;
		//html += '&nbsp;&nbsp;' + DVBPlayer.getRadioChannelName(chanIndex);
		
		html += '&nbsp;&nbsp;' + radioLists[chanIndex - 1]["name"];
	obj.innerHTML = html;
	divIndex = curDivIndex - 1;
	if (divIndex < 0)
		divIndex += 5;
	
	var topPx = -68;
	
	for (i = 0; i < 4; i++)
	{
		obj = document.getElementById('chan' + divIndex);
		obj.style.webkitTransitionDuration = "0.5s";
		obj.style.top = topPx + 'px';
		topPx += 68;
		divIndex++;
		if (divIndex >= 5)
			divIndex = 0;
	}
	
	curDivIndex++;
	if (curDivIndex >= 5)
		curDivIndex = 0; 
}

function channelTimeout()
{
	channelTimer = null;
	DVBPlayer.playRadioChannel(currentChanIndex);
}

function switchChannel(up)
{
	if (radioChanCnt < 2)
		return;
	
	if (up == true)
	{
		currentChanIndex--;
		if (currentChanIndex <= 0)
			currentChanIndex = radioChanCnt;			
		moveDown();
	}
	else
	{
		currentChanIndex++;
		if (currentChanIndex > radioChanCnt)
			currentChanIndex = 1;
		moveUp();
	}
	
	if (channelTimer != null)
		clearTimeout(channelTimer);
	channelTimer = setTimeout('channelTimeout()', 400);
	showLED(currentChanIndex);
		
}

function handleKey()
{
	var keyCode = event.keyCode;
	switch (keyCode)
	{
	case LEFT:
	case VOL_DOWN:
		dealVolKey(false);
		break;
	case RIGHT:
	case VOL_UP:
		dealVolKey(true);
		break;
	case UP:
		switchChannel(true);
		break;
	case DOWN:
		switchChannel(false);
		break;
	case KEY_MUTE:
		mute();
		break;
    case F1:
        window.location.href = 'dvbplay.html';
        break;
	case RETURN:
	case EXIT:
		DVB.stop();
		goBackWithUrl('menu.html');
		return true;
	case vol_Track:
        soundTrack();
		break;
	case KEY_TV:
		window.location.href = 'dvbplay.html';
		break;
	default:
		break;
	}
	
	
}

function refreshTime()
{
	var obj;
	
	var date = new DateTime();
	var time = date.getHour() * 100;
	time += date.getMinute();
	
	obj = document.getElementById('curtime');
	obj.innerHTML = getTimeStrFromInt(time);
	
	delete date;
}

function initChannelShow()
{	
	
	var chanIndex = currentChanIndex - 2;
	var divIndex = curDivIndex - 2;
	var index;
	var obj;
	var html;
	
	
	
	if (radioChanCnt == 1)
	{
		//document.getElementById('chan2').innerHTML = '01&nbsp;&nbsp;' + DVBPlayer.getRadioChannelName(1);
	
		document.getElementById('chan2').innerHTML = '01&nbsp;&nbsp;' + radioChanCnt[0]["name"]
		return;
	}
	
	if (chanIndex <= 0)
		chanIndex += radioChanCnt;
		
	if (divIndex < 0)
		divIndex += 5;
			
	for (index = 0; index < 5; index++)
	{
		if (chanIndex < 10)
			html = '0' + chanIndex;
		else
			html = chanIndex;
		obj = document.getElementById('chan' + divIndex);
		//html += '&nbsp;&nbsp;' + DVBPlayer.getRadioChannelName(chanIndex);
		html += '&nbsp;&nbsp;' + radioLists[chanIndex - 1]["name"];
		obj.innerHTML = html;
		divIndex++;
		if (divIndex == 5)
			divIndex = 0;
		chanIndex++;
		if (chanIndex > radioChanCnt)
			chanIndex = 1;
	}
	
}

/* 流程控制 */
function pageinit()
{
	
	
	window.onkeydown = handleKey;
	
	volumeChannel = System.getConfig("volumeChannel", "0");
	trackChannel = System.getConfig("trackChannel", "0");
	
	radioLists = DVBPlayer.getRadioChannels();
	
	isMute = AvConfig.getVolumeMute();
	if (isMute)
		showCtrl(isMute, 'mutepan');
		
	DVB.init();
	
	DVB.stopSearch(false);
	
	currentVol = AvConfig.getVolume();
	radioChanCnt = DVBPlayer.getRadioChanNum();
	
	
	if (radioChanCnt > 0) {
		currentChanIndex = DVBPlayer.getCurrentRadioChannel();
		
		if (currentChanIndex > radioChanCnt)
			currentChanIndex = 1;
			
		try{
			initChannelShow();
			DVBPlayer.playRadioChannel(currentChanIndex);
			currentVol = initVolume();
			
			currentTrack = initSndTrack();
			showLED(currentChanIndex);
		}catch(e){
			console.log(e)
		}
		
	}
	else
	{
		DVBPlayer.stop();
	}
	
	refreshTime();
	
	setInterval('refreshTime()', 5000);
	
	loadAdPlayer(10007, 'advdiv', 500);
}



function showLED(radioChanCnt)
{
	if (radioChanCnt > 99)
		FPanel.displayString("R"+radioChanCnt);
	else if (radioChanCnt > 9)
		FPanel.displayString("R0"+radioChanCnt);
	else
		FPanel.displayString("R00"+radioChanCnt);
}
