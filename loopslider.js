/*
    jsui pic-based slider
    (a la pictslider but with user interaction messages sending)
*/

this.autowatch = 1;
outlets = 4;

sketch.default2d();

var myblend = 1;
var act = 1;
var loop = 0;

var val = 0;
var prev_val = 0;
var llooppt = 0.;
var rlooppt = 1.;
var clicked = 0;
var over = 0;
var left = 0;
var ldist = 0;
var right = 0;
var rdist = 0;

var hspacer = 10;
var vspacer = 10;
var cursorsize = 16;
var cursorpos, lloopptpos, rloopptpos;
var width;
var height;
var aspect;

draw();

function draw()
{
    width = box.rect[2] - box.rect[0];
    height = box.rect[3] - box.rect[1];
    aspect = width / height;

    with(sketch)
    {

		glclearcolor(0,0,0,0);
        glclear();

        if (myblend == 1)
            glenable("blend");
        else
            gldisable("blend");

		gllinewidth(3);
		
		cursorpos = val*(width-2*hspacer)+hspacer;
		lloopptpos = llooppt*(width-2*hspacer)+hspacer;
		rloopptpos = rlooppt*(width-2*hspacer)+hspacer;
		var worldcursorsize = cursorsize / height;

		// illuminated time line left part
		//glcolor(0.5,0.8,0.05,1.); // --> old one
		glcolor(0.,0.7,0.7,1.); // -> new bright blue
		moveto(screentoworld(hspacer, height/2));
		lineto(screentoworld(cursorpos, height/2));
		
		// not yet illuminated time line right part
		glcolor(0.3,0.3,0.3,1.);
		moveto(screentoworld(width-hspacer, height/2));
		lineto(screentoworld(cursorpos, height/2));
		
		gllinewidth(1);
		
		// DRAW LOOP POINTS
		
		if(loop == 1) {
			//glcolor(0.,0.5,0.95,1.);
			//glcolor(0.,0.7,0.7,1.);
			glcolor(1.,1.,1.,1.);
			moveto(screentoworld(lloopptpos,0));
			lineto(screentoworld(lloopptpos,height));
			tri(screentoworld(lloopptpos, 0),
				screentoworld(lloopptpos + 5, 0),
				screentoworld(lloopptpos, 5));
			tri(screentoworld(lloopptpos, height),
				screentoworld(lloopptpos + 5, height),
				screentoworld(lloopptpos, height - 5));
			//glcolor(0.,0.5,0.95,0.5);
			//glcolor(0.,0.23,0.35,1.);
			glcolor(0.,0.7,0.7,1.);
			quad(screentoworld(lloopptpos - hspacer, 0),
				screentoworld(lloopptpos, 0),
				screentoworld(lloopptpos, height),
				screentoworld(lloopptpos - hspacer, height));

			//glcolor(0.,0.5,0.95,1.);
			//glcolor(0.,0.7,0.7,1.);
			glcolor(1.,1.,1.,1.);
			moveto(screentoworld(rloopptpos,0));
			lineto(screentoworld(rloopptpos,height));
			tri(screentoworld(rloopptpos, 0),
				screentoworld(rloopptpos - 5, 0),
				screentoworld(rloopptpos, 5));
			tri(screentoworld(rloopptpos, height),
				screentoworld(rloopptpos - 5, height),
				screentoworld(rloopptpos, height - 5));
			//glcolor(0.,0.5,0.95,0.5);
			//glcolor(0.,0.23,0.35,1.);
			glcolor(0.,0.7,0.7,1.);
			quad(screentoworld(rloopptpos, 0),
				screentoworld(rloopptpos + hspacer, 0),
				screentoworld(rloopptpos + hspacer, height),
				screentoworld(rloopptpos, height));
		}
		
		// DRAW CURSOR
		
		//glcolor(0.5,0.5,0.5,1.);
		glcolor(1.,1.,1.,1.);
		moveto(screentoworld(cursorpos, height/2));
		circle(worldcursorsize);

        if(clicked) {
			//glcolor(0.5,0.8,0.05,1.);
			glcolor(0.,0.7,0.7,1.);
			circle(worldcursorsize*0.6);
        }
		else {
			//glcolor(0.2,0.5,0.02,1.);
			glcolor(0.,0.23,0.35,1.);
			circle(worldcursorsize*0.6);
		}
    }
}

