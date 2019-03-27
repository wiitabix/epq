"use strict";

function Graph(canvas) {
  let ctx = canvas.getContext("2d");
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  let yMax = Math.round(canvas.height/2);
  let xMax = Math.round(canvas.width/2);
  let xScale = 1;
  let yScale = 1;
  ctx.translate(xMax,yMax);
  ctx.scale(1, -1);
  ctx.textAlign = "center";
  
  this.clearGraph = function() {
    ctx.beginPath();
    ctx.clearRect(-xMax, -yMax, canvas.width, canvas.height);
  };
  
  this.drawAxis = function() {
    ctx.strokeStyle = '#000000';
      
    //draw x axis
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(0, -yMax);
    ctx.lineTo(0,yMax);
    ctx.stroke();
    
    //draw y axis
    ctx.beginPath();
    ctx.moveTo(-xMax,0);
    ctx.lineTo(xMax,0);
    ctx.stroke();
  };
  
  this.drawLines = function() { 
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#807c73';
    //draw vertical lines
    for (let i = -xMax; i < xMax; i = i+xMax/10) {
      ctx.beginPath();
      ctx.moveTo(i, -yMax);
      ctx.lineTo(i, yMax);
      ctx.stroke();
    }
    
    //draw horizontal lines
    for (let i = -yMax; i < yMax; i = i+yMax/10) {
      ctx.beginPath();
      ctx.moveTo(-xMax, i);
      ctx.lineTo(xMax, i);
      ctx.stroke();
    }
  };
  
  this.drawNumbers = function() {
    for (let i = -xMax; i < xMax; i = i+xMax/10) {
      if (Math.trunc(i) !== 0) {
        ctx.save();
        ctx.scale(1, -1);
        ctx.fillText(Math.trunc(i/xScale), i-1.5, 10);
        ctx.restore();
      }
    }
    
    for (let i = -yMax; i < yMax; i = i+yMax/10) {
      if (Math.trunc(i) !== 0) {
        ctx.save();
        ctx.scale(1, -1);
        ctx.fillText(Math.trunc(-i/yScale), -13, i+4);
        ctx.restore();
      }
    }
    ctx.save();
    ctx.scale(1,-1);
    ctx.fillText(0,-10,10);
    ctx.restore();
  };

  this.drawEquation = function(equation, colour, step, width) {
    ctx.strokeWidth = 2;
    ctx.strokeStyle = colour;
    
    for (let x = -xMax; x < xMax; x= x+step) {
        ctx.beginPath();
        ctx.moveTo(x, (yScale*equation(x/xScale)));
        ctx.lineTo((x+step), (yScale*equation((x+step)/xScale)));
        ctx.stroke();
    }
  };
  
  this.zoomInX = function() {
    xScale = xScale + 0.1;
  };
  
  this.zoomOutX = function() {
    xScale = xScale - 0.1;
  };
  
  this.zoomInY = function() {
    yScale = yScale + 0.1;
  };
  
  this.zoomOutY = function() {
    yScale = yScale - 0.1;
  };
}

let setOnClicks = function(graph) {
  document.getElementById("plusY").onclick = graph.zoomInY;
  document.getElementById("minusY").onclick = graph.zoomOutY;
  document.getElementById("plusX").onclick = graph.zoomInX;
  document.getElementById("minusX").onclick = graph.zoomOutX;
};


let update = function(graph, funcArr) {
  let x = getMouseX();
  let y = getMouseY();
  graph.clearGraph();
  graph.drawLines();
  graph.drawAxis();
  for (let i = 0; i<funcArr.length; i++) {
    if (funcArr[i][0](x) >= (y-10) && funcArr[i][0](x) <= (y+10)) {
      console.log('OnFuction: ', funcArr[i][0]);
      graph.drawEquation(funcArr[i][0],"#ff0000", funcArr[i][2]);
    } else {
      graph.drawEquation(funcArr[i][0], funcArr[i][1], funcArr[i][2]);
    }
  }
  graph.drawNumbers();
  window.requestAnimationFrame(function() {
                                            update(graph, funcArr);
                                          });
};

//main
let canvas = document.getElementById("myCanvas");
let MyGraph = new Graph(canvas);
setOnClicks(MyGraph);

let funcs = [];
funcs.push([function (a) {return 2*a+100}, "#00ff00", 1]);
funcs.push([function (a) {return 2*a}, "#00ff00", 1]);
funcs.push([function (a) {return 2*a-100}, "#00ff00", 1]);

let x = null;
let y = null;
document.addEventListener('mousemove', onMouseUpdate, false);function onMouseUpdate(e) {
    x = e.pageX - Math.round(window.innerWidth/2);
    y = -(e.pageY - Math.round(window.innerHeight/2));
}

function getMouseX() {
    return x;
}

function getMouseY() {
    return y;
}



update(MyGraph, funcs);
//graph.drawEquation(function (a) {return 2*a}, "#00ff00", 1);
//graph.drawEquation(function (a) {return a*a}, "#00ff00", 1);
//graph.drawEquation(function (a) {return a*a*a+20*a*a+50*a-200}, "#ff0000", 1);
//graph.drawEquation(function (a) {return Math.sin(a)}, "#0000ff", 0.01, 20, 300); //buttons for scale, render loop, 2D array of params for drawequation!!!!!!!!!!!!!!!!!!!!
//graph.drawEquation(function (a) {return (1/a)+100}, "#ff00ff", 1);
