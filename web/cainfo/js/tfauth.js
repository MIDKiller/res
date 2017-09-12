var curMenuFocus = 0;
var MENUITEM = 0;
var topIndex = 0;
var menuMoveTimer = null;
var files = null;

function MenuFocus(oldFocus)
{

	var obj = document.getElementById('bannerFocus');
	var a = (curMenuFocus - topIndex) * 50 +50;
	if ( a < 500)
		obj.style.top = a + 'px';
	
}
function setCtrlText(id, value)
{
	var obj = document.getElementById(id);
	if (obj != null)
		obj.innerHTML = value;
}

function showList()
{
	var i;
	for(i=1;i<=9;i++)
		{
			if (i <= files.length)
			{	setCtrlText("authid"+i, files[topIndex+i-1].productID);
				setCtrlText("begin"+i, files[topIndex+i-1].beginDate);
				setCtrlText("end"+i, files[topIndex+i-1].expireDate);
				
                if ( files[topIndex+i-1].canTape == 0 )
					document.getElementById("can"+i).innerHTML = '否';
				else 
					document.getElementById("can"+i).innerHTML = '能';
			}
				if (i > files.length)
				{
					document.getElementById("authid"+i).innerHTML = "";
					document.getElementById("begin"+i).innerHTML = "";
					document.getElementById("end"+i).innerHTML = "";
					document.getElementById("can"+i).innerHTML = "";
				}
	}
}


function dealUP()
{		
	 oldFocus = curMenuFocus;
	 if (curMenuFocus > 0)
			curMenuFocus-- ; 

		if (curMenuFocus == topIndex - 1 )
			{
				if(topIndex > 0)
			
					topIndex--;
			}
			MenuFocus(oldFocus);
			showList();
		}
	
function dealDOWN()
{
		oldFocus = curMenuFocus;
		if (curMenuFocus < (files.length - 1 ))
			curMenuFocus++;
		if (curMenuFocus - topIndex == 9)
			topIndex++; 
			
		MenuFocus(oldFocus);
		showList();
}
function keyHandle(){
	var code = event.keyCode;
	var oldFocus;
		switch (code)
	{
		case UP:
			dealUP();
			break;
		case DOWN:
			dealDOWN();
			break;
		case RETURN:
		case EXIT:
            window.location.href = 'tfinfo.html?focus=2';
			return true;
		default:return true;
	}
}
function pageinit()
{

	DVB.stop();
	window.onkeydown = keyHandle;
	var obj = document.getElementById('bannerFocus');
	obj.style.top =  50 + 'px';
	var param = new Parameter();
	var id = param.getParamStr("id");
    var str =  DVB.getServiceEntitles(id);
    files =eval( "(" + str + ")");

	showList();
	if( files == null || files.length == 0)
	{
		obj.style.display = "none";
	}
	setCtrlText("total", files.length);
	delete param;
}
