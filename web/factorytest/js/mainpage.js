// JavaScript Document
var list = null;
var index = 0;

var passed = '';   //测试过的项目
var links = ["ca","led","usb","key","net","light","search","serial","sysinfo","reset"];

function pageinit(){
	//Factory.setFactoryStatus( true );
	HiBox.init();
	//Factory.factorySettings();
	window.onkeydown=keyHandle;
	//焦点
	var param = new Parameter();
	index = param.getParamInt('focus');
	if( index < 0 ) index = 0;
    list = document.getElementsByTagName('li');
	
	list[index].className="focus";
	//已经测试过的项目标红
	passed = param.getParamStr("passed");
	//alert(passed);
	if( passed!=undefined){
		var passeds = passed.split(",");
		for(var i = 0; i < passeds.length; i++ ){
			
			list[ parseInt( passeds[i])].style.color="red";
			
		}
	}
}

function keyHandle( event ){
	var keyCode = event.keyCode;
	list[ index ].removeAttribute("class");
	switch( keyCode )
	{
		case UP:
			if( --index < 0 ){
				index = 9;
			}	
			break;
		case DOWN:
			if( ++index > 9){
				index = 0;
			}
			break;
		case ENTER:
			window.location =  links[ index ]+".html"+(passed === undefined ? "" : "?passed=" + passed);
			break;
		case NUM_0:
			index = 0;
			window.location =  links[ index ]+".html"+(passed === undefined ? "" : "?passed=" + passed);
			break;
		case NUM_1:
			index = 1;
			window.location =  links[ index ]+".html"+(passed === undefined ? "" : "?passed=" + passed);
			break;
		case NUM_2:
			index = 2;
			window.location =  links[ index ]+".html"+(passed === undefined ? "" : "?passed=" + passed);
			break;
		case NUM_3:
			index = 3;
			window.location =  links[ index ]+".html"+(passed === undefined ? "" : "?passed=" + passed);
			break;
		case NUM_4:
			index = 4;
			window.location =  links[ index ]+".html"+(passed === undefined ? "" : "?passed=" + passed);
			break;
		case NUM_5:
			index = 5;
			window.location =  links[ index ]+".html"+(passed === undefined ? "" : "?passed=" + passed);
			break;
		case NUM_6:
			index = 6;
			window.location =  links[ index ]+".html"+(passed === undefined ? "" : "?passed=" + passed);
			break;
		case NUM_7:
			index = 7;
			window.location =  links[ index ]+".html"+(passed === undefined ? "" : "?passed=" + passed);
			break;
		case NUM_8:
			index = 8;
			window.location =  links[ index ]+".html"+(passed === undefined ? "" : "?passed=" + passed);
			break;
		case NUM_9:
			index = 9;
			window.location =  links[ index ]+".html"+(passed === undefined ? "" : "?passed=" + passed);
			break;
		case KEY_HOME:
			return false;
		default:
			break;
	}
	list[ index ].className="focus";
	return false;

}
