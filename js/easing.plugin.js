/*
 * jQuery Easing v1.0b - http://gsgd.co.uk/sandbox/jquery.easing.php
 *
 * Copyright (c) 2006 George Smith
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 */

jQuery.speed = function (s,o) {
		o = o || {};
		
		if ( o.constructor == Function )
			o = { complete: o };
		var ss = { slow: 600, fast: 200 };
		if (s && s.constructor == Object) {
			o.easeMethod = s.easeMethod || 'inout';
			s = s.duration;
		}	else {
			o.easeMethod = 'easeout';
		}
		o.duration = (s && s.constructor == Number ? s : ss[s]) || 400;
		// Queueing
		o.oldComplete = o.complete;
		o.complete = function(){
			jQuery.dequeue(this, "fx");
			if ( o.oldComplete && o.oldComplete.constructor == Function )
				o.oldComplete.apply( this );
		};
	
		return o;
}
// rewrite the fx function to add in the easeMethod to the options object. Need to convert to string
// seemed shorter than rewriting the whole function, and should help prevent changes to jquery causing problems.
// alert(String(jQuery.fx).match(RegExp("z.o = \\{[^}]+\\};"))); 
jQuery.fx = String(jQuery.fx).replace(RegExp("z.o = \\{[^}]+\\};"), 
'z.o = {\
		duration: options.duration || 400,\
		complete: options.complete,\
		step: options.step,\
		easeMethod: options.easeMethod\
	};');
// rewrite the fx function to add in the easing to the options step function
// 100 * in is to prevent problems with expo for numbers between 0 and 1.  Might as well round objects to 2dp while we're at it. 
jQuery.fx = String(jQuery.fx).replace(RegExp("var p = [^}]+"), 
'var p = (t - z.startTime);\
z.now = (firstNum < lastNum) \
? 100*firstNum + jQuery.easing(p, 0, 100*(lastNum - firstNum), z.o.duration, z.o.easeMethod) \
: 100*firstNum - jQuery.easing(p, 0, 100*(firstNum - lastNum), z.o.duration, z.o.easeMethod);\
z.now = Math.round(z.now)/100;\
z.a();');


// make it a Function again
jQuery.fx = Function( "elem", "options", "prop", jQuery.fx.substring(jQuery.fx.indexOf('{')+1, jQuery.fx.lastIndexOf('}')));

jQuery.easing = function(t, b, c, d, type) {
/* Easing Equations ported from Robert Penner's Actionscript Equations
 * (c) 2003 Robert Penner, all rights reserved. 
 * This work is subject to the terms in http://www.robertpenner.com/easing_terms_of_use.html.
 * t = current time b = start value c = end value d = duration
 */
	var e;
	if (type.constructor == Function) {
		e = type;
	} else {
		e = jQuery.equations[type];
	}
	// alert(e.constructor);
	if (!e || e.constructor != Function) {
		e = jQuery.equations['easeinout'];
	}
	return e(t,b,c,d);
}
jQuery.equations = {
	easein: function(t, b, c, d) {
		return c*(t/=d)*t + b; // in
	},
	easeinout: function(t, b, c, d) {
		if (t < d/2) return 2*c*t*t/(d*d) + b;
		var ts = t - d/2;
		return -2*c*ts*ts/(d*d) + 2*c*ts/d + c/2 + b;		
	},
	easeout: function(t, b, c, d) {
		return -c*t*t/(d*d) + 2*c*t/d + b;
	}
}



jQuery.extend(jQuery.equations, {
	expoin: function(t, b, c, d) {
		var flip = 1;
		if (c < 0) {
			flip *= -1;
			c *= -1;
		}
		return flip * (Math.exp(Math.log(c)/d * t)) + b;		
	},
	expoout: function(t, b, c, d) {
		var flip = 1;
		if (c < 0) {
			flip *= -1;
			c *= -1;
		}
		return flip * (-Math.exp(-Math.log(c)/d * (t-d)) + c + 1) + b;
	},
	expoinout: function(t, b, c, d) {
		var flip = 1;
		if (c < 0) {
			flip *= -1;
			c *= -1;
		}
		if (t < d/2) return flip * (Math.exp(Math.log(c/2)/(d/2) * t)) + b;
		return flip * (-Math.exp(-2*Math.log(c/2)/d * (t-d)) + c + 1) + b;
	},
	bouncein: function(t, b, c, d) {
		return c - jQuery.easing (d-t, 0, c, d, 'bounceout') + b;
	},
	bounceout: function(t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	bounceinout: function(t, b, c, d) {
		if (t < d/2) return jQuery.easing (t*2, 0, c, d, 'bouncein') * .5 + b;
		return jQuery.easing (t*2-d, 0, c, d, 'bounceout') * .5 + c*.5 + b;
	},
	elasin: function(t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasout: function(t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	elasinout: function(t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	backin: function(t, b, c, d) {
		var s=1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backout: function(t, b, c, d) {
		var s=1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	backinout: function(t, b, c, d) {
		var s=1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	linear: function(t, b, c, d) {
		return c*t/d + b; //linear
	}
});