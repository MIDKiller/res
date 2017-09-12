//JavaScript Document
var focus = null;
var MAX_OPERATOR = 4;
var bannerFocus = 0;
var listFocus = 0;
var focusHeight = 68;
var isLeft = true;
var infoList = null;
var caInfo = null;

var maxInputCount = 8;
//chang pin
var curInputFocus = 0; //在哪个输入框
var curEditFocus = 0; //在哪个编辑位置
var editTimer = null;
var inputText0 = null;
var inputText1 = null;
var inputText2 = null;
var isReady = false;//焦点在确定上
//rating
var rating = 18;
//work time
var startHour = 0;
var startMinute = 0;
var endHour = 23;
var endMinute = 59;

var askDlg = null;
var isAsking = false;
var msgBox = null;
var showInfo = false;

var readyToChange = false; //已进行完相关的数据检查，将要调用接口
var isInitializing = false;
var cardIn = false;

var isGetting = false;
function setCtrlVisible(ctrl, visible) {
    var obj = document.getElementById(ctrl);
    if (obj == null) {
        return;
    }
    if (visible) {
        obj.style.display = "block";
    } else {
        obj.style.display = "none";
    }
}
function setCtrlText(id, value) {
    var obj = document.getElementById(id);
    if (obj != null)
        obj.innerHTML = value;
}

/* 设置按钮焦点 */
function setBtnFocus(isFocus, id) {
    var obj = document.getElementById(id);
    if (obj == null)
        return;
    if (isFocus)
        obj.style.backgroundImage = "url('../img/focusText1.png')";
    else
        obj.style.backgroundImage = "url('../img/focusText0.png')";
}

//change pin
function enableEditFocus() {
    setCtrlVisible("inputfocus", true);
    setCtrlVisible("editfocus", true);
    document.getElementById("num" + curInputFocus + curEditFocus).style.color = "#9E511B";
}

function disableEditFocus() {
    setCtrlVisible("inputfocus", false);
    setCtrlVisible("editfocus", false);
    clearEditFocus();
    curEditFocus = 0;
}
function clearEditFocus() {
    var obj = document.getElementById("num" + curInputFocus + curEditFocus);
    if (obj == null)
        return;
    obj.style.color = "#FFFFFF";
}

function moveEditFocus() {
    var obj = document.getElementById('editfocus');
    if (obj == null)
        return;
    obj.style.left = (curEditFocus * 30 + 777) + 'px';
    obj.style.top = (curInputFocus * 65 + 175) + 'px';
    changeEditTextColor();
}
function changeEditTextColor() {
    var obj = document.getElementById("num" + curInputFocus + curEditFocus);
    if (obj == null)
        return;
    obj.style.color = "#9E511B";
}

function moveInputFocus() {
    var obj = document.getElementById('inputfocus');
    if (obj == null)
        return;
    obj.style.top = (curInputFocus * 65 + 180) + 'px';
    curEditFocus = 0;
}

function showChangePIN() {
    setCtrlVisible("changePin", true);
    setCtrlVisible("title2", true);
    setCtrlVisible("inputbg2", true);
    setCtrlVisible("input2", true);
    setCtrlText("title0","原&nbsp;&nbsp;&nbsp;&nbsp;PIN&nbsp;&nbsp;&nbsp;码：");
    setCtrlText("title1","新&nbsp;&nbsp;&nbsp;&nbsp;PIN&nbsp;&nbsp;&nbsp;码：");
    setCtrlText("title2","确认新PIN码：");
    curInputFocus = 0;
    curEditFocus = 0;
    clearEditFocus();
}
function hideChangePIN() {
    setCtrlVisible("changePin", false);
}

//change pin
function showChangeRating() {
    setCtrlText("title0","观看级别：");
    setCtrlText("title1","PIN验证：");
    setCtrlVisible("title2", false);
    setCtrlVisible("inputbg2", false);
    setCtrlVisible("input2", false);
    setCtrlText("num00","");
    setCtrlText("num01","");
    setCtrlText("num02","");
    setCtrlText("num03", rating);
    setCtrlText("num04","");
    setCtrlText("num05","");
    setCtrlText("num06","");
    setCtrlText("num07","");

    curInputFocus = 0;
    curEditFocus = 0;

}
function hideChangeRating() {
    setCtrlText("num00","*");
    setCtrlText("num01","*");
    setCtrlText("num02","*");
    setCtrlText("num03", "*");
    setCtrlText("num04","*");
    setCtrlText("num05","*");
    setCtrlText("num06","*");
    setCtrlText("num07","*");
}

