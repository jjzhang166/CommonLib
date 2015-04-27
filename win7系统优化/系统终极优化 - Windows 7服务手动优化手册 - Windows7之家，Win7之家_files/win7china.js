/* Right-bottom float window */

function notice(){
	if( getCookie("recommend") !== "n_close" ){
		document.getElementById('notice').innerHTML = '\
			<div id="recommend" class="recommend_box"> \
				<div class="box_title"><a class="close" href="javascript:;" onclick="notice_close()"></a><b>您还可能对以下内容感兴趣：</b></div> \
				<div class="img_title"><a href="http://down.ruanmei.com/tweakcube/partner/tweakcubesetup_u63.exe" target="_blank"><img width="280" height="150" alt="" src="http://file.ithome.com/images/tweakcube.gif"></a> \
					<div class="boxtitle"> \
						<div class="img_title_bg"></div> \
						<div class="img_title_txt"><a href="#" target="_blank"></a></div> \
					</div> \
				</div> \
				<ul class="artical_list"> \
					<li><a href="http://www.ithome.com/html/win10/140256.htm" target="_blank">Win10预览版10056中文ISO系统镜像下载</a></li> \
					<li><a href="http://www.ithome.com/html/win10/125121.htm" target="_blank">微软Win10/WP10预览版发布会终极汇总</a></li> \
					<li><a href="http://www.ithome.com/bibei/" target="_blank">Win8下载 | Win7下载 | 装机必备软件下载</a></li> \
				</ul> \
				<a href="#" class="more_artical" target="_blank">查看更多...</a> \
			</div>';
	}
}
notice();

function notice_close(){			
	document.getElementById('recommend').className = 'hide';
	setCookie('recommend','n_close',7);
}

/* 活动浮动广告 */
hd_float="<div id=\"hd_float\" style=\"position:fixed;left:50%;bottom:190px;margin-left:-680px;width:166px;\"><a class=\"close\" href=\"http://www.ithome.com/html/soft/142991.htm\" target=\"_blank\" style=\"display:block;width:121px;height:138px;background:url(http://img.ithome.com/images/v2.1/121x138_xzs2.gif) no-repeat;\"></a></div>"

document.write(hd_float);

/* 倒计时 */
function loadStyleString(css) {
    var style = document.createElement("style");
    style.type = "text/css";
    try {
        style.appendChild(document.createTextNode(css));
    } catch (ex) {
        style.styleSheet.cssText = css;
    }
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
}
loadStyleString(" \
	.countdown_counter{ position:relative;min-width:1000px;width:100%;border-bottom:1px solid #ddd;background:#f2f2f2 url(http://t2.qpic.cn/mblogpic/7151d5e02b8ee82d9ff4/2000) center no-repeat;} \
	a.countdown_close{ position:absolute;top:15px;right:15px;width:27px;height:27px;background:url(http://file.ithome.com/images/counterdown/countdown_close.png) 0 0 no-repeat;} \
	a.countdown_close:hover{ background-position:-27px 0; } \
	a.countdown_close:active{ background-position:-54px 0;} \
	.countdown_time{ position:relative;width:960px;height:333px;margin:0 auto;overflow:hidden;} \
	.countdown_time span{float:left;line-height:48px;height:48px;overflow:hidden;} \
	.countdown_time span.danwei{padding:0 1px;} \
	.countdown_time_p{ position:absolute;top:197px;display:none;} \
	.countdown_time1{ left:355px; } \
	.countdown_time2{ left:455px; } \
	.countdown_time3{ left:554px; } \
	.countdown_clear{height:0;clear:both;overflow:hidden;} \
	.countdown_hide{ display:none; } \
	.countdown_show{ display:block; } \
	a.more_info{display:block;width:100%;height:333px;overflow:hidden;} \
");

