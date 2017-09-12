// JavaScript Document
var index = 0;
var qamIndex = 2;
var objs = new Array();
var QAMS =[16,32,64,128,256];
var inputNum ="";
var freq = 738;
var symbrate = 6875;
var qam = 64;
var searching = false;
var searched = false;
/* search message defines */
var DSCAN_OK = 0;
var DSCAN_PROGRESS = 1;
var DSCAN_LOCKERR = 2;
var DSCAN_FREQ = 3;
function keyHandle( event ){
	var keyCode = event.keyCode;
	switch( keyCode ){
		case UP:
			inputNum = "";
			objs[index].style.color="black";
			if( --index < 0 )
				index =2;
			objs[index].style.color = "#00FF00";
			break;
		case DOWN:
			inputNum ="";
			objs[index].style.color="black";
			if( ++index > 2 )
				index = 0;
			objs[index].style.color = "#00FF00";
			break;
		case LEFT:
			if( index == 2){
					if( --qamIndex < 0 )
						qamIndex = 4;
					objs[2].innerText = QAMS[qamIndex]+"-QAM";
			}
			break;
		case RIGHT:
			if( index == 2){
				if( ++qamIndex > 4 )
						qamIndex = 0;
					objs[2].innerText = QAMS[qamIndex]+"-QAM";
					
			}
			break;
		case ENTER:
			//开始搜索
			if( searching == false && searched == false ){
				freq = parseInt(objs[0].innerText);
				symbrate = parseInt(objs[1].innerText);
				qam = QAMS[qamIndex];
				if( DVB.startManualSearch( freq,  symbrate, qam) == true ){
					searching = true;
				}
			}
			break;
		case UpPage:
			window.location="light.html?passed=" + getPassed(6);
			break;
		case DownPage:
			window.location="serial.html?passed=" + getPassed(6);
			break;
		case RETURN:
		case EXIT:
		case KEY_HOME:
			
			if( searching == true )
				DVB.stopSearch(true);
			//返回主页
			window.location = "mainpage.html?focus=6&passed="+ getPassed(6);
			
			return false;
		default:
			break;
	}
	if( keyCode >= NUM_0 && keyCode <= NUM_9){
		input( keyCode );
	}

}
function input( key){
	switch( key ){
		case NUM_0:
			inputNum += 0;
			break;
		case NUM_1:
			 inputNum +=1;
			  break;
		case NUM_2:
			  inputNum +=2;
			  break;
		case NUM_3:
 			  inputNum +=3;
			  break;
		case NUM_4:
			  inputNum +=4;
			  break;
		case NUM_5:
			inputNum +=5;
			break;
		case NUM_6:
			inputNum +=6;
			break;
		case NUM_7:
			inputNum +=7;
			break;
		case NUM_8:
			inputNum +=8;
			break;
		case NUM_9:
			inputNum +=9;
			break;
		default:
		 break;
	}
		if( index == 0 || index == 1 ){
		objs[index].innerText = inputNum;
	}
	
	
}
function onSearchMsg(msg, progress, tvnum, radionum, datanum){
	
	switch (msg)
	{
		case DSCAN_OK:
		
			document.getElementById("progress").innerHTML = "100%";
			document.getElementById("chanNum").innerHTML = tvnum;
			DVB.stopSearch(true);
			searching =false;
			searched = true;
			//搜索完播放
            if( tvnum > 0)
                setTimeout("window.location='play.html'",2000);
			break;
		case DSCAN_PROGRESS:
			document.getElementById("progress").innerHTML = progress+"%"
			break;
		case DSCAN_LOCKERR:
			break;
		case DSCAN_FREQ:
			break;
	}
}
function onSearchChannelMsg(chanName){
	
	document.getElementById("channames").innerHTML +=  chanName + "<br/>";
}
function pageinit(){
	window.onkeydown=keyHandle;
	
	
	DVB.init();
    DVB.clearChannel();
	DVB.scanSignal.connect(onSearchMsg);
	DVB.scanChannelSignal.connect(onSearchChannelMsg);
	objs[0] = document.getElementById( "freq");
	objs[1] = document.getElementById( "symbrate");
	objs[2] = document.getElementById( "qam");
}
