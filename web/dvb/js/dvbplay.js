// JavaScript Document

var arrAudioChannelMod = ["左声道", "右声道", "立体声"];

var dvbInfoPannel = null;
var bigNumPannel = null;
var dvbVolBar = null;
var programList = null;
var askDlg = null;

/* finger start */
var fingerTimer = null;

/* open email */
var emailList = [];
var emailID;

var programNone = [ {
	"name" : "无节目",
	"type" : "None",
	"index": "0",
	"channelNo" : "0",
	"serviceId" : "0"
} ];
var programVirtual = [ {
	"name" : "本地播放",
	"type" : "App",
	"channelNo" : "900",
	"serviceId" : "../localmedia/filebrowse.html"
}, {
	"name" : "互动主页",
	"type" : "App",
	"channelNo" : "901",
	"serviceId" : "http://222.90.100.223:7071/tvims/mainpage/mainpage.html"
} ];
function printFinger(fingerData) {
	var text = fingerData["content"];
	var durationInSecond = fingerData["duration"];
	var finger = document.getElementById("finger");
	var x = Math.round(Math.random() * 800) + 100;
	var y = Math.round(Math.random() * 400) + 100;
	finger.innerHTML = text;
	finger.style.left = x + "px";
	finger.style.top = y + "px";

	finger.style.display = "inline";
	if (fingerTimer !== null) {
		clearTimeout(fingerTimer);
	}
	if (durationInSecond != 0) {
		fingerTimer = setTimeout("hideFinger()", durationInSecond * 1000);
	}

}

function hideFinger() {
	var finger = document.getElementById("finger");
	finger.style.display = "none";
	clearTimeout(fingerTimer);
	fingerTimer = null;
}
/* finger end */
/* osd start */

var topScroll = null;
var bottomScroll = null;
var leftScroll = null;
var rightScroll = null;
/*
 * div : 需要滚动的DIV direction: 滚动方向，left,right,up,down times : 滚动次数，0,一直滚动
 * onceOverHandle : 一次滚动完成后的回调， 用以通知调用都时长
 */
function ScrollDiv(div, direction, times, onceOverHandle) {
	var width = 0, height;
	var duration = 0;
	var speed = 70; // 1秒钟走多少个像素
	this.div = div;
	width = this.div.offsetWidth + 10;
	height = this.div.offsetHeight;

	if (direction == "left" || direction == "right") {
		this.div.style.webkitTransitionProperty = "left";
		duration = (1280 + width) / speed;
	} else {
		this.div.style.webkitTransitionProperty = "top";
		duration = (720 + height) / speed;
	}
	this.times = times;
	this.duration = duration;
	this.overHandle = onceOverHandle;
	this.dir = direction;
	this.div.style.width = width + "px";
	this.div.style.height = height + "px";
	this.div.style.webkitTransitionTimingFunction = "linear";
	this.div.addEventListener("webkitTransitionEnd", transitionEnd);
}

function transitionEnd() {
	var scrollDiv = arguments[0].target;
	if (topScroll != null && scrollDiv == topScroll.div) {
		if (--topScroll.times === 0) {
			stopScrollMsg("top");
		} else {
			if (topScroll.dir == "left") {
				moveToRight(topScroll);
				setTimeout("moveToLeft(topScroll)", 50);
			} else {
				moveToLeft(topScroll);
				setTimeout("moveToRight(topScroll)", 50);
			}
		}
	} else if (bottomScroll != null && scrollDiv == bottomScroll.div) {
		if (--bottomScroll.times === 0) {
			// 通知数码视讯库一次OSD时长
			bottomScroll.overHandle(bottomScroll.duration);
			stopScrollMsg("bottom");
		} else {
			if (bottomScroll.dir == "left") {
				moveToRight(bottomScroll);
				setTimeout("moveToLeft(bottomScroll)", 50);
			} else {
				moveToLeft(bottomScroll);
				setTimeout("moveToRight(bottomScroll)", 50);
			}
		}
	} else if (leftScroll != null && scrollDiv == leftScroll.div) {
		if (--leftScroll.times === 0) {
			stop(leftScroll);
		} else {
			if (leftScroll.dir == "up") {
				moveToDown(leftScroll);
				setTimeout("moveToUp(leftScroll)", 50);
			} else {
				moveToUp(leftScroll);
				setTimeout("moveToDown(leftScroll)", 50);
			}
		}
	} else if (rightScroll != null && scrollDiv == rightScroll.div) {
		if (--rightScroll.times === 0) {
			stop(rightScroll);
		} else {
			if (rightScroll.dir == "up") {
				moveToDown(rightScroll);
				setTimeout("moveToUp(rightScroll)", 50);
			} else {
				moveToUp(rightScroll);
				setTimeout("moveToDown(rightScroll)", 50);
			}
		}
	}
}
function start(scrollDiv) {
	if (scrollDiv != null && scrollDiv.dir == "left") {
		moveToLeft(scrollDiv);
	} else if (scrollDiv !== null && scrollDiv.dir == "right") {
		moveToRight(scrollDiv);
	} else if (scrollDiv !== null && scrollDiv.dir == "up") {
		moveToUp(scrollDiv);
	} else if (scrollDiv !== null && scrollDiv.dir == "down") {
		moveToDown(scrollDiv);
	}
}
function moveToBegin(div, direction) {
	switch (direction) {
	case "left":
		div.style.left = "1280px";
		break;
	case "right":
		div.style.left = "-" + div.offsetWidth + "px";
		break;
	case "up":
		div.style.top = "720px";
		break;
	case "down":
		div.style.top = "-" + div.offsetHeight + "px";
		break;
	default:
		break;
	}
}
function moveToLeft(scrollDiv) {
	if (scrollDiv.dir == "left") {
		scrollDiv.div.style.webkitTransitionDuration = scrollDiv.duration + "s";
		scrollDiv.div.style.left = "-" + scrollDiv.div.style.width;
	} else if (scrollDiv.dir == "right") {
		scrollDiv.div.style.webkitTransitionDuration = "0s";
		scrollDiv.div.style.left = "-" + scrollDiv.div.style.width;
	}
}

function moveToRight(scrollDiv) {
	if (scrollDiv.dir == "left") {
		scrollDiv.div.style.webkitTransitionDuration = "0s";
		scrollDiv.div.style.left = 1280 + "px";
	} else if (scrollDiv.dir == "right") {
		scrollDiv.div.style.webkitTransitionDuration = scrollDiv.duration + "s";
		scrollDiv.div.style.left = 1280 + "px";
	}
}
function moveToUp(scrollDiv) {
	if (scrollDiv.dir == "up") {
		scrollDiv.div.style.webkitTransitionDuration = scrollDiv.duration + "s";
		scrollDiv.div.style.top = "-" + scrollDiv.div.offsetHeight + "px";
	} else if (scrollDiv.dir == "down") {
		scrollDiv.div.style.webkitTransitionDuration = "0s";
		scrollDiv.div.style.top = "-" + scrollDiv.div.offsetHeight + "px";
	}
}
function moveToDown(scrollDiv) {
	if (scrollDiv.dir == "up") {
		scrollDiv.div.style.webkitTransitionDuration = "0s";
		scrollDiv.div.style.top = "720px";
	} else if (scrollDiv.dir == "down") {
		scrollDiv.div.style.webkitTransitionDuration = scrollDiv.duration + "s";
		scrollDiv.div.style.top = 720 + "px";
	}
}
function stop(scrollDiv) {
	if (scrollDiv !== null) {
		switch (scrollDiv.dir) {
		case "left":
			moveToRight(scrollDiv);

			break;
		case "right":
			moveToLeft(scrollDiv);
			break;
		case "up":
			moveToDown(scrollDiv);
			break;
		case "down":
			moveToUp(scrollDiv);
			break;
		default:
			break;
		}
		if (scrollDiv == leftScroll) {
			leftScroll = null;
		} else if (scrollDiv == rightScroll) {
			rightScroll = null;
		} else if (scrollDiv == topScroll) {
			topScroll = null;
		} else if (scrollDiv == bottomScroll) {
			bottomScroll = null;
		}
	}
}
/* osd end */

