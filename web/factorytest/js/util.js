// JavaScript Document
//取得已经测试过的页面的url参数,将页面的passed参数取出，再加上指定页面的编号
function getPassed( pageNum ){
	var param = new Parameter();
	var passed = param.getParamStr('passed');
	
	if( passed == undefined){
		passed ="" + pageNum;
	}else{
		if( passed.indexOf( pageNum) == -1) 
			passed += "," + pageNum;
	}
	return passed;
}