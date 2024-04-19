const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const katex = require('katex')
const { convert } = require('html-to-text')
console.log(process.argv[2])
if(/[0-9]*\/[A-Z]/.test(process.argv[2]))
fetch('https://codeforces.com/problemset/problem/'+process.argv[2]).then(e=>e.text().then(e=>{
	const dom = new JSDOM(e);
	const problem = Array.from(dom.window.document.querySelector(".problem-statement").children).map(e=>e.innerHTML).join('\n')
	let s = convert(problem, {}).split('$$$').map((m,i)=>{
		if(i%2==0)return m;
		let k = convert(katex.renderToString(m), {})
		k = k.slice(0, k.length-(k.length-m.length)/2-m.length)
		return k;
	}).join('')
	console.log(s)
}))
if(/[0-9]+[^A-Za-z\/](:!.*)/.test(process.argv[2]))
fetch('https://codeforces.com/problemset/page/'+process.argv[2]).then(e=>e.text().then(e=>{
	const dom = new JSDOM(e);
	let problemset = Array.from(dom.window.document.querySelectorAll("tr")).map(e=>Array.from(e.children)).slice(1);
	problemset = problemset.map(e=>e.filter((e,i)=>i!=2).map((e,i)=>i==1?Array.from(e.children)[0].innerHTML:e.innerHTML).map(e=>convert(e, {})))
	problemset = problemset.map(e=>e.map(e=>e.split(/\[.*\]/).join('')))
	console.log(problemset.slice(0, -1).join('').split(',').join(''))
}))