function showChangeWorkTime() {
    setCtrlVisible("title2", true);
    setCtrlVisible("inputbg2", true);
    setCtrlVisible("input2", true);

    setCtrlText("title0","工作时间：");
    setCtrlText("title1","结束时间：");
    setCtrlText("title2","PIN验证：");

    setCtrlText("num00","");
    setCtrlText("num01","");
    setCtrlText("num02", parseInt( startHour / 10 ) );
    setCtrlText("num03", startHour % 10 );
    setCtrlText("num04",":");
    setCtrlText("num05", parseInt( startMinute / 10) );
    setCtrlText("num06", startMinute % 10 );
    setCtrlText("num07","");

    setCtrlText("num10","");
    setCtrlText("num11","");
    setCtrlText("num12", parseInt( endHour / 10 ));
    setCtrlText("num13", endHour % 10 );
    setCtrlText("num14",":");
    setCtrlText("num15", parseInt( endMinute / 10 ) );
    setCtrlText("num16", endMinute % 10 );
    setCtrlText("num17","");
}
function hideChangeWorkTime() {
    for( var i = 0; i < 2; i++ ){
        for( var j = 0; j < 8; j++ ){
            setCtrlText("num" + i + j,"*");
        }
    }
}

function showAuthInfo() {
    //防止从其它页面跳到此菜单后的菜单时，执行多次moveDown()后，显示重叠
    cardIn = DVB.isCardIn()  == 1 ? true : false ;
    if( !cardIn ){
        setCtrlVisible("canote", true);
        return;
    }else{
        if( infoList == null )
        {
//            setCtrlVisible("waitnote",true);
//            DVB.getCAInfo();
//            isGetting = true;
            var str = DVB.getOperatorInfo();
            if( str != null && str.length > 0)
                infoList = eval( "(" + str + ")");
            else
                infoList = [];
        }
    }
    if( infoList.length < 1){

        setCtrlVisible("empty", true);
        return;
    }else{
        setCtrlVisible("empty", false);
    }

    setCtrlVisible("authinfo", true);
    for ( var i = 0; i < MAX_OPERATOR; i++) {
        if (i < infoList.length) {
            document.getElementById("order" + i).innerHTML = i + 1;
            document.getElementById("operid" + i).innerHTML = infoList[i].ID;
            if (infoList[i].name != "") {
                document.getElementById("opername" + i).innerHTML = infoList[i].name;
            } else {
                document.getElementById("opername" + i).innerHTML = "无名称";
            }
            setCtrlVisible("item" + i, true);

        } else {
            setCtrlVisible("item" + i, false);
        }
    }
}
function gotCAInfo( info )
{
     cardIn = true;

    caInfo = eval("(" + info  + ")");
    isGetting = false;
    setCtrlVisible("waitnote", false );
    var wt = caInfo['workTime'];
    startHour = wt.startHour;
    startMinute = wt.startMinute;
    endHour = wt.endHour;
    endMinute = wt.endMinute;
    if( isInitializing ){
        gotoBanner();
        isInitializing = false;
    }else{
        setCtrlVisible("cainfobar", false);
        showCAInfo();
    }
}