/* 声音控制 */
var volumeChannel = 0;
var trackChannel = 0;

function initSndTrack() {
	var sndTrack;
	if (trackChannel == '0') {
		sndTrack = DVBPlayer.getCurrentSndTrack();
		AvConfig.setSoundTrackDirect(sndTrack);
		return sndTrack;
	} else {
		sndTrack = AvConfig.getSoundTrackMode();
		AvConfig.setSoundTrackMode(sndTrack);
		return sndTrack;
	}
}



function initVolume() {
	var volume;
	if (volumeChannel == '0') {
		volume = DVBPlayer.getCurrentVolume();
		AvConfig.setVolumeDirect(volume);
		return volume;
	} else {
		volume = AvConfig.getVolume();
		AvConfig.setVolume(volume);
		return volume;
	}
}
/* 声音控制 end */

/* DVB 屏道信息类 */
function DVBInfoPannel() {
	this.channelNum = programList.length;
	this.currentPlayChannel = 0;
	this.currentChannel = 0;
	this.chanShowCheckTimer = null;
	this.keyCheckTimer = null;
	this.oldChan = 0;
}

DVBInfoPannel.prototype.clearKeyTimer = function() {
	if (this.keyCheckTimer !== null)
		clearTimeout(this.keyCheckTimer);
	this.keyCheckTimer = null;
};

DVBInfoPannel.prototype.startKeyCheckTimer = function() {
	this.clearKeyTimer();
	this.keyCheckTimer = setTimeout('dvbInfoPannel.dealKeyTimeout()', 600);
};

DVBInfoPannel.prototype.clearShowTimer = function() {
	if (this.chanShowCheckTimer !== null)
		clearTimeout(this.chanShowCheckTimer);
	this.chanShowCheckTimer = null;
};

DVBInfoPannel.prototype.startShowCheckTimer = function() {
	this.clearShowTimer();
	this.chanShowCheckTimer = setTimeout('dvbInfoPannel.dealShowTimeout()',
			4000);

};

DVBInfoPannel.prototype.disable = function() {
	this.clearKeyTimer();
	this.clearShowTimer();
	showCtrl(false, 'chanbar');
};

DVBInfoPannel.prototype.enable = function() {
	this.refreshInfo(this.currentPlayChannel);
	showCtrl(true, 'chanbar');
	this.startShowCheckTimer();
};

DVBInfoPannel.prototype.getChannelNum = function() {
	return this.channelNum;
};

DVBInfoPannel.prototype.switchToChannel = function(channelIndex) {
	var sc = programList[channelIndex];
	if (sc != null) {
		this.oldChan = this.currentPlayChannel;
		this.currentChannel = this.currentPlayChannel = channelIndex;
		this.showLED(sc.channelNo);
		this.refreshInfo(this.currentChannel);
		showCtrl(true, 'chanbar');
		DVBPlayer.playTVChannel(this.currentPlayChannel);
		dvbVolBar.initSound();
		DVBPlayer.getChannelEpg(this.currentPlayChannel);
		this.startShowCheckTimer();

		setCurrentChannelIndex(this.currentPlayChannel);
	}

};

DVBInfoPannel.prototype.chanUpDown = function(up) {
	var channelIndex = this.currentChannel;
	//console.log(channelIndex);
	if (this.channelNum <= 0)
		return;
	if (up == false) {
		channelIndex--;
		if (channelIndex <= 0)
			channelIndex = this.channelNum - 1;
	} else {
		channelIndex++;
		if (channelIndex >= this.channelNum)
			channelIndex = 1;
	}
	this.testSwitchToChannel(channelIndex);
	this.showLED(channelIndex);
};

DVBInfoPannel.prototype.backChan = function() {

	if (this.oldChan <= 0 || this.oldChan > this.channelNum)
		this.oldChan = this.currentChannel;

	this.switchToChannel(this.oldChan);
};

DVBInfoPannel.prototype.testSwitchToChannel = function(channelIndex) {
	if (channelIndex > this.channelNum)
		return;

	this.clearKeyTimer();
	this.clearShowTimer();

	this.currentChannel = channelIndex;
	this.refreshInfo(this.currentChannel);
	showCtrl(true, 'chanbar');
	this.startKeyCheckTimer();
};

DVBInfoPannel.prototype.refreshTime = function() {
	var obj;

	var date = new DateTime();
	var time = date.getHour() * 100;
	time += date.getMinute();

	obj = document.getElementById('curtime');
	obj.innerHTML = getTimeStrFromInt(time);
};

DVBInfoPannel.prototype.refreshInfo = function(channelIndex) {
	System.debug("refreshInfo()" + channelIndex);
	var obj;
	var channumString;
	var name = programList[channelIndex].name;
	var channum = programList[channelIndex].channelNo;

	if (channum < 10)
		channumString = '00' + channum;
	else if (channum < 100)
		channumString = '0' + channum;
	else
		channumString = channum;
	obj = document.getElementById('channum');
	obj.innerHTML = channumString;

	obj = document.getElementById('channame');
	obj.innerHTML = name + '&nbsp;';

	obj = document.getElementById('epg1');
	obj.innerHTML = '';

	obj = document.getElementById('epg2');
	obj.innerHTML = '';

	this.refreshTime();

};

DVBInfoPannel.prototype.showLED = function(channelIndex) {
	if (channelIndex > 99)
		FPanel.displayString("C" + channelIndex);
	else if (channelIndex > 9)
		FPanel.displayString("C0" + channelIndex);
	else
		FPanel.displayString("C00" + channelIndex);
};

DVBInfoPannel.prototype.onEpgOk = function() {
	this.refreshTime();
	DVBPlayer.getChannelEpg(this.currentPlayChannel);
};

DVBInfoPannel.prototype.onEpgEvt = function(chanIndex, current, name,
		startTime, endTime, audType) {
	showCtrl(true, 'audType');
	if (chanIndex !== this.currentChannel)
		return;

	var html = getTimeStrFromInt(startTime);
	html += '--' + getTimeStrFromInt(endTime);
	html += '&nbsp;&nbsp;';
	html += name;

	var obj;
	if (current == true) {
		obj = document.getElementById('epg1');
	} else {
		obj = document.getElementById('epg2');
	}
	obj.innerHTML = html;
	switch (audType) {
	case 0x81:
		document.getElementById("audType").style.backgroundImage = "url('img/dolby.png')";
		break;
	case 0x06:
		document.getElementById("audType").style.backgroundImage = "url('img/dolby.png')";
		break;
	default:

		document.getElementById("audType").style.backgroundImage = "";
		break;
	}

};

DVBInfoPannel.prototype.dealShowTimeout = function() {
	this.chanShowCheckTimer = null;
	// DVBPlayer.getChannelEpg(this.currentPlayChannel);
	showCtrl(false, 'chanbar');

};

DVBInfoPannel.prototype.dealKeyTimeout = function() {
	System.debug("dealKeyTimeout:keyCheckTimer=" + this.keyCheckTimer);
	System.debug("dealKeyTimeout:currentPlayChannel="
					+ this.currentPlayChannel);
	clearTimeout(this.keyCheckTimer);
	this.keyCheckTimer = null;

	if (this.currentChannel !== this.currentPlayChannel) {
		var sc = programList[this.currentChannel];
		if (sc.serviceId > 0) {
			this.oldChan = this.currentPlayChannel;
			this.currentPlayChannel = this.currentChannel;
			DVBPlayer.playTVChannel(this.currentPlayChannel);
			dvbVolBar.initSound();
			setCurrentChannelIndex(this.currentPlayChannel);
		} else {
			//
			//window.location.href = sc.serviceId;
			
		}

	}
	DVBPlayer.getChannelEpg(this.currentPlayChannel);
	this.startShowCheckTimer();
};

