
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
			Factory.ledDisplaying.connect(ledShow);
			Factory.ledTest();
			break;
		case UpPage:
			window.location.href = 'ca.html?passed=' + getPassed(1);
			break;
		case DownPage:
			window.location.href = 'usb.html?passed=' + getPassed(1);
			break;
		case RETURN:
		case EXIT:
		case KEY_HOME:
			window.location = "mainpage.html?focus=1&passed="+ getPassed(1);
			return false;
		default:break;
	}
}
function ledShow(str)
{
	document.getElementById('lednum').innerHTML = str ;
}