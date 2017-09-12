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
			document.getElementById("false").style.display = "none";
			document.getElementById("true").style.display = "none";
			document.getElementById("tip").style.display = "inline";
			Factory.CACardInserted.connect(caTest);
			Factory.caTest();			
			break;		
		case DownPage:
			window.location.href = "led.html?passed="+ getPassed(0);
			break;
		case RETURN:
		case EXIT:
		case KEY_HOME:
			window.location = "mainpage.html?focus=0&passed="+ getPassed(0);
			return false;
		default:break;
	}
}
function caTest(temp)
{	
	document.getElementById("tip").style.display = "none";
	
	if (temp == true)
	{
		document.getElementById("true").style.display = "inline";
	}
	else
	{
		document.getElementById("false").style.display = "inline";
	}	
}

