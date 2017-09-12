// JavaScript Document

var adTimer = null;

function getNetWorkStatus()
{
	return Lan && Lan.getNetConnectStatus() || WLan && WLan.getNetConnectStatus();
}

function adloadchech()
{
	if (getNetWorkStatus())
	{
		clearInterval(adTimer);
		adTimer = null;
		loadAdPlayer(10000, 'ad', 0);
	}
}

function configTimeout()
{
	if (getNetWorkStatus())
		HiBox.setMainFrame({location:"main"});
	else
		HiBox.setMainFrame({location:"default"});
}

function showStartNotity()
{
    document.getElementById("update").style.display = "inline";
}

function keyHandle()
{
	var keyCode = event.keyCode;
	return false;
}

function pageinit()
{
	window.onkeydown = keyHandle;
	var obj = document.getElementById('ad');
	if (File.exist('/home/poweronpic'))
	{
		obj.innerHTML = '<img id="poweronimg" width="1280" height="720" src="ui://home/poweronpic" />';
	}
	else
	{
		obj.innerHTML = '<img id="poweronimg" width="1280" height="720" src="img/init_bg.jpg" />';
	}
	
	HiBox.init();
/*	
	System.debug("MDEBUG 00000000000");
	//TEST
	//alert()
	eventFrame.setTimeout(function()
		{
			System.debug("MDEBUG 2222222222");
			HiBox.setOverlayFrame({visible:"true",location:"ui:/submsg.html"});
			//HiBox.setOverlayFrame({visible:"true"});
			//overlayFrame.location.href = "ui:/submsg.html";
			System.debug("MDEBUG 3333333333333333");
		}
		,2000
	)
	System.debug("MDEBUG xxxxxxx00000000000");
*/	
	setTimeout('configTimeout()', 6000);
	adTimer = setInterval('adloadchech()', 300);
}
