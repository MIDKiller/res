var focusX=1;
var focusY=1;
var auto=0;
var butState=0;
var butId = 1;
var flag=null;
var ok=0;
var noteAlive = true;

var device = null;
function changeColor()
{
        document.getElementById("item"+focusY+focusX).style.color = "black";
}
function clearColor()
{
        document.getElementById("item"+focusY+focusX).style.color = "white";
}
function formatString(str)                                                  
{                                                                         
        var arr1 = str.split(".",10);                                      
        var arr2 = new Array(arr1.length);                                 
        var a;                                                              
        for(var i=0 ; i<arr1.length ; i++)                                 
        {                                                                
                a = parseInt(arr1[i]);                                      
                if(a<10)                                                  
                {                                                          
                        arr2[i] = "00"+a;                                  
                }                                                        
                else                                                       
                {                                                          
                        if(a<100)                                           
                        {                                                  
                                arr2[i] = "0"+a;
                        }                      
                        else    arr2[i] = a;                     
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
function linkStatus(isLinked)                                                 
{                                                                             
        if(isLinked == true)                                                 
        {                                                                    
                if(noteAlive == false)                                        
                {                                                             
                        ok=0;                                                 
                        document.getElementById("noteTrue").style.display="none"
                        document.getElementById("noteFalse").style.display="none";
                }                                         
		 ok=1;                                                         
                noteAlive = true;                                            
                document.getElementById("note").style.display="";             
                document.getElementById("connected").style.display  = "";     
                document.getElementById("disconnect").style.display = "none";
        }                                                                     
        else                                                                 
        {                                                                    
                document.getElementById("connected").style.display  = "none";
                document.getElementById("disconnect").style.display = "";     
        }                                                                     
        device = Lan.getDeviceName();                                      
}                               
function pageunint()                                                        
{                                                                            
        Lan.dhcpFinishedSignal.disconnect(netCfgResult);                  
        Lan.ANGFinishedSignal.disconnect(netCfgResult);                    
        Lan.linkChangedSignal.disconnect(linkStatus);                      
}                                                                            
                                                                              
function myload()                                                            
{                                                                            
        device = Lan.getDeviceName();                                       
        if(device == null || device.length == 0)                             
        {                                                                    
                document.getElementById("connected").style.display  = "none";
                document.getElementById("disconnect").style.display = "";    
        }                                                                    
        else                                                                
        {                                                                   
                document.getElementById("connected").style.display  = "";    
                document.getElementById("disconnect").style.display = "none";   
        }                                                                    
                                                                            
        if(Lan.isDhcp(device))    
       	{                                                                   
                //document.getElementById("dhcpImgNaN").style.display = "none";
                document.getElementById("dhcpImgSel").style.display = null;   
                document.getElementById("dhcpImgFoc").style.display = null;   
                //document.getElementById("yoN").innerHTML = "...";          
                document.getElementById("focusY").style.display = "none";     
                focusY=0;                                                    
                auto=1;                                                      
        }                                                                     
        else    document.getElementById("item11").style.color = "black";      
                                                                           
        var ip = Lan.getAddress(device);                                   
        var mask = Lan.getNetmask(device);                                  
        var gate = Lan.getGateway(device);                                 
        var dns = Lan.getDNS();                                             
                                                                            
        setNetValue(1,ip);                                                   
        setNetValue(2,mask);                                                  
        setNetValue(3,gate);                                                  
        setNetValue(4,dns);
	 Lan.dhcpFinishedSignal.connect(netCfgResult);                       
        Lan.ANGFinishedSignal.connect(netCfgResult);                        
        Lan.linkChangedSignal.connect(linkStatus);                         
}                                                                            
                                                                            
window.onload = myload;                                                      
window.onunload = pageunint;
function moveRight()                                                          
{                                                                            
        if(ok==0)                                                           
        {                                                                     
                if(butState==1)                                               
                {                                                            
                        document.getElementById("bt"+butId).style.backgroundImage= "url(img/focusText0.png)";
                        if(butId==2)                                          
                        {                                                    
                                butId=1;                                     
                        }                                                     
                        else    butId++;                                      
                                                                              
                        document.getElementById("bt"+butId).style.backgroundImage="url(img/focusText1.png)";
                }                                                             
                else                                                          
                {                                                             
                        clearColor();                                         
                        var left = parseInt(document.getElementById("focusX").style.left);
                        if(focusX==3||focusX==6||focusX==9)                   
                        {                                                     
                                document.getElementById("focusX").style.left = (left+50)+"px";
					 }                                                     
                        else                                                  
                        {                                                    
                                if(focusX==12)                                
                                {                                            
                                        document.getElementById("focusX").style.left="96px";
						
                                }                                             
                                else    document.getElementById("focusX").style.left=(left+25)+"px";
                        }                                                    
                        if(focusX==12)                                        
                        {                                                  
                                focusX=1;                                    
                        }                                                    
                        else    focusX++;                                    
                                                                              
                        setTimeout("changeColor()", 300);                   
                }                                                            
        }                                                                     
}                                                  
function moveLeft()
{
	if(ok==0)
	{
		if(butState==1)
		{
			document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText0.png)";
			if(butId==1)
			{
				butId=2;
			}
			else
			{
				butId--;
			}
			document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText1.png)";
		}
		else
		{
			clearColor();
			var left = parseInt(document.getElementById("focusX").style.left);
			if(focusX==4||focusX==7||focusX==10)
			{
				document.getElementById("focusX").style.left = (left-50)+"px";
			}
			else
			{
				if(focusX==1)
				{
					document.getElementById("focusX").style.left = "446px";
				}
				else	document.getElementById("focusX").style.left = (left-25)+"px";
				
			}
			if(focusX==1)
			{
				focusX=12;
			}
			else	focusX--;
			
			setTimeout("changeColor()", 300);
		}
	}
}
function showX()
{
	document.getElementById("focusX").style.display = '';
	flag=null;
}
function moveDown()
{
	if(ok==0)
	{
		if(auto==0)
		{
			if(focusY==0)
			{
				document.getElementById("focusY").style.top = "75px";
				document.getElementById("focusY").style.display = null;
				document.getElementById("dhcpImgFoc").style.display = "none";
				document.getElementById("dhcpImgNaN").style.display = null;
				document.getElementById("item11").style.color = "black";
				focusY++;
			}
			else
			{
				System.debug(focusY);
				if(focusY>0&&focusY<5)
				{
					clearColor();
				}
				focusX = 1;
				document.getElementById("focusX").style.display = "none";
				document.getElementById("focusX").style.left = "96px";
				var top = parseInt(document.getElementById("focusY").style.top);
				if(focusY<=4)
				{
					if(focusY==0)
					{
						document.getElementById("focusY").style.display = '';
						document.getElementById("dhcpImgNaN").style.display = '';
						document.getElementById("dhcpImgFoc").style.display = "none";
						document.getElementById("focusY").style.top = "75px";
					}
					document.getElementById("focusY").style.top = (top+62)+"px";
				}
				if(focusY==4)
				{
					document.getElementById("focusY").style.display = "none";
					document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText1.png)";
					
				}
				if(focusY<=4)
				{
					focusY++;
					if(focusY==5)
					{
						butState=1;
					}
				}
				if(focusY!=5)
				{
					if(flag!=null)
					{
						clearTimeout(flag);
					}
					flag = setTimeout("showX()", 300);
				}
				setTimeout("changeColor()", 300);
			}
		}
		else
		{
			focusY=5;
			butState=1;
			document.getElementById("dhcpImgFoc").style.display = "none";
			document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText1.png)";	
		}
	}
}

