var posArr = new Array("-200px","-20px","140px","360px","680px","920px","1100px");

var centerItem = 3;
var itemNum = 5;
var curFocus = 0;
var type ;
//����ģʽ������
var factoryCode = "0532194900";
var inputCode ="";
var urls = ['dvb/search.html', 'network.html', 'cainfo/tfinfo.html', 'default.html', 'videoSetting.html'];

function changeSize(index, i)
{
	var obj;
	
	obj = document.getElementById("item"+i);
	obj.style.left = posArr[index];
	obj.style.webkitTransitionDuration = "0.3s";
	switch (index)
	{
	case 2:
	case 4:
		obj.style.top = "110px";
		obj.style.width = "280px";
		obj.style.height = "280px";
		break;
	case 3:
		obj.style.top = "60px";
		obj.style.width = "380px";
		obj.style.height = "380px";
		break;
	case 1:
	case 5:
		obj.style.top = "145px";
		obj.style.width = "200px";
		obj.style.height = "200px";
		break;
	default:
		obj.style.top = "145px";
		obj.style.width = "200px";
		obj.style.height = "200px";
		break;
	}
}

function startMoveRight() 
{
	var index;
	var itemIndex;
	
	var obj = document.getElementById('item' + centerItem);
	obj.src = 'img/set' + curFocus + '_0.png';
	
	index = curFocus - 1;
	if (index < 0)
		index += itemNum;
	itemIndex = centerItem - 1;
	if (itemIndex < 0)
		itemIndex += 7; 
	obj = document.getElementById('item' + itemIndex);
	obj.src = 'img/set' + index + '_1.png';
	
	index = curFocus - 4;
	if (index < 0)
		index += itemNum;
	itemIndex = centerItem + 3;
	if (itemIndex > 6)
		itemIndex -= 7; 
	obj = document.getElementById('item' + itemIndex);
	obj.style.webkitTransitionDuration = "0s";
	obj.src = 'img/set' + index + '_0.png';
	obj.style.left = posArr[0];
	
	itemIndex = centerItem - 3;
	if (itemIndex < 0)
		itemIndex += 7; 
	for (var i = 1 ; i < 7; i++)
	{
		changeSize(i, itemIndex);
		itemIndex++;
		if (itemIndex > 6)
			itemIndex -= 7;
	}
		
	curFocus--;
	if (curFocus < 0)
		curFocus = itemNum - 1;
	centerItem--;
	if (centerItem < 0)
		centerItem += 7;
}

function startMoveLeft()
{
	var index;
	var itemIndex;
	
	var obj = document.getElementById('item' + centerItem);
	obj.src = 'img/set' + curFocus + '_0.png';
	
	index = curFocus + 1;
	if (index >= itemNum)
		index -= itemNum;
	itemIndex = centerItem + 1;
	if (itemIndex > 6)
		itemIndex -= 7; 
	obj = document.getElementById('item' + itemIndex);
	obj.src = 'img/set' + index + '_1.png';
	
	index = curFocus + 4;
	if (index >= itemNum)
		index -= itemNum;
	itemIndex = centerItem - 3;
	if (itemIndex < 0)
		itemIndex += 7; 
	obj = document.getElementById('item' + itemIndex);
	obj.style.webkitTransitionDuration = "0s";
	obj.src = 'img/set' + index + '_0.png';
	obj.style.left = posArr[6];
	
	itemIndex = centerItem + 3;
	if (itemIndex > 6)
		itemIndex -= 7; 
	for (var i = 5 ; i >= 0; i--)
	{
		changeSize(i, itemIndex);
		itemIndex--;
		if (itemIndex < 0)
			itemIndex += 7;
	}
		
	curFocus++;
	if (curFocus >= itemNum)
		curFocus -= itemNum;
	centerItem++;
	if (centerItem > 6)
		centerItem -= 7;
}

function myKeyEvent(){
	var e = event.keyCode;
	switch (e) {
	case RIGHT: 
		startMoveLeft();
		break;
	case LEFT:
		startMoveRight();
		break;
	case ENTER:
		type = DVB.getCAType();
		if (type == 1)
            urls[2]= 'cainfo/irdetoinfo.html?focus=0';
		else if (type ==2)
            urls[2]= 'cainfo/dvtinfo.html?focus=0';
		else if (type == 3)
			urls[2]= 'cainfo/dvninfo.html';
		window.location.href = urls[curFocus];
		break;
	case EXIT:
	case RETURN:
		goBackWithUrl('dvb/menu.html');
		return false;
	default:
		break;
	}
	//���빤��ģʽ
	if( e >= NUM_0 && e<= NUM_9 ){
		switch( e ){
			case NUM_0:
				inputCode += 0;
				break;
			case NUM_1:
				 inputCode +=1;
				  break;
			case NUM_2:
				  inputCode +=2;
				  break;
			case NUM_3:
				  inputCode +=3;
				  break;
			case NUM_4:
				  inputCode +=4;
				  break;
			case NUM_5:
				inputCode +=5;
				break;
			case NUM_6:
				inputCode +=6;
				break;
			case NUM_7:
				inputCode +=7;
				break;
			case NUM_8:
				inputCode +=8;
				break;
			case NUM_9:
				inputCode +=9;
				break;
		} 
		if( inputCode == factoryCode ){
			//window.location = "factorytest/mainpage.html";
			Factory.intoFactoryMode();
			
		}
	}
}

function initIcons()
{
	var param = new Parameter();
	curFocus = param.getParamInt('focus');
	if (curFocus < 0 || curFocus >= itemNum)
		curFocus = 0;
		
	var index = curFocus - 3;
	if (index < 0)
		index += itemNum;
	
	var obj;
	for (var i = 0; i < 7; i++)
	{
		obj = document.getElementById('item' + i);
		if (index == curFocus)
			obj.src = 'img/set' + index + '_1.png';
		else
			obj.src = 'img/set' + index + '_0.png';
		index++;
		if (index >= itemNum)
			index = 0;
	}
	delete param;
}

function pageinit()
{
	try
	{
	//alert(222);
	initIcons();
	DVB.stop();
	FPanel.displayTime();
	document.onkeydown = myKeyEvent;
	}
	catch(e)
	{
		alert(e);
		}
	
}
