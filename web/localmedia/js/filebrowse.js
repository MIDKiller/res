var leftMenuList = null;
var rightMenuList = null;
var currMenuList = null;
var pathbox = null;
var emptytip = null;

var MENUCOUNT = 6;
var LEFTMENU_TOP = 203;
var SUFFIX_LIST = "*.mp4,*.mkv,*.flv,*.avi,*.mov,*.ts,*.m2ts,*.mpg,*.m4v,*.f4v,*.mp3,*.rmvb,*.rm,*.wmv,*.wma";
var PartionFlag = ['C:/','D:/','E:/','F:/','G:/','H:/','I:/','J:/','K:/','L:/','M:/','N:/','O:/','P:/','Q:/','R:/','S:/','T:/','U:/','V:/','W:/','X:/','Y:/','Z:/'];
function MenuList(div,mode)
{
	this.widget = div;
	this.rootMode = mode;

	this.filelist = null;
	this.isFocus = false;
	this.path = "/mnt";
	this.parent = null;

	this.selected = -1;
	this.displaybase = 0;
	this.displaycount = MENUCOUNT;
	this.item=[];
	this.itemIcon=[];
	this.itemName=[];

	for(var i = 0;i < MENUCOUNT;i++)
	{
		this.item[i]= document.getElementById(this.widget+"item"+i);
		this.itemIcon[i] = document.getElementById(this.widget+"icon"+i);
		this.itemName[i] = document.getElementById(this.widget+"name"+i);
	}
}
MenuList.prototype.setPath = function (filepath,selected,lastname)
{

	var i;
	var files;
	this.path =filepath;
	//                        alert("+"+this.rootMode);
	if(this.rootMode)
	{
		this.filelist = File.list(this.path,"+");

		if(this.filelist.length < 1 )
		{
			msgBox(true,"请插入U盘或移动硬盘！");
		}
		else
		{
			msgBox(false);
		}
	}
	else
	{
		this.filelist = File.list(this.path,"+,"+SUFFIX_LIST);
		if(this.filelist.length < 1 )
		{
			msgBox(true,"没有文件哦!请按[返回]！");
		}
		else
		{
			msgBox(false);
		}
	}

	this.selected = 0;
	this.displaybase = 0;
	var butncount = this.filelist.length;

	if(selected == null)
	{
		if(!this.isFocus || this.filelist.length < 1)
		{
			this.selected = -1;
		}

	}
	else if(butncount > 0)
	{


		if(lastname != null)
		{
			selected = 0;
			//System.debug("============>lastname:"+ lastname)
			if(this.filelist != null)
			{
				//查当前的
				for(i= 0;i < butncount;i++)
				{
					if(this.filelist[i].name == lastname)
					{
						//设置当前
						selected = i + 1;
						//System.debug("=========###===>selected:"+ selected)
						break;
					}
				}
			}
		}
		//System.debug("===91======###===>selected:"+ selected+"butncount:"+butncount)

		for(var sel = this.selected;sel < selected;sel++)
		{
			//System.debug("===95======###===>sel:"+sel+"selected:"+ selected)
			this.selected = sel;

			if(this.displaybase + parseInt(this.displaycount / 2) < sel
					&& this.displaybase + this.displaycount < butncount)
			{
				this.displaybase++;
			}


		}
		//System.debug("===91======###===>this.selected:"+ this.selected)

	}

	this.painterList();
	this.painterFocus();

}
MenuList.prototype.clean = function ()
{

	this.path = "";
	this.filelist = null;
	this.selected = -1;
	this.displaybase = 0;
	this.painterList();
	this.painterFocus();

}

MenuList.prototype.painterList = function ()
{

	var i = 0;

	if(this.filelist != null)
	{
		var butncount = this.filelist.length;
		var sel = this.selected;
		var base = this.displaybase;
		var sum = base;

		if(butncount < this.displaycount)
		{
			sum+=butncount;
		}
		else
		{
			sum+=this.displaycount;
		}
		//                                        alert('sssssssssssss:/'+this.widget+" "+this.filelist.length)
		for(i=0; i<sum -base; i++)
		{
			if(this.rootMode == false)
			{
				this.itemIcon[i].className = filetype(this.filelist[i+base]);
				this.itemName[i].innerHTML=this.filelist[i+base].name;
			}
			else
			{
				this.itemIcon[i].className = "bigDisk";
				this.itemName[i].innerHTML=PartionFlag[i+base];
			}

			this.item[i].style.display = "inline";

		}

	}
	for(; i < MENUCOUNT; i++)
	{
		this.item[i].style.display = "none";
	}
}
MenuList.prototype.painterFocus = function ()
{
	var pos = this.selected - this.displaybase;
	var focusIcon =  document.getElementById(this.widget+"focus");
	if(this.isFocus && pos > -1 && pos < MENUCOUNT)
	{
		//                                alert(parseInt(LEFTMENU_TOP + pos * 67));
		//计算 位置
		focusIcon.style.top =  parseInt(LEFTMENU_TOP + pos * 67)+'px';
		focusIcon.style.display = "inline";
	}
	else
	{
		focusIcon.style.display = "none";
	}
}

