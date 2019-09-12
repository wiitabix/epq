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

  this.drawEquation = function(equation, colour, width, step) {
    ctx.lineWidth = width;
    ctx.strokeStyle = colour;
    for (let x = -xMax; x < xMax; x= x+step) {
        ctx.beginPath();
        ctx.moveTo(x, (yScale*equation(x/xScale)));
        ctx.lineTo((x+step), (yScale*equation((x+step)/xScale)));
        ctx.stroke();
    }
  };
    
  this.drawEquations = function(funcArr, x, y) {
    for (let i = 0; i<funcArr.length; i++) {
        if (funcArr[i] !== "blank") {
          this.drawEquation(funcArr[i][0], funcArr[i][1], 3, 1);
        }
    }
  };
  
  this.drawHighlightedEquation = function(funcArr, x, y) {
    for (let i = 0; i<funcArr.length; i++) {
      if (funcArr[i] !== "blank") {
        if ((funcArr[i][0](x/xScale)*yScale) >= y-10 && (funcArr[i][0](x/xScale)*yScale) <= y+10) {
          this.drawEquation(funcArr[i][0], '#ff0000', 4, 1);
          this.drawNumberBox(x,y,xScale,yScale, funcArr[i][0]);
        }
      }
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
  
  this.drawNumberBox = function(x,y,xScale,yScale, func) {
    ctx.save();
    ctx.fillStyle = '#bab5a8';
    ctx.fillRect(x-72,y,70,20);
    ctx.scale(1,-1);
    ctx.textAlign = "right";
    ctx.font = '15px sans-serif';
    ctx.fillStyle = '#000000';
    ctx.fillText(Math.trunc(x/xScale),x-42,-y-5);
    ctx.fillText(',',x-37,-y-6);
    ctx.textAlign = "left";
    ctx.fillText(Math.trunc(func(x/xScale)),x-33,-y-5);
    ctx.restore();
  };
}

function equationBox(number, div, t, sBut, dBut, funcs) {
  let divider = document.getElementById(div);
  let submitButton = document.getElementById(sBut);
  let delButton = document.getElementById(dBut);
  let text = document.getElementById(t);
  let colour = '#000000';
  
  this.clear = function() {
    text.value = '';
    funcs[number-1] = "blank";
  }; 
  
  this.submit = function() {
    let string = text.value;
    string = string.replace(/sin/gi, 'Math.sin');
    string = string.replace(/cos/gi, 'Math.cos');
    string = string.replace(/tan/gi, 'Math.tan');
    string = string.replace(/abs/gi, 'Math.abs');
    string = string.replace(/ceil/gi, 'Math.ceil');
    string = string.replace(/floor/gi, 'Math.floor');
    string = string.replace(/sqrt/gi, 'Math.sqrt');
    string = string.replace(/[0-9]x/g, '$&' + 'product');
    string = string.replace(/xproduct/g, '*x');
    string = string.replace(/\^/g, '**');
    funcs[number-1] = [new Function('x', 'return ' + string), colour];
  };
}

let setOnClicks = function(graph) {
  document.getElementById("plusY").onclick = graph.zoomInY;
  document.getElementById("minusY").onclick = graph.zoomOutY;
  document.getElementById("plusX").onclick = graph.zoomInX;
  document.getElementById("minusX").onclick = graph.zoomOutX;
};


let update = function(graph, funcArr, eInput) {
  let x = getMouseX();
  let y = getMouseY();
  graph.clearGraph();
  graph.drawLines();
  graph.drawAxis();
  graph.drawNumbers();
  graph.drawEquations(funcArr, x, y);
  graph.drawHighlightedEquation(funcArr, x, y);
  window.requestAnimationFrame(function() {
                                            update(graph, funcArr, eInput);
                                          });
};

//main
let tEquations = document.getElementById("equations");
let eInput = document.getElementById("tInput");
let canvas = document.getElementById("myCanvas");
let MyGraph = new Graph(canvas);
setOnClicks(MyGraph);

let funcs = [];
for (let i=0; i<10; i++){
  funcs.push("blank");
}

let box1 = new equationBox(1, "equation1", "text1", "sbutton1", "dbutton1", funcs);
let box2 = new equationBox(2, "equation2", "text2", "sbutton2", "dbutton2", funcs);
let box3 = new equationBox(3, "equation3", "text3", "sbutton3", "dbutton3", funcs);
let box4 = new equationBox(4, "equation4", "text4", "sbutton4", "dbutton4", funcs);
let box5 = new equationBox(5, "equation5", "text5", "sbutton5", "dbutton5", funcs);
let box6 = new equationBox(6, "equation6", "text6", "sbutton6", "dbutton6", funcs);
let box7 = new equationBox(7, "equation7", "text7", "sbutton7", "dbutton7", funcs);
let box8 = new equationBox(8, "equation8", "text8", "sbutton8", "dbutton8", funcs);
let box9 = new equationBox(9, "equation9", "text9", "sbutton9", "dbutton9", funcs);
let box10 = new equationBox(10, "equation10", "text10", "sbutton10", "dbutton10", funcs);

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

update(MyGraph, funcs, eInput);
