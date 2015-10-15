function encryptMessage(message, key) {

	var keys = generateKeys(key);

	//review part 2 of the description.
	var messageInHexa = toHexa(message);
	var messageInBinary = toBinary(messageInHexa);
	var permutedMessage = initialPermutation(messageInBinary);

	var L = [];
	var R = [];

	L[0] = permutedMessage.substring(0, 32);
	R[0] = permutedMessage.substring(32, 64);

	for (var i = 1; i < 17; i++) {
		var fFunctionResult = fFunction(R[i - 1], keys[i - 1]);
		L[i] = R[i - 1];
		R[i] = xor(L[i - 1], fFunctionResult);
	}

	var c = finalPermutation(L[16], R[16]);

	return binaryToHexa(c);
}

function decryptMessage(message, key) {

	var keys = generateKeys(key);

	var messageInBinary = toBinary(message);
	var permutedMessage = initialPermutation(messageInBinary);
	var L = new Array(17);
	var R = new Array(17);

	R[16] = permutedMessage.substring(0, 32);
	L[16] = permutedMessage.substring(32, 64);

	for (var i = 15; i >= 0; i--) {
		var fFunctionResult = fFunction(L[i + 1], keys[i]);
		R[i] = L[i + 1];
		L[i] = xor(R[i + 1], fFunctionResult);
	}

	var resultInBinary = finalPermutation(R[0], L[0]);
	var resultInHexa = binaryToHexa(resultInBinary);
	return hexToString(resultInHexa);

}

function binaryToHexa(binaryString) {
	var binaryArray = binaryString.match(/.{1,8}/g);
	var resultInHexa = "";
	for (var i = 0; i < binaryArray.length; i++) {
		var hexaString = parseInt(binaryArray[i], 2).toString(16).toUpperCase();
		if (hexaString.length < 2) {
			var diff = 2 - hexaString.length;
			for (var j = 0; j < diff; j++) {
				hexaString = "0" + hexaString;
			};
		}
		resultInHexa += hexaString;
	};
	return resultInHexa;
}

function generateKeys(key) {
	var pc1 = calculatePC1(generateKey(key));

	var c0 = pc1.substring(0, 28);
	var d0 = pc1.substring(28, 56);

	var c = [];
	var d = [];

	c[0] = c0;
	d[0] = d0;

	for (var i = 1; i < 17; i++) {
		if (i == 1 || i == 2 || i == 9 || i == 16) {
			c[i] = LS(c[i - 1]);
			d[i] = LS(d[i - 1]);
		} else {
			c[i] = LS(c[i - 1]);
			c[i] = LS(c[i]);

			d[i] = LS(d[i - 1]);
			d[i] = LS(d[i]);
		}
	};

	var k = [];

	for (var i = 0; i < 16; i++) {
		k[i] = calculatePC2(c[i + 1], d[i + 1]);
	};

	return k;
}

function generateKey(key) {
	var keyInBinary = toBinary(key);
	return keyInBinary;
}

function toBinary(key) {
	var i, k, part, result = '';
	// lookup table for easier conversion. '0' characters are padded for '1' to '7'
	var lookupTable = {
		'0': '0000',
		'1': '0001',
		'2': '0010',
		'3': '0011',
		'4': '0100',
		'5': '0101',
		'6': '0110',
		'7': '0111',
		'8': '1000',
		'9': '1001',
		'a': '1010',
		'b': '1011',
		'c': '1100',
		'd': '1101',
		'e': '1110',
		'f': '1111',
		'A': '1010',
		'B': '1011',
		'C': '1100',
		'D': '1101',
		'E': '1110',
		'F': '1111'
	};
	for (i = 0; i < key.length; i += 1) {
		if (lookupTable.hasOwnProperty(key[i])) {
			result += lookupTable[key[i]];
		}
	}

	var ceroString = "";

	if (result.length < 64) {
		var diference = 64 - result.length;
		for (var i = 0; i < diference; i++) {
			ceroString += "0";
		};
	}

	return result + ceroString;
}

