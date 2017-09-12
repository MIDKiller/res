var focusX=1;
var focusY=1;
var auto=0;
var butState=0;
var butId = 1;
var flag=null;
var ok=0;
var tempPing;
var device = Lan.getDeviceName();
function changeColor(){
	document.getElementById("item"+focusY+focusX).style.color = "black";
}
function clearColor(){
	document.getElementById("item"+focusY+focusX).style.color = "white";
}
function formatString(str){
	var arr1 = str.split(".",10);
	var arr2 = new Array(arr1.length);
	var a;
	for(var i=0 ; i<arr1.length ; i++){
		a = parseInt(arr1[i]);
		if(a<10){
			arr2[i] = "00"+a;
		}else{
			if(a<100){
				arr2[i] = "0"+a;
			}else{
				arr2[i] = a;
			}
		}
	}
	return arr2[0]+arr2[1]+arr2[2]+arr2[3];
}

function setNetValue(id,value)
{
	for(var i=0 ; i<12 ; i++)
	{
		document.getElementById("item"+id+(i+1)).innerHTML = value.charAt(i);
	}
}
/*
function myload(){
	System.debug(focusY);
	if(Lan.isDhcp(device)){
		document.getElementById("dhcpImgNaN").style.display = "none";
		document.getElementById("dhcpImgSel").style.display = null;
		document.getElementById("dhcpImgFoc").style.display = null;
		//document.getElementById("yoN").innerHTML = "是";
		document.getElementById("focusY").style.display = "none";
		focusY=0;
		auto=1;
	}else{
		document.getElementById("item11").style.color = "black";
	}
	var ip = Lan.getAddress(device);
	var mask = Lan.getNetmask(device);
	var gate = Lan.getGateway(device);
	var dns = Lan.getDNS();
	setNetValue(1,ip);
	setNetValue(2,mask);
	setNetValue(3,gate);
	setNetValue(4,dns);
}
window.onload = myload;*/
function moveRight(){
	if(ok==0){
	if(butState==1){
                document.getElementById("bt"+butId).style.backgroundImage = "url(../img/focusText0.png)";
		if(butId==2){
			butId=1;
		}else{
			butId++;
		}
                document.getElementById("bt"+butId).style.backgroundImage = "url(../img/focusText1.png)";
	}else{
	clearColor();
	var left = parseInt(document.getElementById("focusX").style.left);
	if(focusX==3||focusX==6||focusX==9){
		document.getElementById("focusX").style.left = (left+50)+"px";
	}else{
		if(focusX==12){
			
			document.getElementById("focusX").style.left = "96px";
		}else{
		document.getElementById("focusX").style.left = (left+25)+"px";
		}
	}
	if(focusX==12){
		focusX=1;
	}else{
		focusX++;
	}
	setTimeout("changeColor()", 300);
  }
}
}
function moveLeft(){
	if(ok==0){
	if(butState==1){
                document.getElementById("bt"+butId).style.backgroundImage = "url(../img/focusText0.png)";
		if(butId==1){
			butId=2;
		}else{
			butId--;
		}
                document.getElementById("bt"+butId).style.backgroundImage = "url(../img/focusText1.png)";
	}else{
	clearColor();
	var left = parseInt(document.getElementById("focusX").style.left);
	if(focusX==4||focusX==7||focusX==10){
		document.getElementById("focusX").style.left = (left-50)+"px";
	}else{
		if(focusX==1){
			document.getElementById("focusX").style.left = "446px";
		}else{
		document.getElementById("focusX").style.left = (left-25)+"px";
		}
	}
	if(focusX==1){
		focusX=12;
	}else{
		focusX--;
	}
	setTimeout("changeColor()", 300);
  }
}
}
function showX(){
	document.getElementById("focusX").style.display = null;
	flag=null;
}
function moveDown(){
	if(ok==0){
	if(auto==0){
		if(focusY==0){
			document.getElementById("focusY").style.top = "75px";
			document.getElementById("focusY").style.display = null;
			document.getElementById("dhcpImgFoc").style.display = "none";
			document.getElementById("dhcpImgNaN").style.display = null;
			document.getElementById("item11").style.color = "black";
			focusY++;
		}else{
			if(focusY>0&&focusY<4){
				clearColor();
			}
			focusX = 1;
			document.getElementById("focusX").style.display = "none";
			document.getElementById("focusX").style.left = "96px";
			var top = parseInt(document.getElementById("focusY").style.top);
			if(focusY<=3){
				if(focusY==0){
					document.getElementById("focusY").style.display = null;
					document.getElementById("dhcpImgNaN").style.display = null;
					document.getElementById("dhcpImgFoc").style.display = "none";
					document.getElementById("focusY").style.top = "75px";
				}
				document.getElementById("focusY").style.top = (top+62)+"px";
			}
			if(focusY==3){
				document.getElementById("focusY").style.display = "none";
               	document.getElementById("bt"+butId).style.backgroundImage = "url(../img/focusText1.png)";
			
				
			} 
			if(focusY<=3){
				focusY++;
				if(focusY==4){
					butState=1;
				}
			}
			if(focusY!=3){
				if(flag!=null){
					clearTimeout(flag);
				}
				flag = setTimeout("showX()", 300);
			}
			setTimeout("changeColor()", 300);
				}
	}else{
		focusY=4;
		butState=1;
		document.getElementById("dhcpImgFoc").style.display = "none";
                document.getElementById("bt"+butId).style.backgroundImage = "url(../img/focusText1.png)";
	}
}
}

