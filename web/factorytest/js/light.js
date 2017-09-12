// JavaScript Document	

function pageinit(){
		window.onkeydown = keyHandle;
		
}
function keyHandle( event ){
	switch( event.keyCode ){
		case ENTER:
			//灯测试接口
			Factory.pilotLampTest();
			break;
		case UpPage:
			window.location = "net.html?passed=" + getPassed(5);
			break;
		case DownPage:
			window.location = "search.html?passed="+ getPassed(5);
			break;
		case RETURN:
		case EXIT:
		case KEY_HOME:
			window.location = "mainpage.html?focus=5&passed=" +getPassed(5);
			break;;
		default:
			break;
	}
	return false; //取消浏览器的默认处理
}
