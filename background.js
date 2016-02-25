var comment ={
		"new":"",
		"almostNew":"",
		"veryGood":"",
		"good":"",
		"acceptable":""
};

var mws = {
	"id":"",
	"pass":""
};

/*if something is changed in product administration page please change these function too*/
function comment(scrape){
	switch(scrape){
		case "New|New":
			return comment.new;
			break;
		case "Used|LikeNew":
			return comment.almostNew;
			break	
		case "Used|veryGood":
			return veryGood;
			break;
		case "Used|Good":
			return good;
			break
		case "Used|Acceptable":
			return acceptable;
			break;
	}
}

function mws(type){
	switch(type){
		case "id":
			return mws.id;
			break;
		case "pass":
			return mws.pass;
			break;
	}
}

function price(){
	amazonFbaPrice(mws(id),mws(pass))
};

var item={};

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){
	var response = request.response;
	if(response.item){
		var item = response.condition;
		var condition = item.condition;
			item.comment = comment(condition);
			item.price = price(mws.id,mws.pass,fba);
		chrome.tabs.executeScript(tab.id,comment.js);
	}else if(response.html){
		var html = response.html;
		if(html.info){
			var info = html.info
			if(info.id){
				mws.id = info.id;
			}else if(info.pass){
				mws.id = info.pass;
			}
		} 
	}else if(response.consequence){
		sendMessage("success");
	}
});