var chanNum = 0 ;
var playingChan = 1;
var vol = 50;
var screenMod=0;
var arrScreenMod = ["4:3","16:9","全屏"];
function play()
{
    DVBPlayer.playTVChannel(playingChan);
    document.getElementById("curchan").innerHTML=playingChan ;
}
function setVolumn()
{
    DVBPlayer.setCurrentVolume(vol);
    AvConfig.setVolumeDirect(vol);

    document.getElementById("vol").innerHTML= vol;
}

function handleKey(  )
{
    var keyCode = event.keyCode;
    switch(keyCode )
    {
    case EXIT:
    case RETURN:
        DVBPlayer.stop();
        window.location="mainpage.html?focus=6&passed="+ getPassed(6);
        return false;
    case DOWN:
    case chan_DOWN:
        if( playingChan > 1)
                    playingChan--;
        play();
        break;
    case UP:
    case chan_UP:
        if( playingChan < chanNum )
            playingChan++;
        play();
        break;
    case VOL_UP:
    case RIGHT:
        if( vol < 100 )
            vol += 10;
        setVolumn();
        break;
    case VOL_DOWN:
    case LEFT:
        if( vol > 0 )
            vol -= 10;
        setVolumn();
        break;
    case YELLOW:
        if( screenMod++ == 2)
            screenMod =0;
        AvConfig.setShowRatio(screenMod);
        document.getElementById("ratio").innerHTML=arrScreenMod[screenMod];
        break;
    }
}

function pageinit()
{
    window.onkeydown = handleKey;
    chanNum = DVBPlayer.getTVChanNum();
   setVolumn();
    screenMod = AvConfig.getShowRatio();
    document.getElementById("ratio").innerHTML=arrScreenMod[screenMod];
    document.getElementById("vol").innerHTML=vol;
    document.getElementById("count").innerHTML=chanNum;
    play();
}