setCookie = function (nm, val, y) { var exp = ''; if (y) { var dt = new Date(); dt.setTime(dt.getTime() + (y * 86400000)); exp = '; expires=' + dt.toGMTString(); } document.cookie = nm + '=' + escape(val) + exp + ';path=/;domain=win7china.com'; }
getCookie = function (nm) { var m = ''; if (window.RegExp) { var re = new RegExp(';\\s*' + nm + '=([^;]*)', 'i'); m = re.exec(';' + document.cookie); } return (m ? unescape(m[1]) : ''); }
var pcm = document.createElement('div');
     pcm.id = "pc_c";
     pcm.className = "countdown_counter";
     pcm.innerHTML = ' \
     <a class="countdown_close" href="javascript:;" onclick="countdown_c()"></a> \
	 <div class="countdown_time" id="time1"> \
		<a href="http://nod32.ruanmei.com/" target="_blank" class="more_info"></a> \
        <div class="countdown_time_p countdown_time1"> \
            <span class="countdown_hide"><img id="hour_01" alt="" src="http://file.ithome.com/images/counterdown/countdown_numb.png"></span> \
            <span><img id="hour_02" alt="" src="http://file.ithome.com/images/counterdown/countdown_numb.png"></span> \
            <span><img id="hour_03" alt="" src="http://file.ithome.com/images/counterdown/countdown_numb.png"></span> \
         </div> \
        <div class="countdown_time_p countdown_time2"> \
            <span><img id="minute_01" alt="" src="http://file.ithome.com/images/counterdown/countdown_numb.png"></span> \
            <span><img id="minute_02" alt="" src="http://file.ithome.com/images/counterdown/countdown_numb.png"></span> \
        </div> \
        <div class="countdown_time_p countdown_time3"> \
            <span><img id="second_01" alt="" src="http://file.ithome.com/images/counterdown/countdown_numb.png"></span> \
            <span><img id="second_02" alt="" src="http://file.ithome.com/images/counterdown/countdown_numb.png"></span>  \
        </div> \
    </div>';
    
var first = document.body.firstChild;
//document.body.insertBefore(pcm,first);


//if( getCookie("pc_c_2") !== "countdown_hide" ){
//     document.getElementById('pc_c').style.display = 'block';
//}else{
//     document.getElementById('pc_c').style.display = 'none';
//}
function countdown_c(){
     document.getElementById('pc_c').style.display = 'none';
     setCookie('pc_c_2','countdown_hide',0.5);
}

var overa;
overa = new Date("08/06/2014 18:00:00"); // 设置时间
var localNow = new Date();
function clock1(){
var local = new Date();
var intDiff = overa.getTime() - local.getTime();
if(intDiff <= 0){
document.getElementById('hour_01').style.marginTop = '0';
document.getElementById('hour_02').style.marginTop = '0';
document.getElementById('hour_03').style.marginTop = '0';
document.getElementById('minute_01').style.marginTop = '0';
document.getElementById('minute_02').style.marginTop = '0';
document.getElementById('second_01').style.marginTop = '0';
document.getElementById('second_02').style.marginTop = '0';
return false;}
var day = Math.floor(intDiff / (1000 * 60 * 60 * 24));
var hour = Math.floor(intDiff / (1000 * 60 * 60)) - (day * 24);
var hour2 = Math.floor(intDiff / (1000 * 60 * 60));
var minute = Math.floor(intDiff / (1000 * 60)) - (day * 24 * 60) - (hour * 60);
var second = Math.floor(intDiff / 1000) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
if (hour2 <= 99) hour2 = '0' + hour2;
if (day <= 9) day = '0' + day;
if (hour2 <= 9) hour2 = '0' + hour2;
if (minute <= 9) minute = '0' + minute;
if (second <= 9) second = '0' + second;
//document.getElementById('day_01').style.marginTop = (day.toString().substr(0,1)) * (-48) +'px';
//document.getElementById('day_02').style.marginTop = (day.toString().substr(1,1)) * (-48) +'px';
document.getElementById('hour_01').style.marginTop = (hour2.toString().substr(0,1)) * (-48) +'px';
document.getElementById('hour_02').style.marginTop = (hour2.toString().substr(1,1)) * (-48) +'px';
document.getElementById('hour_03').style.marginTop = (hour2.toString().substr(2,1)) * (-48) +'px';
document.getElementById('minute_01').style.marginTop = (minute.toString().substr(0,1)) * (-48) +'px';
document.getElementById('minute_02').style.marginTop = (minute.toString().substr(1,1)) * (-48) +'px';
document.getElementById('second_01').style.marginTop = (second.toString().substr(0,1)) * (-48) +'px';
document.getElementById('second_02').style.marginTop = (second.toString().substr(1,1)) * (-48) +'px';
setTimeout("clock1()", 1000);
}
//clock1();
