var curMenuFocus = 0;
var MENUITEM = 0;
var topIndex = 0;
var menuMoveTimer = null;
var files = [];
var CAType = 0;
/*
var files = [ 
			 {num : "1", title : "this id the 1 email" , time : "2010.1.12" , id : "1"},
			 {num : "2", title : "this id the 2 email" , time : "2010.2.12" , id : "2"},

			 {num : "3", title : "this id the 3 email" , time : "2010.3.12" , id : "3"},

			 {num : "4", title : "this id the 4 email" , time : "2010.4.12" , id : "4"},

			 {num : "5", title : "this id the 5 email" , time : "2010.5.12" , id : "5"}

			];
*/
//列表是否能得到焦点 zhangyl
var focusable = true;

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
			{	

					setCtrlText("num"+i, files[topIndex+i-1].num);
					setCtrlText("title"+i, files[topIndex+i-1].title);
                if( CAType == 2 )
                    setCtrlText("date"+i, files[topIndex+i-1].from);
                else
                    setCtrlText("date"+i, files[topIndex+i-1].time);
				
					if ( files[topIndex+i-1].flag == 0 )
						document.getElementById("state"+i).innerHTML = '已读';
					else 
						document.getElementById("state"+i).innerHTML = '未读';
			}
	
				if (i > files.length)
				{
					document.getElementById("num"+i).innerHTML = "";
					document.getElementById("title"+i).innerHTML = "";
					document.getElementById("date"+i).innerHTML = "";
					document.getElementById("state"+i).innerHTML = "";
				}
		
				if (files.length == 0)
				document.getElementById("title1").innerHTML = "没有邮件!";	
		
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

function dealENTER()
{
//	str = "";
//	for(i=0 ;i<files.length;i++)
//	{
//	temp = files.charCodeAt(i).toString(16);
//	str += "\\u"+ new Array(5-String(temp).length).join("0") ++temp;
//	str += "\\u"+ new Array(5-String(temp).length).join("0") + temp;     
//	setCtrlText("content",(str));
    setCtrlText("content",DVB.getEmailContent(files[curMenuFocus].ID));
	setCtrlText("titlebox1",files[curMenuFocus].title);
    if( CAType == 2)
        setCtrlText("sendtime1",files[curMenuFocus].from);
    else
        setCtrlText("sendtime1",files[curMenuFocus].time);
}

function dealGREEN()
{

	DVB.deleteEmail(files[curMenuFocus].ID);
//	alert('curMenuFocus :'+ curMenuFocus);
	//if(files.length <= 9)
//	{
		if (curMenuFocus == files.length - 1 )
		{

			 var oldFocus = curMenuFocus;
			 if (curMenuFocus > 0)
				{
					curMenuFocus-- ; 
				//	topIndex--;
				}
			// if (curMenuFocus == topIndex - 1 )
			//	{
					if(topIndex > 0)
				
						topIndex--;
			//	}
				
				MenuFocus(oldFocus);
		}
//	}
//	else

	refreshList();

	
}

function keyHandle(){
	
	var code = event.keyCode;
	var oldFocus;
//	alert(code);
		switch (code)
	{
		case UP:
			if( focusable )
				dealUP();
			break;
		case DOWN:
			if( focusable )
				dealDOWN();
			break;
		case ENTER: 
			focusable = false;
			dealENTER();
			showCtrl(true,'condentwindow');
			break;
		case GREEN:
			if( focusable )
			dealGREEN();
			break;
		case BLUE:
			
		//	DVB.reset();
			
			break;
		case RETURN:
			focusable = true;
			refreshList();
			showCtrl(false,'condentwindow');
			return false;
		case EXIT:
            goBackWithUrl('../dvb/menu.html');
			return false;
		case KEY_TV:
			window.location.href = '../dvb/dvbplay.html';
			break;
			}
	return;
}

function refreshList ()
{
    var str= DVB.getEmailList();
        if( str != null && str.length > 0)
            files = eval('(' + str + ')');
        else
            files = [];
	showList();
}



function pageinit()
{
    CAType = DVB.getCAType();
    if( CAType == 2 ){
        document.getElementById("date").innerHTML = "发送者";
        document.getElementById("date").style.right="50px";
        document.getElementById("sendtime").innerHTML="发送者:";
    }
    DVB.stop();
	window.onkeydown = keyHandle;
	var obj = document.getElementById('bannerFocus');
	obj.style.top =  50 + 'px';
	
	refreshList();
    FPanel.displayTime();
}
