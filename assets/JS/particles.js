
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
let p5Canvas;


/* const capturer = new CCapture( {
	framerate: 30,
  verbose: true,
  format:'webm',
  name:'video',
  quality: 100
} );
 */
function preload() {
}


function setup()
 {
  print(windowWidth, windowHeight)

    p5Canvas=createCanvas(windowWidth,windowHeight);
   

    
    /* gui.setStrokeWeight(0);
    gui.setTrackWidth(2);
    gui.setRounding(0); */
     t=0;

     cols=floor(windowWidth/scl);
     rows=floor(windowHeight/scl);
    

    
     var particelle = 100;
     for (var i=0; i<particelle; i++)
     {
       particles[i]= new Particle();
     }
}





function draw()
{
/*   if(frameCount === 1) capturer.start()
 */   

 background(255);
    
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
        v.setMag(1);
        flowfield[index]=v;
        xoff+=inc;

        }
     yoff+=inc;
     zoff+=0.0005;
     



    }
  
    var r = 255 * noise(t+10)*2;
    var g = 255 * noise(t+15)*2;
    var b = 255 * noise(t+20)*2;     
    t=s4.val;
    
  
   for (var i=1; i<particles.length; i++)
    {
      var counterprev=i-1;
      strokeWeight(.1);
      stroke(r,g,b);
      line(particles[counterprev].pos.x , particles[counterprev].pos.y , particles[i].pos.x , particles[i].pos.y);
      particles[i].follow(flowfield);
      particles[i].update();
    

      particles[i].show();
      
      particles[i].edges();
      
      }



}