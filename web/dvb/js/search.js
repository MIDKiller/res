// JavaScript Document

var DEFAULT_FREQ = 618;
var DEFAULT_BAUDRATE = 6875;
var DEFAULT_QAM = 64;

var curMenuFocus = 0; /* 当前选中的menu Index*/
var menuFocus = true; /* 当前焦点在menu？*/
var menuMoveTimer = null; /* menu 移动timer */
var MENUITEM = 5;
var isSearching = false;
var searchFinished = false;

/* manual search */
var curManualEditVFocus = 0;
var curManualEditHFocus = 0;
var manualEditTimer = null;
var curQamSel = 2;

/* search message defines */
var DSCAN_OK = 0;
var DSCAN_PROGRESS = 1;
var DSCAN_LOCKERR = 2;
var DSCAN_FREQ = 3;

/* freq set */
var curFreqEditVFocus = 0;
var curFreqEditHFocus = 0;
var freqEditTimer = null;
var curFreqQamSel = 2;
var showInfo = false;
var msgbox = null;

/*频道列表*/
var channelNum = 0;
var channelStr = '';

/* 清除频道 */
var isAsking = false;
var askDlg = null;

var gotoPlaying = false;

var QAM_ARRRY = new Array("16-QAM","32-QAM","64-QAM","128-QAM","256-QAM");

/* 控件状态 */
function setBtnFocus(isFocus, id)
{
	var obj = document.getElementById(id);
	if (obj == null)
		return;
		
	if (isFocus)
		obj.style.backgroundImage = "url('../img/focusText1.png')";
	else
		obj.style.backgroundImage = "url('../img/focusText0.png')";
}

/* fre set */

function getFreqConfig(name, defaultVlaue)
{
	var value = System.getConfig(name);
	if (value == null || value.length < 1)
		return defaultVlaue;
		
	var patrn = /^[0-9]{1,20}$/; //JS中关于数字的正则
	if (!patrn.test(value))
		return defaultVlaue;
	
	return parseInt(value);
}

function loadFreqSet()
{
	var obj;
	var i;
	var num;
	var qamNum = [16, 32, 64, 128, 256];
	var gFreq;
	var gBaut;
	var gQam;
	
	var freq = getFreqConfig('freq', DEFAULT_FREQ);
	gFreq = freq;
	for (i = 2; i >= 0; i--)
	{
		obj = document.getElementById('freqnum0' + i);
		num = freq % 10;
		freq = (freq - num) / 10;
		obj.innerHTML = num;
	}
	
	var baut = getFreqConfig('baudrate', DEFAULT_BAUDRATE);
	gBaut = baut;
	for (i = 3; i >= 0; i--)
	{
		obj = document.getElementById('freqnum1' + i);
		num = baut % 10;
		baut = (baut - num) / 10;
		obj.innerHTML = num;
	}
	
	var qam = getFreqConfig('qam', DEFAULT_QAM);
	gQam = qam;
	for (i = 0; i < qamNum.length; i++)
	{
		if (qamNum[i] == qam)
			break;
	}
	
	if (i == qamNum.length)
		i = 2;
	curFreqQamSel = i;
	obj = document.getElementById('freqqaminput');
	if (obj != null)
		obj.innerHTML = QAM_ARRRY[curFreqQamSel];

	DVB.setMainFreq(gFreq, gBaut, curFreqQamSel);
}

function saveFreqSet()
{
	var freq = 0;
	var baudrate = 0;
	var qam = 0;
	var qamNum = [16, 32, 64, 128, 256];
	
	var obj;
	var i;

	for (i = 0; i < 3; i++)
	{
		obj = document.getElementById('freqnum0' + i);
		freq = freq * 10 + parseInt(obj.innerHTML);
	}

	for (i = 0; i < 4; i++)
	{
		obj = document.getElementById('freqnum1' + i);
		baudrate = baudrate * 10 + parseInt(obj.innerHTML);
	}

	qam = qamNum[curFreqQamSel];
	
	System.setConfig('freq', freq);
	System.setConfig('baudrate', baudrate);
	System.setConfig('qam', qam);
	
	DVB.setMainFreq(freq, baudrate, curFreqQamSel);
}

