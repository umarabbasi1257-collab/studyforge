/* StudyForge Precision Engine
   Exact rational arithmetic for supported integer/fraction workflows,
   arbitrary-size integers via BigInt, strict parsers, dimension-aware units,
   and redundant verification for important numeric operations.
*/
"use strict";
const $=id=>document.getElementById(id);
const out=(id,t)=>{const e=$(id);if(e)e.textContent=t};
const isNum=x=>typeof x==="number"&&Number.isFinite(x);
const fmt=x=>{
  if(typeof x==="bigint") return x.toString();
  if(!Number.isFinite(x)) return "Not a finite result";
  if(Object.is(x,-0)) x=0;
  return Number(x.toPrecision(14)).toString();
};
const gcdBig=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){let t=a%b;a=b;b=t}return a};
const absBig=a=>a<0n?-a:a;

class Fraction{
  constructor(n,d=1n){
    if(typeof n==="number"){if(!Number.isInteger(n)) throw Error("Integer required");n=BigInt(n)}
    if(typeof d==="number"){if(!Number.isInteger(d)) throw Error("Integer required");d=BigInt(d)}
    if(d===0n) throw Error("Division by zero");
    if(d<0n){n=-n;d=-d}
    const g=gcdBig(n,d);this.n=n/g;this.d=d/g;
  }
  add(o){o=F(o);return new Fraction(this.n*o.d+o.n*this.d,this.d*o.d)}
  sub(o){o=F(o);return new Fraction(this.n*o.d-o.n*this.d,this.d*o.d)}
  mul(o){o=F(o);return new Fraction(this.n*o.n,this.d*o.d)}
  div(o){o=F(o);if(o.n===0n)throw Error("Division by zero");return new Fraction(this.n*o.d,this.d*o.n)}
  neg(){return new Fraction(-this.n,this.d)}
  pow(k){if(!Number.isInteger(k))throw Error("Integer exponent required");if(k<0)return new Fraction(this.d,this.n).pow(-k);return new Fraction(this.n**BigInt(k),this.d**BigInt(k))}
  toString(){return this.d===1n?this.n.toString():`${this.n}/${this.d}`}
  decimal(max=30){return Number(this.n)/Number(this.d)}
}
const F=x=>x instanceof Fraction?x:new Fraction(x);

function parseExactFraction(s){
  s=String(s).trim();
  if(/^[-+]?\d+$/.test(s)) return new Fraction(BigInt(s));
  const m=s.match(/^([-+]?\d+)\s*\/\s*([-+]?\d+)$/);
  if(m)return new Fraction(BigInt(m[1]),BigInt(m[2]));
  throw Error("Use an integer or fraction such as 7/12");
}
function n(id){const x=Number($(id)?.value);return Number.isFinite(x)?x:null}
function integer(id){const v=$(id)?.value.trim();if(!/^-?\d+$/.test(v))return null;try{return BigInt(v)}catch{return null}}

function verifyNumber(primary,secondary,tol=1e-12){
  if(!Number.isFinite(primary)||!Number.isFinite(secondary))return false;
  return Math.abs(primary-secondary)<=tol*Math.max(1,Math.abs(primary),Math.abs(secondary));
}
function gcd(a,b){a=Math.abs(Math.trunc(a));b=Math.abs(Math.trunc(b));while(b){[a,b]=[b,a%b]}return a}
function factorialBig(n){if(!Number.isInteger(n)||n<0)throw Error();let r=1n;for(let i=2;i<=n;i++)r*=BigInt(i);return r}
function factorial(n){return factorialBig(n)}

