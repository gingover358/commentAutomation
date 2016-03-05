var H;

function sha_256_init(){
		H[0] = 0x6a09e667;
		H[1] = 0x6a09e667;
		H[2] = 0x3c6ef372;
		H[3] = 0xa54ff53a;
		H[4] = 0x510e527f;
		H[5] = 0x9b05688c;
		H[6] = 0x1f83d9ab;
		H[7] = 0x5be0cd19;
}

function sha_256_write(msg){
	
}

function sha_256_finalize(){

}

function hmac_256_init(key){
	var opad = 0x5c;
	if()
}

function hmac_256_write(){
	var ipad = 0x36;
}

function hmac_256_finalize(){

}