function showCAInfo(  ) {
    cardIn = DVB.isCardIn()  == 1 ? true : false ;
    if( !cardIn ){
        setCtrlVisible("canote", true);
        return;
    }else{
        if( caInfo == null )
        {
            setCtrlVisible("waitnote",true);
            DVB.getCAInfo();
            isGetting = true;
            return ;
        }
    }
    setCtrlText('cardID', caInfo['cardID']);
    setCtrlText('COSVer', caInfo['COSVer']);
    setCtrlText('STBVer', caInfo['STBVer']);
    setCtrlText('CASName', caInfo['CASName']);
    setCtrlText('areaCode', caInfo['areaCode']);
    setCtrlText('startFlag', caInfo['startFlag']  == 1 ? "已启用" : "未启用");
    setCtrlText('streamTime', caInfo['streamTime']);

    setCtrlText('isMother', caInfo['motherID'] == 0 ? "母卡" : "子卡");
    setCtrlText('motherID', caInfo['motherID']);
    setCtrlText('pinLocked', caInfo['pinLocked'] ? "已锁定" : "未锁定");
    rating = caInfo['watchRating'];
    setCtrlText('watchRating', rating);
    setCtrlText('workTime', startHour + ":" + startMinute + "~"+ endHour+":"+endMinute);
    setCtrlVisible("cainfobar", true);
}
function showSTBInfo() {
    setCtrlText('stbid', System.getStbID());
    setCtrlText('hwver', System.getHWVersion());
    setCtrlText('softver', System.getSoftVersion());
    setCtrlText('pubdate', System.getPBDate());
    setCtrlText('bossnum', System.getClientSN());
    setCtrlVisible("infobar", true);
}
function dealPinKey(keycode) {
    switch (keycode) {
    case UP:
        if (isReady) {
            setBtnFocus(false, "confirm");
            curEditFocus = 0;
            enableEditFocus();
            moveEditFocus();
            isReady = false;
        } else {
            setCtrlText("num" + curInputFocus  + (curEditFocus - 1), "*");
            clearEditFocus();
            if (curInputFocus > 0) {
                curInputFocus--;
            }
            curEditFocus = 0;
            moveInputFocus();
            moveEditFocus();
        }
        return true;
    case DOWN:
        setCtrlText("num" + curInputFocus  + (curEditFocus - 1), "*");
        if (curInputFocus == 2) {
            disableEditFocus();
            isReady = true;
            setBtnFocus(true, "confirm");
        } else if (curInputFocus < 2) {
            clearEditFocus();
            curInputFocus++;
            curEditFocus = 0;
            moveInputFocus();
            moveEditFocus();
        }
        return true;
    case LEFT:

        if (curEditFocus == 0 || isReady) {//失去焦点
            isLeft = true;
            setCtrlText("num" + curInputFocus  + curEditFocus , "*");

            clearEditFocus();
            disableEditFocus();
            curInputFocus = 0;
            curEditFocus = 0;
            isReady = false;
            setBtnFocus(false, "confirm");
        } else if (curEditFocus > 0) {
            clearEditFocus();
            curEditFocus--;
            moveEditFocus();
            setCtrlText("num" + curInputFocus  + (curEditFocus + 1), "*");
        }
        return true;
    case RIGHT:
        if( isReady ) return true;
        setCtrlText("num" + curInputFocus  + (curEditFocus - 1), "*");

        clearEditFocus();
        curEditFocus++;
        if (curEditFocus >= maxInputCount)
            curEditFocus = 0;
        moveEditFocus();
        return true;
    case ENTER:
        var oldPin =  inputText0.join("");
        var newPin =  inputText1.join("");
        var repeat = inputText2.join("");
        if (askDlg == null){
            askDlg = new AskDialog();
            askDlg.baseImg = "../img/";
        }
        if( oldPin.length != 8 ){
            readyToChange = false;
            askDlg.popDlg('修改PIN码', '输入的旧PIN码的长度不是8位，请重新输入！', askPinHandle);
        }else if( newPin != repeat ){
            readyToChange = false;
            askDlg.popDlg('修改PIN码', '再次输入的新PIN码不一致，请重新输入！', askPinHandle);
        }else if( newPin.length != 8 || repeat.length != 8 ){
            readyToChange = false;
            askDlg.popDlg('修改PIN码', '新PIN码的长度不是8位！', askPinHandle);
        }else{
            readyToChange = true;
            askDlg.popDlg('修改PIN码', '三次PIN码错误将锁定智能卡!!!</br>确定修改？', askPinHandle);
        }
        isAsking = true;
        setBtnFocus( false, "confirm" );
        return true;
    }
}
function dealRatingKey( keyCode )
{
    switch (keyCode) {
    case UP:
        if( isReady ){
            setBtnFocus(false,"confirm");
            isReady = false;
            moveEditFocus();
            enableEditFocus();
        }else if( curInputFocus == 1){
            clearEditFocus();
            setCtrlText("num" + curInputFocus  + (curEditFocus - 1 ) , "*");

            curInputFocus = 0;
            curEditFocus = 0;
            setCtrlVisible("editfocus", false);
            moveInputFocus();
        }

        return true;
    case DOWN:
        if( curInputFocus == 0 ){
            curInputFocus = 1;
            curEditFocus = 0;
            enableEditFocus();
            moveInputFocus();

            moveEditFocus();
            
        }else if( curInputFocus == 1){
            isReady = true;
            setCtrlText("num" + curInputFocus  + (curEditFocus - 1), "*");
            disableEditFocus();
            curEditFocus = 0;
            setBtnFocus( true, "confirm" );
        }
        return true;
    case LEFT:
        if (curInputFocus == 0) {
            if (rating > 3)
                rating--;
            setCtrlText("num03", rating);
        } else if (curInputFocus == 1) {
            if (curEditFocus == 0 || isReady) {//失去焦点
                isLeft = true;
                setCtrlText("num" + curInputFocus  + curEditFocus , "*");

                clearEditFocus();
                curInputFocus=0;
                curEditFocus = 0;
                disableEditFocus();
                isReady = false;
                setBtnFocus(false, "confirm");
            } else if (curEditFocus >0) {
                clearEditFocus();
                curInputFocus = 1;
                curEditFocus--;
                moveEditFocus();
                setCtrlText("num" + curInputFocus  + (curEditFocus + 1), "*");

            }
        }
        return true;
    case RIGHT:
        if( isReady ) return;
        if( curInputFocus == 0){
            if (rating < 18)
                rating++;
            setCtrlText("num03", rating);
        }else if( curInputFocus == 1 ){
            setCtrlText("num" + curInputFocus  + (curEditFocus - 1), "*");
            clearEditFocus();
            if( ++curEditFocus > 7)
                curEditFocus = 0;
            moveEditFocus();
        }
        return true;
    case ENTER:
        if (askDlg == null){
            askDlg = new AskDialog();
            askDlg.baseImg = "../img/";
        }
        var pin = inputText1.join("");
        if( pin.length != 8 ){
            askDlg.popDlg('修改观看级别', '输入的PIN码的长度不是8位，请重新输入！', askRatingHandle);
             isAsking = true;
        }else{
            changeRating( pin );
        }
        setBtnFocus( false, "confirm" );
        return true;
    }
}
function dealWorkTimeKey(keyCode)
{
    switch (keyCode) {
    case UP:
        if (isReady) {
            setBtnFocus(false, "confirm");
            curEditFocus = 0;
            enableEditFocus();
            moveEditFocus();
            isReady = false;
        } else {
            if( curInputFocus == 2)
                setCtrlText("num" + curInputFocus  + (curEditFocus - 1), "*");

            clearEditFocus();
            if (curInputFocus > 0) {
                curInputFocus--;
            }
            moveInputFocus();
            curEditFocus = 2;
            moveEditFocus();
        }
        return true;
    case DOWN:
        if (curInputFocus == 2) {
            setCtrlText("num" + curInputFocus  + (curEditFocus - 1), "*");
            disableEditFocus();
            isReady = true;
            setBtnFocus(true, "confirm");
        } else if (curInputFocus < 2) {
            clearEditFocus();
            curInputFocus++;
            moveInputFocus();
            if( curInputFocus < 2 )
                curEditFocus = 2;
            else
                curEditFocus = 0;
            moveEditFocus();
        }
        return true;
    case LEFT:
        if( curInputFocus == 2 ){//失去焦点
            if (curEditFocus == 0 || isReady) {
                isLeft = true;
                setCtrlText("num" + curInputFocus  + curEditFocus , "*");

                clearEditFocus();
                disableEditFocus();
                curInputFocus = 0;
                curEditFocus = 0;
                isReady = false;
                setBtnFocus(false, "confirm");
                return true;
            }else{
                clearEditFocus();
                curEditFocus--;
                setCtrlText("num" + curInputFocus  + (curEditFocus + 1), "*");
                moveEditFocus();
            }

        } else {
            clearEditFocus();
            if (curEditFocus == 2) {//失去焦点
                isLeft = true;
                disableEditFocus();
                curInputFocus = 0;
                curEditFocus = 0;
                return true;
            }else if( curEditFocus == 3)
                curEditFocus = 2;
            else if( curEditFocus == 5)
                curEditFocus = 3;
            else if( curEditFocus == 6)
                curEditFocus = 5;
            moveEditFocus();
        }
        return true;
    case RIGHT:
        if( isReady ) return;

        if( curInputFocus ==2 ){
            setCtrlText("num" + curInputFocus  + (curEditFocus - 1), "*");
            clearEditFocus();
            curEditFocus++;
            if (curEditFocus >= maxInputCount)
                curEditFocus = 0;
            moveEditFocus();
        }else{
            clearEditFocus();
            if( curEditFocus == 2)
                curEditFocus = 3;
            else if( curEditFocus == 3)
                curEditFocus = 5;
            else if( curEditFocus == 5)
                curEditFocus = 6;
            else if( curEditFocus == 6)
                curEditFocus = 2;
            moveEditFocus();
        }

        return true;
    case ENTER:
        var pin = inputText2.join("");
        var startTime = inputText0.join("");
        var startHour1 = parseInt( startTime.substring(0,2) );
        var startMinute1 = parseInt( startTime.substring(2,4) );
        var endTime = inputText1.join("");
        var endHour1 = parseInt(  endTime.substring(0,2)  );
        var endMinute1 = parseInt( endTime.substring(2,4) );
        if( startHour > 23 || endHour > 23 || endMinute > 59 || startMinute > 59){
            if (askDlg == null){
                askDlg = new AskDialog();
                askDlg.baseImg = "../img/";
            }

            askDlg.popDlg('修改工作时段', '小时介于0～23之间，分钟介于0～59，请重新输入！', askRatingHandle);
            isAsking = true;
        }else if( pin.length != 8 ){
            if (askDlg == null){
                askDlg = new AskDialog();
                askDlg.baseImg = "../img/";
            }
            askDlg.popDlg('修改工作时段', '输入的PIN码的长度不是8位，请重新输入！', askRatingHandle);
            isAsking = true;
        }else{
            var ret = DVB.modifyWorkTime(pin, startHour1, startMinute1, endHour1, endMinute1 );
            if( msgBox == null ){
                msgBox = new MessageBox();
            }
            if( ret == 0){
                msgBox.popMessage('修改工作时段', '修改成功，按确认键返回', msgBoxHandle);
                startHour = startHour1;
                startMinute = startMinute1;
                endHour = endHour1;
                endMinute = endMinute1;
            }else if( ret == 3 ){
                msgBox.popMessage('修改工作时段', "PIN码已被锁定！", msgBoxHandle);
            }else{
                msgBox.popMessage('修改工作时段', "PIN码错误，请谨慎操作！", msgBoxHandle);
            }
            showInfo = true;
        }

        setBtnFocus( false, "confirm" );
        return true;
    }
}
function moveUp() {
    if (!isLeft) {//处理右边
        if (bannerFocus == 2) {
            if (listFocus > 0) {
                focus.style.top = (parseInt(focus.style.top) - 50) + "px";
                listFocus--;
            }
        } else if (bannerFocus == 3) {//change pin
            dealPinKey(UP);
        } else if (bannerFocus == 4) {//change rating
            dealRatingKey( UP );
        } else if (bannerFocus == 5) {//change work time
            dealWorkTimeKey( UP );
        }
    } else { //处理左边一级菜单
        if (bannerFocus > 0) {
            focus.style.top = (parseInt(focus.style.top) - focusHeight) + "px";
            bannerFocus--;
            if (bannerFocus > 2)
                setCtrlVisible("confirm", true);
            else
                setCtrlVisible("confirm", false);
            if (bannerFocus == 0) {
                setCtrlVisible("cainfobar", false);
                showSTBInfo();

            } else if (bannerFocus == 1) {
                setCtrlVisible("enter", false);
                setCtrlVisible("authinfo", false);
                setCtrlVisible("empty", false);
                showCAInfo();
            } else if (bannerFocus == 2) {
                hideChangePIN();
                setCtrlVisible("enter", true);
                showAuthInfo();
            } else if (bannerFocus == 3) { //change pin
                hideChangeRating();
                showChangePIN();
            } else if (bannerFocus == 4) {
                hideChangeWorkTime();
                showChangeRating();
            }
        }
    }
    return true;
}
function moveDown() {
    if( !cardIn )
    {
         setCtrlVisible("canote", true);
        return true;
    }
    if (!isLeft) { //右边

        if (bannerFocus == 2) {
            if (listFocus < infoList.length - 1 && listFocus < MAX_OPERATOR - 1) {
                focus.style.top = (parseInt(focus.style.top) + 50) + "px";
                listFocus++;
            }
        } else if (bannerFocus == 3) {//change pin

            dealPinKey( DOWN );
        } else if (bannerFocus == 4) {//change rating
            dealRatingKey( DOWN );
        } else if (bannerFocus == 5) {//change work time
            dealWorkTimeKey( DOWN );
        }
    } else {//左边一级菜单
        if (bannerFocus < 5) {
            focus.style.top = (parseInt(focus.style.top) + focusHeight) + "px";
            bannerFocus++;
            if (bannerFocus > 2)
                setCtrlVisible("confirm", true);
            else
                setCtrlVisible("confirm", false);
            if (bannerFocus == 1) { //显示CA信息
                setCtrlVisible("infobar", false);
                showCAInfo();
            } else if (bannerFocus == 2) { //显示授权信息
                setCtrlVisible("cainfobar", false);
                setCtrlVisible("enter", true);
                showAuthInfo();
                if (infoList == null) {
                    setCtrlVisible("empty", true);
                } else {
                    setCtrlVisible("empty", false);
                }
            } else if (bannerFocus == 3) { //显示PIN
                setCtrlVisible("empty", false);

                setCtrlVisible("authinfo",false);
                setCtrlVisible("empty", false);
                setCtrlVisible("enter", true);
                showChangePIN();
            } else if (bannerFocus == 4) {//修改观看级别
                showChangeRating();
            } else if (bannerFocus == 5) {//修改工作时段
                hideChangeRating();
                showChangeWorkTime();
            }
        }
    }
    return true;
}

