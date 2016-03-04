/*load predefind info from back ground page*/
var background = chrome.extension.getBackgroundPage();
var mws = background.mwsSetting;
var comment = background.comment;

	console.log(background);
	console.log(mws);
	console.log(comment);

	
/* set it*/
/*from bacckground page*/
/*only accepted node as a context*/
function $X(exp,context){
	/*context is a constrain for domain that element getting from*/
	var context = context ||document;
	/*exp is a attribute value such as ** in id="**", or class="" etc.*/
	var result = document.evaluate(exp,context,resolver,XPathResult.ANY_TYPE, null);
	switch(result.re){
		case XPath.STRING_TYPE:
			result.stringValue;
		case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
			var res = [];
			do{
				res.push(result.iterateNext());
				return ret;
			}while(result.iterateNext());
	}
	return null;
}

/*add callback function to form*/
function callback(){
	var button = document.getElementsByTagName('button');
		for(var i = 0; i < button.length - 1; i++){
			if((i % 2)==0){
				button[i].addEventListener("click",function(){
					var type = this.parentNode;
						type = type.getAttribute("id")
					var textarea = this.parentNode;
						textarea = textarea.getElementsByTagName("textarea");
						console.log(textarea[0].parentNode)
						if(type == "new"||"like new"||"very good"||"good"||"acceptable"){
							var info = {}
								info.url = document.URL;
								info.type = type;
								info.info = textarea[0].parentNode.getAttribute("id");
								info.change = true;
								console.log(info)
							chrome.runtime.sendMessage(info,function(){
								alert("changeing your comment is success");
							});
						}else{
							var info = {}
								info.url= document.URL;
								info.type = type
								info.info =	textarea[0].parentNode.getAttribute("id");
								info.change = true
							chrome.runtime.sendMessage(info,function(){
								alert("setting your mws infomation is success");
							});
						}
				})
			}
			else{
				button[i].addEventListener("click",function(){
					var textarea = this.parentNode;
					var x = textarea.getElementsByTagName("textarea");
					console.log(x[0])
					x[0].value = "";
				});
			}
		}
}

/*tab switching*/
function activation(section,list){
	console.log("activate")
	for (var i = section.length - 1; i >= 0; i--) {
			var temp=list.childNodes;
			console.log(temp)
			temp=temp[1].textContent;
			console.log(temp)
			console.log(section[i].getAttribute("id")==temp)
			if(section[i].getAttribute("id")==temp){
				section[i].className="active";
			}else{
				section[i].className="none";
			}
	};
};

function match(elements,object){
	var keys = Object.keys(object);
	for(var i=0; i<=elements.length-1; i++){
		for(var s=0; s<=keys.length-1; s++){
			if(elements[i].getAttribute("id")==keys[s]){
				console.log(i)
				var textarea = elements[i].getElementsByTagName("textarea");
					textarea[0].value=object[keys[s]]
			}
		}
	}
}


function setting(){
/* for tab selecting*/
	var list = document.getElementById("tabs");
	list = document.getElementsByTagName("li");

	var section=document.getElementsByTagName("section");

	for (var i = list.length - 1; i >= 0; i--) {
		list[i].addEventListener("click",function(){
		activation(section,this);
		}
	)};
/*load setting*/
	var info={}
		info.type = "default";
	chrome.runtime.sendMessage(info, function(response){
		var mws = response.mws
		var comment = response.comment;
		var commentDiv = document.getElementById("comment");
			commentDiv = commentDiv.getElementsByTagName('div')
		var mwsDiv = document.getElementById("mws");
			mwsDiv = mwsDiv.getElementsByTagName("div")
		match(mwsDiv,mws);
		match(commentDiv,comment)
	})

};

window.onload = function(){
	callback();
	setting();
}