function calculatePC1(key) {
	var result = "00000000000000000000000000000000000000000000000000000000".split("");

	result[0] = key[56];
	result[1] = key[48];
	result[2] = key[40];
	result[3] = key[32];
	result[4] = key[24];
	result[5] = key[16];
	result[6] = key[08];
	result[7] = key[00];
	result[8] = key[57];
	result[9] = key[49];
	result[10] = key[41];
	result[11] = key[33];
	result[12] = key[25];
	result[13] = key[17];
	result[14] = key[09];
	result[15] = key[01];
	result[16] = key[58];
	result[17] = key[50];
	result[18] = key[42];
	result[19] = key[34];
	result[20] = key[26];
	result[21] = key[18];
	result[22] = key[10];
	result[23] = key[02];
	result[24] = key[59];
	result[25] = key[51];
	result[26] = key[43];
	result[27] = key[35];
	result[28] = key[62];
	result[29] = key[55];
	result[30] = key[46];
	result[31] = key[38];
	result[32] = key[30];
	result[33] = key[22];
	result[34] = key[14];
	result[35] = key[06];
	result[36] = key[61];
	result[37] = key[53];
	result[38] = key[45];
	result[39] = key[37];
	result[40] = key[29];
	result[41] = key[21];
	result[42] = key[13];
	result[43] = key[05];
	result[44] = key[60];
	result[45] = key[52];
	result[46] = key[44];
	result[47] = key[36];
	result[48] = key[28];
	result[49] = key[20];
	result[50] = key[12];
	result[51] = key[04];
	result[52] = key[27];
	result[53] = key[19];
	result[54] = key[11];
	result[55] = key[03];
	return result.join("");
}

function LS(key) {
	key += key[0];
	key = key.slice(1, key.length);
	return key;
}

function calculatePC2(c, d) {
	var result = "-000000000000000000000000000000000000000000000000".split("");
	var key = "-" + c + d;

	result[1] = key[14];
	result[2] = key[17];
	result[3] = key[11];
	result[4] = key[24];
	result[5] = key[01];
	result[6] = key[05];
	result[7] = key[03];
	result[8] = key[28];
	result[9] = key[15];
	result[10] = key[06];
	result[11] = key[21];
	result[12] = key[10];
	result[13] = key[23];
	result[14] = key[19];
	result[15] = key[12];
	result[16] = key[04];
	result[17] = key[26];
	result[18] = key[08];
	result[19] = key[16];
	result[20] = key[07];
	result[21] = key[27];
	result[22] = key[20];
	result[23] = key[13];
	result[24] = key[02];
	result[25] = key[41];
	result[26] = key[52];
	result[27] = key[31];
	result[28] = key[37];
	result[29] = key[47];
	result[30] = key[55];
	result[31] = key[30];
	result[32] = key[40];
	result[33] = key[51];
	result[34] = key[45];
	result[35] = key[33];
	result[36] = key[48];
	result[37] = key[44];
	result[38] = key[49];
	result[39] = key[39];
	result[40] = key[56];
	result[41] = key[34];
	result[42] = key[53];
	result[43] = key[46];
	result[44] = key[42];
	result[45] = key[50];
	result[46] = key[36];
	result[47] = key[29];
	result[48] = key[32];

	result = result.join("");

	return result.slice(1, result.length);

}

function toHexa(message) {
	var hex, i;

	var result = "";
	for (i = 0; i < message.length; i++) {
		result += message.charCodeAt(i).toString(16);
	}

	return result;
}

function todec(message) {
	var j;
	var hexes = message.match(/.{1,2}/g) || [];
	var back = "";
	for (j = 0; j < hexes.length; j++) {
		back += String.fromCharCode(parseInt(hexes[j], 16));
	}

	return back;
}

