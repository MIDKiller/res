function pageinit()
{
	window.onkeydown = keyHandle;
}
function keyHandle()
{
	var code = event.keyCode;
	var val = "";
	switch (code)
	{
	case NUM_0:	val = "0"; break;
	case NUM_1:	val = "1"; break;
	case NUM_2:	val = "2"; break;
	case NUM_3:	val = "3"; break;
	case NUM_4:	val = "4"; break;
	case NUM_5:	val = "5"; break;
	case NUM_6:	val = "6"; break;
	case NUM_7:	val = "7"; break;
	case NUM_8:	val = "8"; break;
	case NUM_9:	val = "9"; break;
	case LEFT:	val = "左"; break;
	case RIGHT:	val = "右"; break;
	case UP:	val = "上"; break;
	case DOWN:	val = "下"; break;
	case GREEN:	val = "绿";break;
	case ENTER:	val = "确定"; break;
	case VOL_UP:	val = "音量+";break;
	case VOL_DOWN:	val = "音量-";break;
	case KEY_MUTE:	val = "静音"; break;
	case chan_UP:	val = "频道+";break;
	case chan_DOWN:	val = "频道-";break;
	case vol_Track:	val = "声道";break;
	case  FAV:	val = "喜爱";break;
	case KEY_HOME : val = "主菜单"; break;

       // case RED :                 val ="红";break;
       // case BLUE :              val ="蓝";break;
       // case YELLOW :        val ="黄";break;
       // case EPG :                  val = "指南";break;
       // case LIST:                   val="节目列表"; break;
       //case JUMP:                 val="跳转"; break;
       // case VATIO:               val = "幅宽比";break;
       //case TV:                      val = "电视"; break;
	case UpPage:
		window.location.href = 'usb.html?passed=' + getPassed(3);
		break;
	case DownPage:
		window.location.href = 'net.html?passed=' + getPassed(3);
		break;
	case RETURN:
	case EXIT:
		window.location = "mainpage.html?focus=3&passed="+ getPassed(3);
		break;
        default:break;
        }
	document.getElementById("value").innerHTML = val;
	return false;
}