function freqEditMoveTO()
{
	freqEditTimer = null;
	var obj = document.getElementById('freqnum' + curFreqEditVFocus + curFreqEditHFocus);
	if (obj == null)
		return;
	obj.style.color = '#9E511B';
}

function enableFreqEditFocus()
{
	showCtrl(true, 'freqeditfocus');
	freqEditMoveTO();
}

function disableFreqEditFocus()
{
	showCtrl(false, 'freqeditfocus');
	if (freqEditTimer != null)
		clearTimeout(freqEditTimer);
	freqEditTimer = null;
	var obj = document.getElementById('freqnum' + curFreqEditVFocus + curFreqEditHFocus);
	if (obj == null)
		return;
	obj.style.color = '#ffffff';
}

function clearFreqCurHFocus()
{
	var obj = document.getElementById('freqnum' + curFreqEditVFocus + curFreqEditHFocus);
	if (obj == null)
		return;
	obj.style.color = '#ffffff';
}

function changeFreqHFocus()
{
	var x;
	var y;
	var obj = document.getElementById('freqeditfocus');
	if (obj == null)
		return;
	
	switch (curFreqEditVFocus)
	{
	case 0:
		x = (curFreqEditVFocus * 65 + 17) + 'px';
		y = (curFreqEditHFocus * 30 + 391) + 'px';
		obj.style.display = '';
		break;
	case 1:
		x = (curFreqEditVFocus * 65 + 17) + 'px';
		y = (curFreqEditHFocus * 30 + 376) + 'px';
		obj.style.display = '';
		break;
	case 2:
		obj.style.display = 'none';
		break;
	default:
		return;
	}
	
	if (freqEditTimer != null)
		clearTimeout(freqEditTimer);
	freqEditTimer = null;
	
	freqEditTimer = setTimeout('freqEditMoveTO()', 300);
	
	obj.style.top = x;
	obj.style.left = y;
}

function changeFreqVFocus()
{
	var obj = document.getElementById('freqinputfocus');
	if (obj == null)
		return;
	obj.style.top = (curFreqEditVFocus * 65 + 12) + 'px';
	curFreqEditHFocus = 0;
	changeFreqHFocus();
}

function handleFreqNumInput(num)
{
	if (curFreqEditVFocus > 1)
		return;
		
	var obj = document.getElementById('freqnum' + curFreqEditVFocus + curFreqEditHFocus);
	if (obj == null)
		return;
	obj.innerHTML = (num - NUM_0);
	handleFreqScanKey(RIGHT);
}

function msgboxcb()
{
	msgbox.hide();
	showInfo = false;
}

function handleFreqScanKey(keyCode)
{
	if (showInfo == true)
	{
		msgbox.keyIn(keyCode);
		return false;
	}
	
	switch (keyCode)
	{
	case DOWN:
		clearFreqCurHFocus();
		if (curFreqEditVFocus == 2)
		{
			curFreqEditVFocus++;
			showCtrl(false, 'freqinputfocus');
			disableFreqEditFocus();
			setBtnFocus(true, 'freqsetbtn');
		}
		else if (curFreqEditVFocus == 3)
		{
			curFreqEditVFocus = 0;
			setBtnFocus(false, 'freqsetbtn');
			enableFreqEditFocus();
			showCtrl(true, 'freqinputfocus');
			changeFreqVFocus();
		}
		else
		{
			curFreqEditVFocus++;
			changeFreqVFocus();
		}
		break;
	case UP:
		clearFreqCurHFocus();
		if (curFreqEditVFocus == 0)
		{
			curFreqEditVFocus = 3;
			showCtrl(false, 'freqinputfocus');
			disableFreqEditFocus();
			setBtnFocus(true, 'freqsetbtn');
		}
		else if (curFreqEditVFocus == 3)
		{
			curFreqEditVFocus--;
			setBtnFocus(false, 'freqsetbtn');
			showCtrl(true, 'freqinputfocus');
			changeFreqVFocus();
		}
		else if (curFreqEditVFocus == 2)
		{
			curFreqEditVFocus--;
			enableFreqEditFocus();
			changeFreqVFocus();
		}
		else
		{
			curFreqEditVFocus--;
			changeFreqVFocus();
		}
		break;
	case LEFT:
		disableFreqEditFocus();
		setBtnFocus(false, 'freqsetbtn');
		showCtrl(false, 'freqinputfocus');
		menuFocus = true;
		showCtrl(true, 'bannerFocus');
		break;
	case RIGHT:
		clearFreqCurHFocus();
		if (curFreqEditVFocus < 1)
		{
			if (curFreqEditHFocus == 2)
				curFreqEditHFocus = 0;
			else
				curFreqEditHFocus++;
			changeFreqHFocus();
		}
		else if (curFreqEditVFocus < 2)
		{
			if (curFreqEditHFocus == 3)
				curFreqEditHFocus = 0;
			else
				curFreqEditHFocus++;
			changeFreqHFocus();
		}
		else if (curFreqEditVFocus == 2)
		{
			curFreqQamSel++;
			if (curFreqQamSel == QAM_ARRRY.length)
				curFreqQamSel = 0;
			var obj = document.getElementById('freqqaminput');
			if (obj == null)
				break;
			obj.innerHTML = QAM_ARRRY[curFreqQamSel];
		}
		break;
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
		handleFreqNumInput(keyCode);
		break;
	case ENTER:
		if (curFreqEditVFocus != 3)
			break;
		saveFreqSet();
		showInfo = true;
		if (msgbox == null)
			msgbox = new MessageBox();
		msgbox.popMessage('保存成功', '保存成功，按确认键返回', msgboxcb);
		break;
	case RETURN:
	case EXIT:
		goBackWithUrl('../setting.html?focus=0');
		return false;
	}
}