DVBInfoPannel.prototype.dealKeyEnter = function() {
	System.debug("dealKeyTimeout:keyCheckTimer=" + this.keyCheckTimer);
	System.debug("dealKeyTimeout:currentPlayChannel="
					+ this.currentPlayChannel);
	clearTimeout(this.keyCheckTimer);
	this.keyCheckTimer = null;

	if (this.currentChannel !== this.currentPlayChannel) {
		var sc = programList[this.currentChannel];
		if (sc.serviceId > 0) {
			this.oldChan = this.currentPlayChannel;
			this.currentPlayChannel = this.currentChannel;
			DVBPlayer.playTVChannel(this.currentPlayChannel);
			dvbVolBar.initSound();
			setCurrentChannelIndex(this.currentPlayChannel);
			DVBPlayer.getChannelEpg(this.currentPlayChannel);
			this.startShowCheckTimer();
			return true;
		} else {
			//
			window.location.href = sc.serviceId;
			return true;
		}

	}
	else
	{
		return false;
	}
};
/* DVB 频道数字类 */
function BigNumPannel() {
	this.numKeyTimer = null;
	this.chanNum = [ 0, 0, 0 ];
	this.chanNumIndex = 0;
	this.inputChanNum = 0;
	this.enabled = false;
}

BigNumPannel.prototype.clearKeyTimer = function() {
	if (this.numKeyTimer !== null) {
		clearTimeout(this.numKeyTimer);
		this.numKeyTimer = null;
	}
};

BigNumPannel.prototype.startKeyTimer = function() {
	this.clearKeyTimer();
	this.numKeyTimer = setTimeout('bigNumPannel.dealTimeout()', 2000);
};

BigNumPannel.prototype.enable = function() {
	showCtrl(true, 'bigchannum');
	this.startKeyTimer();
	this.enabled = true;
};

BigNumPannel.prototype.disable = function() {
	showCtrl(false, 'bigchannum');
	this.chanNumIndex = 0;
	this.clearKeyTimer();
	this.enabled = false;
}

BigNumPannel.prototype.dealKeyIn = function(keyCode) {
	var dstChanNum = 0;
	var obj;
	var i;
	var nameObj = document.getElementById('selchanname');

	if (this.chanNumIndex == 3)
		return;

	if (this.chanNumIndex == 0) {
		this.chanNum[0] = 0;
		this.chanNum[1] = 0;
		this.chanNum[2] = 0;
		this.inputChanNum = 0;
	}

	dstChanNum = this.inputChanNum * 10 + (keyCode - NUM_0);
	showCtrl(true, 'bigchannum');
	this.enabled = true;

	this.clearKeyTimer();
	this.chanNum[2] = this.chanNum[1];
	this.chanNum[1] = this.chanNum[0];
	this.chanNum[0] = keyCode - NUM_0;
	this.inputChanNum = dstChanNum;

	for (i = 0; i < 3; i++) {
		obj = document.getElementById('bignum' + i);
		obj.src = 'img/num' + this.chanNum[i] + '.png';
	}

	if (dstChanNum > dvbInfoPannel.getChannelNum()) {
		var sc = programVirtual[dstChanNum - 900];

		if (sc != null) {
			nameObj.innerHTML = sc.name;
		} else {
nameObj.innerHTML = "无对应频道";
		}

	} else {
		nameObj.innerHTML = programList[dstChanNum].name;
	}

	this.chanNumIndex++;
	this.startKeyTimer();
	this.showDstLed(dstChanNum);
};
BigNumPannel.prototype.showDstLed = function(dstChanNum) {
	if (dstChanNum > 99)
		FPanel.displayString("C" + dstChanNum);
	else if (dstChanNum > 9)
		FPanel.displayString("C0" + dstChanNum);
	else
		FPanel.displayString("C00" + dstChanNum);
};

BigNumPannel.prototype.dealTimeout = function() {
	this.numKeyTimer = null;
	this.chanNumIndex = 0;
	var dstChanNum = this.inputChanNum;
	showCtrl(false, 'bigchannum');
	if (dstChanNum > 0) {
		if (dstChanNum > dvbInfoPannel.getChannelNum()) {
			var sc = programVirtual[dstChanNum - 900];

			if (sc != null) {
				window.location.href = sc.serviceId;
			} else {
				// alert("sc null");
			}

		} else {

			dvbInfoPannel.switchToChannel(dstChanNum);
		}

	}
	this.inputChanNum = 0;
	this.enabled = false;
};

/* 音量条类 */
function DVBVolBar() {
	this.name = "DVBVolBar";
	this.volKeyTimer = null;
	this.currentVol = AvConfig.getVolume();	
	this.isMute = AvConfig.getVolumeMute();
	if (this.isMute)
		showCtrl(this.isMute, 'mutepan');
	this.volTrackTimer = null;
	this.curTrack = AvConfig.getSoundTrackMode();
}

DVBVolBar.prototype.initSound = function() {
	this.currentVol = initVolume();	
	this.curTrack = initSndTrack();
};

DVBVolBar.prototype.clearKeyTimer = function() {
	if (this.volKeyTimer != null) {
		clearTimeout(this.volKeyTimer);
		this.volKeyTimer = null;
	}
};

DVBVolBar.prototype.mute = function() {
	this.isMute = !this.isMute;
	showCtrl(this.isMute, 'mutepan');
	if (this.isMute == true) {
		AvConfig.volumeMute();
	} else {
		AvConfig.volumeUnMute();
	}
};

DVBVolBar.prototype.startKeyTimer = function() {
	this.clearKeyTimer();
	this.volKeyTimer = setTimeout('dvbVolBar.dealKeyTimeout()', 2000);
};

DVBVolBar.prototype.enable = function() {
	showCtrl(true, 'volbar');
	this.showVolume();
	this.startKeyTimer();
};

DVBVolBar.prototype.disable = function() {
	showCtrl(false, 'volbar');
	this.clearKeyTimer();
};

DVBVolBar.prototype.volUpDown = function(up) {

	if (this.isMute == true) {
		this.isMute = false;
		showCtrl(false, 'mutepan');
		AvConfig.volumeUnMute();
	}

	if (this.volKeyTimer != null) {
		this.clearKeyTimer();
		if (up == true) {
			this.currentVol += 3;
			if (this.currentVol > 100)
				this.currentVol = 100;
		} else {
			this.currentVol -= 3;
			if (this.currentVol < 0)
				this.currentVol = 0;
		}

		AvConfig.setVolumeDirect(this.currentVol);
	}

	showCtrl(true, 'volbar');
	this.showVolume();
	this.startKeyTimer();
};

DVBVolBar.prototype.showVolume = function() {
	var obj = document.getElementById('curvol');
	if (obj == null)
		return;
	obj.style.width = parseInt((this.currentVol * 730) / 100) + 'px';
	obj = document.getElementById('volnum');
	if (obj == null)
		return;
	obj.innerHTML = this.currentVol;
};

DVBVolBar.prototype.dealKeyTimeout = function() {
	this.volKeyTimer = null;

	if (volumeChannel == '0') {
	
		DVBPlayer.setCurrentVolume(this.currentVol);
	} else {
		AvConfig.setVolume(this.currentVol);
	}

	showCtrl(false, 'volbar');
};

DVBVolBar.prototype.dealTrackTimerout = function() {
//	alert("Name = " + this.name);
	this.volTrackTimer = null;

	if (trackChannel == '0') {
		DVBPlayer.setCurrentSndTrack(this.curTrack);
	} else {
		AvConfig.setSoundTrackMode(this.curTrack);
	}

	showCtrl(false, 'volTrack');
};

