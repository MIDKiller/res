// JavaScript Document
var div_update = null;
var max_width;
var max_height;
var edge_length = 24

function getNetWorkStatus()
{
	return Lan && Lan.getNetConnectStatus() || WLan && WLan.getNetConnectStatus();
}

function keyHandle()
{
	//any key press TODO
	if (getNetWorkStatus())
		HiBox.setMainFrame({location:"default"});
	else
		window.location.href = 'dvb/menu.html';
	
	return false;
}
function timeout()
{
	try {
		var top = parseInt(Math.random() * max_height) ;
		var left = parseInt(Math.random() * max_width) ;
		div_update.style.top = top + edge_length + "px";
		div_update.style.left = left + edge_length + "px";
//		alert("postion:"+left+","+top+":"+max_width);
	} catch (e) {
		// TODO: handle exception
		alert('error:'+e);
	}
	
}

function pageinit()
{
	HiBox.init();
	setTimeout('server()', 100);
	setInterval('timeout()', 3200);
	window.onkeydown = keyHandle;
	div_update = document.getElementById("update");
	
	max_width = 1280 - edge_length * 2 - div_update.offsetWidth ;
	max_height = 720 - edge_length * 2 - div_update.offsetHeight;
}