MenuList.prototype.onKeyEvent = function (key)
{
	var sel = this.selected;
	var butncount = this.filelist.length;
	switch(key)
	{
	case UP:
		if(butncount > 0)
		{
			sel--;
			if(sel > -1)
			{
				this.selected = sel;

				if(this.displaybase+parseInt(this.displaycount / 2) > sel
						&& this.displaybase >0)
				{
					this.displaybase--;
					this.painterList();

				}
				else
				{
					this.painterFocus();
				}
			}
			else
			{
				this.selected = butncount - 1;
				var remain = butncount - this.displaycount;
				if(remain > 0)
				{
					this.displaybase = remain;
				}
				else
				{
					this.displaybase = 0;
				}
				this.painterList();
				this.painterFocus();
			}

		}
		return false;
	case DOWN:
		if(butncount > 0)
		{
			sel++;
			if(sel < butncount)
			{
				this.selected = sel;

				if(this.displaybase + parseInt(this.displaycount / 2) < sel
						&& this.displaybase + this.displaycount < butncount)
				{
					this.displaybase++;
					this.painterList();
				}
				else
				{
					this.painterFocus();
				}

			}
			else
			{
				this.selected = 0;
				this.displaybase = 0;
				this.painterList();
				this.painterFocus();
			}

		}
		return false;
	case ENTER:
		//                                alert("on enter");
		return this.onEnterPress();
	default:
		return true;
	}
}
function msgBox( open,text )
{
	var note = document.getElementById("note");
	if( open ){
		note.innerHTML = text;
		note.style.display = "inline";
	}else{
		note.style.display = "none";
	}
}
function filetype( file)
{

	if(file.type)
	{
		return "folder";
	}
	else
	{
		//        var tem = file.name.split('.');
		switch(file.suffix){
		case "mp3":
		case "wma":
			return "audio";
		case "mp4":
		case "flv":
		case "mkv":
		case "avi":
		case "asf":
		case "mov":
		case "ts":
		case "m2ts":
		case "mpg":
		case "m4v":
		case "f4v":
		case "rm":
		case "rmvb":
			return "video";
		default:
			return "null";
		}
	}
}

function keyHandle()
{

	var keyCode = event.keyCode;

	if(currMenuList != null && currMenuList.isFocus == true)
	{
		try{
			if(currMenuList.onKeyEvent(keyCode) == true)
			{
				switch(keyCode)
				{
				case RIGHT:
					//                                        alert("left");
					if(currMenuList.widget == "left" && currMenuList.filelist != null &&currMenuList.filelist.length > 0)
					{
						leftMenuList.onKeyEvent(ENTER);
						rightMenuList.setFocus(true);
					}
					return false;
				case LEFT:
					//                                        alert("right");
					if(currMenuList.widget == "right")
					{
						leftMenuList.setFocus(true);
					}
					return false;
				case RETURN:
					if(currMenuList == leftMenuList)
					{
						leftMenuList.setPath(leftMenuList.path);
					}
					else
					{
						File.setPath(currMenuList.path);
						File.cdUp();
						path = File.getPath();
						if(path != "/mnt")
						{

							var leftsel = leftMenuList.selected;

							var winpath = path.replace("/mnt/"+leftMenuList.filelist[leftsel].name,PartionFlag[leftsel]);
							document.getElementById("pathbox").innerHTML =  winpath;
							currMenuList.setPath(path);
						}
						else
						{
							leftMenuList.setFocus(true);
						}
					}

					return false;
				case EXIT:
					goBackWithUrl('../dvb/menu.html');
					return false;
				default:
					return true;

				}
			}
			else
			{
				return false;
			}
		}
		catch(e)
		{
			// alert("Exception:" + e);
		}
	}
}
MenuList.prototype.usbCheckDisk = function(action,dirname)
{
	var i ;
	var sel = null;
	var name = dirname.replace("/mnt/","");
	var lastname = "";
	try{
		if(action == "add")
		{
			if(this.filelist != null && this.filelist.length > 0 && this.selected > -1)
			{
				lastname = this.filelist[this.selected].name;
			}
			this.setPath("/mnt",0,lastname);
			//System.debug("add1111111111");
		}
		else if(action == "remove")
		{
			//System.debug("remove:"+this.filelist.length+" "+this.selected);
			if(this.filelist != null && this.filelist.length > 0 && this.selected > -1)
			{
				lastname = this.filelist[this.selected].name;
				//System.debug("name:"+name+":"+lastname);
				if(name == lastname)
				{
					this.setFocus(true);
					rightMenuList.clean();
				}
				else
				{
					//查当前的
					for(i= 0;i < this.filelist.length;i++)
					{
						if(this.filelist[i].name == lastname)
						{
							//设置当前
							sel = i;
							break;
						}
					}
				}
			}
			this.setPath("/mnt",sel);
			//System.debug("remove@@@@@@@@@1111111122222222");
		}
	}
	catch(e)
	{
		// alert("USB Exception :" + e);
	}
}

