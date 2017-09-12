// JavaScript Document

var menuFocus = 0;
var isAsking = false;
var askDlg = new AskDialog();
var powerTime = [3, 4, 5, 6, 7, 8, 100000];
var powerIndex = 5;

function askCB(sel)
{
	if (sel == false) {
		askDlg.hide();
		isAsking = false;
		return;
	}
	
	askDlg.hide();
	isAsking = false;
	
	DVB.clearChannel();
	AvConfig.setDefault();
	WLan.setDefault();
	Lan.setDefault();
	System.setDefault();
}

function changePower(left)
{
	if (left)
	{
		powerIndex--;
		if (powerIndex < 0)
			powerIndex = powerTime.length - 1;
	}
	else
	{
		powerIndex++;
		if (powerIndex >= powerTime.length)
			powerIndex = 0;
	}
	
	System.setConfig('standbyTime', powerTime[powerIndex]);
	if (powerTime[powerIndex] == 100000)
		document.getElementById('powerctrl').innerHTML = '关闭';
	else
		document.getElementById('powerctrl').innerHTML = powerTime[powerIndex] + '小时';
}

function moveFocus(up)
{
	if (up)
	{
		if (menuFocus == 0)
			return;
		
		menuFocus--;
	}
	else
	{
		if (menuFocus == 1)
			return;
		
		menuFocus++;
	}
	
	document.getElementById('bannerFocus').style.top = (30 + menuFocus * 68) + 'px';
	if (menuFocus == 1)
	{
		showCtrl(false, 'showpanel');
		showCtrl(true, 'powerset');
	}
	else
	{
		showCtrl(false, 'powerset');
		showCtrl(true, 'showpanel');
	}
}

function keyHandle()
{
	var keyCode = event.keyCode;
	askDlg.baseImg = 'img/';
	
	if (isAsking == true) {
		return askDlg.keyIn(keyCode);
	}
	
	switch (keyCode) {
	case RETURN:
	case EXIT:
		window.location.href = 'setting.html?focus=4';
		return false;
	case ENTER:
		if (menuFocus == 1)
			break;
		askDlg.popDlg("恢复默认", "确认要恢复默认设置？", askCB);
		isAsking = true;
		break;
	case UP:
		moveFocus(true);
		break;
	case DOWN:
		moveFocus(false);
		break;
	case LEFT:
		if (menuFocus == 0)
			break;
		changePower(true);
		break;
	case RIGHT:
		if (menuFocus == 0)
			break;
		changePower(false);
		break;
	}
}

function pageinit()
{
	try {
		var hour = parseInt(System.getConfig('standbyTime', 8));
		for (powerIndex = 0; powerIndex < powerTime.length; powerIndex++)
		{
			if (powerTime[powerIndex] == hour)
				break;
		}
		
		if (powerIndex ==  powerTime.length)
			powerIndex =  powerTime.length - 1;
	} catch (err) {
		powerIndex = 5;
	}
	if (powerTime[powerIndex] == 100000)
		document.getElementById('powerctrl').innerHTML = '关闭';
	else
		document.getElementById('powerctrl').innerHTML = powerTime[powerIndex] + '小时';

	
	window.onkeydown = keyHandle;	
}