DVBVolBar.prototype.startTrackTimer = function() {
	if (this.volTrackTimer != null) {
		clearTimeout(this.volTrackTimer);
	}

	this.volTrackTimer = setTimeout('dvbVolBar.dealTrackTimerout()', 2000);
};

DVBVolBar.prototype.volTrack = function() {
	var track = this.curTrack;
	if (this.volTrackTimer != null) {
		track++;
		track %= 3;
		this.curTrack = track;
	}

	this.startTrackTimer();
	showCtrl(true, 'volTrack');
	document.getElementById("volTrack").innerHTML = arrAudioChannelMod[track];
	AvConfig.setSoundTrackDirect(track);

};

function volKeyTimeOut() {
	dvbVolBar.dealKeyTimeout();
}

var chanInfoTimer = null;

function infoDisable() {
	chanInfoTimer = null;
	showCtrl(false, 'chinfo');
}

/* 宽高比 */
var ratioTimer = null;
function onRatioTimeout() {
	ratioTimer = null;
	var obj = document.getElementById('screenRatio');
	obj.style.display = 'none';
}

function startRatioTimer() {
	if (ratioTimer != null)
		clearTimeout(ratioTimer);
	ratioTimer = null;
	ratioTimer = setTimeout('onRatioTimeout()', 3000);
}

function ratioChange() {
	var html = [ '全屏', '16:9', '4:3' ];
	var index = AvConfig.getShowRatio();
	index++;
	if (index > 2)
		index = 0;
	AvConfig.setShowRatio(index);
	var obj = document.getElementById('screenRatio');
	obj.innerHTML = html[index];
	obj.style.display = '';
	startRatioTimer();
}

/* 按键处理 */
function dialogHandleKey() {
	var keyCode = event.keyCode;
	System.debug("dialogHandleKey:keyCode=" + keyCode);
	askDlg.keyIn(keyCode);
	return true;
}
function forceHandleKey() {
	return true;
}
function handleKey() {
	var keyCode = event.keyCode;
	System.debug("handleKey:keyCode=" + keyCode);

	switch (keyCode) {

	case RETURN:
		showCtrl(false, "audType");
		showCtrl(false, "openemail");
		dvbVolBar.disable();
		bigNumPannel.disable();
		dvbInfoPannel.backChan();
		return false;
	case KEY_JUMP:
		if (programList.isEnable())
			return true;
		dvbVolBar.disable();
		bigNumPannel.disable();
		dvbInfoPannel.backChan();
		showCtrl(false, "openemail");
		break;
	case EXIT:
		window.location.href = 'menu.html';
		return false;
	case DOWN:
	case chan_DOWN:
		dvbVolBar.disable();
		bigNumPannel.disable();
		dvbInfoPannel.chanUpDown(false);
		showCtrl(false, 'chinfo');
		showCtrl(false, "openemail");
		showCtrl(false, 'audType');
		hideFinger();
		break;
	case INFO:
		if (dvbInfoPannel.getChannelNum() <= 0)
			return;

		showCtrl(true, 'chinfo');
		showInfo();
		DVBPlayer.playTVServiceID(205);
		if (chanInfoTimer != null)
			clearTimeout(chanInfoTimer);
		chanInfoTimer = null;
		chanInfoTimer = setTimeout('infoDisable()', 5000);
		showCtrl(false, "openemail");
		return true;
	case EMAIL:
		window.location.href = "../email/email.html";
		return true;
	case UP:
	case chan_UP:
		dvbVolBar.disable();
		bigNumPannel.disable();
		dvbInfoPannel.chanUpDown(true);
		hideFinger();
		showCtrl(false, 'chinfo');
		showCtrl(false, "openemail");
		break;
	case LEFT:
	case VOL_DOWN:
		if (dvbInfoPannel.getChannelNum() <= 0)
			break;
		dvbInfoPannel.disable();
		bigNumPannel.disable();
		dvbVolBar.volUpDown(false);
		showCtrl(false, "openemail");
		break;
	case RIGHT:
	case VOL_UP:
		if (dvbInfoPannel.getChannelNum() <= 0)
			break;
		dvbInfoPannel.disable();
		bigNumPannel.disable();
		dvbVolBar.volUpDown(true);
		showCtrl(false, "openemail");
		break;
	case EPG:
		window.location.href = "epg.html";
		return true;
	case NUM_0:
	case NUM_1:
	case NUM_2:
	case NUM_3:
	case NUM_4:
	case NUM_5:
	case NUM_6:
	case NUM_7:
	case NUM_8:
	case NUM_9:
		dvbInfoPannel.disable();
		dvbVolBar.disable();
		bigNumPannel.dealKeyIn(keyCode);
		showCtrl(false, "openemail");
		break;
	case KEY_MUTE:
		if (dvbInfoPannel.getChannelNum() <= 0)
			break;
		dvbVolBar.mute();

		break;
	case vol_Track:
		if (dvbInfoPannel.getChannelNum() <= 0)
			break;
		dvbVolBar.volTrack();
		showCtrl(false, "openemail");
		break;
	case ENTER:
		
		if (bigNumPannel.enabled) {
			bigNumPannel.clearKeyTimer();
			bigNumPannel.dealTimeout();
		} else if (dvbInfoPannel.getChannelNum() > 0) {
			var groups = DVBPlayer.getChanGroups();
			
			if (!dvbInfoPannel.dealKeyEnter() && mainMenu && groups ) {

				dvbInfoPannel.dealKeyTimeout();
				dvbInfoPannel.disable();

				var info = DVBPlayer.getChannelStatus();
				
				mainMenu.show(info ? info.serviceId : null);

				return false;
			}
			dvbInfoPannel.disable();
			bigNumPannel.disable();
		}
		showCtrl(false, "openemail");
		break;
	case F1:
		window.location.href = 'radio.html';
		break;
	case UpPage:

		showCtrl(false, "openemail");
		break;
	case DownPage:
		showCtrl(false, "openemail");
		break;
	case KEY_RATIO:
		ratioChange();
		showCtrl(false, "openemail");
		break;
	default:

		break;
	}
}

function onEpgOk() {
	dvbInfoPannel.onEpgOk();
}

function onEpgEvt(chanIndex, current, name, startTime, endTime, audType) {
	dvbInfoPannel.onEpgEvt(chanIndex, current, name, startTime, endTime,
			audType);
}

function askCallback(selOk) {
	if (selOk == true) {
		window.location.href = 'search.html?auto=1';
	} else {
		window.onkeydown = handleKey;
		askDlg.hide();
	}
}

function setCurrentChannelIndex(index) {
	System.setConfig('curchan', index);
}

/*
 * style： 1, OSD风格：屏幕上方
 *
 * 2, OSD风格：屏幕下方
 *
 * 3, OSD风格：整屏显示
 *
 * 4 OSD风格：半屏显示
 */
