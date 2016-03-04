/*setting sku*/
function rand(){
	var alpha = "abcdefghijklmnopqrstuvwxyz";
	var c = Math.floor(Math.random()*(alpha.length - 1));
	return alpha[c];
}

var date = new Date();

var random=[];
	random[0]=rand();
	random[1]=rand();
	random[2]=rand();

	date = date.getFullYear()+ random[0] + "/" + (date.getMonth() + 1) + random[1] + "/" + date.getDate() + random[2] + "/"; 

/*addlistner*/
var item={
	"url":"",
	"type":"",
	"info":"",
	"asin":""
};

/*for common page*/
if(document.getElementById("condition_type")!==null){
	var conditionForm = document.getElementsByName("condition_type");
	conditionForm[0].addEventListener("change",function(){
		console.log("callback is working")
		var condition = conditionForm[0].value;
			item.url=document.URL;
			item.type="sellerCentral"
			item.info=condition;
			item.asin=document.getElementsByClassName("reconciledDetailsAttributes");
			item.asin=item.asin[0].textContent;
			item.asin=item.asin.match(/\s+ASIN:\s+([[0-9]|[A-Z].*)/);
			item.asin=item.asin[1];
		chrome.runtime.sendMessage(item,function(response){
			console.log(response);
			var comment =response.comment;
				document.getElementById("condition_note").value=comment;
			if(response.mws){
				var price = response.price;
				document.getElementById("standard_price").value=price;
				console.log("comment")
			}else{
				console.log("move to option")
				option(condition,conditionForm,false);
			}
		})
	});
/*for media page such as game,dvd etc*/
}else{
	console.log("start dvd &game automation")
	var conditionForm = document.getElementById("offering_condition");
	conditionForm.addEventListener("change",function(){
		var condition = conditionForm.value;
			item.url=document.URL;
			item.type="sellerCentral"
			item.info=condition;
			item.asin=document.getElementById("asin_display");
			item.asin=item.asin.textContent;
			item.asin=item.asin.replace(/\s/,"")
		chrome.runtime.sendMessage(item,function(response){
			console.log(response);
			var response = response.item;
			if(response.mws){
				var price = response.price;
				var comment =response.comment;
					document.getElementById("standard_price").value=price;
					document.getElementById("condition_note").value=comment;
			}else{
				option(condition,conditionForm);
			}
		})
	});
	
}

function Asin(node){
	if(document.getElementById("asin_display")!==null){
		item.asin=document.getElementById("asin_display");
		item.asin=item.asin.textContent;
		item.asin=item.asin.replace(/\s/,"");
	}else{
		item.asin=document.getElementsByClassName("reconciledDetailsAttributes");
		item.asin=item.asin[0].textContent;
		item.asin=item.asin.match(/\s+ASIN:\s+([[0-9]|[A-Z].*)/);
		item.asin=item.asin[1];
	}
}

function convertCondition(condition){
	switch(condition){
		case "New|New":
			return "new, new"
			break;
		case "Used|LikeNew":
			return "used, like_new"
			break;
		case "Used|VeryGood":
			return "used, very_good"
			break;
		case "Used|Good":
			return "used, good"
			break;
		case "Used|Acceptable":
			return "used, acceptable"
			break;
	}
}

function option(condition,Form,first){
	if(document.getElementById("condition_type")==null){
		var conditionForm = Form;
		var	option = conditionForm.getElementsByTagName("option");
		for(var i = option.length-1;i>=0;i--){
			console.log(option[i].value)
			console.log(convertCondition(option[i].value));
			if(convertCondition(option[i].value)==condition){
				console.log("in")
				conditionForm.focus();
				setTimeout(function(){
					conditionForm.value=option[i].value;},200);
				conditionForm.focus();
				break;
			}
		}
		price(condition,true)
	}else{
		var conditionForm = document.getElementsByName("condition_type");
		var	option = conditionForm[0].getElementsByTagName("option");
		for(var i = option.length-1;i>=0;i--){
			console.log(option[i].value);
			if(option[i].value==condition){
				conditionForm[0].value=option[i].value;
			}
		}
		price(condition,false);
	}
	if(first){
		item.url = document.URL;
		item.type = "sellerCentral";
		item.info = document.getElementById("offering_condition")||document.getElementsByName("condition_type");
		if(document.getElementById("offering_condition")!==null){
			var condition = document.getElementsById("offering_condition").value;
				item.info = condition
		}else{
			var conditionForm = document.getElementsByName("condition_type");
				condition = conditionForm[0].value;
				item.info = condition;
		}
		item.asin = Asin(document.getElementById("offering_condition")||document.getElementsByName("condition_type"));
		chrome.runtime.sendMessage(item,function(response){
			console.log(response)
			var comment =response.comment;
				document.getElementById("condition_note").value=comment
		})
	}
}

function price(condition,form){
	if(form){
		var	price = document.getElementById("productHeaderForTabs");
			price = document.getElementsByClassName("tiny");
			price = price[2].textContent;
			price = price.match(/[[0-9|,]+/g)
		var priceForm = document.getElementById("our_price");
			for(var i=0; price.length-1>i; i++){
				price[i] = price[i].replace(/,/g,"")
			}
		if(condition="New|New"){
			price = parseInt(price[4]) + parseInt(price[5]);
			priceForm.value = price;
		}else{
			price = parseInt(price[7]) + parseInt(price[8]);
			priceForm.value = price;
		}
	}else{
		document.getElementById("item_sku").value = date;
		if(condition=="new, new"){
			var lowestPrice=document.getElementById("lowestPriceInfo-for-New");
				lowestPrice.style = "display:block";
			var button = lowestPrice.getElementsByTagName("button");
				button[0].style = "display:inline";
				button[0].click();
		}else{
			console.log("change")
			var lowestPrice=document.getElementById("lowestPriceInfo-for-Used");
				lowestPrice.style = "display:block";
			var button = lowestPrice.getElementsByTagName("button");
				button[0].style = "display:inline";
				button[0].click();
		}
	}
}
	
setTimeout(option("new, new",document.getElementById("condition_type")||document.getElementById("offering_condition"),true),2000);