function moveUp()
{
	if(ok==0)
	{
		if(auto==0)
		{
			if(focusY>0&&focusY<5)
			{
				clearColor();
			}
		
			focusX = 1;
			document.getElementById("focusX").style.display = "none";
			document.getElementById("focusX").style.left = "96px";
			var top = parseInt(document.getElementById("focusY").style.top);
			if(focusY>=1)
			{
				if(focusY==5)
				{
					document.getElementById("focusY").style.display = '';
					document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText0.png)";
					butId=1;
				}
				document.getElementById("focusY").style.top = (top-62)+"px";
			}
			if(focusY>0)
			{
				if(butState==1)
				{
					butState=0;
				}
				focusY--;
				if(focusY==0)
				{
					document.getElementById("focusY").style.display = "none";
					//document.getElementById("dhcpImgNaN").style.display = "none";
					document.getElementById("dhcpImgFoc").style.display = '';
				}
			}
			if(focusY!=5)
			{
				if(flag!=null)
				{
					clearTimeout(flag);
				}
				flag = setTimeout("showX()", 300);
			}
			setTimeout("changeColor()", 300);
		}
		else
		{
			butState=0;
			focusY=0;
			document.getElementById("dhcpImgFoc").style.display = null;
			document.getElementById("bt"+butId).style.backgroundImage = "url(img/focusText0.png)";	
		}
	}
}
function reset()
{
	setNetValue(1,"192168001002");
	setNetValue(2,"255255255000");
	setNetValue(3,"192168001001");
	setNetValue(4,"008008008008");
}
function refreshNetworkInfo()
{
	var ip   = Lan.getAddress(device);
	var mask = Lan.getNetmask(device);
	var gate = Lan.getGateway(device);
	var dns  = Lan.getDNS();
	
	setNetValue(1,ip);
	setNetValue(2,mask);
	setNetValue(3,gate);
	setNetValue(4,dns);
}
function netCfgResult(result)
{
	ok = 1;
	if(noteAlive == true)
	{
		noteAlive = false;
		document.getElementById("note").style.display="none";
	}
	
	if(result == true)
	{		
		document.getElementById("noteTrue").style.display="";
		
		refreshNetworkInfo();
	}
	else
	{	
		document.getElementById("noteFalse").style.display="";
	}	
}
function pressEnter()
{
	if(ok == 0)
	{
		if(focusY==0)
		{
			if(auto==0)
			{
				//document.getElementById("dhcpImgNaN").style.display = "none";
				document.getElementById("dhcpImgSel").style.display = "";
				//document.getElementById("yoN").innerHTML = "是";
				auto=1;
			}
			else
			{
				document.getElementById("dhcpImgNaN").style.display = "";
				document.getElementById("dhcpImgSel").style.display = "none";
				//document.getElementById("yoN").innerHTML = "否";
				Lan.setDhcp(device,false);
				refreshNetworkInfo();
				auto=0;
			}
		}
		else
		{
			if(butState==1)
			{
				if(butId==2)
				{
					reset();
				}
				else
				{	if(device.length == 0)
					{
						netCfgResult(false);
						return;
					}			
					if(auto==0)
					{
						Lan.setDNS(getDns());
						Lan.ANGConfig(device,getIp(),getMask(),getGage());
					}
					else	
					{						
						Lan.setDhcp(device,true);
					}
					ok=1;
					noteAlive = true;
					document.getElementById("note").style.display="";					
				}
			}
		}
	}
	else
	{
		if(noteAlive == false)
		{
			ok=0;
			document.getElementById("noteTrue").style.display="none";
			document.getElementById("noteFalse").style.display="none";
		}	
	}
}
function checkInput(i)
{
	var a = 0;
	var b = 0;
	var c = 0;
	if(focusX >0 && focusX <4)
	{
		a = parseInt(document.getElementById("item"+focusY+1).innerHTML)*100;
		b = parseInt(document.getElementById("item"+focusY+2).innerHTML)*10;
		c = parseInt(document.getElementById("item"+focusY+3).innerHTML);
		if(focusX==1)
		{
			i = i*100;
			a = i;
		}
		else
		{
			if(focusX==2)
			{
				i = i*10;
				b = i;
			}
			else	c = i;
		}
		if((a+b+c)>255)
		{
			return false;
		}
		else	return true;		
	}
	if(focusX >=4 && focusX <7)
	{
		a = parseInt(document.getElementById("item"+focusY+4).innerHTML)*100;
		b = parseInt(document.getElementById("item"+focusY+5).innerHTML)*10;
		c = parseInt(document.getElementById("item"+focusY+6).innerHTML);
		if(focusX==4)
		{
			i = i*100;
			a = i;
		}
		else
		{
			if(focusX==5)
			{
				i = i*10;
				b = i;
			}
			else	c = i;			
		}
		if((a+b+c)>255)
		{
			return false;
		}
		else	return true;		
	}
	if(focusX>=7&&focusX<10)
	{
		a = parseInt(document.getElementById("item"+focusY+7).innerHTML)*100;
		b = parseInt(document.getElementById("item"+focusY+8).innerHTML)*10;
		c = parseInt(document.getElementById("item"+focusY+9).innerHTML);
		if(focusX==7)
		{
			i = i*100;
			a = i;
		}else
		{
			if(focusX==8)
			{
				i = i*10;
				b = i;
			}
			else	c = i;			
		}
		if((a+b+c)>255)
		{
			return false;
		}
		else	return true;		
	}
	if(focusX>=10&&focusX<13)
	{
		a = parseInt(document.getElementById("item"+focusY+10).innerHTML)*100;
		b = parseInt(document.getElementById("item"+focusY+11).innerHTML)*10;
		c = parseInt(document.getElementById("item"+focusY+12).innerHTML);
		if(focusX==10)
		{
			i = i*100;
			a = i;
		}
		else
		{
			if(focusX==11)
			{
				i = i*10;
				b = i;
			}
			else	c = i;			
		}
		if((a+b+c)>255)
		{
			return false;
		}
		else	return true;
	}
}
function inputText(i)
{
	if(checkInput(i))
	{
		document.getElementById("item"+focusY+focusX).innerHTML = i;
		moveRight();
	}
	
}
function getIp()
{
	var ip = "";
	for(var i=1 ; i<13 ; i++)
	{
		if(i==4||i==7||i==10)
		{
			ip +=".";
		}
		ip += document.getElementById("item1"+i).innerHTML;
	}
	var array = ip.split(".");
	var temp = "";
	var a;
	for(var j=0 ; j<array.length ; j++)
	{
		a = parseInt(array[j],10);
		temp+=a+"";
		if(j<(array.length-1))
		{
			temp+=".";
		}
	}
	return temp;
}
function getMask()
{
	var mask = "";
	for(var i=1 ; i<13 ; i++)
	{
		if(i==4||i==7||i==10)
		{
			mask +=".";
		}
		mask += document.getElementById("item2"+i).innerHTML;
	}
	var array = mask.split(".");
	var temp = "";
	var a;
	for(var j=0 ; j<array.length ; j++)
	{
		a = parseInt(array[j],10);
		temp+=a+"";
		if(j<(array.length-1))
		{
			temp+=".";
		}
	}
	return temp;
}
function getGage()
{
	var gate = "";
	for(var i=1 ; i<13 ; i++)
	{
		if(i==4||i==7||i==10)
		{
			gate +=".";
		}
		gate += document.getElementById("item3"+i).innerHTML;
	}
	var array = gate.split(".");
	var temp = "";
	var a;
	for(var j=0 ; j<array.length ; j++)
	{
		a = parseInt(array[j],10);
		temp+=a+"";
		if(j<(array.length-1))
		{
			temp+=".";
		}
	}
	return temp;
}
function getDns()
{
	var dns = "";
	for(var i=1 ; i<13 ; i++)
	{
		if(i==4||i==7||i==10)
		{
			dns +=".";
		}
		dns += document.getElementById("item4"+i).innerHTML;
	}
	var array = dns.split(".");
	var temp = "";
	var a;
	for(var j=0 ; j<array.length ; j++)
	{
		a = parseInt(array[j],10);
		temp+=a+"";
		if(j<(array.length-1))
		{
			temp+=".";
		}
	}
	return temp;
}
document.onkeydown=function()
{
	var e = event.keyCode;

	switch (e) 
	{
		case RETURN:
		case EXIT:
			goBackWithUrl('setting.html?focus=1');
			return false;
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
			break;
		case RIGHT:
			moveRight();
			break;
		case UP: 			
			moveUp();
			break;
		case DOWN: 			
			moveDown();
			break;
		case ENTER:
			pressEnter();			
			break;
		default:
			break;
	}
}