function showOSD(visiable, osdData) {
	var style = osdData["style"];
	var times = osdData["times"];
	var content = osdData["content"];
	var OSDscroll = osdData["scroll"];

	if (OSDscroll) {

		if (visiable) {

			switch (style) {
			case 1:
				showScrollMsg("top", content, times);
				break;
			case 2:
				showScrollMsg("bottom", content, times);
				break;
			case 3:
				showScreenMsg("full", content);
				break;
			case 4:
				showScreenMsg("half", content);
				break;
			default:
				break;
			}
		} else {

			hideOSD(style);
		}
	} else {

		document.getElementById("bottominfobg").style.display = "inline";
		var obj = document.getElementById("DVNosd"); // 天柏CA
		// 有是否滚动选项，此函数直接显示内容，不进行滚动
		obj.innerHTML = content;
		setTimeout("disShowNoScroll()", 10000);
	}

}
function disShowNoScroll() {
	document.getElementById("bottominfobg").style.display = "none";

}
function hideOSD(style) {
	switch (style) {
	case 1:
		stopScrollMsg("top");
		break;
	case 2:
		stopScrollMsg("bottom");
		break;
	case 3:
		setCtrlVisible("fullosd", false);
		break;
	case 4:
		setCtrlVisible("halfosd", false);
		break;
	default:
		break;
	}
}
function overHandle(duration) {
	DVB.reportOSDOnceOver(duration);
}
function showScrollMsg(position, msg, times) {
	var obj = document.getElementById(position + "OSD");
	if (msg != null || msg != "") {
		obj.innerHTML = msg;

		moveToBegin(obj, "left");
		switch (position) {
		case "top":
			topScroll = new ScrollDiv(obj, "left", times, overHandle);
			start(topScroll);
			document.getElementById("topinfobg").style.display = "inline";
			break;
		case "bottom":
			bottomScroll = new ScrollDiv(obj, "left", times, overHandle);
			start(bottomScroll);
			document.getElementById("bottominfobg").style.display = "inline";
			break;
		default:
			break;
		}
	}

}

function stopScrollMsg(position) {
	switch (position) {
	case "top":
		stop(topScroll);
		document.getElementById("topinfobg").style.display = "none";
		break;
	case "bottom":
		stop(bottomScroll);
		document.getElementById("bottominfobg").style.display = "none";
		break;
	default:
		break;
	}
}

function showScreenMsg(size, msg) {
	if (msg != null && msg != "") {
		if (size == "full") {
			setCtrlText("fullinfo", msg);
			setCtrlVisible("fullosd", true);
		} else {
			setCtrlText("halfinfo", msg);
			setCtrlVisible("halfosd", true);
		}

	} else {
		setCtrlVisible("fullosd", false);
		setCtrlVisible("halfosd", false);
	}
}

function setCtrlVisible(id, visible) {
	var obj = document.getElementById(id);
	if (obj != null) {
		if (visible) {
			obj.style.display = "inline";
		} else {
			obj.style.display = "none";
		}
	}
}

// OSD
function setCtrlText(id, value) {
	var obj = document.getElementById(id);
	if (obj != null)
		obj.innerHTML = value;
}

/* 频道信息 */
function showInfo() {
	var b = DVBPlayer.getChannelStatus();

	setCtrlText('name', b["name"]);
	setCtrlText('avpid', b["videoPid"]);
	setCtrlText('volpid', b["audioPid"]);
	setCtrlText('FREQ', b["frequency"]);
	setCtrlText('QAM', b["modulateMod"]);
	setCtrlText('SYM', b["symbolRate"]);
	setCtrlText('signalPwl', b["signalPwl"]);
	setCtrlText('sigNoiseRate', b["sigNoiseRate"]);
	setCtrlText('bitErrorRate', b["bitErrorRate"]);

}

/* email 提示 */
function showNewEmail(visiable) {

	if (visiable) {
		showCtrl(true, 'newemail');
		setTimeout("openEmail()", 1500);
	} else {
		showCtrl(false, 'newemail');
		showCtrl(false, "openemail");
	}

}
function openEmail() {
	var bgID;
	showCtrl(true, "openemail");

	bgID = randomNumber(4);
	switch (bgID) {
	case 0:
		document.getElementById("openemail").style.backgroundImage = "url('img/0.png')";
		break;
	case 1:
		document.getElementById("openemail").style.backgroundImage = "url('img/1.png')";
		break;
	case 2:
		document.getElementById("openemail").style.backgroundImage = "url('img/2.png')";
		break;
	case 3:
		document.getElementById("openemail").style.backgroundImage = "url('img/3.png')";
		break;
	default:
		break;
	}
	var str = DVB.getEmailList();
	if (str != null && str.length > 0) {
		emailList = eval('(' + str + ')');
	}
	var type = DVB.getCAType();

	if (type == 0 || type == 1) {
		emailID = emailList[0].ID;
		// alert(emailID);
	} else {
		emailID = emailList[emailList.length - 1].ID;

	}

	setCtrlText("mailcontent", DVB.getEmailContent(emailID));

}

/* 升级提示 */
function updateAskCallback(sel) {
	if (sel) {
		DVB.clearNeedUpdate();
		System.reboot();
	} else {
		window.onkeydown = handleKey;
		askDlg.hide();
		DVB.clearNeedUpdate();
	}
}

function showUpdateMsg() {
	if (askDlg == null)
		askDlg = new AskDialog();
	window.onkeydown = dialogHandleKey;
	askDlg.popDlg("升级提示", "有新的程序升级，现在升级？", updateAskCallback);
}

function pageuninit() {

	delete programList;
	delete dvbInfoPannel;
	delete bigNumPannel;
	delete dvbVolBar;
	if (askDlg != null)
		delete askDlg;
}

function showNeedReboot() {
	showNodeMessage('canote', "您更换了CA卡，系统将重启！");
	setTimeout("System.quit()", 5000);
}
// 多CA中检测智能卡是否插反
function onShowCardError(visiable) {
	if (visiable) {
		showNodeMessage('canote', "请检查是否正确插入了智能卡！");
	} else {
		hideNodeMessage('canote');
	}
}
Array.prototype.appendArray = function(other) {
	var i;
	var length = other.length;
	for (i = 0; i < length; i++) {
		this.push(other[i]);
	}
};
function forceOSD(osdDate) {

	var changeChannel = osdDate['changeCH'];
	var seriverID = osdDate['seriveID'];
	var content = osdDate['content'];
	if (changeChannel == 0) {
		window.onkeydown = forceHandleKey;
		DVBPlayer.playTVChannelByID(seriverID);
		showNodeMessage('canote', content);
	} else if (changeChannel == 1) {
		window.onkeydown = handleKey;
		showCtrl(false, 'canote');
		if (seriverID) {
			DVBPlayer.playTVChannelByID(seriverID);
		}
	}

}
function onUpdateMsg(msg) {
	if (msg == 0 || msg == 1)
		showUpdateMsg();
}