function initialPermutation(message) {
	var result = "-00000000000000000000000000000000000000000000000000000000".split("");

	result[1] = message[58 - 1];
	result[2] = message[50 - 1];
	result[3] = message[42 - 1];
	result[4] = message[34 - 1];
	result[5] = message[26 - 1];
	result[6] = message[18 - 1];
	result[7] = message[10 - 1];
	result[8] = message[02 - 1];
	result[9] = message[60 - 1];
	result[10] = message[52 - 1];
	result[11] = message[44 - 1];
	result[12] = message[36 - 1];
	result[13] = message[28 - 1];
	result[14] = message[20 - 1];
	result[15] = message[12 - 1];
	result[16] = message[04 - 1];
	result[17] = message[62 - 1];
	result[18] = message[54 - 1];
	result[19] = message[46 - 1];
	result[20] = message[38 - 1];
	result[21] = message[30 - 1];
	result[22] = message[22 - 1];
	result[23] = message[14 - 1];
	result[24] = message[06 - 1];
	result[25] = message[64 - 1];
	result[26] = message[56 - 1];
	result[27] = message[48 - 1];
	result[28] = message[40 - 1];
	result[29] = message[32 - 1];
	result[30] = message[24 - 1];
	result[31] = message[16 - 1];
	result[32] = message[08 - 1];
	result[33] = message[57 - 1];
	result[34] = message[49 - 1];
	result[35] = message[41 - 1];
	result[36] = message[33 - 1];
	result[37] = message[25 - 1];
	result[38] = message[17 - 1];
	result[39] = message[09 - 1];
	result[40] = message[01 - 1];
	result[41] = message[59 - 1];
	result[42] = message[51 - 1];
	result[43] = message[43 - 1];
	result[44] = message[35 - 1];
	result[45] = message[27 - 1];
	result[46] = message[19 - 1];
	result[47] = message[11 - 1];
	result[48] = message[03 - 1];
	result[49] = message[61 - 1];
	result[50] = message[53 - 1];
	result[51] = message[45 - 1];
	result[52] = message[37 - 1];
	result[53] = message[29 - 1];
	result[54] = message[21 - 1];
	result[55] = message[13 - 1];
	result[56] = message[05 - 1];
	result[57] = message[63 - 1];
	result[58] = message[55 - 1];
	result[59] = message[47 - 1];
	result[60] = message[39 - 1];
	result[61] = message[31 - 1];
	result[62] = message[23 - 1];
	result[63] = message[15 - 1];
	result[64] = message[07 - 1];

	result = result.join("");

	return result.slice(1, result.length);
}

function expansion(array) {
	var result = "-000000000000000000000000000000000000000000000000".split("");

	result[1] = array[32 - 1];
	result[2] = array[1 - 1];
	result[3] = array[2 - 1];
	result[4] = array[3 - 1];
	result[5] = array[4 - 1];
	result[6] = array[5 - 1];
	result[7] = array[4 - 1];
	result[8] = array[5 - 1];
	result[9] = array[6 - 1];
	result[10] = array[07 - 1];
	result[11] = array[08 - 1];
	result[12] = array[09 - 1];
	result[13] = array[08 - 1];
	result[14] = array[09 - 1];
	result[15] = array[10 - 1];
	result[16] = array[11 - 1];
	result[17] = array[12 - 1];
	result[18] = array[13 - 1];
	result[19] = array[12 - 1];
	result[20] = array[13 - 1];
	result[21] = array[14 - 1];
	result[22] = array[15 - 1];
	result[23] = array[16 - 1];
	result[24] = array[17 - 1];
	result[25] = array[16 - 1];
	result[26] = array[17 - 1];
	result[27] = array[18 - 1];
	result[28] = array[19 - 1];
	result[29] = array[20 - 1];
	result[30] = array[21 - 1];
	result[31] = array[20 - 1];
	result[32] = array[21 - 1];
	result[33] = array[22 - 1];
	result[34] = array[23 - 1];
	result[35] = array[24 - 1];
	result[36] = array[25 - 1];
	result[37] = array[24 - 1];
	result[38] = array[25 - 1];
	result[39] = array[26 - 1];
	result[40] = array[27 - 1];
	result[41] = array[28 - 1];
	result[42] = array[29 - 1];
	result[43] = array[28 - 1];
	result[44] = array[29 - 1];
	result[45] = array[30 - 1];
	result[46] = array[31 - 1];
	result[47] = array[32 - 1];
	result[48] = array[01 - 1];

	result = result.join("");

	return result.slice(1, result.length);
}


function xor(firstArray, secondArray) {
	var result = [];
	for (var i = 0; i < firstArray.length; i++) {
		var firstValue = parseInt(firstArray[i]);
		var secondValue = parseInt(secondArray[i]);
		if (firstValue + secondValue == 1) {
			result[i] = "1";
		} else {
			result[i] = "0";
		}
	}
	return result.join("");
}

function fFunction(R, k) {
	var expandedR = expansion(R);
	var xorRAndK = xor(expandedR, k);
	var blocks = getAsBlocks(xorRAndK);
	var result = "";

	//Boxes
	for (var i = 0; i < blocks.length; i++) {
		var x = parseInt(blocks[i].slice(1, 5), 2);
		var y = parseInt(blocks[i][0] + blocks[i][5], 2);
		var binaryDec = (sBoxes[i][y][x]).toString(2);
		if (binaryDec.length < 4) {
			var diff = 4 - binaryDec.length;
			for (var j = 0; j < diff; j++) {
				binaryDec = "0" + binaryDec;
			};
		}
		result += binaryDec;
	};

	result = permutationP(result);
	return result;
}

