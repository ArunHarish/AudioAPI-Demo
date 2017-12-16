//Major update:
//Decided to pass in the element in DOM function
//So the DOM prop is going to be a method
//Bug(s)/Necessary updates:

(function(w,s,d) {
	var $ = {
		set:function() {
			return {
			}
		},
		F:function(x,y) {
			return parseFloat(x,y || 10);
		},
		DOM:function(x) {
			return {

			Append:function(q,s) {
				var __ = $.type;
				//Forcing String element(s) to be DOM
				if(__(x).isString) 
					x = $.DOM(x).new();
				//Possible compatibility issue detected below: map method is suitable only for some modern browsers
				else if(__(x).isArray) {
					x = x.map(function(a) {
						return $.DOM(a).new();
						});
				}
				function x_int(h) {
					h.forEach(function(q) {
						x_DOMS(q);
					})
				}
				function x_DOMS(h) {
					var _y = __(q);
					if(_y.isArray) y_Array(h);
					//The error could probably due to the cloning of Elements
					//Have to know when we have to clone and when not
					//Basically when the childNode is a DOM, it is not required to be cloned
					else if(_y.isDOM) h.appendChild(q);	
				}
				function y_Array(k) {
					q.forEach(function(g) {
						var _t = $.type(g);
						if(_t.isDOM) k.appendChild(g.cloneNode(true));
						else if(_t.isString) {
							q = $.DOM(g).new()
							k.appendChild(q)
						};
					});
				}
				ADL(__(x),x_int,x_DOMS,x);
				return q;
			},
			Attr:{
				set:function(y,z) {
					var __ = $.type;
					function x_d(_) {
						var _y = __(y);
						if(_y.isObject) 
							y_o(_,y);
						else if (_y.isArray)
							y_a(_,y);
						else if(_y.isString)
							y_s(_,y);
					}
					function x_a(g) {
						g.forEach(function(_) {
							x_d(_);
						})
					}
					function y_o(a,b) {
						for(var g in b) a.setAttribute(g,b[g]);
					}
					function y_a(a,b) {
						b.forEach(function(m,n) {
							if(z[n]) a.setAttribute(m,z[n]);
						})
					}
					function y_s(a,b) {
						if(__(z).isString)
							a.setAttribute(b,z);
						else 
							throw "Cannot set property:" +b + ", due to error type";
					}
					ADL(__(x),x_a,x_d,x);
					return x;
				}
				//Get here 
			},
			CSS:{
				set:function(y,z) {
					var __ = $.type;
					function x_d(_) {
						var _y = __(y);
						if(_y.isObject) 
							y_o(_,y);
						else if (_y.isArray)
							y_a(_,y);
						else if(_y.isString)
							y_s(_,y);
					}
					function x_a(g) {
						g.forEach(function(_) {
							x_d(_);
						})
					}
					function y_s(a,b) {
						if(__(z).isString)
						a.style.setProperty(b,z);
						else 
							throw "Cannot set property:" +b + ", due to error type";
					}
					function y_o(a,b) {
						for(var g in b) a.style.setProperty(g,b[g]);
					}
					function y_a(a,b) {
						b.forEach(function(m,n) {
							if(z[n]) a.style.setProperty(m,z[n]);
						})
					}
					ADL(__(x),x_a,x_d,x);
					return x;
				},
				get:function(y,z) {
					var __ = $.type,
						_ret;
					function x_d(_) {
						var _y = __(y);
						if(_y.isString) 
							y_s(_,y);
						else if (_y.isArray)
							y_a(_,y);
					}
					function x_a(g) {
						g.forEach(function(_) {
							x_d(_);
						})
					}
					function y_s(a,b) {
						var u = w.getComputedStyle(a).getPropertyValue(b);
						_ret = u;
						return u;
					}
					function y_a(a,b) {
						for(var _d = [], l = 0 ; l < b.length ; l++) _d.push(y_s(a,b[l]));
						_ret = _d;
					}
					ADL(__(x),x_a,x_d,x);
					return _ret;
				}
			},
			new:function(y,z,m) {
			var __ = $.type,
				opt = {
					txtNode:false,
					dupNum:0,
					stcOrd:false
				},
				_x = __(x),
				_y = __(y),
				_z = __(z),
				_m = __(m);
			function synth(x,y) {
				return y ? d.createTextNode(x) : d.createElement(x);
			}
			function imp(z) {
				var o = opt,
					_ = $.type,
					_f = o.txtNode,
					_g = o.dupNum,
					f = _(_f),
					g = _(_g),
					m = o.stcOrd,
					r = [];
				function tNode(h,j) {
					if(f.isArray) {
						if(_f.indexOf(j) > -1)
							return synth(h,true);
						else
							return synth(h,false);
					}
					else if(f.isBoolean && f) {
						return synth(h,_f);
					}	
				};
				switch(z) {
					//Array

					case 0:
					
					function chk() {
						if(g.isArray) return 0;
						else if(g.isObject) return 1;
						else if(g.isNumber) return 2;
					};
					function e(a,b) {
						for(var i = 0; i <= _g[b]; i++) {
							r.push(tNode(a,b))
						}
					}
					switch(chk()) {
						case 0:
						x.forEach(function(a,b) {
							if(_g[b]) e(a,b);
							else r.push(tNode(a,b))
						})
						break;
						case 1:
						x.forEach(function(a,b) {
							if(b in _g) e(a,b);
							else r.push(tNode(a,b))
						})
						break;
						case 2:
						if(m)
							x.forEach(function(a,b) {
								for(var i = 0; i <= _g; i++) r.push(tNode(a,b))
							});
						else {
							for(var i = 0; i <= _g; i++)
								x.forEach(function(a,b) {
									r.push(tNode(a,b))
								});
						}
						break;
					}
					break;
					case 1:
					for(var i = 0; i <= _g; i++) r.push(tNode(x,i));
					break;
				}
				
				return r.length > 1 ? r : r[0];
			}
			function Eval() {
				if(_x.isArray) {
					if(_y.isArray || _y.isBoolean) {
						opt.txtNode = y;
						if(_z.isArray || _z.isNumber || _z.isObject) 
							opt.dupNum = z;
						if(_m.isBoolean) opt.stcOrd = m;
					}
					else if(_y.isNumber || _y.isObject) {
						opt.dupNum = y;
						if(_z.isBoolean) opt.stcOrd = z;
						if(_m.isArray || _m.isNumber || _m.isObject) opt.dupNum = m;
					}
					return imp(0);
				}
				else
					if(_x.isString) {
						if(_y.isBoolean) {
							if(_z.isNumber) opt.dupNum = z;
							opt.txtNode = y;
						}
						else if(_y.isNumber) {
							opt.dupNum = y;
						}
						return imp(1);
					}
			}
			return Eval();
			}
		}
		},
		type:function(i) {
			var _ = {
				isObject:false,
				isArray:false,
				isString:false,
				isBoolean:false,
				isNumber:false,
				isDOM:false,
				isNList:false,
				isFunc:false,
				isUndefined:false,
				isList:false
			};
			if(i != void 0) {
				if(i.nodeType)
					_.isDOM = true;
				else {
					var p = [String,Number,Array,Boolean,Function,NodeList,Object],
						s = ["isString","isNumber","isArray","isBoolean","isFunc","isNList","isObject"];
					for(var t = 0; t < p.length; t++) {
						if(i instanceof p[t] || i.constructor == p[t]) {
							_[s[t]] = true;
							break;
						}
					}
				}
			}
			else _.isUndefined = true;
			return _;
		},
		NLTA:function(n) {
			return Array.prototype.slice.call(n);
		},
		listener:function(x,y,z,q) {
			var __ = $.type,
			 	_1 = __(x),
			 	q  = q ? q : (__(z).isBoolean ? z : false);
			function doer(b,c,d,$w) {
				switch($w) {
					case 0:
					var t;
					c.forEach(function(e,i) {
						var __t = __(e);
						if(__t.isArray) {
							e.forEach(function(f) {
								b.addEventListener(f,d[i] || d, q);
							})
						}
						else{
							if(i in d) t = i;
							b.addEventListener(e,d[t] || d, q)
						}	
					})
					break;
					case 1:
						for(var x in c) b.addEventListener(x,c[x],q);
					break;
					case 2:
						b.addEventListener(c,d, q);
					break;
				}
			}
			function _e(x) {
				var _2 = __(y),
					_3 = __(z);
				if(_2.isArray && (_3.isArray || _3.isFunc))
					doer(x,y,z,0);
				else if(_2.isObject) {
					doer(x,y,z,1);
				}	
				else if(_2.isString){
					doer(x,y,z,2);
				}		
			};
			function init(A) {

				A.forEach(function(e) {
					_e(e);
				})
			}
			ADL(_1,init,_e,x);
		}
	};
	function ADL(M,a,b,n) {
		if(M.isArray) a(n);
		else if(M.isDOM) b(n);
		else if(M.isNList) $.NLTA(n);
		else {
			try {
				b(n);
			}
			catch(e) {
				throw e;
			}
		}
	};
w.$ = $;
})(window,screen,document)