
function pageinit()
{
	window.onkeydown = keyHandle;	
}
function keyHandle()
{
	var code = event.keyCode;
	
	switch (code)
	{
		case ENTER: 
			document.getElementById("result").style.display="none";
			document.getElementById("tip").style.display = "inline";
			Factory.usbNumber.connect(usbTest);
			Factory.usbTest();
			break;
		case UpPage:
			window.location.href = 'led.html?passed=' + getPassed(2);
			break;
		case DownPage:
			window.location.href = 'key.html?passed=' + getPassed(2);
			break;
		case RETURN:
		case EXIT:
		case KEY_HOME:
			window.location = "mainpage.html?focus=2&passed="+ getPassed(2);
			return false;
		default:break;
	}
}
function usbTest(temp)
{
	document.getElementById("tip").style.display = "none";
	var result = "检测到的USB个数为: ";
	result += temp;
	result += " 个"
	document.getElementById("result").innerHTML = result ;
	document.getElementById("result").style.display="inline";
}