function init_programList() {
	//	localStorage['roleChannels'] = "597|5|39321,601|6|39321,613|15|39321";
	var channels = [];
	var allChannels = DVBPlayer.getTVChannels();

	var roles = localStorage['roleChannels'] || System.getConfig('roleChannels');
	// System.debug("init_programList roles = " + roles);
	if (roles && roles.length ) {
		var chanel;
		var infos = JSON.parse(roles);

		if(infos && infos.channelList && infos.channelList.length)
		{
			var chns =  infos.channelList;
			var length = chns.length;
			for ( var i = 0; i < length; i++) {
					var info = chns[i];
					// System.debug("init_programList ("+i+")channels name = "+info.name+"   serviceId = "+info.serviceId);
					chanel = DVBPlayer.getTVChannelDetailByID(info.serviceId,0, 0);
					if(chanel && chanel.name)
						channels.push(chanel);
			}
		}
		else
		{
			var infos = roles.split(',');
			System.debug("roles.split = " + roles.split(','));
			for ( var i = 0; i < infos.length; i++) {
				System.debug("init_programList infos = " + infos[i]);
				try{
					info = infos[i].split('|');
					System.debug("init_programList info.split = " + info);
					chanel = DVBPlayer.getTVChannelDetailByID(info[0],info[1], info[2]);

					if(chanel && chanel.name)
						channels.push(chanel);
				}
				catch(e)
				{
					System.debug("init_programList err chanel = " + chanel);
					continue;
				}
			}
		}

		init_programGroupList(channels);
	} else {
		init_programGroupList();
		channels = allChannels;
		// var length = channels.length;
		// for(var i = 0;i < length; ++i){
		// 	var chn = channels[i];
		// 	System.debug("init_programList ("+i+")channels name = "+chn.name+"   serviceId = "+chn.serviceId);
		// }
	}

	return channels;
}
/* 流程控制 */
function pageinit() {
	
	window.onkeydown = handleKey;

	volumeChannel = System.getConfig("volumeChannel", "0");
	trackChannel = System.getConfig("trackChannel", "0");
	try {

		MediaPlayer.deinit();
	} catch (err) {

	}

	DVB.init();
	DVB.onShowNewEmailSignal.connect(showNewEmail);
	// OSD
	DVB.onShowOSDSignal.connect(showOSD);
	// 指纹
	DVB.onShowFingerSignal.connect(printFinger);

	DVB.stopSearch(false);
	DVBPlayer.stopEPGScan();
	programList = new Array;

	askDlg = new AskDialog();

	var programChannels = init_programList();
	

	DVBPlayer.onEpgEvt.connect(onEpgEvt);
	DVBPlayer.onEpgOk.connect(onEpgOk);

	if (programChannels.length > 0) {

		programList.appendArray(programNone);
		programList.appendArray(programChannels);
		programList.appendArray(programVirtual);

		dvbInfoPannel = new DVBInfoPannel();
		bigNumPannel = new BigNumPannel();
		dvbVolBar = new DVBVolBar();
		var params = new Parameter();
		var prechan = params.getParamInt('prechan');
		if (prechan != null && prechan > 0) {
			dvbInfoPannel.oldChan = prechan;

		}

		var chan = params.getParamInt('chan');
		
		var svrid = params.getParamInt('svrid');
		
		if (chan != null && chan > 0 && chan <= dvbInfoPannel.getChannelNum()) {
		
			dvbInfoPannel.switchToChannel(chan);
		} else if (svrid != null && svrid > 0) {
	
			DVBPlayer.playTVChannelByID(svrid);
		} else {
			chan = DVBPlayer.getCurrentTVChannel();
			
			dvbInfoPannel.switchToChannel(chan > 0 ? chan : 1);
		}

		DVBPlayer.setTVVoutRect(0, 0, 1280, 720);

	} else {
		window.onkeydown = dialogHandleKey;
		askDlg.popDlg("没有节目", "没有节目信息，开始搜索节目？", askCallback);
		showNodeMessage('canote', "没有节目");
	}

	/* 是否要升级 */
	DVB.onUpdateSignal.connect(onUpdateMsg);
	// CA及信号弱提示消息
    DVB.onCaTunerEvt.connect(onCaTunerMsg);
	DVB.onShowCardErrorSignal.connect(onShowCardError);

	loadAdPlayer(10002, 'advbar', 500);
	loadAdPlayer(10003, 'advvol', 800);
	loadAdPlayer(10004, 'advflow', 1200);
	loadAdPlayer(10005, 'advprg', 2000);

	DVB.onNeedRebootSignal.connect(showNeedReboot);
	DVB.onSendOSDForceSignal.connect(forceOSD);
    DVB.pullSignals();
}
// const data
var DIV_MAIN_HEIGTH = 668;
var MENU_INTERVAL = 188;
var SNDMENU_HEIGHT = 490;

var mainMenu = null;
// var timerid = null;
var divMain = null;
var sndMenuListArray = [];
// tests data
var menuArray = [ {
	"name" : "主零",
	"array" : [ "陕西卫视", "宁夏电视台", "内蒙古电视台", "aaaeee", "aaafff" ]
}, {
	"name" : "主一",
	"array" : [ "陕西高清频道", "西安高清", "bbbccc" ]
}, {
	"name" : "主二",
	"array" : [ "第零", "第一", "第二", "第三", "第四", "第五", "第六", "第七", "第八", "第九" ]
}, {
	"name" : "主三",
	"array" : [ "dddbbb", "dddccc", "dddddd", "dddeee", "dddfff" ]
}, {
	"name" : "主四",
	"array" : [ "eeebbb", "eeeccc", "eeeddd", "eeeeee", "eeefff" ]
}, {
	"name" : "主五",
	"array" : [ "eeebbb", "eeeccc", "eeeddd", "eeeeee", "eeefff" ]
}, {
	"name" : "主六",
	"array" : [ "eeebbb", "eeeccc", "eeeddd", "eeeeee", "eeefff" ]
}, {
	"name" : "主七",
	"array" : [ "七零", "七一", "七二", "七三", "七四", "七五", "七六", "七七", "七八", "七九" ]
} ];

var divArea = null;

var favIndex = 0;
var favItem = null;
var showFavTimer = null;

function onShowFavTo() {
	showFavTimer = null;
	document.getElementById('favnote').style.display = 'none';
}

function showFav(fav) {
	if (showFavTimer != null)
		clearTimeout(showFavTimer);
	showFavTimer = setTimeout('onShowFavTo()', 2000);
	var obj = document.getElementById('favnote');
	if (fav) {
		obj.innerHTML = '添加喜爱频道成功';
	} else {
		obj.innerHTML = '取消喜爱频道成功';
	}
	obj.style.display = '';
}

function setFavrite(serviceId, favor) {
	if (!DVBPlayer.setFavorite(serviceId, favor)){
		//return false;
	}

	divArea.removeChild(favItem);
	
	var pos = favIndex - mainMenu.displaybase;
	favItem = document.createElement("div");
	favItem.className = "SndMenu";
	favItem.style.left = pos * MENU_INTERVAL + "px";
	divArea.appendChild(favItem);
	
	var array = DVBPlayer.getAllFavoriteTv();

	sndMenuListArray[favIndex] = new SndMenuLists(favIndex, favItem, '喜爱频道',
			array);
	
	if (mainMenu.selected == favIndex){
		sndMenuListArray[favIndex].setFocus(true, '0.6s');
	}	
	else{
		sndMenuListArray[favIndex].setFocus(false, '0s');
	}

	return true;
}

// 二级菜单
function SndMenuLists(groupIndex, div, name, items) {
	this.name = name;
	this.isFocus = false;
	this.parent = null;

	this.selected = -1;
	this.displaybase = 0;
	this.displaycount = 8;
	this.startX = 20;
	this.interval = 60;
	this.div = div;
	this.divLists = [];

	this.items = items;
	var i;
	var divTemp;

	div.style.height = "0px";

	for (i = 0; i < this.items.length; i++) {
		divTemp = document.createElement("div");
		divTemp.className = "SndMenuItem";
		divTemp.innerHTML = this.items[i].name;
		divTemp.style.top = this.startX + i * this.interval + "px";
		div.appendChild(divTemp);
		this.divLists[i] = divTemp;
	}
	this.divFocus = document.createElement("div");
	this.divFocus.className = "SndMenuFocus";
	this.divFocus.style.top = this.startX + "px";
	div.appendChild(this.divFocus);

}
SndMenuLists.prototype.painterList = function(isDownOrUp) {
	var i;
	var sum;
	var butncount = this.items.length;
	var startX = this.startX;
	var nodes = this.divLists;

	if (butncount < this.displaycount) {
		sum = butncount;
	} else {
		sum = this.displaycount;
	}

	if (isDownOrUp) {
		var base = this.displaybase;
		for (i = -1; i < sum; i++) {
			nodes[i + base].style.top = (startX + i * this.interval) + "px";
		}
	} else {
		startX += (sum - 1) * this.interval;
		var bottom = this.displaybase + sum - 1;
		for (i = -1; i < sum; i++) {
			nodes[bottom - i].style.top = (startX - i * this.interval) + "px";
		}
	}
};

SndMenuLists.prototype.painterFocus = function() {

	var pos = this.selected - this.displaybase;
	if (this.isFocus && pos > -1 && pos < this.items.length) {
		// 计算 位置
		this.divFocus.style.top = parseInt(this.startX + pos * this.interval)
				+ 'px';
		this.divFocus.style.display = "inline";
	} else {
		this.divFocus.style.display = "none";
	}
};

