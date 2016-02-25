/*load predefind info from back ground page*/
var background = chrome.extension.getBackgroundPage();
var mws = background.mws;
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
			if((i % 2)==0||i==0){
				button[i].addEventListener("click",function(){
					var type = button[i].parentNode;
						type = type.getElementsByTagName("button");
						type = type[0].value;
						console.log(type);
					var textarea = button[i].parentNode;
						textarea = textarea.getElementsByTagName("textarea");
						console.log(textarea);
						if(type == "new"|"like new"|"very good"|"good"|"acceptable"){
							console.log("true")
							comment.type = info;
							alert("changeing your comment is success");
							chrome.runtime.sendMessage(info,function(){
								var info = true; 
							});
						}else{
							console.log("save mws")
							mws.type = info;
							alert("setting your mws infomation is success");
							chrome.runtime.sendMessage(info,function(){
								var info = true; 
							});
						}
					console.log(button[i])
				})
			}
			else{
				button[i].addEventListener("click",function(){
					var textarea = button[i].parentNode;
					console.log(textarea)
					var x = textarea.getElementsByTagName("textarea");
					x[0].value = "";
				});
				console.log(button[i]);
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

function setting(){
	console.log("abc")
	var list = document.getElementById("tabs");
	list = document.getElementsByTagName("li");

	var section=document.getElementsByTagName("section");

	for (var i = list.length - 1; i >= 0; i--) {
		list[i].addEventListener("click",function(){
		activation(section,this);
		}
	)};
};

window.onload = function(){
	callback();
	setting();
}