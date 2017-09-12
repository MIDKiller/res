// JavaScript Document
function pageinit(){
	window.onkeydown = function( event ){
		switch( event.keyCode ){
			case ENTER:
				DVB.clearChannel();
				AvConfig.setDefault();
				WLan.setDefault();
				Lan.setDefault();
				Factory.factorySettings();
				break;
			case UpPage:
				window.location="sysinfo.html?passed=" + getPassed(9);
				break;
			
			case RETURN:
			case EXIT:
			case KEY_HOME:
				window.location = "mainpage.html?focus=9&passed="+ getPassed(9);
				return false;
		}
		
	};
}