function moveUp(){
	if(ok==0){
		if(auto==0){
			if(focusY>0&&focusY<4){
				clearColor();
			}
		
			focusX = 1;
			document.getElementById("focusX").style.display = "none";
			document.getElementById("focusX").style.left = "96px";
			var top = parseInt(document.getElementById("focusY").style.top);
			if(focusY>=1){
				if(focusY==4){
					document.getElementById("focusY").style.display = null;
                    document.getElementById("bt"+butId).style.backgroundImage = "url(../img/focusText0.png)";
					butId=1;
				}
				document.getElementById("focusY").style.top = (top-62)+"px";
			}
			if(focusY>0){
				if(butState==1){
					butState=0;
				}
				focusY--;
				if(focusY==0){
					document.getElementById("focusY").style.display = "none";
					document.getElementById("dhcpImgNaN").style.display = "none";
					document.getElementById("dhcpImgFoc").style.display = null;
				}
			}
		if(focusY!=4){
			if(flag!=null){
				clearTimeout(flag);
			}
			flag = setTimeout("showX()", 300);
		}
		setTimeout("changeColor()", 300);
		}else{
			butState=0;
			focusY=0;
			document.getElementById("dhcpImgFoc").style.display = null;
            document.getElementById("bt"+butId).style.backgroundImage = "url(../img/focusText0.png)";
		}
}
}
function reset()
{
	setNetValue(1,"192168001010");
	setNetValue(2,"255255255000");
	setNetValue(3,"192168001001");
}
function pressEnter(){
	if(focusY==0){
		
		if(auto==0){
			document.getElementById("dhcpImgNaN").style.display = "none";
			document.getElementById("dhcpImgSel").style.display = null;
			//document.getElementById("yoN").innerHTML = "是";
			
			auto=1;
		}else{
			document.getElementById("dhcpImgNaN").style.display = null;
			document.getElementById("dhcpImgSel").style.display = "none";
			//document.getElementById("yoN").innerHTML = "否";
			Lan.setDhcp(device,false);
			
			auto=0;
		}
	}else{
	if(butState==1){
		if(butId==2){
			reset();
		}else{
			if(ok==0){
				if(auto==0){
					
					Lan.setAddress(device,getIp());
					Lan.setNetmask(device,getMask());
//					Lan.setGateway(device,getGage());
//					Lan.setDNS(getDns());
					doPing();

				}else{
					Lan.setDhcp(device,true);
					Lan.dhcpFinishedSignal.connect(pingOK);
				}
				document.getElementById("pingOK").style.display="none";
				document.getElementById("pingFalse").style.display="none";
				document.getElementById("note").style.display="inline";
				ok=0;
				
			}else{
				ok=0;
				document.getElementById("pingOK").style.display="none";
				document.getElementById("pingFalse").style.display="none";
				document.getElementById("note").style.display="none";
			}
		}
	}
}
}
function showBye()
{
	document.getElementById("pingOK").style.display="none";
	document.getElementById("pingFalse").style.display="none";
	document.getElementById("note").style.display="none";
	
}

