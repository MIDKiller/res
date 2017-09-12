// JavaScript Document
function showCtrl(isShow, id)
{
	var obj = document.getElementById(id);
	if (obj == null)
		return;
		
	if (isShow == true)
		obj.style.display = '';
	else
		obj.style.display = 'none';
}

function myParseInt(str)
{
	if (str == null || str.length < 1)
		return '';
	
	var d = 0;	
	var i;
	for (i = 0; i < str.length; i++)
	{
		if (str[i] < '0' || str[i] > '9')
			return d;
		d = d * 10 + (str[i] - '0');
	}
	
	return d;
}

function formatAddress(addr)
{
	var dAddr = '';
	var tmp;
	if (addr.length != 12)
		return '0.0.0.0';
		
	tmp = addr.substring(0, 3);
	dAddr += myParseInt(tmp) + '.';
	
	tmp = addr.substring(3, 6);
	dAddr += myParseInt(tmp) + '.';
	
	tmp = addr.substring(6, 9);
	dAddr += myParseInt(tmp) + '.';
	
	tmp = addr.substring(9, 12);
	dAddr += myParseInt(tmp);
	
	return dAddr;
}

function getTimeStrFromInt(iTime)
{
	var sTime = '';
	var tmp = parseInt(iTime / 100);
	
	if (tmp < 10)
		sTime = '0';
	sTime += tmp + ':';
	
	tmp = parseInt(iTime % 100);
	if (tmp < 10)
		sTime += '0';
	sTime += tmp;
	
	return sTime;
}

/* */
function Parameter()
{
	this.initparam();
}

Parameter.prototype.initparam = function()
{
	var str = window.location.href;
	var num = str.indexOf('?');
	if (num < 0) {
		this.init = true;
		return;
	}
	
	var params = str.substr(num + 1);
	params = params.split('&');
	if (params == null)
	{
		this.init = true;
		return;
	}
	
	var i;
	for (i = 0; i < params.length; i++)
	{
		num = params[i].indexOf('=');
		if (num > 0)
		{
			var name = params[i].substring(0, num);
			var value = params[i].substr(num + 1);
			this[name] = decodeURIComponent(value);
		}
	}
}

Parameter.prototype.getParamInt = function(name)
{
	var value = this.getParamStr(name);
	if (value == null)
		return -1;
	return parseInt(value);
}

Parameter.prototype.getParamStr = function(name)
{
	return this[name];
}

/* date time */
function DateTime()
{
	this.dateArray = DVB.getDateTimeInJSON();
}

DateTime.prototype.getYear = function()
{
	if (this.dateArray != null)
	{
		var ret = this.dateArray['year'];
		if (ret == null)
			return 0;
		return ret;
	}
	return 0;
}

DateTime.prototype.getMonth = function()
{
	if (this.dateArray != null)
	{
		var ret = this.dateArray['mon'];
		if (ret == null)
			return 0;
		return ret;
	}
	return 0;
}

DateTime.prototype.getMDay = function()
{
	if (this.dateArray != null)
	{
		var ret = this.dateArray['mday'];
		if (ret == null)
			return 0;
		return ret;
	}
	return 0;
}

DateTime.prototype.getWDay = function()
{
	if (this.dateArray != null)
	{
		var ret = this.dateArray['wday'];
		if (ret == null)
			return 0;
		return ret;
	}
	return 0;
}

DateTime.prototype.getHour = function()
{
	if (this.dateArray != null)
	{
		var ret = this.dateArray['hour'];
		if (ret == null)
			return 0;
		return ret;
	}
	return 0;
}

DateTime.prototype.getMinute = function()
{
	if (this.dateArray != null)
	{
		var ret = this.dateArray['min'];
		if (ret == null)
			return 0;
		return ret;
	}
	return 0;
}

DateTime.prototype.getSecond = function()
{
	if (this.dateArray != null)
	{
		var ret = this.dateArray['sec'];
		if (ret == null)
			return 0;
		return ret;
	}
	return 0;
}

/* ask dialog start */
function AskDialog()
{
	this.askSelOk = true;
	this.callback = null;
	this.baseImg = '../img/';
}