SndMenuLists.prototype.reset = function() {

	this.selected = 0;
	this.displaybase = 0;

	var i;
	for (i = 0; i < this.divLists.length; i++) {
		this.divLists[i].style.top = this.startX + i * this.interval + "px";
	}

	this.divFocus.style.top = this.startX + "px";
};

SndMenuLists.prototype.setFocus = function(isFocus, duration, postion) {
	this.isFocus = isFocus;
	if (postion != null) {
		this.div.style.WebkitTransitionDuration = duration;
	}
	if (isFocus) {
		this.reset();
		this.div.style.height = SNDMENU_HEIGHT + "px";

		if (postion != null) {
			this.div.style.left = postion;
		}
	} else {
		this.div.style.height = "0px";
	}
};

SndMenuLists.prototype.onKeyEvent = function(key) {
	var sel = this.selected;
	var butncount = this.items.length;
	var favor;
	switch (key) {
	case UP:
		if (butncount > 0) {
			sel--;
			if (sel > -1) {
				this.selected = sel;

				if (this.displaybase + parseInt(this.displaycount / 2) > sel
						&& this.displaybase > 0) {
					this.displaybase--;
					this.painterList(false);

				} else {
					this.painterFocus();
				}
			}

		}
		return false;
	case DOWN:
		if (butncount > 0) {
			sel++;
			if (sel < butncount) {
				this.selected = sel;

				if (this.displaybase + parseInt(this.displaycount / 2) < sel
						&& this.displaybase + this.displaycount < butncount) {
					this.displaybase++;
					this.painterList(true);
				} else {
					this.painterFocus();
				}

			}
		}
		return false;
	case ENTER:
		return this.onEnterPress();	
	case F2:
	case F6:
	case FAVkey:	
		var srv = this.items[sel]['svrid'] || this.items[sel]['srvId'];

		//favor = DVBPlayer.isFavorite(this.items[sel]['svrid']);
		favor = DVBPlayer.isFavorite(srv);
		
		favor = !favor;
		/*if (setFavrite(this.items[sel]['svrid'], favor)) {
			console.log('-------' + favor + '---' + sel);
			this.items[sel]['favor'] = favor;
			showFav(favor);
		}*/
		if (setFavrite(srv, favor)) {
			this.items[sel]['favor'] = favor;
			showFav(favor);
		}	
		break;
	default:
		return true;
	}
};

SndMenuLists.prototype.onEnterPress = function() {

	try {
		var chn = this.items[this.selected];
	
		mainMenu.hide(chn.serviceId);

	} catch (e) {
		//console.log("onEnterPess:" + e);
	}

};
SndMenuLists.prototype.findSvrid = function(svrid) {
	var i;
	var items = this.items;
	System.debug("SndMenuLists.prototype.findSvrid svrid=" + svrid);
	for (i = 0; i < this.items.length; i++) {
		System.debug("SndMenuLists.prototype.findSvrid items serviceId="
				+ items[i].serviceId);

		if (svrid == items[i].serviceId) {
			return i;
		}

	}
	return null;
};
SndMenuLists.prototype.setSelected = function(index) {
	var i;
	this.isFocus = true;
	this.div.style.WebkitTransitionDuration = "0s";
	this.div.style.height = SNDMENU_HEIGHT + "px";

	this.selected = index;
	this.displaybase = parseInt(this.selected / this.displaycount)
			* this.displaycount;
	for (i = 0; i < this.displaybase && i < this.items.length; i++) {
		this.divLists[i].style.top = this.startX - this.interval + "px";
	}

	for (; i < this.items.length; i++) {
		this.divLists[i].style.top = this.startX + (i - this.displaybase)
				* this.interval + "px";
	}
	this.painterFocus();
	return false;
};
// 主菜单
function MainMenuList(div, items) {
	this.isFocus = true;
	this.parent = null;

	this.selected = -1;
	this.displaybase = 0;
	this.displaycount = 6;
	this.startX = 0;
	this.interval = MENU_INTERVAL;
	this.div = div;
	this.divLists = [];
	this.items = items;
	this.svrid = null;

	this.divFocus = document.createElement("div");
	this.divFocus.className = "MainMenuFocus";
	this.divFocus.style.left = this.startX + "px";

	var i;
	var divTemp;
	for (i = 0; i < this.items.length; i++) {
		divTemp = document.createElement("div");
		divTemp.className = "MainMenuItem";
		divTemp.innerHTML = this.items[i].name;
		divTemp.style.left = this.startX + i * this.interval + "px";
		div.appendChild(divTemp);
		this.divLists[i] = divTemp;
	}

	div.appendChild(this.divFocus);
}
MainMenuList.prototype.painterList = function(isRightOrLeft) {
	var i;
	var sum;
	var butncount = this.items.length;
	// var sel = this.selected;
	var startX = this.startX;
	var nodes = this.divLists;

	if (butncount < this.displaycount) {
		sum = butncount;
	} else {
		sum = this.displaycount;
	}

	if (isRightOrLeft) {
		var base = this.displaybase;
		for (i = -1; i < sum; i++) {
			nodes[i + base].style.left = (startX + i * this.interval) + "px";
		}

	} else {

		startX += (sum - 1) * this.interval;
		var bottom = this.displaybase + sum - 1;
		for (i = -1; i < sum; i++) {
			nodes[bottom - i].style.left = (startX - i * this.interval) + "px";
		}
	}

};
var pindex = 0;
var postions = [ {
	"first" : 0,
	"second" : 14
}, {
	"first" : 6,
	"second" : 4
}, {
	"first" : 6,
	"second" : 1
}, {
	"first" : 0,
	"second" : 4
}, {
	"first" : 0,
	"second" : 16
} ];
MainMenuList.prototype.show = function(svrid) {
	divMain.style.height = DIV_MAIN_HEIGTH + "px";
	window.onkeydown = keyHandle;
	System.debug("MainMenuList.prototype.show svrid=" + svrid + "  this.svrid="
			+ this.svrid);
	if (svrid != null && svrid != this.svrid) {
		var i = postions[pindex].first;
		var index = postions[pindex].second;
		pindex = (pindex + 1) % 5;
		var items = this.items;

		for (i = 0; i < items.length; i++) {
			index = items[i].findSvrid(svrid);
			if (index != null) {
				this.setSelected(i, index);
				break;
			}
		}

		this.svrid = svrid;

	}

};

MainMenuList.prototype.hide = function(svrid) {

	System.debug("function(" + svrid + ")");
	if (svrid != null) {
		var i;
		var count = dvbInfoPannel.getChannelNum();
		for (i = 1; i < count; i++) {
			System.debug("function(svrid) serviceId = "
					+ programList[i].serviceId);
			if (programList[i].serviceId == svrid) {
				dvbInfoPannel.switchToChannel(i);
				break;
			}
		}

		this.svrid = svrid;
	}

	divMain.style.height = "0px";
	window.onkeydown = handleKey;
	// System.debug("function(svrid) end svrid = "+svrid);
};
MainMenuList.prototype.setSelected = function(index, subindex) {
	var i;
	this.selected = index;
	this.displaybase = parseInt(this.selected / this.displaycount)
			* this.displaycount;

	var divLists = this.divLists;
	var divListsLength = divLists.length;
	var displaySum = this.displaybase + this.displaycount;

	var items = this.items;
	var leftTemp;
	var divTemp;

	leftTemp = this.startX - this.interval + "px";
	for (i = 0; i < this.displaybase; i++) {
		divTemp = items[i].div;
		divLists[i].style.left = leftTemp;
		divTemp.style.left = leftTemp;
		if (divTemp.style.height != "0px") {
			divTemp.style.WebkitTransitionDuration = "0s";
			divTemp.style.height = "0px";
		}
	}
	displaySum = divListsLength > displaySum ? displaySum : divListsLength;

	for (; i < displaySum; i++) {
		leftTemp = this.startX + (i - this.displaybase) * this.interval + "px";
		divTemp = items[i].div;
		divLists[i].style.left = leftTemp;
		divTemp.style.left = leftTemp;
		if (divTemp.style.height != "0px") {
			divTemp.style.WebkitTransitionDuration = "0s";
			divTemp.style.height = "0px";
		}
	}

	leftTemp = this.startX + this.displaycount * this.interval + "px";
	for (; i < divListsLength; i++) {
		divTemp = items[i].div;
		divLists[i].style.left = leftTemp;
		divTemp.style.left = leftTemp;
		if (divTemp.style.height != "0px") {
			divTemp.style.WebkitTransitionDuration = "0s";
			divTemp.style.height = "0px";
		}
	}

	System.debug("MainMenuList.prototype.setSelected index = " + index);

	this.items[index].setSelected(subindex);
	this.painterFocus();
};
MainMenuList.prototype.painterFocus = function() {
	var pos = this.selected - this.displaybase;
	if (this.isFocus && pos > -1 && pos < this.items.length) {
		this.divFocus.style.left = parseInt(this.startX + pos * this.interval)
				+ 'px';
	}
};

