// JavaScript Document


var WIFI_CLOSING = 0;
var WIFI_CLOSED = 1;
var WIFI_OPENNING = 2;
var WIFI_OPENED = 3;
var WIFI_LINKING = 4;
var WIFI_IPCFGING = 5;
var WIFI_CONNECTED = 6;
var WIFI_DISCONNECT = 7;
		
//var wifiOpen = false;
var devName = null;

var funcFocusIndex = 0;
var funcFocus = 0;//0: 焦点在按钮上， 1： 焦点在AP list  2： 焦点在密码输入 3: 焦点在对话框

var apTopIndex = 0;
var apFocusIndex = 0;
var apListArray = null;
//var wifiStatus = -1;
//var wifiIn = false;
//var wifiTimer = null;

var inputFocus = 0;
var charFocus = 0;
var currentCharSel = 0;
var inputKeys = '';
var chars = [
				['1', '.', ','],
				['2','a','b','c','A','B','C'],
				['3','d','e','f','D','E','F'],
				['4','g','h','i','G','H','I'],
				['5','j','k','l','J','K','L'],
				['6','m','n','o','M','N','O'],
				['7','p','q','r','s','P','Q','R','S'],
				['8','t','u','v','T','U','V'],
				['9','w','x','y','z','W','X','Y','Z']
		];
	
var msgBox = null;

function changeText(id, text)
{
	var obj = document.getElementById(id);
	obj.innerHTML = text;
}

function focusBtn(id, isFocus)
{
	var obj = document.getElementById(id);
	
	if (isFocus == true)
	{
		obj.style.backgroundImage = 'url(img/focusText1.png)';
	}
	else
	{
		obj.style.backgroundImage = 'url(img/focusText0.png)';
	}
}

function showWifiOpen(ing)
{
	var obj = document.getElementById('selbox');
	obj.style.backgroundImage = 'url(img/seleIco.png)';
	
	changeText('enabletext', '无线开关');
	
	if (ing == false)
	{
		showCtrl(true, 'serachbtn');
		showCtrl(true, 'setbtn');
	}
}

function showWifiClose()
{
	var obj = document.getElementById('selbox');
	obj.style.backgroundImage = 'url(img/seleNoneIco.png)';
	
	changeText('enabletext', '无线开关');
	
	showCtrl(false, 'serachbtn');
	showCtrl(false, 'setbtn');
	
	funcFocus = 0;
	funcFocusIndex = 0;
	

	showCtrl(true, 'selboxfocus');
	focusBtn('serachbtn', false);
	focusBtn('setbtn', false);
}

function showApListFocus()
{
	
}

function focusWifiEnable(enable)
{
	var obj = document.getElementById('selboxfocus');
	
	if (enable == true)
	{
		obj.style.display = '';
	}
	else
	{
		obj.style.display = 'none';
	}
}

function refreshApList()
{
	var i;
	var index = 0;
	var obj;
	var ap;
	
	if (apListArray != null)
	{
		for (i = apTopIndex; i < (apTopIndex + 7) && i < apListArray.length; i++)
		{
			ap = apListArray[i];
			obj = document.getElementById('ap' + index);
			obj.innerHTML = ap['essid'];
			index++;
		}
	}
	
	for (; index < 7; index++)
	{
		obj = document.getElementById('ap' + index);
		obj.innerHTML = '&nbsp;';
	}
	
	if (apListArray == null || apListArray.length == 0)
	{
		obj = document.getElementById('ap2');
		obj.innerHTML = '&nbsp&nbsp;没有搜索到无线网络';
	}
}

function startSearch()
{
	apListArray = null;	
	apTopIndex = 0;
	apFocusIndex = 0;
	
	var obj;
	for (var index = 0; index < 7; index++)
	{
		obj = document.getElementById('ap' + index);
		if (index == 2)
			obj.innerHTML = '&nbsp;正在搜索....';
		else
			obj.innerHTML = '&nbsp;';
	}
	WLan.scanning();
}

