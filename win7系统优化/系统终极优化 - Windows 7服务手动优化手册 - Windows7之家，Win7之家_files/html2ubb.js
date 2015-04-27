function copyUBB()
{
    var content = document.getElementById("news_content_ubb");
    var temp = document.getElementById("temp");
    temp.innerHTML = content.innerHTML;
    
    var imgs = temp.getElementsByTagName("img");
    
    for(var i = 0; i<imgs.length; i++)
    {
        if (imgs[i].src.toLowerCase().indexOf('http://') != 0 && imgs[i].src.toLowerCase().indexOf('/') == 0)
        {
            imgs[i].src = "http://www.vista123.com/" + imgs[i].src;
        }
    }
    
    document.getElementById('ubb').value=html_trans(document.getElementById('temp').innerHTML);
    clipboardData.setData('Text',document.getElementById('ubb').value);
    alert('新闻内容已经转换成论坛支持的UBB代码并复制到剪粘版，可以粘帖到论坛里发表');
    return false;
}
function html_trans(str) {
	str = str.replace(/\r/g,"");
	str = str.replace(/on(load|click|dbclick|mouseover|mousedown|mouseup)="[^"]+"/ig,"");
	str = str.replace(/<script[^>]*?>([\w\W]*?)<\/script>/ig,"");
	
	str = str.replace(/<a[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>/ig,"[url=$1]$2[/url]");
	
	str = str.replace(/<font[^>]+color=([^ >]+)[^>]*>(.*?)<\/font>/ig,"[color=$1]$2[/color]");
	
	str = str.replace(/<img[^>]+src="([^"]+)"[^>]*>/ig,"\n[img]$1[/img]\n");
	
	str = str.replace(/<([\/]?)b>/ig,"[$1b]");
	str = str.replace(/<([\/]?)strong>/ig,"[$1b]");
	str = str.replace(/<([\/]?)u>/ig,"[$1u]");
	str = str.replace(/<([\/]?)i>/ig,"[$1i]");
	
	str = str.replace(/&nbsp;/g," ");
	str = str.replace(/&amp;/g,"&");
	str = str.replace(/&quot;/g,"\"");
	str = str.replace(/&lt;/g,"<");
	str = str.replace(/&gt;/g,">");

	
	str = str.replace(/<br>/ig,"\n");
	str = str.replace(/<[^>]*?>/g,"");
	str = str.replace(/\[url=([^\]]+)\]\n(\[img\]\1\[\/img\])\n\[\/url\]/g,"$2");
	str = str.replace(/\n+/g,"\n");

	str = my_format(str);
	str = str.replace(/\n/g, "\n\n");
	
	return str;
}
function my_format(str){
   var cc,tempstr;
   cc = str;
   tempstr = "";
   var ss=cc.split("\n");
   for (var i=0; i< ss.length; i++ ){
        while (ss[i].substr(0,1)==" "||ss[i].substr(0,1)=="　"){ss[i]=ss[i].substr(1,ss[i].length);}
        if (ss[i].length>0) tempstr+=""+ss[i]+"\n";
   }
   return tempstr;
}

function trans(){
	var str = "";
	rtf.focus();
	rtf.document.body.innerHTML = "";
	rtf.document.execCommand("paste");
	str = rtf.document.body.innerHTML;
	if(str.length == 0) {
		alert("剪切板没有内容！");
		return "";
	}
	return html_trans(str);
}
function HighlightAll() {
	var tempval=eval("document.getElementById('text')");
	tempval.focus();
	tempval.select();
	therange=tempval.createTextRange();
	therange.execCommand("Cut"); //Copy
}

function runCode()  //定义一个运行代码的函数，

{
  var code=event.srcElement.parentElement.children[0].value;//即要运行的代码。
  var newwin=window.open('','','');  //打开一个窗口并赋给变量newwin。
  newwin.opener = null // 防止代码对论谈页面修改
  newwin.document.write(code);  //向这个打开的窗口中写入代码code，这样就实现了运行代码功能。
  newwin.document.close();

}