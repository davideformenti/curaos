let serial;
let latestData;
const Y_AXIS = 1;
const X_AXIS = 2;
let c1, c2;
let data; // for incoming serial data
let val;
let r, g, b, c, d;
let valLM35;
let SoilHumidity;
var PPM;
let GasSensorValue;
let ExtMoisture;

var esposizione;
let water_pg;
let light_pg;
let soil_pg;
let leaf_pg;



//------- water animation variables --------------
let kMax;
let step;
let n = 40; // number of blobs
let radius = 1; // diameter of the circle
let inter = 1; // difference between the sizes of two blobs
let maxNoise = 1400;
let lapse = 0;    // timer
let noiseProg = (x) => (x);



var np = 100;
var startcol;



var scl=10;
let rows, cols;
var inc=0.01;
var zoff=0;
var label1;
var particles=[];
var flowfield=[];
let spectral;
let labeltitolo;
let t;
let ppm_url = 'https://io.adafruit.com/api/v2/davideformenti/feeds/sentinella.ppm';
let esposizione_url = 'https://io.adafruit.com/api/v2/davideformenti/feeds/sentinella.exposure';
let SoilHumidity_url = 'https://io.adafruit.com/api/v2/davideformenti/feeds/sentinella.soil-humidity';
let ExtHumidity_url = 'https://io.adafruit.com/api/v2/davideformenti/feeds/sentinella.ext-humidity';
let Temp_url = 'https://io.adafruit.com/api/v2/davideformenti/feeds/sentinella.temperature';
let counter = 0;


function setup() {

  
  createCanvas(windowWidth, windowHeight);
  water_pg= createGraphics(width,height);
 


    /* temperature_pg.drawingContext.shadowOffsetX = 5;
    temperature_pg.drawingContext.shadowOffsetY = -5;
    temperature_pg.drawingContext.shadowBlur = .1;
    temperature_pg.drawingContext.shadowColor = 'black'; */

	angleMode(DEGREES);
  noFill();
	kMax = random(0.6, 1.0);
	step = 0.01;
	noStroke();

  noiseSeed(random(100));
	startcol = random(255);

  t=0;

  cols=floor(windowWidth/scl);
  rows=floor(windowHeight/scl);
 

 
  var particelle = 300;
  for (var i=0; i<particelle; i++)
  {
    particles[i]= new Particle();
  }





  serial = new p5.SerialPort();
 
  serial.list();
  serial.open('COM5');
  serial.on('connected', serverConnected);
  serial.on('list', gotList);
  serial.on('data', gotData);
  serial.on('data', serialEvent);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
  serial.on('close', gotClose);
  serial.on('connected', serverConnected);
  serial.on('open', portOpen);
  serial.on('data', serialEvent);
  serial.on('error', serialError);
  serial.on('close', portClose);
  


 } 

function draw() {
  
 

    water_monitor();

     water_pg.colorMode(HSL,360, 100, 100,1)
     var background_lightness = esposizione;
     var background_color = map(background_lightness,0,100,220,45);
     var background_light = map(background_lightness,0,100,10,70);
     water_pg.background(background_color,60,background_light, 0.1)

   var yoff=0;
   for(var y=0;  y<rows; y++)
   {
     var xoff=0;
     for(var x=0; x<cols;x++)
     {
       var index = x+y*cols;
       var r=noise(xoff,yoff)*255;
       var angle= noise(xoff,yoff,zoff)*TWO_PI*4;
       var v=p5.Vector.fromAngle(angle);
       v.setMag(.1);
       flowfield[index]=v;
       xoff+=inc;

       }
    yoff+=inc;
    zoff+=0.0005;
    



   }
 
   var r = 255 * noise(t+10)*2;
   var g = 255 * noise(t+15)*2;
   var b = 255 * noise(t+20)*2;     
   t=.5;
   
 
  for (var i=1; i<particles.length; i++)
   {
     var counterprev=i-1;
     strokeWeight(0);
     stroke(r,g,b);
     line(particles[counterprev].pos.x , particles[counterprev].pos.y , particles[i].pos.x , particles[i].pos.y);
     particles[i].follow(flowfield);
     particles[i].update();
   

     particles[i].show();
     
     particles[i].edges();
     
     }

   
 
}