function pageinit()
{
//	alert("---tset");
	DVB.stop();
	document.getElementById("prom").innerHTML= "仅显示该设备支持的媒体文件,支持格式有:"+ SUFFIX_LIST.replace(/\*\./g,"");


	window.onkeydown = keyHandle;
	pathbox = document.getElementById("pathbox");
	FPanel.displayTime();
	leftMenuList = new MenuList("left",true);
	rightMenuList = new MenuList("right",false);

	leftMenuList.setFocus = function (focus)
	{
		this.isFocus = focus;
		if(focus)
		{
			if(currMenuList != null && currMenuList != this)
			{
				currMenuList.setFocus(false);
			}
			currMenuList = this;

			if(this.filelist.length > 0)
			{
				if(this.selected < 0)
				{
					this.selected = 0;
				}
				msgBox(false);

			}
			else
			{
				msgBox(true,"请插入U盘或移动硬盘！");
			}
		}

		this.painterFocus();
	}
	leftMenuList.onEnterPress = function (focus)
	{
		var sel = this.selected;
		var winpath="";
		if(this.filelist != null && sel > -1 && sel < this.filelist.length)
		{
			var path = this.path +"/"+ this.filelist[sel].name;;

			winpath = path.replace("/mnt/"+this.filelist[sel].name,PartionFlag[sel]);
			pathbox.innerHTML =  winpath;

			rightMenuList.setPath(path)
		}

		return false;
	}

	leftMenuList.setPath("/mnt");
	leftMenuList.setFocus(true);
	//right
	rightMenuList.setFocus = function (focus)
	{
		this.isFocus = focus;
		if(focus)
		{
			if(this.filelist.length > 0)
			{
				if(currMenuList != null && currMenuList != this)
				{
					currMenuList.setFocus(false);
				}

				if(this.selected < 0 && this.filelist.length > 0)
				{
					this.selected = 0;
				}

				currMenuList = this;
				msgBox(false);

			}
			else
			{
				msgBox(true,"没有文件！");
			}
		}

		this.painterFocus();

	}
	rightMenuList.onEnterPress = function (focus)
	{
		var sel = this.selected;
		var winpath="";
		if(this.filelist != null && sel > -1 && sel < this.filelist.length)
		{

			if(filetype(this.filelist[sel]) == "folder")
			{
				var leftsel = leftMenuList.selected;
				var path = this.path +"/"+ this.filelist[sel].name;

				winpath = path.replace("/mnt/"+leftMenuList.filelist[leftsel].name,PartionFlag[leftsel]);
				pathbox.innerHTML =  winpath;

				this.setPath(path);
			}
			else
			{
				var file = this.path + "/" + this.filelist[sel].name;
				window.location.href="../localplay/localplay.html?file=" + encodeURIComponent(file);
				//open file
			}
		}
		return false;
	}

	try{
		System.usbchange.connect(leftMenuList,leftMenuList.usbCheckDisk);
	}
	catch(e)
	{
	}

	loadAdPlayer(10007, 'advdiv', 500);
}

function pageuninit()
{
	System.usbchange.disconnect(leftMenuList,leftMenuList.usbCheckDisk);
	delete leftMenuList;
	delete rightMenuList;
}