/* 处理手动搜索输入 */
function manualEditMoveTO()
{
	manualEditTimer = null;
	var obj = document.getElementById('num' + curManualEditVFocus + curManualEditHFocus);
	if (obj == null)
		return;
	obj.style.color = '#9E511B';
}

function enableEditFocus()
{
	showCtrl(true, 'editfocus');
	manualEditMoveTO();
}

function disableEditFocus()
{
	showCtrl(false, 'editfocus');
	if (manualEditTimer != null)
		clearTimeout(manualEditTimer);
	manualEditTimer = null;
	var obj = document.getElementById('num' + curManualEditVFocus + curManualEditHFocus);
	if (obj == null)
		return;
	obj.style.color = '#ffffff';
}

function clearCurHFocus()
{
	var obj = document.getElementById('num' + curManualEditVFocus + curManualEditHFocus);
	if (obj == null)
		return;
	obj.style.color = '#ffffff';
}

function changeManualHFocus()
{
	var x;
	var y;
	var obj = document.getElementById('editfocus');
	if (obj == null)
		return;
	
	switch (curManualEditVFocus)
	{
	case 0:
		x = (curManualEditVFocus * 65 + 17) + 'px';
		y = (curManualEditHFocus * 30 + 391) + 'px';
		obj.style.display = '';
		break;
	case 1:
		x = (curManualEditVFocus * 65 + 17) + 'px';
		y = (curManualEditHFocus * 30 + 376) + 'px';
		obj.style.display = '';
		break;
	case 2:
		obj.style.display = 'none';
		break;
	default:
		return;
	}
	
	if (manualEditTimer != null)
		clearTimeout(manualEditTimer);
	manualEditTimer = null;
	
	manualEditTimer = setTimeout('manualEditMoveTO()', 300);
	
	obj.style.top = x;
	obj.style.left = y;
}

function changeManualVFocus()
{
	var obj = document.getElementById('inputfocus');
	if (obj == null)
		return;
	obj.style.top = (curManualEditVFocus * 65 + 12) + 'px';
	curManualEditHFocus = 0;
	changeManualHFocus();
}

function handleNumInput(num)
{
	if (curManualEditVFocus > 1)
		return;
		
	var obj = document.getElementById('num' + curManualEditVFocus + curManualEditHFocus);
	if (obj == null)
		return;
	obj.innerHTML = (num - NUM_0);
	handleManualScanKey(RIGHT);
}

function startManualSearch()
{
	var freq = 0;
	var baudrate = 0;
	var qam = 0;
	var qamNum = [16, 32, 64, 128, 256];
	
	var obj;
	var i;

	for (i = 0; i < 3; i++)
	{
		obj = document.getElementById('num0' + i);
		freq = freq * 10 + parseInt(obj.innerHTML);
	}

	for (i = 0; i < 4; i++)
	{
		obj = document.getElementById('num1' + i);
		baudrate = baudrate * 10 + parseInt(obj.innerHTML);
	}

	qam = qamNum[curQamSel];

	if (DVB.startManualSearch(freq, baudrate, qam) == false)
		return;

	clearSeachrMsg();
	showCtrl(false, 'manualscan');
	showCtrl(true, 'scandiv');
	
	isSearching = true;
}