function moveLeft() {
    if (!isLeft)//右边
    {
        if (bannerFocus == 2) {
            isLeft = true;
            focus.style.display = "none";
            focus = document.getElementById("bannerFocus");
            focus.style.display = "inline";
        } else if (bannerFocus == 3) {//change pin
            dealPinKey( LEFT );
        } else if (bannerFocus == 4) {//change rating
            dealRatingKey( LEFT );
        } else if (bannerFocus == 5) {//change work time
            dealWorkTimeKey( LEFT );
        }
    }
    return true;
}
function moveRight() {
    if (bannerFocus < 2)
        return;
    if (!isLeft) {//右边
        if (bannerFocus == 3) { //change pin
            dealPinKey( RIGHT );
        } else if (bannerFocus == 4) {//change rating
            dealRatingKey( RIGHT );
        } else if (bannerFocus == 5) {//change work time
            dealWorkTimeKey( RIGHT );
        }
    } else {//左边
        isLeft = false;
        if (bannerFocus == 2 && infoList.length > 0) {
            focus.style.display = "none";
            focus = document.getElementById("listfocus");
            focus.style.display = "inline";

        } else if (bannerFocus == 3) { //change pin
            inputText0 = new Array(8);
            inputText1 = new Array(8);
            inputText2 = new Array(8);
            curInputFocus = 0;
            curEditFocus = 0;
            moveInputFocus();
            moveEditFocus();
            enableEditFocus();
        } else if (bannerFocus == 4) {//change rating
            inputText1 = new Array(8);
            curInputFocus = 0;
            curEditFocus = 0;
            moveInputFocus();
            moveEditFocus();
            setCtrlVisible("inputfocus", true);
            isLeft = false;
        } else if (bannerFocus == 5) {//change work time
            inputText0 = [parseInt( startHour/10 ),startHour%10,
                          parseInt( startMinute/10 ),startMinute%10];
            inputText1 = [parseInt( endHour/10 ),endHour%10,
                          parseInt( endMinute/10 ),endMinute%10];

            inputText2 = new Array(8);
            curInputFocus = 0;

            moveInputFocus();
            enableEditFocus();
            curEditFocus = 2;
            moveEditFocus();
        }
    }
    return true;
}
function clearEditText() {
    setCtrlText("num" + curInputFocus + curEditFocus, "*");
}