MainMenuList.prototype.onKeyEvent = function(key) {
	var sel = this.selected;
	var butncount = this.items.length;
	switch (key) {
	case EXIT:
		window.location.href = 'menu.html';
		return false;
	case RETURN:
		mainMenu.hide();
		return true;
	case LEFT:
		if (butncount > 0) {
			sel--;
			if (sel > -1) {
				this.selected = sel;

				if (sel < this.displaybase) {
					this.displaybase--;
					if (this.items[sel + 1] != null) {
						this.items[sel + 1].setFocus(false, "0s");
					}
					this.painterList(false);

				} else {
					if (this.items[sel + 1] != null) {
						this.items[sel + 1].setFocus(false, "0.6s");
					}
					this.painterFocus();

				}

				this.items[sel]
						.setFocus(true, "0.6s", this.divFocus.style.left);

			}
			// back to end
			// else
			// {
			// sel = butncount - 1;
			// this.selected = sel;
			// this.displaybase = butncount - this.displaycount;

			// this.painterList(false);
			// this.painterFocus();

			// // this.items[0].setFocus(false);
			// // this.items[sel].setFocus(true,false);
			// }

		}
		return false;
	case RIGHT:
		if (butncount > 0) {
			sel++;
			if (sel < butncount) {
				this.selected = sel;

				if (this.displaybase + this.displaycount > sel)

				{

					if (this.items[sel - 1] != null) {
						this.items[sel - 1].setFocus(false, "0.6s");
					}

					this.painterFocus();

				} else {
					this.displaybase++;
					if (this.items[sel - 1] != null) {
						this.items[sel - 1].setFocus(false, "0s");
					}

					this.painterList(true);

				}
				this.items[sel]
						.setFocus(true, "0.6s", this.divFocus.style.left);

			}
			// back to begain
			// else
			// {
			// sel = 0;
			// this.selected = sel;
			// this.displaybase = 0;
			// this.painterList(true);
			// this.painterFocus();

			// // this.items[butncount - 1].setFocus(false);
			// // this.items[sel].setFocus(true,true);
			// }

		}
		return false;
	case UP:
	case DOWN:
	case ENTER:
	case F2:
	case F6:
	case FAV:
		this.items[sel].onKeyEvent(key);
		break;
	default:
		return true;
	}
};

function keyHandle() {

	var keyCode = event.keyCode;
	try {

		// if (timerid != null) {
		// clearTimeout(timerid);
		// }
		// timerid = setTimeout("mainMenu.hide();", 2000);
		mainMenu.onKeyEvent(keyCode);

	} catch (e) {
		// alert(e);
	}
}
/*

function getALLTVChannels () {
	var oldChanItem = DVBPlayer.getTVChannels();
	var newChanItem = [];

	try {
		// statements

		for (var key in oldChanItem)
		{
			var ch = oldChanItem[key];
			var x = {};
			x.name = ch.name;
			x.svrid = ch.srvId;
			x.serviceId = ch.serviceId;
			x.favor = x.svrid ? DVBPlayer.isFavorite(x.svrid) : 0;
			newChanItem.push(x);
		}
	} catch(e) {
		// statements
		console.log(e);
	}	
	return newChanItem;
}
*/
function init_programGroupList(customChannanls) {

	try {
		var divSndMenuTemp;
		var groups = null;
		var array = null;
		var name;
		var i;
		var j;
		divMain = document.getElementById("main");
		divArea = document.getElementById("area");

		groups = DVBPlayer.getChanGroups();
		for (i = 0, j = 0; i < groups.length; i++) {
			name = groups[i].name;
			array = DVBPlayer.getChanGroupChans(groups[i].id);
			if (array.length > 0) // 去除空组
			{
				divSndMenuTemp = document.createElement("div");
				divSndMenuTemp.className = "SndMenu";
				divSndMenuTemp.style.left = j * MENU_INTERVAL + "px";
				divArea.appendChild(divSndMenuTemp);
				sndMenuListArray[j] = new SndMenuLists(j, divSndMenuTemp, name,
					array);
				j++;
			}
		}

		/* group all */
		//array = customChannanls && customChannanls.length ? customChannanls : getALLTVChannels();
		array = customChannanls && customChannanls.length ? customChannanls : DVBPlayer.getTVChannels();
		divSndMenuTemp = document.createElement("div");
		divSndMenuTemp.className = "SndMenu";
		divSndMenuTemp.style.left = j * MENU_INTERVAL + "px";
		divArea.appendChild(divSndMenuTemp);
		sndMenuListArray[j] = new SndMenuLists(j, divSndMenuTemp, '所有频道',array);
		j++;
		/* group
		favrite */
		favIndex = j;
		divSndMenuTemp = document.createElement("div");
		divSndMenuTemp.className = "SndMenu";
		divSndMenuTemp.style.left = j * MENU_INTERVAL + "px";
		divArea.appendChild(divSndMenuTemp);
		array = DVBPlayer.getAllFavoriteTv();
		sndMenuListArray[j] = new SndMenuLists(j, divSndMenuTemp, '喜爱频道', array);
		favItem = divSndMenuTemp;
	
		/*
		 * var offset= groups.length; for (i = 0; i < groups.length; i++) {
		 * divSndMenuTemp = document.createElement("div");
		 * divSndMenuTemp.className = "SndMenu"; divSndMenuTemp.style.left = i *
		 * MENU_INTERVAL + "px"; divArea.appendChild(divSndMenuTemp); array =
		 * DVBPlayer.getChanGroupChans(groups[i].id); sndMenuListArray[offset+i] =
		 * new SndMenuLists(divSndMenuTemp, "测试-"+groups[i].name, array); }
		 */
		mainMenu = new MainMenuList(divArea, sndMenuListArray);
		
	} catch (e) {
		// alert("create exception:" + e);
	}
}
/*
(function() {
 // 'use strict';
  try {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', './json.txt', true);
    xhr.onreadystatechange = function()
    {
      console.log("xhr.readyState: "+xhr.readyState);
      if (xhr.readyState==4)
      {
        console.log("xhr.status: "+xhr.status);

        if (xhr.status==200)
        {
          // ...our code here...
          // console.log("Problem retrieving XML data 200"+xhr.responseText);
					localStorage['roleChannels'] = xhr.responseText;

          // console.log("Success: xhr.responseText:"+localStorage['roleChannels']);
        }
      }
    };

    xhr.send(null);


} catch (e) {
  console.error("message: catch "+e);
} finally {
  console.log("message: finally ");
}
}());
*/
