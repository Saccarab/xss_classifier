let payload_count = 0
let payload;

let groups = {}
groups.script = []
groups.obfuscate = []
groups.tag = []
groups.rest = []

// function utfcheck(){

// }

let confirm = [{
	mark:	"&", val: 5},{
	mark:	"#", val: 5},{
	mark:	"&#", val: 10},{
	mark:	"%", val: 5},{
	mark: "¼", val: 10},{
	mark:	"&", val: 5},{
	mark: "base64", val: 20},{
	mark: "&#;", val: 30},{
	mark: "eval;", val: 50},{
	mark: "String.fromCharCode", val:30}
]

let warn_map = [{ //how common the xss is so it can give a warning
	mark:	"alert", val: 0},{
	mark:	";", val: 0},{
	mark:	"javascript", val: 0},{
	mark:	"on", val: 0},{
	mark:	"&#", val: 0},{
	mark:	"src", val: 0},{
	mark: "&lt", val: 0},{
	mark:	".find", val: 0},{
	mark: "base64", val: 0},{
	mark: "http", val: 0},{
	mark: "href", val: 0},{
	mark: "\\u0", val: 0},{
	mark: "\\x", val: 0},{
	mark: "string.fromcharcode", val:0}
]

function externa_scr(xss){
	let src_map = [{ //how common the xss is so it can give a warning
		mark:	".js", val: 30},{
		mark:	"src", val: 15},{
		mark:	"SRC", val: 15},{
		mark:	"script", val: 10},{
		mark:	"javascript", val: 15},{
		mark:	"eval", val: 50}
	]
	let value = 0;
	for(let j = 0; j<src_map.length; j++){
		count = (xss.toLowerCase().match(new RegExp(src_map[j].mark)) || []).length
		value = value + count * src_map[j].val
	}

	return value
}

function obfuscated(xss){
	// (xss.toLowerCase().includes('&lt;') || xss.toLowerCase().includes('&#') || xss.includes('\\x') || xss.includes('\\u')){

	let src_map = [{ //how common the xss is so it can give a warning
		mark:	"&lt", val: 20},{
		mark:	"&#", val: 10},{
		mark:	"\\x", val: 15},{
		mark:	"\\u", val: 15}
	]

	let value = 0;
	for(let j = 0; j<src_map.length; j++){
		count = (xss.toLowerCase().match(new RegExp(src_map[j].mark)) || []).length
		value = value + count * src_map[j].val
	}

	return value
}

function handler(xss){
	let src_map = [{ //how common the xss is so it can give a warning
		mark:	"on", val: 10},{
		mark:	"onmouse", val: 15},{
		mark:	"onerror", val: 20},{
		mark:	"onclick", val: 20}
	]

	let value = 0;
	for(let j = 0; j<src_map.length; j++){
		count = (xss.toLowerCase().match(new RegExp(src_map[j].mark)) || []).length
		value = value + count * src_map[j].val
	}

	return value
}

function tag(xss){
	let src_map = [{ //how common the xss is so it can give a warning
		mark:	"<", val: 10},{
		mark:	">", val: 10},{
		mark:	"/", val: 2}
	]

	let value = 0;
	for(let j = 0; j<src_map.length; j++){
		count = (xss.toLowerCase().match(new RegExp(src_map[j].mark)) || []).length
		value = value + count * src_map[j].val
	}

	return value
}

function ismax(xss){
	if (externa_scr(xss) > 10)
		return 'Over Limit'
	else
		return 'Seems Okay'
}