function startConnect(key)
{
	showCtrl(false, 'keyinput');
	funcFocus = 1;
	if (apListArray == null || apListArray.length <= apFocusIndex)
		return;
	
	WLan.connectAP(apListArray[apFocusIndex]['essid'], key);
}

function dealAPFocus(keyCode)
{
	switch (keyCode)
	{
	case EXIT:
	case RETURN:
		window.location.href = 'setting.html?focus=3';
		return false;
	case ENTER:
		if (apListArray == null || apListArray.length == 0)
			break;
		/* TODO none key */
		funcFocus = 2;
		initKeyInput();
		break;
	case DOWN:
		if (apListArray == null || apListArray.length == 0 || apFocusIndex == (apListArray.length - 1))
			break;
			
		if ((apFocusIndex - apTopIndex) < 6)
		{
			apFocusIndex++;
			var obj = document.getElementById('apfocus');
			obj.style.top = ((apFocusIndex - apTopIndex) * 50 + 263) + 'px';
			break;
		}
		
		apFocusIndex++;
		apTopIndex++;
		refreshApList();
		break;
	case UP:
		if (apListArray == null || apListArray.length == 0 || apFocusIndex == 0)
		{
			funcFocus = 0;
			showCtrl(false, 'apfocus');
		
			switch (funcFocusIndex)
			{
			case 0:
				showCtrl(true, 'selboxfocus');
				break;
			case 1:
				focusBtn('serachbtn', true);
				break;
			case 2:
				focusBtn('setbtn', true);
				break;
			}
			break;
		}
		
		if (apFocusIndex > apTopIndex)
		{
			apFocusIndex--;
			var obj = document.getElementById('apfocus');
			obj.style.top = ((apFocusIndex - apTopIndex) * 50 + 263) + 'px';
			break;
		}
		
		apFocusIndex--;
		apTopIndex--;
		refreshApList();
		break;
	default:
		break;
	}
}

function dealFuncFocus(keyCode)
{
	switch (keyCode)
	{
	case EXIT:
	case RETURN:
		window.location.href = 'setting.html?focus=3';
		return false;
	case DOWN:
		if (apListArray == null || apListArray.length == 0)
			break;
			
		var status = WLan.getCurrStatus();
		if (status == WIFI_CLOSED || status == WIFI_CLOSING)
			break;
		funcFocus = 1;
		showCtrl(true, 'apfocus');

		focusBtn('serachbtn', false);
		focusBtn('setbtn', false);
		showCtrl(false, 'selboxfocus');
		break;
	case ENTER:
		if (funcFocusIndex == 0)
		{
			var status = WLan.getCurrStatus();
			if (status != WIFI_CLOSED && status != WIFI_CLOSING)
			{
				WLan.close();
			}
			else if (status == WIFI_CLOSED)
			{
				WLan.open();
			}
		}
		else if (funcFocusIndex == 1)
		{
			startSearch();
		}
		break;
	case LEFT:		
		var status = WLan.getCurrStatus();
		if (status == WIFI_CLOSED || status == WIFI_CLOSING)
			break;
		
		if (funcFocusIndex == 2)
		{
			focusBtn('setbtn', false);
			focusBtn('serachbtn', true);
			funcFocusIndex = 1;
		}
		else if (funcFocusIndex == 1)
		{
			focusBtn('serachbtn', false);
			showCtrl(true, 'selboxfocus');
			funcFocusIndex = 0;
		}
		
		break;
	case RIGHT:			
		var status = WLan.getCurrStatus();
		if (status == WIFI_CLOSED || status == WIFI_CLOSING)
			break;
			
		if (funcFocusIndex == 0)
		{
			showCtrl(false, 'selboxfocus');
			focusBtn('serachbtn', true);
			funcFocusIndex = 1;
		}
		else if (funcFocusIndex == 1)
		{
			focusBtn('serachbtn', false);
			focusBtn('setbtn', true);
			funcFocusIndex = 2;
		}
		break;
	default:
		break;
	}
}

/* key input */
function initKeyInput()
{
	inputKeys = WLan.getPasswd();
		
	var obj = document.getElementById('inputedit');
	obj.innerHTML = inputKeys;
	
	focusBtn('inputokbtn', false);
	focusEdit('inputedit', true);
	
	showCtrl(true, 'keyinput');
	inputFocus = 0;
}

