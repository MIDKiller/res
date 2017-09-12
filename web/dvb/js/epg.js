// JavaScript Document

var listCurFocus = 0;
var channelCnt = 0;
var topChanIndex = 1;
var dayFocus = 0;

var chanSelTimer = null;
var daySelTimer = null;
var epgTimer = null;
var epgArray = null;
var epgPage = 0;
var epgFocusIndex = 0;

var weekDayArray = ['周日','周一','周二','周三','周四','周五','周六'];

/* 声音控制 */
var volumeChannel = 0;
var trackChannel = 0;

function initSndTrack()
{
	var sndTrack;
	if (trackChannel == '0')
	{
		sndTrack = DVBPlayer.getCurrentSndTrack();
		AvConfig.setSoundTrackDirect(sndTrack);
		return sndTrack;
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
}

function clearEpgTimer()
{
	if (epgTimer != null)
	{
		clearTimeout(epgTimer);
		epgTimer = null;
	}
}

function epgTimeout()
{
	daySelTimer = null;
	showEpg();
}

function startEpgTimer()
{
	clearDaySelTimer();
	daySelTimer = setTimeout('epgTimeout()', 1000);
}

function daySelTimeout()
{
	daySelTimer = null;
	resetEpg();
	showEpg();
}

function clearDaySelTimer()
{
	if (daySelTimer != null)
	{
		clearTimeout(daySelTimer);
		daySelTimer = null;
	}
}

function startDaySelTimer()
{
	clearDaySelTimer();
	daySelTimer = setTimeout('daySelTimeout()', 600);
}

function updateTimeBar()
{
	var date = new DateTime();
	var tmp;
	var html = date.getYear() + '-';
	tmp = date.getMonth();
	if (tmp < 10)
		html += '0';
	html += tmp;
	
	html += '-';
	tmp = date.getMDay();
	if (tmp < 10)
		html += '0';
	html += tmp;
	
	html += '&nbsp;';
	
	tmp = date.getHour();
	if (tmp < 10)
		html += '0';
	html += tmp;
	
	html += ':';
	tmp = date.getMinute();
	if (tmp < 10)
		html += '0';
	html += tmp;
	
	var obj = document.getElementById('datetimebar');
	obj.innerHTML = html;
	
	delete date;
}

function moveEpgFocus()
{
	var obj = document.getElementById('epgfocus');
	obj.style.top = (426 + epgFocusIndex * 38) + 'px';
}

function showEpgLines()
{
	var i = 0;
	var index = epgPage * 5;
	var obj;
	var html;
	var lineArray;
	
	if (epgArray == null)
		return;
		
	showCtrl(true, 'epgfocus');
	
	for (i = 0; i < 5 && index < epgArray.length; i++, index++)
	{
		obj = document.getElementById('epglist' + i);
		lineArray = epgArray[index];
		html = getTimeStrFromInt(lineArray['start']);
		html += '--';
		html += getTimeStrFromInt(lineArray['end']);
		html += '&nbsp;&nbsp;';
		html += lineArray['name'];
		obj.innerHTML = html;
		showCtrl(lineArray['subscribe'], 'sub' + i);
	}
	
	if (epgFocusIndex >= i)
	{
		epgFocusIndex = i - 1;
		moveEpgFocus();
	}
	
	for (; i < 5; i++)
	{
		obj = document.getElementById('epglist' + i);
		obj.innerHTML = '';
		showCtrl(false, 'sub' + i);
	}
}

function dosubscribe()
{
	var subscribe = false;
	if (epgArray == null)
		return;
		
	var index = epgPage * 5 + epgFocusIndex;
	subscribe = epgArray[index]['subscribe'];
	subscribe = !subscribe;
	if (subscribe)
	{
		if (DVBPlayer.subscribe(epgArray[index]['id'], epgArray[index]['startsec']) == 1)
		{
			epgArray[index]['subscribe'] = subscribe;
			showCtrl(subscribe, 'sub' + epgFocusIndex);
		}
	}
	else
	{
		if (DVBPlayer.cancelSubscribe(epgArray[index]['id']))
		{
			epgArray[index]['subscribe'] = subscribe;
			showCtrl(subscribe, 'sub' + epgFocusIndex);
		}
	}
}

function epgSelUp()
{
	if (epgArray == null)
		return;
		
	if (epgFocusIndex > 0)
	{
		epgFocusIndex--;
		moveEpgFocus();
		return;
	}
	
	if (epgPage == 0)
		return;
		
	epgPage--;
	epgFocusIndex = 4;
	showEpgLines();
	moveEpgFocus();
}

function epgSelDown()
{
	var index = epgPage * 5 + epgFocusIndex;
	if (epgArray == null || index >= (epgArray.length - 1))
		return;
	if (epgFocusIndex < 4)
	{
		epgFocusIndex++;
		moveEpgFocus();
		return;
	}
	epgPage++;
	epgFocusIndex = 0;
	showEpgLines();
	moveEpgFocus();
}

function resetEpg()
{
	epgArray = null;
	epgPage = 0;
	epgFocusIndex = 0;
	showCtrl(false, 'epgfocus');
	moveEpgFocus();
}

function showEpg()
{
	var i;
	var obj;
	
	for (i = 0; i < 5; i++)
	{
		obj = document.getElementById('epglist' + i);
		obj.innerHTML = '';
		showCtrl(false, 'sub' + i);
	}
	
	epgArray = DVBPlayer.getEPGInJSON(topChanIndex + listCurFocus, dayFocus);
	
	if (epgArray == null || epgArray.length == 0)
	{
		showCtrl(true, 'waitinfo');
		showCtrl(false, 'epgfocus');
		epgFocusIndex = 0;
		startEpgTimer();
		return;
	}
	
	showCtrl(false, 'waitinfo');
	showEpgLines();
	startEpgTimer();
}

function chanSelTimeout()
{
	chanSelTimer = null;
	dayFocus = 0;
	DVBPlayer.playTVChannel(topChanIndex + listCurFocus);
	var obj;
	obj = document.getElementById('dayfocus');
	obj.style.left = (dayFocus * 151 + 112) + 'px'
	resetEpg();
	showEpg();
	
	initSndTrack();
	initVolume();
}

function startChanSelTimer()
{
	if (chanSelTimer != null)
	{
		clearTimeout(chanSelTimer);
		chanSelTimer = null;
	}
	chanSelTimer = setTimeout('chanSelTimeout()', 600);
}

function refreshChannelList()
{
	var i;
	var index = topChanIndex;
	var obj;
	var channame;
	
	for (i = 0; i < 4 && index <= channelCnt; i++, index++)
	{
		obj = document.getElementById('channame' + i);
		channame = DVBPlayer.getTVChannelDetail(index).name;
		if (channame == null || channame.length == 0)
			channame = '频道' + index;
		obj.innerHTML = channame;
	}
}

function dealKeyDown()
{
	var obj;
	
	if ((topChanIndex + listCurFocus) == channelCnt)
		return;
	
	if (listCurFocus < 3)
	{
		listCurFocus++;
		obj = document.getElementById('chanfocus');
		obj.style.top = (178 + listCurFocus * 45) + 'px';
		startChanSelTimer();
		return;
	}
	
	if ((topChanIndex + 3)  < channelCnt)
	{
		topChanIndex++;
		startChanSelTimer();
		refreshChannelList();
	}
}

function dealKeyUp()
{
	var obj;
	if (listCurFocus > 0)
	{
		listCurFocus--;
		obj = document.getElementById('chanfocus');
		obj.style.top = (178 + listCurFocus * 45) + 'px';
		startChanSelTimer();
		return;
	}
	
	if (topChanIndex > 1)
	{
		topChanIndex--;
		startChanSelTimer();
		refreshChannelList();
	}
}

function dealDayChange(left)
{
	if (left == true)
	{
		dayFocus--;
		if (dayFocus < 0)
			dayFocus = 6;
	}
	else
	{
		dayFocus++;
		if (dayFocus > 6)
			dayFocus = 0;
	}
	
	var obj;
	obj = document.getElementById('dayfocus');
	obj.style.left = (dayFocus * 151 + 112) + 'px'
	startDaySelTimer();
}

function changeEpgPage()
{
	if (channelCnt <= 0)
		return;
	var oldPage = epgPage;
	if (epgArray == null)
		return;
	
	epgPage++;
	if ((epgPage * 5) >= epgArray.length)
		epgPage = 0;
		
	if (oldPage == epgPage)
		return;
	
	epgFocusIndex = 0;
	moveEpgFocus();
	
	showEpgLines();
}
function upEpgPage()
{
    if(channelCnt <= 0)
        return;
    var oldPage = epgPage;
    if (epgArray == null)
        return;

    epgPage--;
    if(epgPage <= 0)
        epgPage = 0;
    if (oldPage == epgPage)
        return;
		
	epgFocusIndex = 0;
	moveEpgFocus();
	
    showEpgLines();

}

function handleKey()
{
	var keyCode = event.keyCode;
	switch (keyCode)
	{
	case LEFT:
		if (channelCnt <= 0)
			break;
		dealDayChange(true);
		break;
	case RIGHT:
		if (channelCnt <= 0)
			break;
		dealDayChange(false);
		break;
	case UP:
		if (channelCnt <= 0)
			break;
		dealKeyUp();
		break;
	case DOWN:
		if (channelCnt <= 0)
			break;
		dealKeyDown();
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
		break;
	case UpPage:
        if (channelCnt <= 0)
            break;
        upEpgPage();
        break;
	case DownPage:
		if (channelCnt <= 0)
			break;
		changeEpgPage();
		break;
	case KEY_TV:
		window.location.href = 'dvbplay.html';
		break;
	case ENTER:
		if (channelCnt <= 0)
			break;
		window.location.href = 'dvbplay.html';
		break;
	case RETURN:
	case EXIT:
		goBackWithUrl('menu.html');
		return true;
	case YELLOW:
		epgSelUp();
		break;
	case BLUE:
		epgSelDown();
		break;
	case GREEN:
		dosubscribe();
		break;
	default:
		break;
	}
}

function initWeekDay()
{
	var i;
	var obj;
	
	var date = new DateTime();
	var weekDay = date.getWDay();
	
	for (i = 0; i < 7; i++)
	{
		obj = document.getElementById('day' + i);
		obj.innerHTML = weekDayArray[weekDay];
		weekDay++;
		if (weekDay > 6)
			weekDay = 0;
	}
	delete date;
}

function pageinit()
{
	window.onkeydown = handleKey;
	DVB.init();
	
	DVB.stopSearch(false);
	channelCnt = DVBPlayer.getTVChanNum();
	initWeekDay();
	
	volumeChannel = System.getConfig("volumeChannel", "0");
	trackChannel = System.getConfig("trackChannel", "0");
	
	if (channelCnt > 0)
	{
		/* set to current channel */
		var tvChannel = DVBPlayer.getCurrentTVChannel();
		if (tvChannel > channelCnt)
			tvChannel = 1;
			
		if (channelCnt < 4)
		{
			topChanIndex = 1;
			listCurFocus = tvChannel - topChanIndex;
			var obj = document.getElementById('chanfocus');
			obj.style.top = (178 + listCurFocus * 45) + 'px';
		}
		else
		{
			topChanIndex = tvChannel;
			if ((channelCnt - topChanIndex) < 3)
				topChanIndex = channelCnt - 3;
			listCurFocus = tvChannel - topChanIndex;
			var obj = document.getElementById('chanfocus');
			obj.style.top = (178 + listCurFocus * 45) + 'px';
		}
		
		DVBPlayer.playTVChannel(topChanIndex + listCurFocus);
		DVBPlayer.setTVVoutRect(99, 138, 381, 215);
		showEpg();
	}
	
	refreshChannelList();
	updateTimeBar();
	setInterval('updateTimeBar()', 3000);
	
	FPanel.displayString(" EP9");
	
	loadAdPlayer(10006, 'advdiv', 500);
}
