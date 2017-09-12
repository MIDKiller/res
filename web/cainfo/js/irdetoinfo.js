// JavaScript Document
var focus = null;
var MAX_OPERATOR = 3;
var bannerFocus = 0;
var listFocus = 0;
var focusHeight = 68;
var isLeft = true;
var infoList = null;

function moveUp()
{
	if( !isLeft ){
		if( listFocus > 0 ){
			focus.style.top = (parseInt(focus.style.top) - 50 ) + "px"; 
			listFocus --;
		}
		return true;
	}
	if( infoList == null ){
		setCtrlVisible("empty", false);
	}
	if(bannerFocus > 0 && isLeft){
		focus.style.top = (parseInt(focus.style.top) - focusHeight ) + "px"; 
		bannerFocus --;
		if( bannerFocus == 0 ){
			setCtrlVisible( "cainfobar", false );
			setCtrlVisible("rightItem",false);
			showSTBInfo();
			return true;
		}else if( bannerFocus == 1 ){
			setCtrlVisible( "enter", false );
		//	setCtrlVisible("authinfo", false );
			showCAInfo();
			return true;
		}
	}
}
function moveDown()
{
	if( !isLeft ){
		if( listFocus < infoList.length -1 && listFocus < MAX_OPERATOR -1){
			focus.style.top = (parseInt(focus.style.top) + 50 ) + "px"; 
			listFocus ++;
		}		
		return true;
	}
	if( bannerFocus < 1 && isLeft){   // 修改bannerFocus < 2
		focus.style.top = (parseInt(focus.style.top) + focusHeight ) + "px"; 
		bannerFocus ++;
		if( bannerFocus == 1){ //显示CA信息
			setCtrlVisible( "infobar", false );
			showCAInfo();
			return true;
		}/*else if( bannerFocus == 2 ){   //显示授权信息
			setCtrlVisible( "cainfobar", false );
			setCtrlVisible("rightItem",false);
			
			setCtrlVisible( "enter", true );
			if( infoList == null ){
				setCtrlVisible("empty", true);
			}else{
				setCtrlVisible("empty", false);
			}
			showAuthInfo();
			return true;
		}*/

	}
	

}

function moveLeft()
{
	if( bannerFocus == 2 || !isLeft )
	{
		isLeft = true;
		focus.style.display = "none";
		focus = document.getElementById("bannerFocus");		
		focus.style.display = "inline";
	}
}
function moveRight()
{
	if( bannerFocus == 2 && isLeft && infoList.length > 1){
		isLeft = false;
		focus.style.display = "none";
		focus = document.getElementById( "listfocus");
		focus.style.display = "inline";
	}
}
function showAuthInfo()
{
	setCtrlVisible("authinfo", true);
	
	for( var i = 0;  i < MAX_OPERATOR; i++ ){
		if( i < infoList.length )
		{
			document.getElementById("order" + i).innerHTML = i + 1;
			document.getElementById("operid" + i ).innerHTML = infoList[i].id;
			if( infoList[i].name != "" ){
				document.getElementById("opername" + i ).innerHTML = infoList[i].name;
			}else{
				document.getElementById("opername" + i ).innerHTML = "无名称";
			}
			setCtrlVisible("item" + i, true);

		}else{
			setCtrlVisible("item" + i, false);
		}
	}
}
function showCAInfo()
{
//	var state = DVB.getServiceStatus(0);
//	var emm = DVB.getServiceStatus(1);
    var ca = null;
    var state = null;
    var emm = null;
    var str = DVB.getCAInfo();
    if( str != null && str.length > 0)
    {
          ca = eval("(" + str +")");
        state = ca["des"];
        emm = ca["emm"];
    }

	setCtrlText('cardnum', ca['serial_num']);
	setCtrlText('castate',ca['nationality']);
	document.getElementById("version").innerHTML = ca['card_max'] + '.' + ca['card_min'] +"&nbsp;&nbsp" + "Build" +"&nbsp" + ca['build'];

	document.getElementById("caversion").innerHTML = "IRDETO_V3" +'&nbsp;&nbsp'+ca['lib_max'] + '.' +ca['lib_min'] + '.' + ca['sub_version'];

	setCtrlText('catype', ca['name']);
    setCtrlText('emm', emm['rsc_status']);
    setCtrlText('ecm', state['rsc_status']);
    setCtrlText('workinfo', state['global_status']);
    setCtrlText('workstate',emm['internal_status']);
    setCtrlText('Tsinfo',state['stream_info_0']);
	setCtrlText('cainfo', ca['build_info']);
	setCtrlVisible("cainfobar", true );
	setCtrlVisible("rightItem", true);
	
	
	

}

/*
function caState(msg)
{
	var obj = document.getElementById("castate");
	obj.innerHTML = msg;
}	
*/
function showSTBInfo()
{
	setCtrlText('stbid', System.getStbID());
	setCtrlText('hwver', System.getHWVersion());
	setCtrlText('softver', System.getSoftVersion());
	setCtrlText('pubdate', System.getPBDate());
	setCtrlText('bossnum', System.getClientSN());
	setCtrlVisible("infobar", true );
}

function dealKey(keyCode)
{
	switch( keyCode )
	{
	case UP:
		moveUp();
		return true;
	case DOWN:
		moveDown();
		return true;
	case LEFT:
		moveLeft();
		return true;
	case RIGHT:
		moveRight();
		return true;
	case ENTER:
		if( !isLeft ){
			var id= infoList[ listFocus ].id;
			window.location.href = 'authinfo.html?id=' + id;
		}
		return true;
	case RETURN:
	case EXIT:
		goBackWithUrl('../setting.html?focus=2');
		return true;
	}
}

function keyHandle()
{
	var keyCode = event.keyCode;
	return dealKey(keyCode);
}

function setCtrlVisible( ctrl , visible )
{
	var obj = document.getElementById(ctrl);
	
	if( visible )
	{
		obj.style.display = "inline";
	}else{
		obj.style.display = "none";
	}
}
function setCtrlText(id, value)
{
	var obj = document.getElementById(id);
	if (obj != null)
		obj.innerHTML = value;
}

function pageinit()
{
	window.onkeydown = keyHandle;
	
	
	
	
//	DVB.onShowSmartCardMSG.connect(onCaCardInfo);
//	DVB.onShowInfo.connect(caState);
	focus = document.getElementById("bannerFocus");
	var param = new Parameter();
	var curFocus = param.getParamInt('focus');
	
	switch (curFocus)
	{
	case 0:
		showSTBInfo();
		break;
	case 1:
		dealKey(DOWN);
		break;
/*	case 2:
		dealKey(DOWN);
		dealKey(DOWN);
		break;*/
	default:
		showSTBInfo();
		break;
	}
    delete param;
}