AskDialog.prototype.focusBtn = function(id, isFocus)
{
	var obj = document.getElementById(id);
	if (isFocus == true)
		obj.style.backgroundImage = 'url(' + this.baseImg + 'focusText1.png)';
	else
		obj.style.backgroundImage = 'url(' + this.baseImg + 'focusText0.png)';
}

AskDialog.prototype.popDlg = function(title, info, callback)
{
	var obj;
	obj = document.getElementById('asktitle');
	obj.innerHTML = title;
	obj = document.getElementById('askinfo');
	obj.innerHTML = info;
	obj = document.getElementById('askbox');
	obj.style.display = '';
	
	this.askSelOk = true;
	this.focusBtn('askokbtn', true);
	this.focusBtn('asknobtn', false);
	this.callback = callback;
}

AskDialog.prototype.hide = function()
{
	var obj = document.getElementById('askbox');
	obj.style.display = 'none';
}

AskDialog.prototype.keyIn = function(keyCode)
{
	if (keyCode == LEFT || keyCode == RIGHT)
	{
		this.askSelOk = !this.askSelOk;
		this.focusBtn('askokbtn', this.askSelOk);
		this.focusBtn('asknobtn', !this.askSelOk);
		return false;
	}
	
	if (keyCode == ENTER)
	{
		if (this.callback != null)
			this.callback(this.askSelOk);
	}
	
	if (keyCode == EXIT || keyCode == RETURN)
	{
		if (this.callback != null)
			this.callback(false);
	}
	
	return false;
}

/* ask dialog end */
function MessageBox()
{
	this.cb = null;
}

MessageBox.prototype.popMessage = function(title, info, callback)
{
	var obj;
	obj = document.getElementById('msgtitle');
	obj.innerHTML = title;
	obj = document.getElementById('msginfo');
	obj.innerHTML = info;
	obj = document.getElementById('msgbox');
	obj.style.display = '';
	
	this.cb = callback;
}

MessageBox.prototype.keyIn = function(keyCode)
{
	if (keyCode == ENTER)
	{
		if (this.cb != null)
			this.cb();
	}
	
	return false;
}

MessageBox.prototype.hide = function()
{
	var obj = document.getElementById('msgbox');
	obj.style.display = 'none';
}

var adJsUrl = 'http://222.90.100.223:7071/vs/ad/ui/padplayer.js';
var adJsLoaded = false;
var adJsStartLoad = false;
var adIds = new Array();
var adDivs = new Array();
var adJsObj = null;
function onAdJsLoaded()
{
	adJsLoaded = true;
	try {
		for (var i = 0; i < adIds.length; i++)
		{
			adPlayerInit(adIds[i], adDivs[i]);
		}
	} catch (err) {
	}
}
function loadAdPlayer(adId, adDiv, delayTime)
{
	try {
		if (delayTime > 0)
		{
			setTimeout(function() {
				loadAdPlayer(adId, adDiv, 0);
			}, delayTime);
			return;
		}
		
		if (adJsLoaded)
		{
			adPlayerInit(adId, adDiv);
			return;
		}
		
		if (adJsStartLoad)
		{
			adIds.push(adId);
			adDivs.push(adDiv);
			return;
		}
		
		adJsStartLoad = true;
		adIds.push(adId);
		adDivs.push(adDiv);
			
		adJsObj = document.createElement("script");
		adJsObj.setAttribute("type", "text/javascript");
		adJsObj.setAttribute("language", "javascript");
		adJsObj.onload = onAdJsLoaded;
		adJsObj.setAttribute("src", adJsUrl);
		document.body.appendChild(adJsObj);
		
	} catch(err) {
		return;
	}
}
function adPlayerSwChannel(channelIndex)
{
	try {
		if (!jsLoaded)
			return;
		adPlayerSwitchChannel(channelIndex);
	} catch (err) {
	}
}

function goBackWithUrl(url)
{
	var str = window.location.href;
	var num = str.indexOf('?');
	if (num < 0)
	{
		window.location.href = url;
		return;
	}
	
	var params = str.substr(num + 1);
	if (params.indexOf('page=main') >= 0)
	{
		HiBox.setMainFrame({location:"dvbplay?"+params});
	}
	else
	{
		window.location.href = url;
	}
}



//随机数
function randomNumber(limit)
{
  return Math.floor(Math.random()*limit);
}