function dealNum(num) {

    var realNum = num - NUM_0;
    switch (bannerFocus) {
    case 3: //change pin
        switch (curInputFocus) {
        case 0:
            inputText0[curEditFocus] = realNum;
            break;
        case 1:
            inputText1[curEditFocus] = realNum;
            break;
        case 2:
            inputText2[curEditFocus] = realNum;
            break;
        }
        setCtrlText("num" + curInputFocus + (curEditFocus - 1), "*");
        setCtrlText("num" + curInputFocus + curEditFocus, realNum);
        if (curEditFocus == 7) {
            setTimeout("clearEditText()", 300);
        }
        if (curEditFocus < 7) {
            clearEditFocus();
            curEditFocus++;
            moveEditFocus();
        }
        break;
    case 4://change rating
        if( curInputFocus == 1){
            inputText1[curEditFocus] = realNum;
            setCtrlText("num" + curInputFocus + (curEditFocus - 1), "*");
            setCtrlText("num" + curInputFocus + curEditFocus, realNum);
            if (curEditFocus == 7) {
                setTimeout("clearEditText()", 300);
            }
            if (curEditFocus < 7) {
                clearEditFocus();
                curEditFocus++;
                moveEditFocus();
            }
        }
        break;
    case 5: //change work time
        if( curInputFocus < 2 ){
            setCtrlText("num" + curInputFocus + curEditFocus, realNum);
            clearEditFocus();
            if (curEditFocus == 2){
                curEditFocus = 3;
                if( curInputFocus == 0 )
                    inputText0[0] = realNum;
                else
                    inputText1[0] = realNum;
            }else if( curEditFocus == 3 ){
                curEditFocus = 5;
                if( curInputFocus == 0 )
                    inputText0[1] = realNum;
                else
                    inputText1[1] = realNum;
            }else if( curEditFocus == 5 ){
                curEditFocus = 6;
                if( curInputFocus == 0 )
                    inputText0[2] = realNum;
                else
                    inputText1[2] = realNum;
            }else{
                if( curInputFocus == 0 )
                    inputText0[3] = realNum;
                else
                    inputText1[3] = realNum;
            }
            moveEditFocus();
        }else{
            inputText2[curEditFocus] = realNum;
            setCtrlText("num" + curInputFocus + (curEditFocus - 1), "*");
            setCtrlText("num" + curInputFocus + curEditFocus, realNum);
            if (curEditFocus == 7) {
                setTimeout("clearEditText()", 300);
            }
            if (curEditFocus < 7) {
                clearEditFocus();
                curEditFocus++;
                moveEditFocus();
            }
        }
        break;
    }
}