function getAsBlocks(string) {
	var blocks = [];
	for (var i = 0; i < string.length; i = i + 6) {
		blocks.push(string.slice(i, i + 6));
	}
	return blocks;
}

function permutationP(message) {
	var result = "-00000000000000000000000000000000".split("");

	result[1] = message[16 - 1];
	result[2] = message[7 - 1];
	result[3] = message[20 - 1];
	result[4] = message[21 - 1];
	result[5] = message[29 - 1];
	result[6] = message[12 - 1];
	result[7] = message[28 - 1];
	result[8] = message[17 - 1];
	result[9] = message[1 - 1];
	result[10] = message[15 - 1];
	result[11] = message[23 - 1];
	result[12] = message[26 - 1];
	result[13] = message[5 - 1];
	result[14] = message[18 - 1];
	result[15] = message[31 - 1];
	result[16] = message[10 - 1];
	result[17] = message[2 - 1];
	result[18] = message[8 - 1];
	result[19] = message[24 - 1];
	result[20] = message[14 - 1];
	result[21] = message[32 - 1];
	result[22] = message[27 - 1];
	result[23] = message[3 - 1];
	result[24] = message[9 - 1];
	result[25] = message[19 - 1];
	result[26] = message[13 - 1];
	result[27] = message[30 - 1];
	result[28] = message[6 - 1];
	result[29] = message[22 - 1];
	result[30] = message[11 - 1];
	result[31] = message[4 - 1];
	result[32] = message[25 - 1];

	result = result.join("");

	return result.slice(1, result.length);

}

function finalPermutation(L, R) {
	var result = "-00000000000000000000000000000000000000000000000000000000".split("");

	var message = "-" + R + L;

	result[1] = message[40];
	result[2] = message[8];
	result[3] = message[48];
	result[4] = message[16];
	result[5] = message[56];
	result[6] = message[24];
	result[7] = message[64];
	result[8] = message[32];
	result[9] = message[39];
	result[10] = message[7];
	result[11] = message[47];
	result[12] = message[15];
	result[13] = message[55];
	result[14] = message[23];
	result[15] = message[63];
	result[16] = message[31];
	result[17] = message[38];
	result[18] = message[6];
	result[19] = message[46];
	result[20] = message[14];
	result[21] = message[54];
	result[22] = message[22];
	result[23] = message[62];
	result[24] = message[30];
	result[25] = message[37];
	result[26] = message[5];
	result[27] = message[45];
	result[28] = message[13];
	result[29] = message[53];
	result[30] = message[21];
	result[31] = message[61];
	result[32] = message[29];
	result[33] = message[36];
	result[34] = message[4];
	result[35] = message[44];
	result[36] = message[12];
	result[37] = message[52];
	result[38] = message[20];
	result[39] = message[60];
	result[40] = message[28];
	result[41] = message[35];
	result[42] = message[3];
	result[43] = message[43];
	result[44] = message[11];
	result[45] = message[51];
	result[46] = message[19];
	result[47] = message[59];
	result[48] = message[27];
	result[49] = message[34];
	result[50] = message[2];
	result[51] = message[42];
	result[52] = message[10];
	result[53] = message[50];
	result[54] = message[18];
	result[55] = message[58];
	result[56] = message[26];
	result[57] = message[33];
	result[58] = message[1];
	result[59] = message[41];
	result[60] = message[9];
	result[61] = message[49];
	result[62] = message[17];
	result[63] = message[57];
	result[64] = message[25];

	result = result.join("");

	return result.slice(1, result.length);
}


var s1 = [
	[14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
	[0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
	[4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
	[15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
];
var s2 = [
	[15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
	[3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
	[0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
	[13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
];
var s3 = [
	[10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
	[13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
	[13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
	[1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
];
var s4 = [
	[7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
	[13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
	[10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
	[3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
];
var s5 = [
	[2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
	[14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
	[4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
	[11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
];
var s6 = [
	[12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
	[10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
	[9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
	[4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
];
var s7 = [
	[4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
	[13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
	[1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
	[6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
];
var s8 = [
	[13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
	[1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
	[7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
	[2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
];

var sBoxes = [s1, s2, s3, s4, s5, s6, s7, s8];

function hexToString(stringInHexa) {
	var str = '';
	for (var i = 0; i < stringInHexa.length; i += 2) {
		str += String.fromCharCode(parseInt(stringInHexa.substr(i, 2), 16));
	}
	return str;
}