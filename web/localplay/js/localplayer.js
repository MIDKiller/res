var curMenuFocus = 0;
var MenuFocus = true;
var MenuItem = 0;
var keyplay = true;
var usbVolBar = null;
var flag = 0;
var usbPlayBar = null;
var avPlayProgress = 0;
var lastPlayProgress = 0;
var playtime = 0;
var askDlg = null;
var file = "";
var back = "";
var progressLeft = 0;
var currentTrack = 0;
var trackTimerId = null;
var divNote = null;
function soundTrack() {
	var trackString = [ '左声道', '右声道', '立体声' ];
	currentTrack++;
	if (currentTrack >= 3)
		currentTrack = 0;

	AvConfig.setSoundTrackMode(currentTrack);

	document.getElementById("volTrack").innerHTML = trackString[currentTrack];
	document.getElementById("volTrack").style.display = '';
	if (trackTimerId != null) {
		clearTimeout(trackTimerId);
		trackTimerId = null;
	}

	trackTimerId = setTimeout(function() {
		trackTimerId = null;
		document.getElementById("volTrack").style.display = 'none';
	}, 3000);
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
function dealPlayFlagKey(keyCode) {
	switch (keyCode) {
	case ENTER:
		flag = 2;
		lastPlayProgress = avPlayProgress;
		MediaPlayer.pause();
		document.getElementById("play").style.backgroundImage = "url('img/pause.png')";
		document.getElementById("dot").style.left = progressLeft + 122 + 'px';
		showCtrl(true, 'playbar');
		showCtrl(true, 'dot');
		usbPlayBar.clearPlayTimer();
		// System.debug("dealPlayFlagKey flag = " + flag);
		break;
	case DOWN:
		flag = 1;
		usbPlayBar.fast(false);
		break;
	case UP:
		flag = 1;
		usbPlayBar.fast(true);
		break;
	case RIGHT:
	case VOL_UP:
		usbVolBar.volUpDown(true);
		break;
	case LEFT:
	case VOL_DOWN:
		usbVolBar.volUpDown(false);
		break;
	case KEY_RATIO:
		ratioChange();
		break;
	case KEY_MUTE:
		usbVolBar.mute();
		break;
	default:
		break;
	}
}

function dealFastFlagKey(keyCode) {
	switch (keyCode) {
	case ENTER:
		flag = 0;
		MediaPlayer.resume();
		showCtrl(false, 'fast');
		showCtrl(false, 'dot');
		usbPlayBar.speed = 0;
		usbPlayBar.clearPlayTimer();
		usbPlayBar.startPlayTimer();
		// System.debug("dealFastFlagKey flag + " + flag);
		break;
	case DOWN:
		usbPlayBar.fast(false);
		break;
	case UP:
		usbPlayBar.fast(true);
		break;
	default:
		break;
	}
}

function dealPauseFlagKey(keyCode) {

	switch (keyCode) {
	case ENTER:
		flag = 0;
		document.getElementById("play").style.backgroundImage = "url('img/play.png')";
		showCtrl(false, 'dot');
		if (avPlayProgress != lastPlayProgress) {
			MediaPlayer.pseek(avPlayProgress);
		}
		MediaPlayer.resume();
		usbPlayBar.clearPlayTimer();
		usbPlayBar.startPlayTimer();
		// System.debug("dealPauseFlagKey flag + " + flag);
		break;
	case LEFT:
		usbPlayBar.progress(false);
		break;
	case RIGHT:
		usbPlayBar.progress(true);
		break;
	case VOL_DOWN:
		usbVolBar.volUpDown(false);
		break;
	case VOL_UP:
		usbVolBar.volUpDown(true);
		break;
	case KEY_MUTE:
		dvbVolBar.mute();
		break;
	default:
		break;
	}
}

function askCleanOk(sel) {
	isAsking = false;
	askDlg.hide();
	askDlg = null;
	if (sel == true)
		DVB.clearChannel();
}

function dealExitFlagKey(keycode) {
	/*
	 * switch (keyCode) { case ENTER: askDlg = new AskDialog();
	 * askDlg.popDlg('退出播放','确定退出当前播放', askCleanOk); isAsking = true; break;
	 * case LEFT: if (isAsking == true) { askBoxKeyIn(); break; } menuFocus =
	 * true; break; case RIGHT: if (isAsking == true) { askBoxKeyIn(); break; }
	 * break; case RETURN: case EXIT: /*继续播放
	 */
	/*
	 * window.location.href = '../localmedia/filebrowse.html?file='+file; return
	 * true; default: break; }
	 */
}

function KeyEvent() {

	var code = event.keyCode;

	switch (flag) {
	case vol_Track:
		soundTrack();
		return;
	case RETURN:
	case EXIT:
		goBack(back);
		return false;
	}
	switch (flag) {
	case 0:
		return dealPlayFlagKey(code);
	case 1:
		return dealFastFlagKey(code);
	case 2:
		return dealPauseFlagKey(code);
	case 3:
		return dealExitFlagKey(code);
	default:
		break;
	}

	return;
}

// 音量条显示
function USBVolBar() {
	this.volKeyTimer = null;
	this.currentVol = AvConfig.getVolume();
	this.isMute = AvConfig.getVolumeMute();
	if (this.isMute)
		showCtrl(this.isMute, 'mutepan');
	AvConfig.setVolume(this.currentVol);
}

USBVolBar.prototype.clearKeyTimer = function() {
	if (this.volKeyTimer != null) {
		clearTimeout(this.volKeyTimer);
		this.volKeyTimer = null;
	}
};

USBVolBar.prototype.mute = function() {

	this.isMute = !this.isMute;
	showCtrl(this.isMute, 'mutepan');
	if (this.isMute == true) {
		AvConfig.volumeMute();
	} else {
		AvConfig.volumeUnMute();
	}
};

USBVolBar.prototype.startKeyTimer = function() {
	this.clearKeyTimer();
	this.volKeyTimer = setTimeout('volKeyTimeOut()', 2000);

};

USBVolBar.prototype.enable = function() {
	showCtrl(true, 'volbar');
	this.showVolume();
	this.startKeyTimer();
};

USBVolBar.prototype.disable = function() {
	showCtrl(false, 'volbar');
	this.clearKeyTimer();
};

USBVolBar.prototype.volUpDown = function(up) {

	this.clearKeyTimer();

	showCtrl(true, 'volbar');

	if (up == true) {

		this.currentVol += 5;
		if (this.currentVol > 100)
			this.currentVol = 100;
	} else {
		this.currentVol -= 5;
		if (this.currentVol < 0)
			this.currentVol = 0;
	}

	if (this.isMute == true) {
		this.isMute = false;
		showCtrl(this.isMute, 'mutepan');
		AvConfig.volumeUnMute();
	}
	this.showVolume();
	AvConfig.setVolume(this.currentVol);
	this.startKeyTimer();

};

USBVolBar.prototype.showVolume = function() {
	var obj = document.getElementById('curvol');
	if (obj == null)
		return;
	obj.style.width = parseInt((this.currentVol * 730) / 100) + 'px';
	obj = document.getElementById('volnum');
	if (obj == null)
		return;
	obj.innerHTML = this.currentVol;
};

function dealKeyTimeout() {
	this.volKeyTimer = null;
	showCtrl(false, 'volbar');
}
function volKeyTimeOut() {

	this.dealKeyTimeout();
}

/* playbar隐藏 */

function USBPlayBar() {
	this.playKeyTimer = null;
	this.playBarCheckTime = null;
	this.keyCheckTime = null;
	this.speed = 0;
	document.getElementById("playname").innerHTML = "";
	document.getElementById('ttltime').innerHTML = changeTime();
	this.clearPlayTimer();
	this.startPlayTimer();

}

USBPlayBar.prototype.clearPlayTimer = function() {
	if (this.playKeyTimer != null) {
		clearTimeout(this.playKeyTimer);
		this.playKeyTimer = null;
	}
};

USBPlayBar.prototype.startPlayTimer = function() {
	this.clearPlayTimer();
	this.playKeyTimer = setTimeout('playKeyTimeOut()', 7000);
};

function dealplayKeyTimeout() {
	this.playKeyTimer = null;
	showCtrl(false, 'playbar');
}

function playKeyTimeOut() {

	this.dealplayKeyTimeout();
}
// 时间转换
function changeTime(iTime) {

	if (iTime == null) {
		return "00:00:00";
	}
	var sTime = '';
	var h, m, s;
	s = parseInt(iTime / 1000);

	m = parseInt(s / 60);
	s = parseInt(s % 60);

	h = parseInt(m / 60);
	m = parseInt(m % 60);

	if (h < 10)
		sTime = '0';
	sTime += h + ':';
	if (m < 10)
		sTime += '0';
	sTime += m + ':';
	if (s < 10)
		sTime += '0';
	sTime += s;

	return sTime;
}

// 进度条
// 快进

USBPlayBar.prototype.fast = function(up) {
	// var key = event.keyCode;

	this.clearPlayTimer();
	showCtrl(true, 'playbar');
	showCtrl(true, 'fast');
	if (up == true) {
		this.speed++;

		if (this.speed < 0) {
			this.speed = 1;
		} else if (this.speed > 6) {
			MediaPlayer.resume();
			this.clearPlayTimer();
			showCtrl(false, 'fast');
			this.startPlayTimer();
			this.speed = 0;
			return;
		}

		var speed = Math.pow(2, this.speed);
		document.getElementById("fast").style.backgroundImage = "url('img/anniu1.png')";
		document.getElementById("kuaijin").innerHTML = '快进';
		MediaPlayer.tplay(this.speed);
		if (speed < 10)
			document.getElementById('text').innerHTML = speed + 'X';
		else
			document.getElementById('text').innerHTML = speed;
	}

	else {
		this.speed--;
		if (this.speed > 0) {
			this.speed = -1;
		} else if (this.speed < -6) {
			MediaPlayer.resume();
			this.clearPlayTimer();
			showCtrl(false, 'fast');
			this.startPlayTimer();
			this.speed = 0;

			return;
		}

		var speed = Math.pow(2, Math.abs(this.speed));

		document.getElementById("fast").style.backgroundImage = "url('img/anniu2.png')";
		document.getElementById("kuaijin").innerHTML = '快退';
		MediaPlayer.tplay(this.speed);

		if (speed < 10)
			document.getElementById('text').innerHTML = speed + 'X';
		else
			document.getElementById('text').innerHTML = speed;
	}

};

USBPlayBar.prototype.progress = function(up) {
	this.clearPlayTimer();
	System.debug("progress up or down  = " + up);

	if (up == true) {
		avPlayProgress = 1 + avPlayProgress;
		if (avPlayProgress > 100)
			avPlayProgress = 100;

	} else {
		avPlayProgress = avPlayProgress - 1;
		if (avPlayProgress < 0)
			avPlayProgress = 0;

	}
	System.debug("progress avPlayProgress  = " + avPlayProgress);

	this.showProgress();
};

USBPlayBar.prototype.showProgress = function() {
	var obj = document.getElementById('dot');
	System.debug("showProgress avPlayProgress  = " + avPlayProgress);

	obj.style.left = avPlayProgress * 9.26 + 122 + 'px';
	// obj.innerHTML = avPlayProgress;
	var times = MediaPlayer.getDuration();
	System.debug("showProgress avPlayProgress  =  " + avPlayProgress + "MediaPlayer.getDuration"+ MediaPlayer.getDuration());

	document.getElementById("adytime").innerHTML = changeTime((avPlayProgress * times) / 100);
};

function showFastFalseStart() {

	showCtrl(false, 'fast');
	usbPlayBar.clearPlayTimer();
	usbPlayBar.startPlayTimer();
	flag = 0;
	// System.debug("showFastFalseStart flag - " + flag);
}

function onPlayStarted() {
	System.debug("[callback]onPlayStarted getDuration = " + MediaPlayer
			.getDuration());

	divNote.style.display = '';
	divNote.style.webkitTransitionDuration = '1.5s';
	divNote.style.opacity = '0.0';

	document.getElementById("playname").innerHTML = MediaPlayer.mediaName();
	document.getElementById('ttltime').innerHTML = changeTime(MediaPlayer
			.getDuration());
	showCtrl(false, 'fast');
}

function timeoutExit() {
	divNote.style.display = 'none';
	goBack(back);
}
function showFastFalseFinish() {

	showCtrl(false, 'fast');
	showCtrl(false, 'playbar');
	MediaPlayer.stop();
	setTimeout(timeoutExit, 1500);
}
function errorUSB(action, dirname) {
	if (action != 'remove')
		return;

	if (file.indexOf(dirname) != 0)
		return;

	MediaPlayer.stop();
	System.umount(dirname);

	divNote.innerHTML = '播放错误，移动存储已拔出！';
	divNote.style.display = '';
	divNote.style.webkitTransitionDuration = '0s';
	divNote.style.opacity = '1.0';
}
function playError() {
	divNote.innerHTML = '播放错误，媒体无法正常解析！';
	divNote.style.display = '';
	divNote.style.webkitTransitionDuration = '0s';
	divNote.style.opacity = '1.0';
}
function playBuffering(__ok) {
	System.debug("[callback]playBuffering buffer = " + __ok);
	if (__ok == false) {
		divNote.innerHTML = '正在缓冲...';
		divNote.style.display = '';
		divNote.style.webkitTransitionDuration = '0s';
		divNote.style.opacity = '1.0';
	} else {
		divNote.innerHTML = '缓冲成功';
		divNote.style.display = '';
		divNote.style.webkitTransitionDuration = '3s';
		divNote.style.opacity = '0.0';
	}
}

function playScaled(__speed) {

	System.debug("[callback]playScaled speed = " + __speed);
	if (__speed > 0 && __speed < 6) {
		showCtrl(true, 'fast');
		this.speed = __speed;
		var speed = Math.pow(2, this.speed);
		document.getElementById("fast").style.backgroundImage = "url('img/anniu1.png')";
		document.getElementById("kuaijin").innerHTML = '快进';
		if (speed < 10)
			document.getElementById('text').innerHTML = speed + 'X';
		else
			document.getElementById('text').innerHTML = speed;
	} else if (__speed < 0 && __speed > -6) {
		showCtrl(true, 'fast');
		this.speed = __speed;
		var speed = Math.pow(2, Math.abs(this.speed));

		document.getElementById("fast").style.backgroundImage = "url('img/anniu2.png')";
		document.getElementById("kuaijin").innerHTML = '快退';

		if (speed < 10)
			document.getElementById('text').innerHTML = speed + 'X';
		else
			document.getElementById('text').innerHTML = speed;
	} else {
		showCtrl(false, 'fast');
		this.speed = 0;
	}
}

function ProgressMsg(progress, times) {
	if (flag != 2) {
		document.getElementById("adytime").innerHTML = changeTime(times);
		progressLeft = 930 * progress / 100;
		avPlayProgress = progress;
		document.getElementById("procimg").style.width = progressLeft + "px";
	}

}
function PlayTitle(title) {

	document.getElementById("subtitle").innerHTML = title;

}
function goBack(__url) {
	if (__url) {
		window.location.href = __url;
	} else {
		window.history.back();
	}
}
function pageinit() {
	window.onkeydown = KeyEvent;
	DVB.stop();
	MediaPlayer.init();

	currentTrack = AvConfig.getSoundTrackMode();
	file = decodeURIComponent(window.location.getParameter('file'));
	if (!file) {
		file = decodeURIComponent(window.location.getParameter('purl'));
	}
	System.debug("MediaPlayer.file =" + file);

	back = decodeURIComponent(window.location.getParameter('back'));

	if (!back) {
		back = decodeURIComponent(window.location.getParameter('rurl'));
	}

	if (!back) {
		back = System.getWebEnv("PLAY_BACK_URL");
	}
	System.debug("MediaPlayer.back =" + back);

	usbVolBar = new USBVolBar();
	usbPlayBar = new USBPlayBar();
	divNote = document.getElementById('note');
	divNote.style.webkitTransitionProperty = 'opacity';

	System.usbchange.connect(errorUSB);

	try {

		MediaPlayer.playProgress.connect(ProgressMsg);
		MediaPlayer.playSubtitle.connect(PlayTitle);
		MediaPlayer.playStarted.connect(onPlayStarted);
		MediaPlayer.playFinished.connect(showFastFalseFinish);
		MediaPlayer.buffering.connect(playBuffering);
		MediaPlayer.error.connect(playError);

		MediaPlayer.scaled.connect(playScaled);

	} catch (e) {
		System.debug("MediaPlayer.connect error=" + e);
	}

	MediaPlayer.play(file, 0, 0, 1280, 720);
	// divNote.innerHTML = '开始加载..';
	// divNote.style.display = '';
}
function pagedeinit() {
	
	MediaPlayer.deinit();

	try {
		MediaPlayer.playProgress.disconnect(ProgressMsg);
		MediaPlayer.playSubtitle.disconnect(PlayTitle);

		MediaPlayer.playStarted.disconnect(onPlayStarted);
		MediaPlayer.playFinished.disconnect(showFastFalseFinish);
		MediaPlayer.buffering.disconnect(playBuffering);
		MediaPlayer.error.disconnect(playError);

		MediaPlayer.scaled.connect(playScaled);
	} catch (e) {
		System.debug("MediaPlayer.disconnect error=" + e);
	}

	System.usbchange.disconnect(errorUSB);

	delete usbVolBar;
	delete usbPlayBar;
}
