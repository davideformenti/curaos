function Particle ()
{
            this.pos=createVector(random(width),random(height));
            this.vel=createVector(0,0);
            this.acc=createVector(0,0);
            //this.maxspeed=10;
            //floor(s2d1.valY)
            //floor(s2d1.valX)
        this.update =function()
        {
            this.multiplier=createVector(0,0);
            this.vel.add(this.acc);
            this.vel.limit(3);
            this.pos.add(this.vel);
            this.vel.add(this.multiplier);
            this.acc.mult(.7);
        }
this.follow = function(vectors){
    var x = floor(this.pos.x/scl);
    var y = floor(this.pos.y/scl);
    var index =x+y*cols;
    var force=vectors[index];
    this.applyForce(force);
}
        this.applyForce =function(force)
        {
            this.acc.add(force);
        }

        this.show = function()
        {
           
            

            
            point(this.pos.x,this.pos.y);
          
          
        }      
        
        this.edges = function ()
        {
            if(this.pos.x > width) this.pos.x =0;
            if(this.pos.x < 0) this.pos.x=width;
            if(this.pos.y > height) this.pos.y=0;
            if(this.pos.y < 0) this.pos.y =height;


        }

}