function showCharSel(keyCode)
{	
	var obj;
	var index;
	currentCharSel = keyCode - NUM_1;
	var array = chars[currentCharSel];
	var obj;
	for (index = 0; index < array.length; index++)
	{
		obj = document.getElementById('c' + index);
		obj.innerHTML = array[index];
	}
	
	for (; index < 9; index++)
	{
		obj = document.getElementById('c' + index);
		obj.innerHTML = '';
	}
	
	charFocus = 0;
	obj = document.getElementById('charfocus');
	obj.style.left = '10px';
}

function changeCharSel(left)
{
	if (left == true)
	{
		charFocus--;
		if (charFocus < 0)
			charFocus = chars[currentCharSel].length - 1;
	}
	else
	{
		charFocus++;
		if (charFocus == chars[currentCharSel].length )
			charFocus = 0;
	}
	
	obj = document.getElementById('charfocus');
	obj.style.left = (10 + charFocus * 50) + 'px';
}

function focusEdit(id, isFocus)
{
	var obj = document.getElementById(id);
	if (isFocus == true)
	{
		obj.style.borderColor = '#F93';
	}
	else
	{
		obj.style.borderColor = '#CCC';
	}
}

function dealKeyInput(keyCode)
{
	switch (keyCode)
	{
	case RETURN:
		if (inputFocus == 1)
		{
			inputFocus = 0;
			showCtrl(false, 'charsel');
		}
		else if (inputFocus == 0)
		{
			if (inputKeys.length > 0)
			{
				inputKeys = inputKeys.substring(0, inputKeys.length - 1);
				var obj = document.getElementById('inputedit');
				obj.innerHTML = inputKeys;
			}
		}
		return false;
	case EXIT:
		showCtrl(false, 'keyinput');
		funcFocus = 1;
		return false;
	case LEFT:
		if (inputFocus == 1)
		{
			changeCharSel(true);
		}
		else if (inputFocus == 2)
		{
			inputFocus = 0;
			focusBtn('inputokbtn', false);
			focusEdit('inputedit', true);
		}
		break;
	case RIGHT:
		if (inputFocus == 1)
		{
			changeCharSel(false);
		}
		else if (inputFocus == 0)
		{
			inputFocus = 2;
			focusBtn('inputokbtn', true);
			focusEdit('inputedit', false);
		}
		break;
	case ENTER:
		if (inputFocus == 1)
		{
			inputFocus = 0;
			inputKeys = inputKeys + chars[currentCharSel][charFocus];
			var obj = document.getElementById('inputedit');
			obj.innerHTML = inputKeys;
			showCtrl(false, 'charsel');
		}
		else if (inputFocus == 2)
		{
			/* TODO start connect */
			startConnect(inputKeys);
		}
		break;
	case NUM_0:
		if (inputFocus == 1 || inputFocus == 0)
		{
			inputFocus = 0;
			inputKeys = inputKeys + '0';
			var obj = document.getElementById('inputedit');
			obj.innerHTML = inputKeys;
			showCtrl(false, 'charsel');
		}
		break;
	case NUM_1:
	case NUM_2:
	case NUM_3:
	case NUM_4:
	case NUM_5:
	case NUM_6:
	case NUM_7:
	case NUM_8:
	case NUM_9:
		if (inputFocus == 0)
		{
			inputFocus = 1;
			showCharSel(keyCode);
			showCtrl(true, 'charsel');
		}
		else if (inputFocus == 1)
		{
			showCharSel(keyCode);
		}
		break;
	}
}
/* key input end */

function keyEventHandle()
{
	var keyCode = event.keyCode;
	
	switch (funcFocus)
	{
	case 0:
		return dealFuncFocus(keyCode);
	case 1:
		return dealAPFocus(keyCode);
	case 2:
		return dealKeyInput(keyCode);
	case 3:
		if (keyCode == EXIT || keyCode == RETURN)
		{
			window.location.href = 'setting.html?focus=3';
			return false;
		}
		break;
	}
	return false;
}