function handleManualScanKey(keyCode)
{
	if (isSearching == true)
	{
		if (keyCode == RETURN || keyCode == EXIT)
		{
			DVB.stopSearch(false);
			isSearching = false;
			searchFinished = true;
			showCtrl(true, 'manualscan');
			showCtrl(false, 'scandiv');
			return false;
		}
		return;
	}

	switch (keyCode)
	{
	case DOWN:
		clearCurHFocus();
		if (curManualEditVFocus == 2)
		{
			curManualEditVFocus++;
			showCtrl(false, 'inputfocus');
			disableEditFocus();
			setBtnFocus(true, 'manualscanbtn');
		}
		else if (curManualEditVFocus == 3)
		{
			curManualEditVFocus = 0;
			setBtnFocus(false, 'manualscanbtn');
			enableEditFocus();
			showCtrl(true, 'inputfocus');
			changeManualVFocus();
		}
		else
		{
			curManualEditVFocus++;
			changeManualVFocus();
		}
		break;
	case UP:
		clearCurHFocus();
		if (curManualEditVFocus == 0)
		{
			curManualEditVFocus = 3;
			showCtrl(false, 'inputfocus');
			disableEditFocus();
			setBtnFocus(true, 'manualscanbtn');
		}
		else if (curManualEditVFocus == 3)
		{
			curManualEditVFocus--;
			setBtnFocus(false, 'manualscanbtn');
			showCtrl(true, 'inputfocus');
			changeManualVFocus();
		}
		else if (curManualEditVFocus == 2)
		{
			curManualEditVFocus--;
			enableEditFocus();
			changeManualVFocus();
		}
		else
		{
			curManualEditVFocus--;
			changeManualVFocus();
		}
		break;
	case LEFT:
		disableEditFocus();
		setBtnFocus(false, 'manualscanbtn');
		showCtrl(false, 'inputfocus');
		menuFocus = true;
		showCtrl(true, 'bannerFocus');
		break;
	case RIGHT:
		clearCurHFocus();
		if (curManualEditVFocus < 1)
		{
			if (curManualEditHFocus == 2)
				curManualEditHFocus = 0;
			else
				curManualEditHFocus++;
			changeManualHFocus();
		}
		else if (curManualEditVFocus < 2)
		{
			if (curManualEditHFocus == 3)
				curManualEditHFocus = 0;
			else
				curManualEditHFocus++;
			changeManualHFocus();
		}
		else if (curManualEditVFocus == 2)
		{
			curQamSel++;
			if (curQamSel == QAM_ARRRY.length)
				curQamSel = 0;
			var obj = document.getElementById('qaminput');
			if (obj == null)
				break;
			obj.innerHTML = QAM_ARRRY[curQamSel];
		}
		break;
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
		handleNumInput(keyCode);
		break;
	case ENTER:
		if (curManualEditVFocus != 3)
			break;
		startManualSearch();
		break;
	case RETURN:
	case EXIT:
		goBackWithUrl('../setting.html?focus=0');
		return false;
	}
}

/* 处理清除屏道*/
function askCleanOk(sel)
{
	isAsking = false;
	askDlg.hide();
	askDlg = null;
	if (sel == true)
		DVB.clearChannel();
}

function handleClearChanKey(keyCode)
{
	switch (keyCode)
	{
	case ENTER:
		if (askDlg == null)
			askDlg = new AskDialog();
		askDlg.popDlg('清除频道', '确定删除所有频道？', askCleanOk);
		isAsking = true;
		break;
	case LEFT:
		if (isAsking == true)
		{
			askBoxKeyIn();
			break;
		}
		menuFocus = true;
		setBtnFocus(false, 'clschanbtn');
		showCtrl(true, 'bannerFocus');
		break;
	case RIGHT:
		if (isAsking == true)
		{
			askBoxKeyIn();
			break;
		}
		break;
	case RETURN:
	case EXIT:
		goBackWithUrl('../setting.html?focus=0');
		return false;
	default:
		break;
	}
	
	return true;
}

