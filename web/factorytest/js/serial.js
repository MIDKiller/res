var state = ["无操作","正在连接服务器...","已连接上服务器","未连接上服务器","正在接收数据...","正在烧写序列号...","序列号烧写成功","序列号烧写失败"];

function pageinit()
{
	var devname = Lan.getDeviceName();
	Factory.configNetwork(devname, "192.168.1.101", "255.255.255.0");
	document.getElementById("address").innerHTML = Factory.getIpAddress(devname);
	Factory.SNWriteState.connect(showStatus);
	Factory.writeSN();

	window.onkeydown = function( event )
	{
		switch( event.keyCode )
		{		
			case ENTER:
				Factory.writeSN();
				break;	
			case UpPage:
				window.location="search.html?passed=" + getPassed(7);
				break;
			case DownPage:
				window.location="sysinfo.html?passed=" + getPassed(7);
				break;
			case RETURN:
			case EXIT:
			case KEY_HOME:
				window.location = "mainpage.html?focus=7&passed="+ getPassed(7);
				return false;			
		}		
	};
}

function showStatus(stateNum)
{
	document.getElementById("status").innerHTML = state[stateNum];
}