function wifiStatusReport(wifiStatus)
{	
	//System.debug(wifiStatus);
	switch (wifiStatus)
	{
	case WIFI_CLOSING:
		changeText('iwstatus', '正在关闭连接...');
		changeText('iwenable', '关闭');
		showWifiClose();
		break;
	case WIFI_CLOSED:
		changeText('iwstatus', '已关闭');
		changeText('iwenable', '关闭');
		showWifiClose();
		break;
	case WIFI_OPENNING:
		changeText('iwstatus', '正在开启连接...');
		changeText('iwenable', '开启');
		showWifiOpen(true);
		break;
	case WIFI_OPENED:
		changeText('iwstatus', '未连接网络');
		changeText('iwenable', '开启');
		showWifiOpen(false);
		break;
	case WIFI_LINKING:
		changeText('iwstatus', '正在连接网络...');
		changeText('iwenable', '开启');
		showWifiOpen(false);
		break;
	case WIFI_IPCFGING:
		changeText('iwstatus', '配置网络地址...');
		changeText('iwenable', '开启');
		showWifiOpen(false);
		break;
	case WIFI_CONNECTED:
		changeText('iwstatus', '已连接');
		changeText('iwenable', '开启');
		showWifiOpen(false);
		changeText('iwip', formatAddress(WLan.getAddress(devName)));
		changeText('iwnetmask', formatAddress(WLan.getNetmask(devName)));
		changeText('iwgw', formatAddress(WLan.getGateway(devName)));
		changeText('iwdns', formatAddress(WLan.getDNS()));
		break;
	case WIFI_DISCONNECT:
		changeText('iwstatus', '连接网络失败');
		changeText('iwenable', '开启');
		showWifiOpen(false);
		break;
	default:
		break;
	}
	
	changeText('iwessid', WLan.getEssid());
	//devName = WLan.getDevName();
	if (WLan.isDhcp(devName) == true)
	{
		changeText('iwdhcp', '自动获取地址');
	}
	else
	{
		changeText('iwdhcp', '静态地址');
	}	
}

function onWifiSearched(result)
{
	apListArray = result;
	apTopIndex = 0;
	apFocusIndex = 0;
	
	refreshApList();
}

function wifiInit()
{
	//wifiStatusTimeout();
	
	var status = WLan.getCurrStatus();
	wifiStatusReport(status);

	//wifiOpen = WLan.getCfgOpenStatus();
	
	//if (wifiTimer != null)
	//	clearInterval(wifiTimer);
	//wifiTimer = null;
	//wifiTimer = setInterval('wifiStatusTimeout()', 300);
	
	if (status != WIFI_CLOSING && status != WIFI_CLOSED)
		startSearch();
}

function onWifiInsertMsg(status)
{
	if (status == false)
	{
		showCtrl(false, 'keyinput');
		funcFocus = 3;
		var obj = document.getElementById('apfocus');
		obj.style.display = 'none';
		obj.style.top = '263px';
		if (msgBox != null)
			delete msgBox;
		msgBox = new MessageBox();
		msgBox.popMessage('无网络设备', '没有发现无线网卡，请插入无线网卡！', null);
	}
	else
	{
		if (msgBox != null)
			msgBox.hide();
		funcFocus = 0;
		
		wifiInit();
	}
}

function pageuninit()
{
	WLan.IOSignal.disconnect(onWifiInsertMsg);
	WLan.scanFinishedSignal.disconnect(onWifiSearched);
	WLan.statusChangedSignal.disconnect(wifiStatusReport);
}

function pageinit()
{
	document.onkeydown = keyEventHandle;
	WLan.IOSignal.connect(onWifiInsertMsg);
	WLan.scanFinishedSignal.connect(onWifiSearched);
	WLan.statusChangedSignal.connect(wifiStatusReport);
	devName = WLan.getDevName();
	if (devName == null || devName.length == 0)
	{
		onWifiInsertMsg(false);
		return;
	}
	
	wifiInit();
}