function doPing()
{
	Factory.pingTest(getGage());
	Factory.pingIsOK.connect(pingOK);	
}
function pingOK(tempPing)
{
	document.getElementById("note").style.display="none";
	
	if (tempPing == true)
	{ 	
		document.getElementById("pingOK").style.display = "inline";
	}
	else
	{			
		document.getElementById("pingFalse").style.display = "inline";		
	}	
}
function checkInput(i)
{
	var a = 0;
	var b = 0;
	var c = 0;
	if(focusX>0&&focusX<4)
	{
		a = parseInt(document.getElementById("item"+focusY+1).innerHTML)*100;
		b = parseInt(document.getElementById("item"+focusY+2).innerHTML)*10;
		c = parseInt(document.getElementById("item"+focusY+3).innerHTML);
		if(focusX==1){
			i = i*100;
			a = i;
		}
		else
		{
			if(focusX==2){
				i = i*10;
				b = i;
			}else{
				c = i;
			}
		}
		if((a+b+c)>255){
			return false;
		}else{
			return true;
		}
	}
	if(focusX>=4&&focusX<7){
		a = parseInt(document.getElementById("item"+focusY+4).innerHTML)*100;
		b = parseInt(document.getElementById("item"+focusY+5).innerHTML)*10;
		c = parseInt(document.getElementById("item"+focusY+6).innerHTML);
		if(focusX==4){
			i = i*100;
			a = i;
		}else{
			if(focusX==5){
				i = i*10;
				b = i;
			}else{
				c = i;
			}
		}
		if((a+b+c)>255){
			return false;
		}else{

			return true;
		}
	}
	if(focusX>=7&&focusX<10){
		a = parseInt(document.getElementById("item"+focusY+7).innerHTML)*100;
		b = parseInt(document.getElementById("item"+focusY+8).innerHTML)*10;
		c = parseInt(document.getElementById("item"+focusY+9).innerHTML);
		if(focusX==7){
			i = i*100;
			a = i;
		}else{
			if(focusX==8){
				i = i*10;
				b = i;
			}else{
				c = i;
			}
		}
		if((a+b+c)>255){
			return false;
		}else{
			return true;
		}
	}
	if(focusX>=10&&focusX<13){
		a = parseInt(document.getElementById("item"+focusY+10).innerHTML)*100;
		b = parseInt(document.getElementById("item"+focusY+11).innerHTML)*10;
		c = parseInt(document.getElementById("item"+focusY+12).innerHTML);
		if(focusX==10){
			i = i*100;
			a = i;
		}else{
			if(focusX==11){
				i = i*10;
				b = i;
			}else{
				c = i;
			}
		}
		if((a+b+c)>255){
			return false;
		}else{
			return true;
		}
	}
}
function inputText(i){
	if(checkInput(i)){
			document.getElementById("item"+focusY+focusX).innerHTML = i;
			moveRight();
		}
	
}
function getIp(){
	var ip = "";
	for(var i=1 ; i<13 ; i++){
		if(i==4||i==7||i==10){
			ip +=".";
		}
		ip += document.getElementById("item1"+i).innerHTML;
	}
	var array = ip.split(".");
	var temp = "";
	var a;
	for(var j=0 ; j<array.length ; j++){
		a = parseInt(array[j],10);
		temp+=a+"";
		if(j<(array.length-1)){
			temp+=".";
		}
	}
	return temp;
}
function getMask(){
	var mask = "";
	for(var i=1 ; i<13 ; i++){
		if(i==4||i==7||i==10){
			mask +=".";
		}
		mask += document.getElementById("item2"+i).innerHTML;
	}
	var array = mask.split(".");
	var temp = "";
	var a;
	for(var j=0 ; j<array.length ; j++){
		a = parseInt(array[j],10);
		temp+=a+"";
		if(j<(array.length-1)){
			temp+=".";
		}
	}
	return temp;
}
function getGage(){
	var gate = "";
	for(var i=1 ; i<13 ; i++){
		if(i==4||i==7||i==10){
			gate +=".";
		}
		gate += document.getElementById("item3"+i).innerHTML;
	}
	var array = gate.split(".");
	var temp = "";
	var a;
	for(var j=0 ; j<array.length ; j++){
		a = parseInt(array[j],10);
		temp+=a+"";
		if(j<(array.length-1)){
			temp+=".";
		}
	}
	return temp;
}
function getDns(){
	var dns = "";
	for(var i=1 ; i<13 ; i++){
		if(i==4||i==7||i==10){
			dns +=".";
		}
		dns += document.getElementById("item4"+i).innerHTML;
	}
	var array = dns.split(".");
	var temp = "";
	var a;
	for(var j=0 ; j<array.length ; j++){
		a = parseInt(array[j],10);
		temp+=a+"";
		if(j<(array.length-1)){
			temp+=".";
		}
	}
	return temp;
}

document.onkeydown=function(){
	var e = event.keyCode;

	switch (e) {
		case 48: 
			inputText(0);
			break;
		case 49: 
			inputText(1);
			break;
		case 50: 
			inputText(2);
			break;
		case 51: 
			inputText(3);
			break;
		case 52: 
			inputText(4);
			break;
		case 53: 
			inputText(5);
			break;
		case 54: 
			inputText(6);
			break;
		case 55: 
			inputText(7);
			break;
		case 56: 
			inputText(8);
			break;
		case 57: 
			inputText(9);
			break;
		case LEFT: 
			moveLeft();
			showBye();
			break;
		case RIGHT:
			moveRight();
			showBye();
			break;
		case UP: 
			moveUp();
			showBye();
			System.debug(focusY);
			break;
		case DOWN: 
			moveDown();
			showBye();
			System.debug(focusY);
		
			break;
		case ENTER:
			System.debug(focusY);
			pressEnter();
			break;
		case UpPage:
			window.location = 'key.html?passed=' + getPassed(4);
			break;
		case DownPage:
			window.location = 'light.html?passed=' + getPassed(4);
			break;
		case RETURN:
		case EXIT:
		case KEY_HOME:
			window.location = "mainpage.html?focus=4&passed="+ getPassed(4);
			break;
		default:
			break;
	}
	return false;
}