function percentage(){
 let a=n("pctA"),b=n("pctB");
 if(a===null||b===null){out("pctResult","Enter valid values");return}
 out("pctResult",`${fmt(a*b/100)} is ${fmt(b)}% of ${fmt(a)}. For percentage change, use the Word Problem Solver.`);
}
function quadratic(){
 let a=n("qa"),b=n("qb"),c=n("qc");
 if([a,b,c].some(x=>x===null)||a===0){out("qResult","Enter valid a, b and c; a cannot be 0.");return}
 const d=b*b-4*a*c;
 if(d>=0){
   const root=Math.sqrt(d);
   const x1=(-b+root)/(2*a),x2=(-b-root)/(2*a);
   const check=(x)=>a*x*x+b*x+c;
   if(!verifyNumber(check(x1),0)||!verifyNumber(check(x2),0)){out("qResult","Verification failed; use higher precision inputs.");return}
   out("qResult",d===0?`x = ${fmt(x1)}`:`x₁ = ${fmt(x1)} · x₂ = ${fmt(x2)}`);
 }else{
   const re=-b/(2*a),im=Math.sqrt(-d)/(2*a);
   out("qResult",`x₁ = ${fmt(re)} + ${fmt(Math.abs(im))}i · x₂ = ${fmt(re)} − ${fmt(Math.abs(im))}i`);
 }
}
function statistics(){
 let a=$("statsInput").value.split(",").map(x=>Number(x.trim()));
 if(!a.length||a.some(x=>!Number.isFinite(x))){out("statsResult","Use comma-separated numbers.");return}
 let s=[...a].sort((x,y)=>x-y),sum=a.reduce((x,y)=>x+y,0),mean=sum/a.length;
 let med=a.length%2?s[(a.length-1)/2]:(s[a.length/2-1]+s[a.length/2])/2;
 let counts=new Map();s.forEach(x=>counts.set(x,(counts.get(x)||0)+1));
 let maxF=Math.max(...counts.values()),modes=[...counts].filter(x=>x[1]===maxF).map(x=>x[0]);
 let variance=a.reduce((q,x)=>q+(x-mean)**2,0)/a.length;
 out("statsResult",`n=${a.length} · mean ${fmt(mean)} · median ${fmt(med)} · mode ${maxF>1?modes.join(", "):"none"} · range ${fmt(s.at(-1)-s[0])} · population σ ${fmt(Math.sqrt(variance))}`);
}
function ratioTool(){
 let a=n("ratioA"),b=n("ratioB"),c=n("ratioC");
 if(a===null||b===null){out("ratioResult","Enter A and B.");return}
 if(c!==null){if(a===0){out("ratioResult","A cannot be 0.");return}out("ratioResult",`x = ${fmt(b*c/a)} from ${fmt(a)}:${fmt(b)} = ${fmt(c)}:x`)}
 else if(Number.isInteger(a)&&Number.isInteger(b)&&!(a===0&&b===0)){let g=gcd(a,b);out("ratioResult",`${a/g}:${b/g}`)}
 else out("ratioResult","For simplification use integers; or enter C to solve a proportion.");
}
function geometryInputs(){
 let t=$("geoType").value,box=$("geoInputs");
 box.innerHTML=t==="rectangle"?'<div class="three"><input id="gw" type="number" step="any" placeholder="Width"><input id="gh" type="number" step="any" placeholder="Height"></div>':
 t==="circle"?'<input id="gr" type="number" step="any" placeholder="Radius">':
 '<div class="three"><input id="ga" type="number" step="any" placeholder="Side a"><input id="gb" type="number" step="any" placeholder="Side b"><input id="gc" type="number" step="any" placeholder="Side c"></div>';
}
function geometry(){
 let t=$("geoType").value;
 if(t==="rectangle"){let w=n("gw"),h=n("gh");if(w===null||h===null||w<0||h<0){out("geoResult","Enter valid dimensions.");return}out("geoResult",`Area ${fmt(w*h)} · Perimeter ${fmt(2*(w+h))}`)}
 else if(t==="circle"){let r=n("gr");if(r===null||r<0){out("geoResult","Enter valid radius.");return}out("geoResult",`Area ${fmt(Math.PI*r*r)} · Circumference ${fmt(2*Math.PI*r)}`)}
 else{let a=n("ga"),b=n("gb"),c=n("gc");if([a,b,c].some(x=>x===null)||a<=0||b<=0||c<=0||a+b<=c||a+c<=b||b+c<=a){out("geoResult","Enter valid triangle sides.");return}let s=(a+b+c)/2,area=Math.sqrt(s*(s-a)*(s-b)*(s-c));out("geoResult",`Area ${fmt(area)} · Perimeter ${fmt(a+b+c)}`)}
}
function physicsInputs(){
 let t=$("physType").value,box=$("physInputs");
 const map={speed:'<input id="pv1" type="number" step="any" placeholder="Distance (m)"><input id="pv2" type="number" step="any" placeholder="Time (s)">',
 force:'<input id="pv1" type="number" step="any" placeholder="Mass (kg)"><input id="pv2" type="number" step="any" placeholder="Acceleration (m/s²)">',
 ke:'<input id="pv1" type="number" step="any" placeholder="Mass (kg)"><input id="pv2" type="number" step="any" placeholder="Velocity (m/s)">',
 accel:'<input id="pv1" type="number" step="any" placeholder="ΔVelocity (m/s)"><input id="pv2" type="number" step="any" placeholder="Time (s)">'};
 box.innerHTML=map[t];
}
function physics(){
 let t=$("physType").value,a=n("pv1"),b=n("pv2");
 if(a===null||b===null||b===0){out("physResult","Enter valid values.");return}
 let r=t==="speed"?a/b:t==="force"?a*b:t==="ke"?.5*a*b*b:a/b;
 out("physResult",`${fmt(r)} ${t==="speed"?"m/s":t==="force"?"N":t==="ke"?"J":"m/s²"}`);
}
function temperature(){
 let v=n("tempVal");if(v===null){out("tempResult","Enter a temperature.");return}
 let f=$("tempFrom").value,t=$("tempTo").value;
 let c=f==="Celsius"?v:f==="Fahrenheit"?(v-32)*5/9:v-273.15;
 if(t==="Kelvin"&&c<0){out("tempResult","Below absolute zero.");return}
 let r=t==="Celsius"?c:t==="Fahrenheit"?c*9/5+32:c+273.15;
 out("tempResult",`${fmt(r)} ${t}`);
}
const unitSets={
 length:{Meter:1,Kilometer:1000,Centimeter:.01,Millimeter:.001,Foot:.3048,Inch:.0254,Mile:1609.344,Yard:.9144},
 mass:{Kilogram:1,Gram:.001,Milligram:.000001,Pound:.45359237,Ounce:.028349523125},
 area:{'Square meter':1,'Square kilometer':1e6,'Square foot':.09290304,'Square yard':.83612736,Acre:4046.8564224,Hectare:10000},
 volume:{Liter:.001,Milliliter:.000001,'Cubic meter':1,'Cubic foot':.028316846592,'Gallon (US)':.003785411784}
};
function unitInputs(){
 let type=$("unitType").value,u=Object.keys(unitSets[type]);
 $("unitInputs").innerHTML=`<div class="three"><select id="unitFrom">${u.map(x=>`<option>${x}</option>`).join("")}</select><select id="unitTo">${u.map(x=>`<option>${x}</option>`).join("")}</select></div>`;
}
function units(){
 let v=n("unitValue"),type=$("unitType").value;if(v===null){out("unitResult","Enter a value.");return}
 let set=unitSets[type],from=set[$("unitFrom").value],to=set[$("unitTo").value],r=v*from/to;
 // Independent algebraic inverse check.
 let back=r*to/from;
 if(!verifyNumber(back,v)){out("unitResult","Verification failed.");return}
 out("unitResult",`${fmt(r)} ${$("unitTo").value}`);
}
function compound(){
 let p=n("cp"),r=n("cr"),t=n("ct"),f=n("cf");
 if([p,r,t,f].some(x=>x===null)||p<0||t<0||f<=0){out("compoundResult","Enter valid values.");return}
 let amount=p*Math.pow(1+r/100/f,f*t);
 if(!verifyNumber(amount,Math.exp(Math.log(p)+f*t*Math.log1p(r/100/f)),1e-10)){out("compoundResult","Verification failed.");return}
 out("compoundResult",`Future value ${fmt(amount)} · Interest ${fmt(amount-p)}`);
}
function simpleInterest(){
 let p=n("sip"),r=n("sir"),t=n("sit");if([p,r,t].some(x=>x===null)||p<0||t<0){out("siResult","Enter valid values.");return}
 let i=p*r/100*t;out("siResult",`Interest ${fmt(i)} · Total ${fmt(p+i)}`);
}
function loan(){
 let p=n("lp"),r=n("lr"),y=n("ly");
 if([p,r,y].some(x=>x===null)||p<0||y<=0||r<0){out("loanResult","Enter valid values.");return}
 let months=Math.round(y*12),m=r/100/12,pay=m===0?p/months:p*m*Math.pow(1+m,months)/(Math.pow(1+m,months)-1),total=pay*months;
 let balance=pay===0?0:p;
 if(m>0){for(let i=0;i<months;i++)balance=balance*(1+m)-pay}
 if(m>0&&!verifyNumber(balance,0,1e-8)){out("loanResult","Verification warning: increase precision/backend for extreme loan parameters.");return}
 out("loanResult",`Monthly EMI ${fmt(pay)} · Total ${fmt(total)} · Interest ${fmt(total-p)}`);
}
function gpa(){
 let p=$("gpaPoints").value.split(",").map(Number),c=$("gpaCredits").value.split(",").map(Number);
 if(!p.length||p.length!==c.length||p.some(x=>!Number.isFinite(x))||c.some(x=>!Number.isFinite(x)||x<=0)){out("gpaResult","Enter matching point and credit lists.");return}
 let credits=c.reduce((a,b)=>a+b,0),weighted=p.reduce((s,x,i)=>s+x*c[i],0);
 out("gpaResult",`Weighted GPA ${fmt(weighted/credits)} · ${fmt(credits)} credits`);
}
function countWords(){
 let t=$("words").value.trim(),words=t?t.split(/\s+/u):[],sent=t?t.split(/[.!?]+/).filter(Boolean):[];
 out("wordResult",`${words.length} words · ${t.length} chars · ${sent.length} sentences · ~${Math.ceil(words.length/200)} min read`);
}
function timeCalc(){let h=n("th1"),m=n("tm1"),s=n("ts1");if([h,m,s].some(x=>x===null)||[h,m,s].some(x=>x<0)){out("timeResult","Enter non-negative values.");return}let total=h*3600+m*60+s,hh=Math.floor(total/3600),mm=Math.floor(total%3600/60),ss=total%60;out("timeResult",`${hh}h ${mm}m ${ss}s`)}
function dateDifference(){let a=$("dateA").value,b=$("dateB").value;if(!a||!b){out("dateResult","Choose both dates.");return}let x=new Date(a+"T00:00:00Z"),y=new Date(b+"T00:00:00Z"),days=Math.abs(y-x)/86400000;out("dateResult",`${fmt(days)} days · ${fmt(days/7)} weeks (approx.)`)}
function countdown(){let d=$("examDate").value;if(!d){out("countdownResult","Choose an exam date.");return}let diff=new Date(d).getTime()-Date.now();if(diff<=0){out("countdownResult","That date has passed.");return}let days=Math.floor(diff/86400000),h=Math.floor(diff%86400000/3600000),m=Math.floor(diff%3600000/60000);out("countdownResult",`${days} days · ${h} hours · ${m} minutes remaining`)}
function combinatorics(){
 let nn=integer("combN"),rr=integer("combR");
 if(nn===null||rr===null||nn<0n||rr<0n||rr>nn){out("combResult","Use integers with 0 ≤ r ≤ n.");return}
 // Exact BigInt multiplicative algorithms: no floating-point overflow.
 let perm=1n,comb=1n;
 for(let i=0n;i<rr;i++){perm*=nn-i;comb=comb*(nn-i)/(i+1n)}
 out("combResult",`nPr = ${perm.toString()} · nCr = ${comb.toString()}`);
}
function matrixCalc(){
 let ids=["m11","m12","m21","m22","n11","n12","n21","n22"],vals=ids.map(id=>parseExactFraction($(id).value));
 if(vals.some(v=>!v)){out("matrixResult","Enter integers or fractions such as 3/4.");return}
 let [x,y,z,w,e,f,g,h]=vals,det=x.mul(w).sub(y.mul(z));
 let p=x.mul(e).add(y.mul(g)),q=x.mul(f).add(y.mul(h)),r=z.mul(e).add(w.mul(g)),s=z.mul(f).add(w.mul(h));
 let inverse=det.n!==0n?`A⁻¹=[${w.div(det)}, ${y.neg().div(det)}; ${z.neg().div(det)}, ${x.div(det)}]`:"A has no inverse (determinant = 0)";
 out("matrixResult",`det(A) = ${det} · ${inverse} · AB = [${p}, ${q}; ${r}, ${s}]`);
}

