// JavaScript Document

var DVBMSG = 0;
var TUNERMSG = 1;

var CAMESSAGE = [/*同方消息*/
		[
                   '',
		'无法识别卡',
		'智能卡过期，请更换新卡',
		'加扰节目，请插入智能卡',
		'卡中不存在节目运营商',
		'条件禁播',
		'当前时段被设定为不能观看',
		'节目级别高于设定的观看级别',
		'智能卡与本机顶盒不对应',
		'没有授权','节目解密失败',
		'卡内金额不足','区域不正确',
		'子卡需要和母卡对应，请插入母卡',
		'智能卡校验失败，请联系运营商',
		'智能卡升级中，请不要拔卡或者关机',
		'请升级智能卡','请勿频繁切换频道',
		'智能卡暂时休眠，请5分钟后重新开机',
		'智能卡已冻结，请联系运营商',
		'智能卡已暂停，请回传收视记录给运营商',
		'请重启机顶盒','机顶盒被冻结'
        ],

        [/*Irdeto消息*/
         '',
           "",
           "",
           "",
           "",
           "E04-4请插入智能卡",
           "E04-5无法识别智能卡,请与客服联系",
           "E04-33智能卡错误, 请与客服联系",
           "I07-4正在检测智能卡",
           "D102-9当前节目被加密,请与客服联系",
           "",
           "",
           "E04-30无效智能卡,请与客服联系",
           "",
           "",
           "",
           "",
           "",
           "",
           ""
		],

        [	/*数码视讯消息*/
           '',
           '收看级别不够',
           '不在收看时段内',
           '没有机卡对应',
           '',
           '请插入智能卡',
           '没有购买此节目',
           '运营商限制观看该节目',
           '运营商限制区域观看',
           '此卡为子卡，已经被限制收看，请与母卡配对',
           '余额不足，不能观看此节目，请及时充值',
           '此节目为IPPV节目，请到IPPV节目确认/取消购买菜单下确认购买此节目',
           '此节目为IPPV节目，您没有预订和确认购买，不能观看此节目',
           '此节目为IPPV节目，您没有预订和确认购买，不能观看此节目',
           '此节目为IPPT节目，您没有预订和确认购买，不能观看此节目',
           '',
           '',
           '',
           '',
           'IC卡被禁止服务',
           '',
           '此卡未被激活，请联系运营商',
           '请联系运营商回传IPP节目信息',
           '用户您好，此节目您尚未购买，正在免费预览中'
		],		
        [	/*天柏消息*/
           '',
           '请插入智能卡',
           '余额不足',
           '条件禁播',
           '观看级别不够',
           '节目授权过期',
           '节目未授权',
           '智能卡过期',
           '请插入正确智能卡',
           '机卡未配对',
		   '机顶盒开锁',
		   '机顶盒锁定'
		   ]
];
				
var TUNER_MESSAGE = "信号弱，请检查射频线是否插好！";

function onCaTunerMsg(msgType, msgCode)
{
	if (msgType == DVBMSG)
	{
		if (msgCode == 0)
		{
			hideNodeMessage('canote');
			return;
		}
        var CAType = DVB.getCAType();
		//alert (CAType);
        var str = CAMESSAGE[CAType][msgCode];
        if( str != null && str != '')
            showNodeMessage('canote', str );
	}
	else if (msgType == TUNERMSG)
	{
		if (msgCode == 0)
		{
			showNodeMessage('tunernote', TUNER_MESSAGE);
			FPanel.setSignalLed(false);
		}
		else
		{
			hideNodeMessage('tunernote');
			FPanel.setSignalLed(true);
		}
	}
}

function showNodeMessage(noteid, msg)
{
	var obj = document.getElementById(noteid);
	obj.innerHTML = msg;
	showCtrl(true, noteid);
}

function hideNodeMessage(noteid)
{
	showCtrl(false, noteid);
}