function value_in(){
	let xss = document.getElementById('input').value
	payload.push(xss)
	document.getElementById('count').innerHTML = payload.length
	//duplicate // make this a func
	if(xss.toLowerCase().includes('<script>') || xss.toLowerCase().includes('</script>') || xss.toLowerCase().includes('<script/>') || xss.toLowerCase().includes('/script')){
			groups.script.push(xss)
			document.getElementById('group').innerHTML = "Basic Script"
		}
		else if(xss.toLowerCase().includes('&lt;') || xss.toLowerCase().includes('&#') || xss.includes('\\x') || xss.includes('\\u')){
			groups.obfuscate.push(xss)
			document.getElementById('group').innerHTML = "Basic Obfuscation"
		}
		else if(xss.toLowerCase().includes('<') && xss.toLowerCase().includes('>')){
			groups.tag.push(xss)
			document.getElementById('group').innerHTML = "Html Tag"
		}
		else{
			document.getElementById('group').innerHTML = "Unknown"
			groups.rest.push(xss)
		}
	//duplicate //
	document.getElementById('inputdisp').innerHTML = xss.replace('<','&lt').replace('>','&gt')
	let common = 0;
	for(let j=0;j<warn_map.length;j++){
		count = (xss.toLowerCase().match(new RegExp(warn_map[j].mark)) || []).length
		common = common + warn_map[j].val * count
		warn_map[j].val = warn_map[j].val + count
	}
	document.getElementById('commonval').innerHTML = common
	if (common > 800){
		document.getElementById('common').innerHTML = "Incredibly Common"
	}
	else if (common > 600){
		document.getElementById('common').innerHTML = "Common"
	}
	else if (common > 400){
		document.getElementById('common').innerHTML = "Somewhat Common"
	}
	else if (common > 200){
		document.getElementById('common').innerHTML = "Rare"
	}
	else if (common > 100){
		document.getElementById('common').innerHTML = "Epic"
	}
	else if (common > 0){
		document.getElementById('common').innerHTML = "Unique"
	}
	else
		document.getElementById('common').innerHTML = "???"

	let phrase_string = ''
	for(let j = 0; j<warn_map.length; j++){
		phrase_string += `Phrase: ${warn_map[j].mark} Occurence: ${warn_map[j].val}<br>` 
	} 
	document.getElementById('phrases').innerHTML= phrase_string
	document.getElementById('scr').innerHTML = externa_scr(xss)
	document.getElementById('obf_count').innerHTML = obfuscated(xss)
	document.getElementById('handler').innerHTML = handler(xss)
	document.getElementById('tag').innerHTML = tag(xss)
	document.getElementById('max').innerHTML = ismax(xss)
	calculate_all()

}

const proxy = "https://cors-anywhere.herokuapp.com/"; // proxy alternates ??

$.ajax({
  url: proxy+'https://saccarab.github.io/test_payload/',
  async: true,
  success: function(data){
  	payload = data.split('\n')

  	payload.splice(0,1)
  	payload.splice(payload.length-1,1)
  	document.getElementById('count').innerHTML = payload.length
  	for(let i = 0;i < payload.length; i++){
			if(payload[i].toLowerCase().includes('<script>') || payload[i].toLowerCase().includes('</script>') || payload[i].toLowerCase().includes('<script/>')
				|| payload[i].toLowerCase().includes('/script')){
				// groups.first.push(payload.splice(i,1)) empty array
				groups.script.push(payload[i])
			}
			else if(payload[i].toLowerCase().includes('&lt;') || payload[i].toLowerCase().includes('&#') || payload[i].includes('\\x') || payload[i].includes('\\u')){
				groups.obfuscate.push(payload[i])
			}
			else if(payload[i].toLowerCase().includes('<') && payload[i].toLowerCase().includes('>')){
				groups.tag.push(payload[i])
			}
			else
				groups.rest.push(payload[i])
		}

		for(let i = 0;i < payload.length; i++){
			for(let j = 0; j<warn_map.length; j++){
				let count = 0
				count = (payload[i].toLowerCase().match(new RegExp(warn_map[j].mark)) || []).length
				warn_map[j].val = warn_map[j].val + count
			}
		}

		let phrase_string = ''
		for(let j = 0; j<warn_map.length; j++){
			phrase_string += `Phrase: ${warn_map[j].mark} Occurence: ${warn_map[j].val}<br>` 
		} 
		document.getElementById('phrases').innerHTML= phrase_string
		calculate_all()
  }
})


//compare first 3 and last 3 give each letter value of 7
//compare rest of the values and give them value of 3


function calculate_all(){
	let counter = [ //how common the xss is so it can give a warning
		0, //external
		0, //obfuscated
		0, //handler
		0, //tag
	]

	for(let i = 0;i < payload.length; i++){
		counter[0]+= externa_scr(payload[i].toLowerCase())
		counter[1]+= obfuscated(payload[i].toLowerCase())
		counter[2]+= handler(payload[i].toLowerCase())
		counter[3]+= tag(payload[i].toLowerCase())
	}
	
	for(let i = 0;i < counter.length; i++){
		counter[i] = counter[i]/payload.length
	}

	document.getElementById('scr_av').innerHTML = counter[0]
	document.getElementById('obf_av').innerHTML = counter[1]
	document.getElementById('hand_av').innerHTML = counter[2]
	document.getElementById('tag_av').innerHTML = counter[3]

}