function string_to_array(str){
	var array = new Array()
	for(var i = 0; str.length>i; i++){
		array[i] = str.charCodeAt(i);
	}
	return array;
}

function sha_256_init(){
	H = new Array();
	H[0] = 0x6a09e667;
	H[1] = 0xbb67ae85;
	H[2] = 0x3c6ef372;
	H[3] = 0xa54ff53a;
	H[4] = 0x510e527f;
	H[5] = 0x9b05688c;
	H[6] = 0x1f83d9ab;
	H[7] = 0x5be0cd19;
	sha_buf = new Array()
	sha_len = 0;
}

function sha_256_write(msg){
	if(typeof(msg) == "string"){
		sha_buf = sha_buf.concat(string_to_array(msg));
	}else{
		/*only accept array contain a byte data converted by utf-16*/
		sha_buf = sha_buf.concat(msg) 
	}
	for(var i = 0; i+64<=sha_buf.length; i+=64){
		sha_into_16(H,sha_buf.slice(i,i+64));
	}
	sha_buf = sha_buf.slice(i);
	sha_len += msg.length;
}


function sha_256_finalize(){
	sha_buf[sha_buf.length] = 0x80;
	if(sha_buf.length>56){	
		for(var i = sha_len; sha_len<64; i++){
			sha_buf[i] = 0;
		}
		sha_into_16(H,sha_buf);
		sha_buf.length = 0;
	}
	
	for(var i = sha_buf.length; i<59; i++){
		sha_buf[i] = 0;
	}
	sha_buf[59] = (sha_len>>>29)&0xff;  
	sha_buf[60] = (sha_len>>>21)&0xff;
	sha_buf[61] = (sha_len>>>13)&0xff;
	sha_buf[62] = (sha_len>>>5)&0xff;
	sha_buf[63]	= (sha_len<<3)&0xff;
	sha_into_16(H,sha_buf);
	var res = new Array(32);
	for(var i = 0; i<H.length; i++){
		res[4*i]= H[i]>>>24
		res[4*i+1]= H[i]>>>16 &0xff;
		res[4*i+2]= H[i]>>>8 &0xff;
		res[4*i+3]= H[i] &0xff;
	}
	return res;
}

function hmac_256_init(key){
	var ipad = 0x36;
		hmacKey = new Array();
	if(typeof key == "string"){
		hmacKey = string_to_array(key);
	}else{
		hmacKey = hamacKey.concat(key);
	}
	if(hmacKey.length<64){
		for(var i=hmacKey.length; i<64; i++){
			hmacKey[i] = 0;
		}
	}else{
		sha_256_init();
		sha256_write(hmacKey);
		hmacKey=sha_256_finalize();
	}
	for(var i = 0; i<hmacKey.length; i++){
		hmacKey[i] ^=ipad;
	}
	sha_256_init();
	sha_256_write(hmacKey)
}

function hmac_256_write(msg){
	sha_256_write(msg);
}

function hmac_256_finalize(){
	var ikey = sha_256_finalize();
		console.log(ikey,ikey.length)
	var okey = new Array();
		for(var i = 0; i<64; i++){
			okey[i] = hmacKey[i] ^ 0x5c ^ 0x36
		}
		console.log(okey,okey.length)
		sha_256_init();
		sha_256_write(okey);
		sha_256_write(ikey);
	return sha_256_finalize();
}


var k =new Array( 0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
   0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
   0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
   0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
   0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
   0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
   0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
   0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2)


function hash_256(H,W){
	/*Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array*/
	for(var i = 16; i<64; i++){
		var s0 = ((W[i-15]>>>7) | (W[i-15]<<25)) ^ ((W[i-15]>>>18)| (W[i-15]<<14)) ^ (W[i-15]>>>3) 
		var s1 = ((W[i-2]>>>17) | (W[i-2]<<15)) ^ ((W[i-2]>>>19) | (W[i-2]<<13)) ^ (W[i-2]>>>10);
			W[i]= (W[i-16] + s0 + W[i-7] + s1)&0xffffffff
	}
	/*Compression function main loop:*/
	var temp = new Array().concat(H);
	for(var i = 0; i<W.length; i++){
		var S1= (temp[4]>>>6|temp[4]<<26)^(temp[4]>>>11|temp[4]<<21)^(temp[4]>>>25|temp[4]<<7);
		var ch= (temp[4] & temp[5]) ^ (~temp[4] & temp[6]);
		var S2= (temp[0]>>>2|temp[0]<<30)^(temp[0]>>>13|temp[0]<<19)^(temp[0]>>>22|temp[0]<<10);
		var maj=(temp[0]&temp[1])^(temp[2]&(temp[0]^temp[1]));
		var temp1 = temp[7] + S1 + ch + k[i] + W[i];
		var temp2 = S2 + maj;
			temp.pop();
			temp.unshift((temp1+temp2)&0xffffffff);
			temp[4] = (temp[4] + temp1)&0xffffffff;
		}
	for(var i = 0; i<8; i++){
		H[i] = (H[i] + temp[i]) & 0xffffffff;
	};
}

function sha_into_16(H,w){
	var W = new Array(16);
	for(var i = 0; i<16; i++){
		W[i] = w[4*i]<<24 | w[4*i+1]<<16 | w[4*i+2]<<8 | w[4*i+3]<<0;
	}
	hash_256(H,W);
}

function getSignature(){
  var para = {
    "Service":"AWSECommerceService",
    "AWSAccessKeyId":"00000000000000000000",
    "Operation":"ItemLookup",
    "ItemId":"0679722769",
    "ResponseGroup":"ItemAttributes,Offers,Images,Reviews",
    "Version":"2009-01-06",
    "Timestamp":"2009-01-01T12:00:00Z"
  };

  var para_array = [];

  for(var pname in para){
    para_array.push(pname + "=" + encodeURIComponent(para[pname]));
  }

  para_array.sort();

  var str_para = para_array.join('&');
  var str_signature = "GET" + "¥n" + "webservices.amazon.com" + "¥n" + "/onca/xml" + "¥n" + str_para;

  hmac_256_init("1234567890");
  hmac_256_write(str_signature);
  var x =hmac_256_finalize();
  console.log(x)
}

getSignature();