function bang()
{
    draw();
    refresh();
    outlet(0,val);
}

function msg_float(v)
{
	if(clicked == 0) {
		if(loop == 1) {
			val = Math.min(Math.max(llooppt,v),rlooppt);
		} else {
			val = Math.min(Math.max(0,v),1);
		}
    	notifyclients();
    	bang();
	}
}

function internal_msg_float(v)
{
	if(loop == 1) {
		val = Math.min(Math.max(llooppt,v),rlooppt);
	} else {
		val = Math.min(Math.max(0,v),1);
	}
    notifyclients();
    bang();
	
}

function set(v)
{
	if(clicked == 0) {
		if(loop == 1) {
			val = Math.min(Math.max(llooppt,v),rlooppt);
		} else {
			val = Math.min(Math.max(0,v),1);
		}
    	notifyclients();
    	draw();
    	refresh();
	}
}

function set_llooppt(v) 
{
	if(loop == 1) {
		llooppt = Math.min(Math.max(0,v),rlooppt);
		internal_msg_float(val);
		outlet(2,llooppt);
	}
}

function set_rlooppt(v) 
{
	if(loop == 1) {
		rlooppt = Math.min(Math.max(llooppt,v),1);
		internal_msg_float(val);
		outlet(3,rlooppt);
	}
}

function get_looppts()
{
	outlet(3,rlooppt);
	outlet(2,llooppt);
}

function set_loop(l)
{
	loop = (l == 0) ? 0 : 1;
	internal_msg_float(val);
	outlet(3,rlooppt);
	outlet(2,llooppt);
}

function active(a)
{
    if (a == 0) {
        act = 0;
    } else {
        act = 1;
	}
}

// ************************** MOUSE INTERACTION ************************** //

function onclick(x,y,but,cmd,shift,capslock,option,ctrl)
{
    ondrag(x,y,but,cmd,shift,capslock,option,ctrl)
}
onclick.local = 1; //private. could be left public to permit "synthetic" events

function ondrag(x,y,but,cmd,shift,capslock,option,ctrl)
{
    var f,a;
    
    if(!act)
        return;
	
	f = Math.min(Math.max(cursorsize/2,x),width-cursorsize/2);
	f -= cursorsize/2;
	f /= width-cursorsize;

    if(but == 0)
    {
        //outlet release msg
        if(clicked == 1)
        {
			///////////////// ON RELEASED /////////////////////////////////
            outlet(1,0);
            clicked = 0;
			left = 0;
			right = 0;
			over = 0;
        }
        draw();
        refresh();
    }
    else
    {
        if(clicked == 0)
        {
			///////////////// ON CLICK /////////////////////////////////
            outlet(1,1);
            clicked = 1;

			if(loop == 1) {
				if(lloopptpos - x < hspacer && lloopptpos - x >= 0) {
					left = 1;
				} else if(x - rloopptpos < hspacer && x - rloopptpos >= 0) {
					right = 1;
				}
			}
			ldist = Math.abs(lloopptpos - x);
			rdist = Math.abs(x - rloopptpos);
				
			if((x-cursorpos)*(x-cursorpos) + (y-height/2)*(y-height/2) < (cursorsize/2)*(cursorsize/2)) {
				over = 1;
			} else {
				over = 0;
			}
        }
		
		if((left == 0 && right == 0) || over == 1) {
        	internal_msg_float(f); //set new value with clipping + refresh
		} else {
			if(loop == 1) {
				if(left == 1) {
					llooppt = (x + ldist)/(width-2*hspacer) - hspacer/width;
					llooppt = Math.min(Math.max(0,llooppt),rlooppt);
					internal_msg_float(val);
					outlet(2,llooppt);
				} else if(right == 1) {
					rlooppt = (x - rdist)/(width-2*hspacer) - hspacer/width;
					rlooppt = Math.min(Math.max(llooppt,rlooppt),1);
					internal_msg_float(val);
					outlet(3,rlooppt);
				}
			}
			draw();
			refresh();
			//etc ...
		}
    }
}
ondrag.local = 1; //private. could be left public to permit "synthetic" events

function onresize(w,h)
{
	box.size(w,h);
    draw();
    refresh();
}
onresize.local = 1; //private