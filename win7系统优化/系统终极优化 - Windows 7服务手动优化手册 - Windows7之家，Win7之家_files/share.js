function ShareButtons(){
document.write('<div class="social_share">');
document.write('<img src=/images/shareto.png>分享到： ');
document.write('<a href="javascript:shareto(\'qzone\');"> <img src=/images/qzone.png>QQ空间</a>');
document.write('<a href="javascript:shareto(\'tqq\');"> <img src=/images/qqbo.png>QQ微博</a>');
document.write('<a href="javascript:shareto(\'sina\');"> <img src=/images/sina.png>新浪微博</a>');
document.write('<a href="javascript:shareto(\'kaixin\');"> <img src=/images/kaixin.png>开心网</a>');
document.write('<a href="javascript:shareto(\'renren\');"> <img src=/images/renren.png>人人网</a>');
document.write('</div>');
}
function shareto(id){
	var url=encodeURIComponent(document.location.href);
	var title=encodeURIComponent(document.title);
	if(id=="fav"){
		addBookmark(document.title);
		return;
	}else if(id=="qzone"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'QZone', 1]);
		window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+url);
		return;
	}else if(id=="twitter"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'Twitter', 1]);
		window.open('http://twitter.com/home?status='+title+encodeURIComponent(' ')+url,'_blank');
		return;
	}else if(id=="sina"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'SinaT', 1]);
		//window.open('http://v.t.sina.com.cn/share/share.php?title='+title+'&url='+url+'&source=bookmark','_blank');
		window.open("http://v.t.sina.com.cn/share/share.php?url="+url+"&appkey=1369706960&title="+title+"&pic=","_blank","width=615,height=505");
		return;
	}else if(id=="qqshuqian"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'QQShuqian', 1]);
		window.open('http://shuqian.qq.com/post?from=3&jumpback=2&noui=1&uri='+url+'&title='+title,'_blank','width=930,height=570,left=50,top=50,toolbar=no,menubar=no,location=no,scrollbars=yes,status=yes,resizable=yes');
		return;
	}else if(id=="baidu"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'Baidu', 1]);
		window.open('http://cang.baidu.com/do/add?it='+title+'&iu='+url+'&fr=ien#nw=1','_blank','scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes');
		return;
	}else if(id=="googlebuzz"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'GoogleBuzz', 1]);
		//window.open('http://www.google.com/buzz/post?url='+url+'&imageurl=');
		window.open('http://www.google.com/buzz/post?url='+url,'_blank');
		return;
	}else if(id=="douban"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'Douban', 1]);
		var d=document,e=encodeURIComponent,s1=window.getSelection,s2=d.getSelection,s3=d.selection,s=s1?s1():s2?s2():s3?s3.createRange().text:'',r='http://www.douban.com/recommend/?url='+e(d.location.href)+'&title='+e(d.title)+'&sel='+e(s)+'&v=1',x=function(){if(!window.open(r,'douban','toolbar=0,resizable=1,scrollbars=yes,status=1,width=450,height=330'))location.href=r+'&r=1'};
		if(/Firefox/.test(navigator.userAgent)){setTimeout(x,0)}else{x()}
		return;
	}else if(id=="renren"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'RenRen', 1]);
		window.open('http://www.connect.renren.com/share/sharer?url='+url+'&title='+title,'_blank');
		return;
	}else if(id=="xianguo"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'XianGuo', 1]);
		window.open('http://xianguo.com/service/submitdigg/?link='+url+'&title='+title,'_blank');
		return;
	}else if(id=="digu"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'Digu', 1]);
		window.open('http://www.diguff.com/diguShare/bookMark_FF.jsp?title='+title+'&url='+url,'_blank','width=580,height=310');
		return;
	}else if(id=="mail"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'Mail', 1]);
		window.open('mailto:?subject='+title+'&body='+encodeURIComponent('这是我看到了一篇很不错的文章，分享给你看看！\r\n\r\n')+title+encodeURIComponent('\r\n')+url);
		return;
	}else if(id=="tqq"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'TQQ', 1]);
		window.open('http://v.t.qq.com/share/share.php?title='+title+'&url='+url,'_blank');
		return;
	}else if(id=="kaixin"){
		_gaq.push(['_trackEvent', 'SocialShare', 'Share', 'Kainxin', 1]);
		window.open('http://www.kaixin001.com/~repaste/repaste.php?rurl='+url+'&rtitle='+title+'&rcontent='+title+url);
		return;
	}
}

function addBookmark(title){
    var url = parent.location.href;
    if (window.sidebar) { // Mozilla Firefox Bookmark
        window.sidebar.addPanel(title, url,"");
    } else if(document.all) { // IE Favorite
        window.external.AddFavorite( url, title);
    } else if(window.opera) { // Opera 7+
        return false; // do nothing
    } else { 
         alert('请按 Ctrl + D 为Chrome浏览器添加书签!');
    }
}



   function initPic()
    {
        //debugger;
        var news_content = document.getElementById("content");
        
        var imgs = news_content.getElementsByTagName("img");
        
        for(var i = 0; i<imgs.length; i++)
        {
            if (imgs[i].width >600)
            {
                imgs[i].width = 600;
                imgs[i].alt = "点击查看大图片";
                imgs[i].onclick = 	function()
              	 {
                 	zoom(this, this.src);
            	 }
                imgs[i].style.cursor = "pointer";
                imgs[i].id="img"+i;
            }
        }
        
               
			
    }
    
