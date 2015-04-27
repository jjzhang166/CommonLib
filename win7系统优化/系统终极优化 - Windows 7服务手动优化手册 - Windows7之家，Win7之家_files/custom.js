// JavaScript Document

function hot7()
{
    document.getElementById("con1").style.display = "";
    document.getElementById("con2").style.display = "none";
    document.getElementById("con3").style.display = "none";
    document.getElementById("con4").style.display = "none";
    document.getElementById("hot7").className = "current";
    document.getElementById("comm7").className = "";
    document.getElementById("month").className = "";
    document.getElementById("must").className = "";
}

function comm7() {
    document.getElementById("con1").style.display = "none";
    document.getElementById("con2").style.display = "";
    document.getElementById("con3").style.display = "none";
    document.getElementById("con4").style.display = "none";
    document.getElementById("hot7").className = "";
    document.getElementById("comm7").className = "current";
    document.getElementById("month").className = "";
    document.getElementById("must").className = "";
}

function month() {
    document.getElementById("con1").style.display = "none";
    document.getElementById("con2").style.display = "none";
    document.getElementById("con3").style.display = "";
    document.getElementById("con4").style.display = "none";
    document.getElementById("hot7").className = "";
    document.getElementById("comm7").className = "";
    document.getElementById("month").className = "current";
    document.getElementById("must").className = "";
}

function must() {
    document.getElementById("con1").style.display = "none";
    document.getElementById("con2").style.display = "none";
    document.getElementById("con3").style.display = "none";
    document.getElementById("con4").style.display = "";
    document.getElementById("hot7").className = "";
    document.getElementById("comm7").className = "";
    document.getElementById("month").className = "";
    document.getElementById("must").className = "current";
}

/* RSS */

function rss_list_on(){
	document.getElementById("rss_list").style.display = "block";
}
function rss_list_off(){
	document.getElementById("rss_list").style.display = "none";
}

function all_list()
{
    document.getElementById("all_list").style.display = "";
    document.getElementById("win7_list").style.display = "none";
    document.getElementById("all_nav").className = "current";
    document.getElementById("win7_nav").className = "";
}

function win7_list()
{
    document.getElementById("all_list").style.display = "none";
    document.getElementById("win7_list").style.display = "";
    document.getElementById("all_nav").className = "";
    document.getElementById("win7_nav").className = "current";
}

/* Comment */

function clearComment()
{
	var comment = document.getElementById("commentContent");

	if (comment.value == " 文明上网，友好发言") {
		comment.value = '';
		comment.onclick = function()
		{ }
	}
}

function addComment() {
	if ( document.getElementById("commentNick").value == '') {
		alert("请输入昵称！");
		document.getElementById("commentNick").focus();
		return false;
	}
	
	var comment = document.getElementById("commentContent");
				
	if ( comment.value == '' || comment.value == " 您的评论将会在几分钟后显示"  || comment.value.length<5) {
		alert("请输入评论内容,评论要求在五个字以上！！");
		document.getElementById("commentContent").focus();
		return false;
}

document.getElementById("btnComment").disabled = true;

	//$('commentform').submit();
}

// Rss

function rss_list_on(){
	document.getElementById("rss_list").style.display = "block";
}

function rss_list_off(){
	document.getElementById("rss_list").style.display = "none";
}

/* Cookie */

setCookie = function (nm, val, y) { var exp = ''; if (y) { var dt = new Date(); dt.setTime(dt.getTime() + (y * 86400000)); exp = '; expires=' + dt.toGMTString(); } document.cookie = nm + '=' + escape(val) + exp + ';path=/;domain=win7china.com'; }
getCookie = function (nm) { var m = ''; if (window.RegExp) { var re = new RegExp(';\\s*' + nm + '=([^;]*)', 'i'); m = re.exec(';' + document.cookie); } return (m ? unescape(m[1]) : ''); }


var ifm = document.getElementById("r_p_ifm");
if(ifm) {
	ifm.style.width = "310px";
	ifm.style.height = "200px";
} 