/* 处理自动搜索 */
function handleAutoScanKey(keyCode)
{
	switch (keyCode)
	{
	case ENTER:
		if (isSearching == true)
			break;
		
		var searchAll = false;
		searchFinished = false;
		if (curMenuFocus == 2)//全频搜索
			searchAll = true;
		if (DVB.startAutoSearch(searchAll) == false)
			break;
		isSearching = true;
		clearSeachrMsg();
		showCtrl(false, 'autoscan');
		showCtrl(true, 'scandiv');
		break;
	case LEFT:
		if (isSearching == true)
			break;
		
		menuFocus = true;
		setBtnFocus(false, 'autoscanbtn');
		showCtrl(true, 'bannerFocus');
		break;
	case RETURN:
	case EXIT:
		if (isSearching == false)
		{
			goBackWithUrl('../setting.html?focus=0');
			return false;
		}
		DVB.stopSearch(false);
		isSearching = false;
		searchFinished = true;
		showCtrl(true, 'autoscan');
		showCtrl(false, 'scandiv');
		return false;
	default:
		break;
	}
	
	return true;
}

/* 处理menu focus */
function changeMenuColor()
{
	var obj = document.getElementById('list' + curMenuFocus);
	
	obj.style.color = '#ffffff';
	menuMoveTimer = null;
	
	/* show function div */
	switch (curMenuFocus)
	{
	case 0:
		showCtrl(true, 'autoscan');
		showCtrl(false, 'manualscan');
		showCtrl(false, 'clschan');
		showCtrl(false, 'freqset');
		break;
	case 1:
		showCtrl(false, 'autoscan');
		showCtrl(true, 'manualscan');
		showCtrl(false, 'clschan');
		showCtrl(false, 'freqset');
		break;
	case 2:
		showCtrl(true, 'autoscan');
		showCtrl(false, 'manualscan');
		showCtrl(false, 'clschan');
		showCtrl(false, 'freqset');
		break;
	case 3:
		showCtrl(true, 'clschan');
		showCtrl(false, 'autoscan');
		showCtrl(false, 'manualscan');
		showCtrl(false, 'freqset');
		break;
	case 4:
		showCtrl(true, 'freqset');
		showCtrl(false, 'clschan');
		showCtrl(false, 'autoscan');
		showCtrl(false, 'manualscan');
		break;
	default:
		break;
	}
}

function moveMenuFocus(oldFocus)
{
	if (menuMoveTimer != null)
		clearTimeout(menuMoveTimer);
	menuMoveTimer = null;
	
	var obj = document.getElementById('bannerFocus');
	var topPx = curMenuFocus * 86 + 20;
	obj.style.top = topPx + 'px';
	menuMoveTimer = setTimeout("changeMenuColor()", 250);
	obj = document.getElementById('list' + oldFocus);
	obj.style.color = "gray";
}

/* 处理菜单按键*/
function handleMenuKey(keyCode)
{
	var oldFocus;
	switch (keyCode)
	{
	case UP:
		oldFocus = curMenuFocus;
		if (curMenuFocus == 0)
			curMenuFocus = MENUITEM - 1;
		else
			curMenuFocus--;
		moveMenuFocus(oldFocus);
		break;
	case DOWN:
		oldFocus = curMenuFocus;
		if (curMenuFocus == (MENUITEM - 1))
			curMenuFocus = 0;
		else
			curMenuFocus++;
		moveMenuFocus(oldFocus);
		break;
	case RIGHT:
		switch (curMenuFocus)
		{
		case 0:
		case 2:
			menuFocus = false;
			setBtnFocus(true, 'autoscanbtn');
			showCtrl(false, 'bannerFocus');
			break;
		case 1:
			menuFocus = false;
			showCtrl(false, 'bannerFocus');
			if (curManualEditVFocus < 2)
				enableEditFocus();
			if (curManualEditVFocus < 3)
				showCtrl(true, 'inputfocus');
			else
				setBtnFocus(true, 'manualscanbtn');
			break;
		case 3:
			menuFocus = false;
			setBtnFocus(true, 'clschanbtn');
			showCtrl(false, 'bannerFocus');
			break;
		case 4:
			menuFocus = false;
			showCtrl(false, 'bannerFocus');
			if (curFreqEditVFocus < 2)
				enableFreqEditFocus();
			if (curFreqEditVFocus < 3)
				showCtrl(true, 'freqinputfocus');
			else
				setBtnFocus(true, 'freqsetbtn');
			break;
		default:
			break;
		}
		break;
	case RETURN:
	case EXIT:
		goBackWithUrl('../setting.html?focus=0');
		return false;
	default:
		break;
	}
	
	return true;
}

