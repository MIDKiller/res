// JavaScript Document
function pageinit(){
	document.getElementById("stbid").innerHTML = System.getStbID();
	document.getElementById("hwver").innerHTML = System.getHWVersion();
	document.getElementById("softver").innerHTML = System.getSoftVersion();
	document.getElementById("pubdate").innerHTML = System.getPBDate();

	window.onkeydown = function( event ){
		var keyCode = event.keyCode;
		switch( keyCode ){
			case RETURN:
			case EXIT:
			case KEY_HOME:
				window.location = "mainpage.html?focus=8&passed="+ getPassed(8);
				break;
			case UpPage:
				window.location="serial.html?passed=" + getPassed(8);
				break;
			case DownPage:
				window.location="reset.html?passed=" + getPassed(8);
				break;
		}
		
		return false;
	};
	
	
}
