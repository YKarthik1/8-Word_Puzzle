
const MAX_DFS_DEPTH=25;

function createInputs(container){

let div=document.getElementById(container+"-grid");

for(let i=0;i<9;i++){

let inp=document.createElement("input");

inp.oninput=updateViz;

div.appendChild(inp);

}

}

function getGrid(name){

let inputs=document.querySelectorAll("#"+name+"-grid input");

let nums=[...inputs].map(i=>Number(i.value)||0);

return[

nums.slice(0,3),

nums.slice(3,6),

nums.slice(6,9)

];

}

function setGrid(name,state){

let flat=state.flat();

let inputs=document.querySelectorAll("#"+name+"-grid input");

inputs.forEach((i,idx)=>i.value=flat[idx]);

updateViz();

}

function clearGrid(name){

document.querySelectorAll("#"+name+"-grid input")

.forEach(i=>i.value="");

updateViz();

}

function clearAll(){

clearGrid("initial");

clearGrid("goal");

document.getElementById("results").innerHTML=

"Time:-<br>Nodes Expanded:-<br>Path Cost:-";

}

function updateViz(){

draw(getGrid("initial"));

}

function draw(state){

let viz=document.getElementById("viz-grid");

viz.innerHTML="";

state.flat().forEach(n=>{

let d=document.createElement("div");

d.className="tile";

d.innerText=n||"";

viz.appendChild(d);

});

}

function randomInitial(){

setGrid("initial",[[1,2,3],[8,0,4],[7,6,5]]);

}

function randomGoal(){

setGrid("goal",[[2,8,1],[0,4,3],[7,6,5]]);

}

function stringify(s){return JSON.stringify(s)}

function neighbors(s){

let x,y;

for(let i=0;i<3;i++)
for(let j=0;j<3;j++)
if(s[i][j]==0){x=i;y=j}

let dirs=[[1,0],[-1,0],[0,1],[0,-1]];

let res=[];

for(let[d1,d2] of dirs){

let nx=x+d1,ny=y+d2;

if(nx>=0&&ny>=0&&nx<3&&ny<3){

let c=JSON.parse(JSON.stringify(s));

[c[x][y],c[nx][ny]]=[c[nx][ny],c[x][y]];

res.push(c);

}

}

return res;

}

function manhattan(a,b){

let d=0;

for(let i=0;i<3;i++)
for(let j=0;j<3;j++){

let v=a[i][j];

if(v){

for(let x=0;x<3;x++)
for(let y=0;y<3;y++)
if(b[x][y]==v)d+=Math.abs(i-x)+Math.abs(j-y);

}

}

return d;

}

function bfs(start,goal){

let q=[[start,[]]];

let vis=new Set();

let nodes=0;

while(q.length){

let[s,p]=q.shift();

let k=stringify(s);

if(vis.has(k))continue;

vis.add(k);

nodes++;

if(k==stringify(goal))return{path:[...p,s],nodes};

for(let n of neighbors(s))
q.push([n,[...p,s]]);

}

}

function dfs(start,goal){

let st=[[start,[],0]];

let vis=new Set();

let nodes=0;

while(st.length){

let[s,p,d]=st.pop();

let k=stringify(s);

if(vis.has(k))continue;

vis.add(k);

nodes++;

if(k==stringify(goal))return{path:[...p,s],nodes};

if(d<MAX_DFS_DEPTH)

for(let n of neighbors(s))
st.push([n,[...p,s],d+1]);

}

}

function astar(start,goal){

let open=[[start,[],0]];

let vis=new Set();

let nodes=0;

while(open.length){

open.sort((a,b)=>a[2]-b[2]);

let[s,p,c]=open.shift();

let k=stringify(s);

if(vis.has(k))continue;

vis.add(k);

nodes++;

if(k==stringify(goal))return{path:[...p,s],nodes};

for(let n of neighbors(s)){

let g=p.length+1;

open.push([n,[...p,s],g+manhattan(n,goal)]);

}

}

}

function animate(path){

let i=0;

let t=setInterval(()=>{

draw(path[i]);

i++;

if(i>=path.length)clearInterval(t);

},500);

}

function solve(){

let start=getGrid("initial");

let goal=getGrid("goal");

let algo=document.getElementById("algo").value;

let t0=performance.now();

let res=algo=="bfs"?bfs(start,goal):

algo=="dfs"?dfs(start,goal):

astar(start,goal);

let time=(performance.now()-t0)/1000;

animate(res.path);

document.getElementById("results").innerHTML=

"Time: "+time.toFixed(3)+" s<br>"+

"Nodes Expanded: "+res.nodes+"<br>"+

"Path Cost: "+(res.path.length-1);

}

createInputs("initial");

createInputs("goal");

createInputs("viz");

randomInitial();

randomGoal();
