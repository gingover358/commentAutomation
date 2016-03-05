var explanation ={
		"New":"返品、返金可。",
		"almostNew":"新品に近い商品です",
		"veryGood":"とてもいい状態です",
		"good":"いい状態です。",
		"acceptable":"使用感ありますが、商品昨日に問題ありません。"
};
var mwsSetting = {
	"mode": false,
	"AWSAccessKeyId":"AKIAIPZIKE3PCDQAFCWA",
	"SellerId":"A2BPYG5COR2NOD",
	"MWSAuthToken":"9760-1633-7075",
	"secretKey":"qX57ExhbEtK4TbvQJU7pB3otYuId7DRQUWg1g0qJ",
	"endpoint":"https://mws.amazonservices.jp/"
}

var MWS =JSON.stringify(mwsSetting);

function load(){
	chrome.storage.sync.get(explanation,function(matched){
		console.log(matched)
		if(matched!==null){
			explanation = matched;
			chrome.storage.sync.get(mwsSetting,function(matched){
				mws = matched;
				console.log("predefine")
			})
		}else{
			chrome.storage.sync.set(explanation,function(){
				console.log("default explanation is set");
			});
			chrome.storage.sync.set(mwsSetting,function(){
				console.log("default mwsSetting is set");
			});

		}
	})
}

load();

/*if something is changed in product administration page please change these function too*/
function explain(scrape){
	switch(scrape){
		case "New|New":
		case "new, new":
			return explanation.New;
			break;
		case "Used|LikeNew":
		case "used, like_new":
			return explanation.almostNew;
			break	
		case "Used|veryGood":
		case "used, very_good":
			return explanation.veryGood;
			break;
		case "Used|Good":
		case "used, good":
			return explanation.good;
			break
		case "Used|Acceptable":
		case "used, acceptable":
			return explanation.acceptable;
			break;
	}
}

function mws(type){
	switch(type){
		case "mode":
			return mws.mode;
			break;
		case "AWSAccessKeyId":
			return mws.AWSAccessKeyId;
		case "SellerId":
			return mws.SellerId;
			break;
		case "MWSAuthToken,":
			return mws.MWSAuthToken;
			break;
		case "secretKey":
			return mws.secretKey;
			break;
		case "endpoint":
			return mws.endpoint;
	}
}

function con(){
	console.log("con");
}

/*mws service*/
function signature(secretKey){
	/*encrypt with hash*/
	var secretKey=encodeHash156(secretKey);
	/*convert to uri with base64*/
	var secretKey=atob(secretKey)
	return secretKey;
}

function priceSet(AWSAccessKeyId,MWSAuthToken,SellerId,endPoint,Asin){
	var action = "GetCompetitivePricingForASIN";
	var timeStamp = date;
	var version = "2011-10-01";
	var SignatureMethod = "HmacSHA256";
	var date = new Date();
	/* written in ISO8601*/
		date = date.getFullYear() + "-" + (date.getMonth() + 1) +"-"+ date.getDate() + "T" +"%3A" + date.getHours() + "%3A" + date.getMinutes() + "Z"
	var url = endPoint +
		 "?AWSAccessKeyId=" + AWSAccessKeyId+
		 "&Action=" + action +
		"&MWSAuthToken=" + MWSAuthToken +
		"&SellerId=" + SellerId +
		"Version=" + version +
		"&Timestamp=" + date +
		"&Version=" + version +
		"&Signature=" + signature(secretKey) +
		"&SignatureMethod=" + SignatureMethod +
		"SignatureVersion" + "2" +
		"&MarketplaceId=" + "A1VC38T7YXB528" +
		"&ASIN" + Asin;
		console.log(url);
	var connect = new XMLHttpRequest();
		connect.open("POST",url,true);
		connect.send();
	var responseXml;
	var price;
		connect.onreadystatechange = function(){
			if(connect.readyState == 4 && xhttp.status == 200){
					console.log(connect.responseXml)
				var responseXml = connect.responseXML;
					console.log(responseXml);
			}
		} 

};

var item={};

chrome.runtime.onMessage.addListener(function(response,sender,sendResponse){
	console.log(response)
	var url = response.url;
	var reg = /https:\/\/catalog-fe.amazon.com\/abis\/Display\/ItemSelected?\/*/
	if(response.type == "default"){
		console.log("defa")
		item.mws = mwsSetting;
		item.comment = explanation;
		sendResponse(item);
	}else if(url=="chrome-extension://alnmcplhmjbikckhnfkaljigcmbaacng/option.html"){
		switch(response.type){
			case "mws":
				var mws = response.info;
				console.log(mws)
				switch(mws){
					case "mws mode":
						mws.mode = response.content;
						break;
					case "id":
						mws.id = response.content;
						break;
					case "pass":
						mws.pass = response.content;
						break;
				}
			case "comment":
				var mws = response.info;
				switch(mws){
					case "New":
						explanation.New = response.content;
						chrome.storage.sync.set(explanation,function(){
							console.log("default explanation is set");
						});
						break;
					case "almostNew":
						explanation.almostNew = response.content;
						chrome.storage.sync.set(explanation,function(){
							console.log("default explanation is set");
						});
						break;
					case "veryGood":
						explanation.veryGood = response.content;
						chrome.storage.sync.set(explanation,function(){
							console.log("default explanation is set");
						});
						break;
					case "good":
						explanation.good = response.content;
						chrome.storage.sync.set(explanation,function(){
							console.log("default explanation is set");
						});
						break;
					case "acceptable":
						explanation.acceptable = response.content;
						chrome.storage.sync.set(explanation,function(){
							console.log("default explanation is set");
						});
						break;
				}
			sendResponse("success");
		}

	}else if(url.search(reg)!== -1){
		console.log(response)
		var mws = JSON.parse(MWS);
		var condition = response.info;
		var price;
		var asin;
			if(mws.mode){
				asin = response.asin;
				condition = response.condition;
				price = priceSet(mws.AWSAccessKeyId,mws.MWSAuthToken,mws.SellerId,mws.endpoint,asin);
				item.mws = true; 
				sendResponse(item);	
			}else{
					item.mws=false
					item.comment = explain(condition);
					console.log(item.comment)
					console.log(item);
					sendResponse(item);	
			}
	}
});