function getPPMData() {
  //let data;  // local var to get last value
  // this calls a GET function, which requests a URL
  // the arguments are the url to request, the kind of data to expect,
  // and a callback function once the data is ready
  httpGet(ppm_url, 'json', function(response) {
    console.log(response);
    PPM = floor(response.last_value); // store the data we're interested in
    // draw an ellipse
    console.log(PPM);
  });
}

function getExposureData() {
  //let data;  // local var to get last value
  // this calls a GET function, which requests a URL
  // the arguments are the url to request, the kind of data to expect,
  // and a callback function once the data is ready
  httpGet(esposizione_url, 'json', function(response) {
    console.log(response);
    esposizione = floor(response.last_value); // store the data we're interested in
    // draw an ellipse
    console.log(esposizione);
  });
}

function getTempData() {
  //let data;  // local var to get last value
  // this calls a GET function, which requests a URL
  // the arguments are the url to request, the kind of data to expect,
  // and a callback function once the data is ready
  httpGet(Temp_url, 'json', function(response) {
    console.log(response);
    valLM35 = floor(response.last_value); // store the data we're interested in
    // draw an ellipse
    console.log(valLM35);
  });
}
function getExtHumData() {
  //let data;  // local var to get last value
  // this calls a GET function, which requests a URL
  // the arguments are the url to request, the kind of data to expect,
  // and a callback function once the data is ready
  httpGet(ExtHumidity_url, 'json', function(response) {
    console.log(response);
    ExtMoisture = floor(response.last_value); // store the data we're interested in
    // draw an ellipse
    console.log(ExtMoisture);
  });
}
function getSoilHumData() {
  //let data;  // local var to get last value
  // this calls a GET function, which requests a URL
  // the arguments are the url to request, the kind of data to expect,
  // and a callback function once the data is ready
  httpGet(SoilHumidity_url, 'json', function(response) {
    console.log(response);
    SoilHumidity = floor(response.last_value); // store the data we're interested in
    // draw an ellipse
    console.log(SoilHumidity);
  });
}


function serialEvent(){

/* 	//receive serial data here
	var inputString = serial.readStringUntil('\n');
  if (!inputString) return;
  // split the string into an array:
  var sensorReadings = split(inputString, ",");
  if (sensorReadings.length > 1) {       // check that the array has at least three elements
    valLM35 = int(sensorReadings[0]);      // copy the second element  into yPosition
    esposizione = int(sensorReadings[1]);  // copy the first element into xPosition
    SoilHumidity = int(sensorReadings[2]);  // copy the second element  into yPosition
    var rzero = int(sensorReadings[3]);  // copy the second element  into yPosition
    PPM = int(sensorReadings[4]);  // copy the second element  into yPosition
    ExtMoisture = int(sensorReadings[5]);  // copy the second element  into yPosition
    GasSensorValue = int(sensorReadings[6]);  // copy the second element  into yPosition
    console.log("umidità del terreno");
    console.log(SoilHumidity);
    console.log("tempertura");
    console.log(valLM35);
    console.log("esposizione");
    console.log(esposizione);
    console.log("ppm");
    console.log(PPM);
    console.log("rzero");
    console.log(rzero);
    console.log("Gas Sensor Value");
    console.log(GasSensorValue);
	} */
}