function dealKey(keyCode) {
    if( isGetting )
        return true;
    switch (keyCode) {
    case UP:
        moveUp();
        return true;
    case DOWN:
        moveDown();
        return true;
    case LEFT:
        moveLeft();
        return true;
    case RIGHT:
        moveRight();
        return true;
    case ENTER:
        if (!isLeft && bannerFocus == 2 && infoList != null) {
            var id = infoList[listFocus].ID;
            window.location.href = 'dvtauth.html?id=' + id;
        } else if (bannerFocus == 3 && isReady) { //change pin confirm
            dealPinKey( ENTER );
        } else if( bannerFocus == 4 && isReady ){ //change rating
            dealRatingKey( ENTER );
        }else if( bannerFocus == 5 && isReady ){
            dealWorkTimeKey( ENTER);
        }
        return true;
    case NUM_0:
    case NUM_1:
    case NUM_2:
    case NUM_3:
    case NUM_4:
    case NUM_5:
    case NUM_6:
    case NUM_7:
    case NUM_8:
    case NUM_9:
        if( isReady ) return true;
        dealNum(keyCode);
        return true;
    case RETURN:
    case EXIT:
        goBackWithUrl('../setting.html?focus=2');
        return true;
    }
}
function changeRating( pin)
{
    var ret =  DVB.modifyRating( pin , rating);
    if( msgBox == null ){
        msgBox = new MessageBox();
    }
    if( ret == 0){
        msgBox.popMessage('修改观看级别', '修改成功，按确认键返回', msgBoxHandle);
        caInfo['watchRating'] = rating;
        showInfo = true;
    }else if( ret == 3 ){
        msgBox.popMessage('修改观看级别', "PIN码已被锁定！", msgBoxHandle);
        showInfo = true;
    }else{
        msgBox.popMessage('修改观看级别', "PIN码错误，请谨慎操作！", msgBoxHandle);
        showInfo = true;
    }
}
function keyHandle() {
    var keyCode = event.keyCode;
    if( showInfo && msgBox != null  ){
        msgBox.keyIn( keyCode );
        return true;
    }
    if(  isAsking && askDlg != null ){
        askDlg.keyIn( keyCode );
        return true;
    }
    return dealKey(keyCode);
}
function askPinHandle( sel )
{
    isAsking = false;
    askDlg.hide();
    if (sel == true && readyToChange ){

        var ret =  DVB.modifyPin( inputText0.join("") , inputText1.join(""));
        if( msgBox == null ){
            msgBox = new MessageBox();
        }
        if( ret == 0){
            msgBox.popMessage('修改PIN码', '修改成功，按确认键返回', msgBoxHandle);
            showInfo = true;
        }else if( ret == 3 ){
            msgBox.popMessage('修改PIN码', "PIN码已被锁定！", msgBoxHandle);
            showInfo = true;
        }else{
            msgBox.popMessage('修改PIN码', "PIN码错误，请谨慎操作！", msgBoxHandle);
            showInfo = true;
        }
    }
    readyToChange = false;
    askDlg = null;

    setBtnFocus( true, "confirm");
}
function askRatingHandle( sel )
{
    isAsking = false;
    askDlg.hide();
    setBtnFocus( true, "confirm");
    askDlg = null;
}
function msgBoxHandle()
{
    msgBox.hide();
    setBtnFocus( true, "confirm");
    showInfo = false;
    msgBox = null;
}

