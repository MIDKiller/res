// JavaScript Document

var curFocus = 0;
var keyCheckTimer = null;
var urls = [{name:"电&nbsp;&nbsp;视",url:'dvbplay.html'},
 			{name:"广&nbsp;&nbsp播",url:'radio.html'},
            {name:"电视指南",url: 'epg.html'}, 
            {name:"系统设置",url: '../setting.html'},
            {name:"本地播放",url:'../localmedia/filebrowse.html'},
            {name:"邮&nbsp;&nbsp;件",url:'../email/email.html'}
           
            ];

function initSndTrack()
{
	var sndTrack;
	var trackChannel = System.getConfig("trackChannel", '0');
	if (trackChannel == '0')
	{
		sndTrack = DVBPlayer.getCurrentSndTrack();
		AvConfig.setSoundTrackDirect(sndTrack);
	}
	else
	{
		sndTrack = AvConfig.getSoundTrackMode();
		AvConfig.setSoundTrackMode(sndTrack);
	}
	//alert("mod="+trackChannel+"      track="+sndTrack);
}

function initVolume()
{
	var volume;
	var volumeChannel = System.getConfig("volumeChannel", '0');
	if (volumeChannel == '0')
	{
		volume = DVBPlayer.getCurrentVolume();
		AvConfig.setVolumeDirect(volume);
	}
	else
	{
		volume = AvConfig.getVolume();
		AvConfig.setVolume(volume);
	}
}

function moveFocus()
{
    var top = curFocus * 60 + 130;
    var obj = document.getElementById('menufocus');
    obj.style.top = top + 'px';
}

function onGoTV()
{
    window.location.href = urls[0].url;
}

function keyCheckTimeout()
{
    keyCheckTimer = null;
    var obj = document.getElementById('menu');
    obj.style.left = '-250px';
    setTimeout('onGoTV()', 800);
}

function startKeyCheckTimer()
{
    if (keyCheckTimer != null)
    {
        clearTimeout(keyCheckTimer);
        keyCheckTimer = null;
    }

    keyCheckTimer = setTimeout('keyCheckTimeout()', 5000);
}

function handleKey()
{
	startKeyCheckTimer();
	var keyCode = event.keyCode;
	switch (keyCode)
	{
	case DOWN:
		curFocus++;
		if (curFocus == urls.length)
			curFocus = 0;
		moveFocus();	
		break;
	case UP:
		curFocus--;
		if (curFocus < 0)
			curFocus = urls.length - 1;
		moveFocus();
		break;
	case ENTER:
		window.location.href = urls[curFocus].url;
		break;
	case EXIT:
	case RETURN:
		onGoTV();
		return false;
	case KEY_TV:
		onGoTV();
		break;
	default:
		break;
	}
}

function getCurrentChannelIndex()
{
    var channel = System.getConfig('curchan');
    if (channel != null && channel.length > 0)
        return parseInt(channel);
    return 1;
}

function showled(dstChanNum)
{
	if (dstChanNum > 99)
        FPanel.displayString("C"+dstChanNum);
	else if (dstChanNum > 9)
		FPanel.displayString("C0"+dstChanNum);
	else
		FPanel.displayString("C00"+dstChanNum);
}

function pageinit()
{
    window.onkeydown = handleKey;

    
    try {
    	var divTemp = null;
        var mainDiv = document.getElementById("menulist");
        if(mainDiv)
        {
        	for(var i =0;i < urls.length;i++)
        	{
        		divTemp = document.createElement("div");
        		divTemp.className = "menuitem";
        		divTemp.innerHTML = urls[i].name;
        		mainDiv.appendChild(divTemp);
        	}
        }
        
    	MediaPlayer.deinit();

    	DVB.init();
    	DVBPlayer.setChannel(getCurrentChannelIndex());
    	DVB.stopSearch(false);
    	DVBPlayer.stopEPGScan();

    	var channelCnt = DVBPlayer.getTVChanNum();
    	if (channelCnt > 0) {
    		var chanIndex = DVBPlayer.getCurrentTVChannel();
    		DVBPlayer.playTVChannel(chanIndex);
    		showled(chanIndex);
    		initVolume();
    		initSndTrack();
    		DVBPlayer.setTVVoutRect(0, 0, 1280, 720);
    	}
    } 
    catch (err)
    {
    	
    }

    var obj = document.getElementById('menu');
    obj.style.left = '0px';

    startKeyCheckTimer();
	
	loadAdPlayer(10001, 'advdiv', 500);
}