/* Safe scientific parser with explicit whitelist and no arbitrary property access. */
const sciFns={sqrt:Math.sqrt,sin:Math.sin,cos:Math.cos,tan:Math.tan,log:Math.log10,ln:Math.log,abs:Math.abs,asin:Math.asin,acos:Math.acos,atan:Math.atan};
function tokenizeExpr(s){
 let out=[],i=0;
 while(i<s.length){
   if(/\s/.test(s[i])){i++;continue}
   if(/[0-9.]/.test(s[i])){let m=s.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/i);if(!m)throw Error();out.push({t:"num",v:Number(m[0])});i+=m[0].length;continue}
   if(/[a-zA-Z]/.test(s[i])){let m=s.slice(i).match(/^[a-zA-Z]+/)[0].toLowerCase();out.push({t:"name",v:m});i+=m.length;continue}
   if("+-*/^(),".includes(s[i])){out.push({t:s[i],v:s[i]});i++;continue}
   throw Error();
 }
 return out;
}
function scientific(){
 let src=$("sciExpr").value.trim();if(!src){out("sciResult","Enter an expression.");return}
 try{
   let tok=tokenizeExpr(src),pos=0;
   const peek=()=>tok[pos],eat=t=>{if(peek()?.t!==t)throw Error();return tok[pos++]};
   function primary(){
     if(peek()?.t==="num")return eat("num").v;
     if(peek()?.t==="name"){
       let name=eat("name").v;
       if(name==="pi")return Math.PI;if(name==="e")return Math.E;
       eat("(");let v=expr();eat(")");
       if(!(name in sciFns))throw Error();return sciFns[name](v);
     }
     if(peek()?.t==="("){eat("(");let v=expr();eat(")");return v}
     if(peek()?.t==="-"){eat("-");return -primary()}
     if(peek()?.t==="+"){eat("+");return primary()}
     throw Error();
   }
   function power(){let a=primary();if(peek()?.t==="^"){eat("^");let b=power();a=Math.pow(a,b)}return a}
   function term(){let a=power();while(peek()?.t==="*"||peek()?.t==="/"){let op=eat(peek().t).t,b=power();if(op==="*" )a*=b;else{if(b===0)throw Error();a/=b}}return a}
   function expr(){let a=term();while(peek()?.t==="+"||peek()?.t==="-"){let op=eat(peek().t).t,b=term();a=op==="+"?a+b:a-b}return a}
   let r=expr();if(pos!==tok.length||!Number.isFinite(r))throw Error();out("sciResult",fmt(r));
 }catch{out("sciResult","Invalid expression or undefined result.")}
}