function cardInHandle()
{
     cardIn = true;
//    if(bannerFocus == 0){
//        setCtrlVisible("infobar", true);
        setCtrlVisible("canote",false);
//        DVB.getCAInfo();
//        setCtrlVisible("waitnote", true);
//    }
}
function gotoBanner()
{
    var param = new Parameter();
    var curFocus = param.getParamInt('focus');
    cardIn = DVB.isCardIn()  == 1 ? true : false ;
    if( curFocus > 0){
        if( !cardIn ){
            setCtrlVisible("canote", true);
            return;
        }else{
            if( caInfo == null ) {
                setCtrlVisible("waitnote",true);
                DVB.getCAInfo();
                isGetting = true;
                isInitializing = true;
                return ;
            }
        }
    }
    switch (curFocus)
    {
    case 0:
        showSTBInfo();
        break;
    case 1:
        dealKey(DOWN);
        break;
    case 2:
        dealKey(DOWN);
        dealKey(DOWN);
        break;
    case 3:
        dealKey(DOWN);
        dealKey(DOWN);
        dealKey(DOWN);
        break;
    case 4:
        dealKey(DOWN);
        dealKey(DOWN);
        dealKey(DOWN);
        dealKey(DOWN);
        break;
    case 5:
        dealKey(DOWN);
        dealKey(DOWN);
        dealKey(DOWN);
        dealKey(DOWN);
        dealKey(DOWN);
        break;
    default:
        showSTBInfo();
        break;
    }
    delete param;
}

function pageinit() {
    DVB.stop();
    DVB.cardInSignal.connect( cardInHandle );
    DVB.gotCAInfoSignal.connect( gotCAInfo );
    window.onkeydown = keyHandle;
    focus = document.getElementById("bannerFocus");
    gotoBanner();
}
