var Canvas1;
var ctx1;
var Voltage_Log;
var VColor;

// Are we dragging?
var bVOLT = false;
var WIDTH;
var HEIGHT;
var cross_sep = 50.0;

var VOLTAGES;/* = new Array(601);
for (var i = 0; i < VOLTAGES.length; i++) {
  VOLTAGES[i] = new Array(601);
}*/

var CHOICE_RADIO = document.getElementsByName("contact");
CHOICE_RADIO.forEach(element => element.addEventListener('change', async (event) => {
   await getValue(element.value);
   draw(VOLTAGES);
   bVOLT = true;
}));

async function getValue(val) {
  if (val=="Choice1"){
    //var fnm = "./ChoiceA.csv";
    var fnm="https://raw.githubusercontent.com/brad42820/conduction_lab/main/ChoiceD2.csv"
  } else {
    var fnm="https://raw.githubusercontent.com/brad42820/conduction_lab/main/ChoiceA.csv"
  }
  //alert(val);
  return new Promise( resolve => {
    d3.text(fnm).then(function(text) {
      VOLTAGES=d3.csvParseRows(text);
      resolve('resolved');
    });
  });
}

//----------------------
// Dealing With The Radio
//const Focus_Form = document.getElementById('F');
//F = parseFloat(document.getElementById('F').value);
//Focus_Form.addEventListener('change', (event) => {
//  F = parseFloat(Focus_Form.value);
//  draw();
//  recompute_image_distance();
//});
//----------------------

//Object_Position_Log.innerHTML = "Object Position: ( " + px_to_x(Ox).toFixed(2) + ", " + py_to_y(Oy).toFixed(2) + ")";

//----------------------
// Drawing Functions
function clear() {
  ctx1.clearRect(0, 0, WIDTH, HEIGHT);
}


function draw_heat_map(VMAP){
    for(var i = 0; i<VMAP.length; i++){
      for(var j=0; j<VMAP[0].length; j++){
        if (VMAP[i][j] >= 5){
          ctx1.fillStyle = "red";
          ctx1.fillRect(i,j,1,1);
        }
        if (VMAP[i][j] <= 0){
          ctx1.fillStyle = "black";
          ctx1.fillRect(i,j,1,1);
        }
      }
    }
}

function draw_crosses(){
  ctx1.beginPath();
  for(var i = 1; i<600.0/cross_sep; i++){
    for(var j = 1; j<600.0/cross_sep; j++){
      ctx1.moveTo(cross_sep*i-5,cross_sep*j);
      ctx1.lineTo(cross_sep*i+5,cross_sep*j);
      ctx1.moveTo(cross_sep*i,cross_sep*j-5);
      ctx1.lineTo(cross_sep*i,cross_sep*j+5);
    }
  }
  ctx1.strokeStyle="#666666";
  ctx1.stroke();
}

function draw_probe(x,y) {
    ctx1.beginPath();
    ctx1.arc(x, y, 4, 0, 2 * Math.PI);
    ctx1.fillStyle="#00ddaa";
    ctx1.fill();
}

function draw(VOLTAGES) {
  clear();
  draw_heat_map(VOLTAGES);
  draw_crosses();
}

function draw_with_sensor(VOLTAGES, x, y) {
  clear();
  draw_heat_map(VOLTAGES);
  draw_crosses();
  draw_probe(x,y);
}

//----------------------

//----------------------
// Initialize canvas, context, and draw refresh interval
function init() {
  Canvas1 = document.getElementById("Canvas1");
  ctx1 = Canvas1.getContext( '2d' );
  WIDTH = Canvas1.width;
  HEIGHT = Canvas1.height;
  Voltage_Log = document.getElementById("Voltage_Log");
  VColor = Voltage_Log.style.color;
//  return setInterval(draw, 10);
}

init();


function MouseDrag(e){
  if (bVOLT){
    let i = e.pageX - Canvas1.offsetLeft;
    let j = e.pageY - Canvas1.offsetTop;
    if ((0<i) && (i<600) && (0<j) && (j<600)){
      Voltage_Log.innerHTML = "Voltage: "+parseFloat(VOLTAGES[i][j]).toFixed(2)+"V";
      draw_with_sensor(VOLTAGES, i, j);
    } else {
      Voltage_Log.innerHTML = "Voltage: -.--V";
      draw(VOLTAGES);
    }
  }
}
Canvas1.onmousemove = MouseDrag;