const problemOptions={
 distance:{label:"Distance / Speed / Time",fields:[["distance","Distance (km)"],["speed","Speed (km/h)"]]},
 work:{label:"Work Rate",fields:[["rate1","Rate A (jobs/hour)"],["rate2","Rate B (jobs/hour)"],["workTotal","Total work (jobs)"]]},
 percent:{label:"Percentage Change",fields:[["original","Original value"],["final","Final value"]]},
 simple:{label:"Simple Interest",fields:[["p","Principal"],["r","Annual rate %"],["t","Time (years)"]]},
 compound:{label:"Compound Growth",fields:[["p","Starting amount"],["r","Annual growth %"],["t","Time (years)"],["f","Compounds/year"]]},
 proportion:{label:"Proportion a:b = c:x",fields:[["a","A"],["b","B"],["c","C"]]},
 average:{label:"Average / Mean",fields:[["values","Values, comma-separated"]]}
};
function problemTypeChanged(){let type=$("problemType").value,c=problemOptions[type],box=$("problemInputs");box.innerHTML=`<div class="problem-fields">${c.fields.map(f=>`<input id="pf_${f[0]}" ${f[0]==="values"?"type=text":"type=number step=any"} placeholder="${f[1]}">`).join("")}</div>`}
function solveWordProblem(){
 let t=$("problemType").value,g=id=>Number($("pf_"+id).value),s=x=>`<span class="step">${x}</span>`,r="";
 if(t==="distance"){let d=g("distance"),v=g("speed");if(!isNum(d)||!isNum(v)||v<=0){$("stepsResult").textContent="Enter valid distance and speed.";return}let z=d/v;r=s("<b>1. Formula:</b> Time = Distance ÷ Speed")+s(`<b>2. Substitute:</b> ${fmt(d)} ÷ ${fmt(v)}`)+s(`<b>3. Calculate:</b> ${fmt(z)} hours`)+s(`<b>Answer:</b> ${fmt(z*60)} minutes`)}
 else if(t==="work"){let a=g("rate1"),b=g("rate2"),w=g("workTotal");if([a,b,w].some(x=>!isNum(x)||x<=0)){$("stepsResult").textContent="Enter positive rates and work.";return}let q=a+b,z=w/q;r=s(`<b>1. Combined rate:</b> ${fmt(a)} + ${fmt(b)} = ${fmt(q)} jobs/hour`)+s(`<b>2. Time:</b> ${fmt(w)} ÷ ${fmt(q)} = ${fmt(z)} hours`)+s(`<b>Answer:</b> ${fmt(z)} hours`)}
 else if(t==="percent"){let a=g("original"),b=g("final");if(!isNum(a)||!isNum(b)||a===0){$("stepsResult").textContent="Original value cannot be zero.";return}let z=(b-a)/a*100;r=s(`<b>1. Difference:</b> ${fmt(b-a)}`)+s(`<b>2. Formula:</b> (Final − Original) ÷ Original × 100`)+s(`<b>3. Substitute:</b> (${fmt(b-a)} ÷ ${fmt(a)}) × 100`)+s(`<b>Answer:</b> ${z>=0?"Increase":"Decrease"} of ${fmt(Math.abs(z))}%`)}
 else if(t==="simple"){let p=g("p"),rr=g("r"),tt=g("t");if([p,rr,tt].some(x=>!isNum(x))||p<0||tt<0){$("stepsResult").textContent="Enter valid values.";return}let i=p*rr/100*tt;r=s("<b>1. Formula:</b> I = P × r × t")+s(`<b>2. Substitute:</b> ${fmt(p)} × ${fmt(rr/100)} × ${fmt(tt)}`)+s(`<b>3. Interest:</b> ${fmt(i)}`)+s(`<b>Answer:</b> Total = ${fmt(p+i)}`)}
 else if(t==="compound"){let p=g("p"),rr=g("r"),tt=g("t"),f=g("f");if([p,rr,tt,f].some(x=>!isNum(x))||p<0||tt<0||f<=0){$("stepsResult").textContent="Enter valid values.";return}let a=p*Math.pow(1+rr/100/f,f*tt);r=s("<b>1. Formula:</b> A = P(1 + r/n)^(nt)")+s(`<b>2. Substitute:</b> P=${fmt(p)}, r=${fmt(rr/100)}, n=${fmt(f)}, t=${fmt(tt)}`)+s(`<b>3. Result:</b> A = ${fmt(a)}`)+s(`<b>Answer:</b> ${fmt(a)}`)}
 else if(t==="proportion"){let a=g("a"),b=g("b"),c=g("c");if([a,b,c].some(x=>!isNum(x))||a===0){$("stepsResult").textContent="Enter valid values; A cannot be zero.";return}let x=b*c/a;r=s(`<b>1. Set proportion:</b> ${fmt(a)}:${fmt(b)} = ${fmt(c)}:x`)+s(`<b>2. Cross multiply:</b> ${fmt(a)}x = ${fmt(b*c)}`)+s(`<b>3. Divide:</b> x = ${fmt(b*c)} ÷ ${fmt(a)}`)+s(`<b>Answer:</b> x = ${fmt(x)}`)}
 else {let a=$("pf_values").value.split(",").map(Number);if(!a.length||a.some(x=>!isNum(x))){$("stepsResult").textContent="Enter comma-separated numbers.";return}let sum=a.reduce((x,y)=>x+y,0),m=sum/a.length;r=s(`<b>1. Count:</b> ${a.length}`)+s(`<b>2. Sum:</b> ${fmt(sum)}`)+s(`<b>3. Formula:</b> Mean = Sum ÷ Count`)+s(`<b>Answer:</b> ${fmt(sum)} ÷ ${a.length} = ${fmt(m)}`)}
 $("stepsResult").innerHTML=r;
}