/* 按键处理函数 */
function keyHandle()
{
	if (gotoPlaying == true)
		return true;
		
	var keyCode = event.keyCode;
	
	if (isAsking)
	{
		return askDlg.keyIn(keyCode);
	}
	
	if (menuFocus == true)
	{
		return handleMenuKey(keyCode);
	}
	
	switch (curMenuFocus)
	{
	case 0:
	case 2:
		return handleAutoScanKey(keyCode);
	case 1:
		return handleManualScanKey(keyCode);
	case 3:
		return handleClearChanKey(keyCode);
	case 4:
		return handleFreqScanKey(keyCode);
	default:
		break;
	}
	
	return true;
}

/* 搜索结果处理*/
function setSearchProgress(progress, tvnum, radionum, datanum)
{
	var obj = document.getElementById('procimg');
	if (obj == null)
		return;
		
	obj.style.width = parseInt(progress * 650 / 100) + 'px';

	obj = document.getElementById('tvnum');
	if (obj != null)
		obj.innerHTML = '电视：' + tvnum;
	obj = document.getElementById('radionum');
	if (obj != null)
		obj.innerHTML = '广播：' + radionum;
	obj = document.getElementById('ocnum');
	if (obj != null)
		obj.innerHTML = '资讯：' + datanum;
}

/* 搜索消息接收 */
function clearSeachrMsg()
{
	channelNum = 0;
	channelStr = '';
	var obj = document.getElementById('scanrst');
	obj.innerHTML = '';
	
	setSearchProgress(0, 0, 0, 0);
}

function onSearchChannelMsg(chanName)
{
	var obj = document.getElementById('scanrst');
	if (obj == null)
		return;
		
	if (channelNum < 7)
	{
		channelNum++;
		if (channelNum == 1)
			channelStr = chanName;
		else
			channelStr =  channelStr + '<br>' + chanName;
		obj.innerHTML = channelStr;
		return;
	}
	
	var index = channelStr.indexOf('<br>');
	channelStr = channelStr.substring(index + 4);
	channelStr =  channelStr + '<br>' + chanName;
	obj.innerHTML = channelStr;
}

function gotoPlayCB()
{
	DVBPlayer.setChannel(1);
	window.location.href='dvbplay.html';
}

function onSearchMsg(msg, param1, param2, param3, param4)
{
	switch (msg)
	{
	case DSCAN_OK:
		setSearchProgress(param1, param2, param3, param4);
		DVB.stopSearch(true);
		searchFinished = true;
		gotoPlaying = true;
		setTimeout('gotoPlayCB()', 1000);
		break;
	case DSCAN_PROGRESS:
		setSearchProgress(param1, param2, param3, param4);
		break;
	case DSCAN_LOCKERR:
		break;
	case DSCAN_FREQ:
		break;
	}
}

function pageuninit()
{
	DVB.scanSignal.disconnect(onSearchMsg);
	DVB.scanChannelSignal.disconnect(onSearchChannelMsg);
	if (askDlg != null)
		delete askDlg;
	if (msgbox != null)
		delete msgbox;
		
	delete QAM_ARRRY;
}

function initout()
{
	handleMenuKey(RIGHT);
	handleAutoScanKey(ENTER);
}

function pageinit()
{
	DVB.init();
	var obj = document.getElementById('bannerFocus');
	obj.style.top = (curMenuFocus * 86 + 20) + 'px';

	FPanel.displayString("scan");
	window.onkeydown = keyHandle;
	loadFreqSet();
	//DVB.init();
	//DVBPlayer.stop();
	DVB.scanSignal.connect(onSearchMsg);
	DVB.scanChannelSignal.connect(onSearchChannelMsg);
	
	var param = new Parameter();
	var auto = param.getParamInt('auto');
	
	if (auto != null && auto == 1)
	{
		setTimeout('initout()', 500);
	}
}
