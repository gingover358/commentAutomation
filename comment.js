console.log("comment");
/*setting sku*/
function rand(){
	var alpha = "abcdefghijklmnopqrstuvwxyz";
	var c = Math.floor(Math.random()*(alpha.length - 1));
	return alpha[c];
}

var date = new Date();
	console.log(date.getMonth() + 1);

var random=[];
	random[0]=rand();
	random[1]=rand();
	random[2]=rand();

	date = date.getFullYear()+ random[0] + "/" + (date.getMonth() + 1) + random[1] + "/" + date.getDate() + random[2] + "/"; 

document.getElementById("item_sku").value = date;

/*addlistner*/
var conditionForm = document.getElementById("Parent-offering_condition-span")||document.getElementById("condition_type");
	conditionForm.addEventListener("onchange",function(){
			var condition = conditionForm.value;
			item.condition = condition;
			sendMessage(item);
	});
console.log(conditionForm);

/*default_condition*/
function option(condition){
	var conditionForm = document.getElementById("Parent-offering_condition-span")||document.getElementsByName("condition_type");
	var	option = conditionForm[0].getElementsByTagName("option");
		for(var i = option.length-1;i>=0;i--){
			if(option[i].value==condition){
					console.log(conditionForm)
					console.log(option[i].value)
				conditionForm[0].value=option[i].value;
			}else{
				continue;
			}
		}
		price(mws,condition);
}

function price(click,condition){
	if(click){
	/*for price info provided by exhibit page in amazon*/
		if(condition=="new, new"){
			var lowestPrice=document.getElementById("lowestPriceInfo-for-New");
				lowestPrice.style = "display:block";
			var button = lowestPrice.getElementsByTagName("button");
				button[0].style = "display:inline";
				button[0].click();
		}else{
			var lowestPrice=document.getElementById("lowestPriceInfo-for-Used");
				lowestPrice.style = "display:block";
			var button = lowestPrice.getElementsByTagName("button");
				button[0].style = "display:inline";
				button[0].click();
		}

	}else{
	/*for mws*/
		product=document
	}
}

setTimeout(option("new, new"),800);

var consequence;

chrome.runtime.sendMessage(consequence,function(response){
	var item = response.item;
	document.getElementById("comment").value=item.commnt;
	document.getElementById("price").value = item.price;
	consequence = true;
	sendMessage(consequence);
});