function serverConnected() {
  print("Connected to Server");
 }
 
 function gotList(thelist) {
  print("List of Serial Ports:");
   for (let i = 0; i < thelist.length; i++) {
   print(i + " " + thelist[i]);
  }
 }
 
 function gotOpen() {
  print("Serial Port is Open");
 }
 
 function portOpen(){
   console.log('the serial port opened!');
 }
 
 function gotClose(){
  print("Serial Port is Closed");
  latestData = "Serial Port is Closed";
 }

 function portClose(){
   console.log('the port was closed');
 }

 function gotError(theerror) {
  print(theerror);
 }
 
 function serialError(err){
   console.log('something went wrong with the port. ' + err);
 }
 
 function gotData() {
  
   /* data = serial.readStringUntil("/");
   console.log(data);
    let arr = data.split(",").map((item) => item.trim());
  val = data.split(",");
   r = Number(val[0]);
   g = Number(val[1]);
   b = Number(val[2]);
   c = Number(val[3]);
   d = Number(val[4]);
   console.log(data);
   console.log(r);
   console.log(g); */
 
 
 
   //d = map(d, 50, 1000, 0, 100);
 
 /* let currentString = serial.readLine();
   trim(currentString);
  if (!currentString) return;
  console.log("luce");
  console.log(currentString);
  console.log("temperatura");
  latestData = currentString; 
    */
 
 }








function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}





function water_monitor(){

    // only pull this every once in awhile
    if (counter % 180 == 0) {
      getExposureData();
      getPPMData(); // function for calling data
      getTempData();
      getSoilHumData();
      getExtHumData();

    }
    counter++;
/*   water_pg.colorMode(HSL,360, 100, 100,1)
  var background_lightness = esposizione;
  var background_color = map(background_lightness,0,100,220,45);
  var background_light = map(background_lightness,0,100,10,70);
  water_pg.background(background_color,60,background_light, 0.1)
 */
  let water_pgText=select('#ApportoIdrico');
  water_pgText.html(SoilHumidity);

  let esposizione_pgText=select('#esposizone');
  esposizione_pgText.html(esposizione);

  let   Umidità_pgText=select('#ExternalHumidity');
  Umidità_pgText.html(ExtMoisture);

  let PPM_pgText=select('#PPM');
  PPM_pgText.html(PPM);

  let Temperatura_pgText=select('#Temperatura');
  Temperatura_pgText.html(valLM35);



/* var soilMoistureValue = SoilHumidity;
var soilmoisturepercent = Math.floor(map(SoilHumidity, AirValue, WaterValue,0,100)); */
let noisiness;
let t = frameCount/100;
for (let i = n; i > 0; i--) {
  let alpha = 1 - noiseProg(i / n);
  water_pg.fill(PPM/3.5, 60, 60, alpha); 
  let size = radius + i * inter;
  let k = kMax * sqrt(i/n);
  if (windowWidth<windowHeight){
    maxNoise=700;
    n = 10; // number of blobs
    radius = 2; // diameter of the circle
    inter = 2; // difference between the sizes of two blobs
  }
  else{

  }
  noisiness = maxNoise * noiseProg(i / n);
  water_pg.stroke(SoilHumidity*2,100,SoilHumidity/2);
  if (windowWidth<windowHeight){ //mobile
  blob(size, water_pg.width/2, water_pg.height*1.25, k, t - i * step, noisiness);
  blob(size, water_pg.width/2, -water_pg.height/6, k, t - i * step, noisiness);
  }
  else{
    blob(size, water_pg.width*1.3, water_pg.height/2, k, t - i * step, noisiness);
    blob(size, -water_pg.width/3, water_pg.height/4, k, t - i * step, noisiness);
  }

}

/*water_pg.textSize(20);
 water_pg.text('APPORTO IDRICO', 100, 100);
  water_pg.text(SoilHumidity +'%', 600, 100); */
image (water_pg,0,0);




function blob(size, xCenter, yCenter, k, t, noisiness) {

  water_pg.beginShape();
  let angleStep = 360 / 10;
  for (let theta = 0; theta <= 360 + 2 * angleStep; theta += angleStep) {
    
    let r1, r2;
    r1 = cos(theta)+1;
    r2 = sin(theta)+1;
    let r = size + noise(k * r1,  k * r2, t) * noisiness;
    let x = xCenter + r * cos(theta);
    let y = yCenter + r * sin(theta);
    water_pg.curveVertex(x, y);
    water_pg.strokeWeight(1);


    
  }
  water_pg.endShape();
}
}