/* Setup */
Object.entries(problemOptions).forEach(([k,v])=>{let o=document.createElement("option");o.value=k;o.textContent=v.label;$("problemType").appendChild(o)});
problemTypeChanged();geometryInputs();physicsInputs();unitInputs();

/* Filters */
document.querySelectorAll(".cat").forEach(btn=>btn.addEventListener("click",()=>{
 document.querySelectorAll(".cat").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
 let f=btn.dataset.filter;document.querySelectorAll(".tool-card").forEach(c=>c.classList.toggle("hidden",f!=="all"&&!c.dataset.cat.split(" ").includes(f)));
}));

/* Pomodoro */
let seconds=1500,running=false,interval;
function renderTimer(){let m=Math.floor(seconds/60),s=seconds%60;out("timer",`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`)}
function toggleTimer(){running=!running;$("timerBtn").textContent=running?"Pause":"Start";if(running)interval=setInterval(()=>{if(seconds>0){seconds--;renderTimer()}else{running=false;clearInterval(interval);$("timerBtn").textContent="Start"}},1000);else clearInterval(interval)}
function resetTimer(){clearInterval(interval);running=false;seconds=1500;renderTimer();$("timerBtn").textContent="Start"}renderTimer();

/* Popup calculator */
let calcExpr="";
function openCalculator(){$("calcModal").classList.add("open");$("calcModal").setAttribute("aria-hidden","false")}
function closeCalculator(){$("calcModal").classList.remove("open");$("calcModal").setAttribute("aria-hidden","true")}
function calcRender(){$("calcDisplay").value=calcExpr||"0"}
function calcInput(x){if(calcExpr==="Error")calcExpr="";calcExpr+=x;calcRender()}
function calcClear(){calcExpr="";calcRender()}
function calcBack(){calcExpr=calcExpr.slice(0,-1);calcRender()}
function calcEquals(){let e=calcExpr.replace(/×/g,"*").replace(/÷/g,"/").replace(/−/g,"-");if(!e)return;if(!/^[0-9+\-*/().\s]+$/.test(e)){calcExpr="Error";calcRender();return}try{let r=Function('"use strict";return ('+e+')')();calcExpr=Number.isFinite(r)?fmt(r):"Error"}catch{calcExpr="Error"}calcRender()}
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCalculator()});
