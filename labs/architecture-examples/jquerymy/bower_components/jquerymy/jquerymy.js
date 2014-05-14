/*
 * jQuery.my 0.9.8
 * Requires jQuery 1.11.0+, SugarJS 1.4.0+
 * 
 * Changes:
 * 
 * — $obj.my("remove") now accurately unbinds rih plugins and nested forms
 * — modal calculates image width/heights in more accurate way
 * – validator of native form errors works fine in IE8
 * – 
 * 
 * More details at jquerymy.com
 * 
 * @ermouth, thanks @carpogoryanin, @ftescht
 * 2014-05-10
 */

;(function($) {var _version = "jQuery.my 0.9.8";
	
	// Some shortcuts and constants
	var lang = "en", 
		forms = {_src:{}, _name:"Global manifest cache"}, 
		$E = $.extend,  N = null, TMP,
		n = function (o) {return o!==null && o!==undefined;}, 
		d8="{yyyy}-{MM}-{dd}", h24="{HH}:{mm}",
		Ob="object", Da="data", Ar = "array", 
		St = "string", Fu="function", Ch = "change",
		
		isA = Object.isArray, 
		isB = Object.isBoolean, 
		isS = Object.isString, 
		isO = Object.isObject,
		isN = Object.isNumber, 
		isR = Object.isRegExp, 
		isF = Object.isFunction, 
		isP = function (a) {/*is promise*/return !!(null!=a&&(isO(a)||a.jquery)&&isF(a.then)&&isF(a.fail)&&isF(a.state));},
		isRej = function (p) {/*is promise rejected*/ return isP(p)?(p.state()==="rejected"):null;};
	
		
	//=======================================
	// Manifest repo getter/setter and helpers
	
	var _cache = function _localCache (A1, A2) {
		// ( no args ) – returns all forms obj container
		// ({manifest},  {container}) – caches form in container, id must be defined, return form or null
		// ({manifest}) – caches form in local container, id must be defined
		// ("form.Id", "exist") – true/false
		// ("form.Id", {container}) – get from container
		// ("form.Id") – get from local cache
		var ref, obj;
		if (isS(A1)) {
			ref=A1, obj = _getref(isO(A2)?A2:forms, ref);	
			if ("exist"===A2) return isO(obj);
			return !obj?null:Object.clone(obj,true);	
		} else if (isO(A1)){
			obj = _putmanifest (A1, A2);
			if (!isO(obj)) return f.con(obj), null;
			return obj;
		} else if (undefined===A1) {
			return forms._src;
		} else if (null===A1) {
			return Object.reject(forms,/^_/);
		}else return null;
	};
	
	// - - - - - - - - - - - - - - - - - - - -
	
	function _getref(obj,ref) {
		//gets branch of obj by string ref like "data.list.items.1"
		return (ref||"").split(".").reduce(function(a,b){
			if (null!=a && null!=a[b]) return a[b];
			else return undefined;
		}, obj);
	};
	
	// - - - - - - - - - - - - - - - - - - - -
	
	function _manifest (manifest, ref) {
		// Dereferences pointer to form component, 
		// manifest is caller manifest obj,
		// internal function
		var t, ext;
		if (isO(ref)) return ref;
		else if (isS(ref)) {
			
			//try to find it on manifest
			t = _getref(manifest, ref);
			
			//then in local repo as original
			if (null==t) t = Object.clone(forms._src[ref],true);
			
			//then in local repo as part of component
			if (null==t) {
				t = _getref(forms, ref);
				if (isO(t) && isO(t._self)) t=Object.clone(t._self,true);
				else if (isO(t)) t = Object.clone(t,true);
			}
			
			//then in ext repo as part of component
			if (null==t && _getref(manifest,"params.cache")) {
				ext = _getref(manifest,"params.cache");
				if (isF(ext)) t = ext(ref);
				else if (isO(ext)) t = _cache(ref, ext);
				
				if (isO(t)){
					if (isO(t._self)) t=Object.clone(t._self,true);
					Object.merge(t, {params:{cache:ext}}, true);
				}
			}
			
			if (null!=t && isO(t)) {
				ext = ext||_getref(manifest,"params.cache");
				if (ext) Object.merge(t, {params:{cache:ext}}, true);
				return t;
			}
			else throw "Component "+ref+" not found";
			
		} else if (isF(ref)) {
			return ref.apply(manifest, Array.prototype.slice.call(arguments, 2));
		} else return null;
	}
	
	// - - - - - - - - - - - - - - - - - - - -
	
	function _putmanifest (obj0, root0) {
		// Mounts obj to root in a branch, defined in
		// obj.id property. If id =="x.y.z", root will be
		// deep extended with {x:{y:{z:obj}}}.
		// obj also is unjsonned and extended with _self ref,
		// which point to original version of obj.
		
		//Returns direct link to entire branch obj or string error.
		
		var root=root0||forms, obj=obj0, path, id, prev, res, i;
		
		if (!(isO(root) && isO(obj) && isO(obj.ui) && isO(obj.data) && isS(obj.id))) 
			return "Invalid arguments.";
		
		if (!root.hasOwnProperty("_src")) root._src={};

		id = obj.id;
		
		
		path = id.split(".").compact(true);
		
		// All path parts exept first must be latin caps
		if (
			null!=path.slice(2).find(function(e){return /^[^A-Z0-9]/.test(e);})
			|| (/^[^A-Z]/.test(path[1]))
		) return "All path parts exept 1st must start with caps/nums.";
		
		try {obj=Object.clone(obj0, true);} 
		catch (e) {return "Can't mount circular-referencing obj.";}
		
		//unwind string defs of functions
		try {if (!obj.params || (obj.params && !obj.params.strict)) _unjson(obj);} 
		catch (e) {return "Invalid manifest, parse error.";}
		
		//mark manifest as unjsonned
		Object.merge(obj,{params:{strict:true}}, true);
		// save it
		root._src[id] = obj;
		
		
		if (prev=f.mask(root, id)) {
			if (prev.params && prev.params.protect) return "Can't mount on protected";
			if (prev._self) delete prev._self; 
		} //else {
			//no prev node, mount
			Object.merge(root,f.unmask(obj, id),true);
		//}
		res = _getref(root,id);
		
		Object.defineProperty(res, "_self", {
			get: function(){ return root._src[id]; },
			set: function(){ throw "Can not change repo";},
			enumerable : false,
			configurable : true
		});
		
		return res;
	}
	
	
	//########################################################	
	// Storage of rules defined by cascading selectors
	// very similar to css. Leafs are processor  
	// or processing rules for this type of node
	
	var MY = {
			
	
	//getter and setter functions for different types of nodes
			
		vals : {
		
	/**/	".my-form": function ($o, v) {
			//object is jQuery.my instance
				if ($o && $o.my ) {var d = $o.my(Da); return Object.equal(d,v)?d:$o.my(Da, v, true);}
				else return v||N;
			},
				
	/**/	".hasDatepicker":function ($o,v) {
			//object has jQ UI datepicker		
				if(n(v)) $o.datepicker("setDate", ((v=="")?v:Date.create(v)));
				var date = $o.datepicker("getDate");
				return (date?date.format(d8):"");
			},
			
	/**/	".my-tags": function ($o,v) {
				//object is jQ tags control
				if (n(v)) {
					var v0 = v;
					if (isS(v) || isN(v)) $o.tags(Da,[v+""]);
					else if (isA(v)) $o.tags(Da,v);
				}
				return $o.tags(Da);
			},
			
	/**/	".ui-draggable": function ($o,v) {
			//object is jQ UI draggable
				if (n(v) && isO(v)) {
					var c = {};
					if (!isNaN(v.left)) c.left = Number(v.left).ceil(2)+"px";
					if (!isNaN(v.top)) c.top = Number(v.top).ceil(2)+"px";
					if (c.left || c.top) $o.css(c);
				}
				var p = $o.position();
				return {
					left:((v&&!isNaN(v.left))?(v.left*1).ceil(2):p.left.ceil(2)), 
					top:((v&&!isNaN(v.top))?(v.top*1).ceil(2):p.top.ceil(2))
				};
			},
	/**/	".my-form-list": function ($o,list) {
			//object is list of forms	
				var i,old,mod,eq,
					sP = "ui-sortable", sPlaceholder= ">."+sP+"-placeholder",
					od = $o.data("formlist")||{},
					gen = od.generator||{},
					itemSel = gen.selector||">*", 
					tmpl = gen.template||"<div></div>",
					delay = gen.delay||50,
					sortable = $o.is("."+sP), 
					result=[];
				var $c = sortable?$o.find($o.sortable("option","items")):$o.find(itemSel);
				
				if (n(list) && isA(list)) {
	
					//return list passed if dragging taking place
					if (sortable && $o.find(sPlaceholder).size()!=0) {
						return list;
					}
					
					//first we must define if putting new data over old will
					// change anything
					old= []; $c.each(function(){
						var $x = $(this);
						if ($x.data("my")) old.push($x.my("data"));
					});
					
					//fast compare
					eq=false; 
					if (old.length==list.length) for (eq=true, i=0;i<old.length;i++) if (old[i]!==list[i]) eq=false;
					
					if (!eq){
						// more comprehemsive compare, for example
						// applying [{a:1},{b:4}] over [{a:1,b:2},{a:3,b:4}]
						// must not force any recalc
						mod = $.extend(true, [], old, list);
						if (!Object.equal(old,mod) || mod.length!=list.length) {
							//we have new data, hash it
							var hash=[], xhash={}, present={};
							for (var i=0;i<list.length;i++) {
								hash[i]=f.sdbmCode(list[i]);
								xhash[hash[i]]=i;
							}
							
							//clean childs with no match to new data
							$c.filter("*:not(.ui-sortable-placeholder)").each(function(idx,elt){
								var $x = $(this), 
									md = $x.data("formlist")||{},
									hash = md.sdbmCode;
								if (hash && xhash.hasOwnProperty(hash)) present[hash]=$(this);
								else $x.remove();
							});
							
							//iterate list
							for (var i=0;i<list.length;i++) {
								if (present[hash[i]]) {
									var $n = present[hash[i]].detach().appendTo($o);
									result.push($n.my("data"));
								} else {
									var $n = $(/\{/.test(tmpl)?tmpl.assign(list[i]):tmpl).appendTo($o);
									$n.data("formlist",{index:i});
									$n.on("change.my", (function (){
										if ($(this).data("my")) {
											$(this).data("formlist").sdbmCode = f.sdbmCode($(this).my("data"));
										}
										$o.trigger("check.my");
									}).debounce(delay/1.3));
									$n.data("formlist").list = list[i];
									
									//ToDo – allow it to be async
									$n.my(
										_manifest (gen.parent, gen.manifest, list[i], i, list, $o),
										list[i]
									);
									result.push($n.my("data"));
								}
							}
							(function(){$o.trigger(Ch);}).delay();
							return result;
						}
					}
					return old;
				} else if ($c.size()) {
					$c.filter("*:not(.ui-sortable-placeholder)").each(function(idx){
						var $x = $(this);
						if ($x.is(".my-form") && $x.data("my")) {
							result.push($x.my("data"));
							if (idx!=$x.data("formlist").index) {
								$x.data("formlist").index=idx;
								$x.my("redraw");
							}
						}
					});
					return result;
				}
				return list||[];
			},
			
	/**/	".ui-sortable": function ($o, list) {
				//jQ UI sortable
				var a = [], sP = "ui-sortable", sPlaceholder= ">."+sP+"-placeholder", $c = $o.find($o.sortable("option","items"));
				if (n(list) && isA(list)) {
					var w = {}, z={}, v = list.unique(); 				
					//return list passed if some field has focus of dragging taking place
					if ($o.find("input:focus:eq(0),textarea:focus:eq(0)").size()!=0 
							|| $o.find(sPlaceholder).size()!=0) return v;	
					$c.each(function () {w[f.sdbmCode(f.extval($(this)))] = $(this);});
					for (var i=v.length-1; i>=0; i--) {
						var j = f.sdbmCode(v[i]);
						if (w[j]) {
							w[j].prependTo($o).show();z[j]=true;
							if (a.indexOf(v[i])==-1) a.push(v[i]);
						}
					};
					a=a.reverse();
					for (i in w) if (!z[i]) w[i].hide();
				} else {
					var $p = $o.find(sPlaceholder), $q = $o.eq(0);
					if ($p.size()!=0) {
			
						//if placeholder state changed saving new data
						if ($q.my()[sP] != $p.position().left+""+$p.position().top) {
							var $c = $c.filter(":visible:not(:disabled, .ui-state-disabled, .ui-sortable-helper)");
							var $m = $o.find($o.sortable("option","items")).filter(".ui-sortable-helper");
							$c.each(function () {
								var $x = $(this);
								if ($x.is(".ui-sortable-placeholder")) {a.push(f.extval($m));}
								else a.push(f.extval($x));
							});
							//caching placeholder state and data retrieved
							$q.my()[sP] = $p.position().left+""+$p.position().top;
							$q.my()[sP+"1"] = a;
						} else a = $q.my()[sP+"1"];
						if (a==N) $c.each(function () {a.push(f.extval($(this)));});				
					} else {
						var $c = $o.find($o.sortable("option","items")).filter(":visible:not(:disabled, .ui-state-disabled)");
						$c.each(function () {a.push(f.extval($(this)));});
					}
				};
				return a;
			},
			
	/**/	"input[type=date]":function ($o,v) {
				//object is date input
				if(n(v)) {
					if (v!="") d = Date.create(v).format(d8); else d = "";
					if (isS(d) && !d.has("Invalid")) $o.val(d);
					return d;
				}
				var d = $o.val();
				return (d!=""?Date.create(d).format(d8):"");
			},
			
	/**/	"input[type=time]":function ($o,v) {
				//object is time input
				if(n(v)) {
					if (v!="") d = Date.create(v).format(h24); else d = "";
					if (isS(d) && !d.has("Invalid")) $o.val(d);
					return d;
				}
				var d = $o.val();
				return (d!=""?Date.create(d).format(h24):"");
			},
			
	/**/	"input":{
				"[type='text'],[type='number'],[type='search'],[type='hidden'],[type='password'],[type='button'],[type='range'],:not([type])":{
				//nearly all main input types and button
				
					".ui-slider-input": function ($o,v) {
					//input with jQ UI slider() applied
						if (n(v)) $o.val(v).slider("refresh");
					},
					
					".tagstrip input.value": function ($o,v) {
					//input of tagstrip() applied
						if (n(v)) $o.val(v).trigger("update");
					},
					
					"div.select2-container+input": function ($o, v) {
					//select2
						if (n(v) && !(JSON.stringify(v)===JSON.stringify($o.select2("val")))) $o.select2("val", (isA(v)?v:[v]));
						return $o.select2("val");
					},
					
					"": function ($o,v) {if(n(v)) $o.val(v);}
				},
				
				":radio":function ($o,v) {
				//radio buttons
					var pos = -1;
					if (n(v)) {	
						$o.each(function(ind) {
							var val = $(this).val();
							if ((v+"")===(val+"")) pos=ind;
						});
						var jqcheck = $o.eq(0).checkboxradio;
						if (jqcheck) $o.each(function(ind){
								var $x = $(this);
								if (pos!=ind && $x.is(":checked")) 
									$x.prop("checked",false).checkboxradio("refresh");
							});						
						if (pos>-1) {
							var $x = $o.eq(pos);
							if (!$x.is(":checked")) {
								$x.prop("checked",true);
								if (jqcheck) $x.checkboxradio("refresh");
							}
						} else if (!jqcheck) $o.each(function(){ $(this).prop("checked",false); });
					} 
					if (pos==-1) for (var ind=0; ind<$o.size(); ind++) {
						if ($o.eq(ind).is(":checked")) pos=ind;
					};
					return pos!=-1?$o.eq(pos).val():"";
				},
				
				":checkbox": function ($o, v0) {
				//checkbox
					var pos = -1, v = v0, a = [], k = {};
					if (n(v)) {	
						if ($.type(v) != Ar) v = [v0];
						var jqcheck = !!$o.eq(0).checkboxradio;
						$o.each(function(ind) {
							var $x = $(this), val = $x.val(), on = $x.is(":checked");
							if (v.indexOf(val)!=-1) {
								a.push(val);
								if (!on) $x.prop("checked", true);
							} else if (on) $x.prop("checked", false);
							if (jqcheck) $x.checkboxradio("refresh");
						});
					} else {
						$o.each(function(ind) {
							var $x = $(this);
							if ($x.is(":checked")) a.push($x.val());
						});
					}
					return a;
				}
			},
			
	/**/	"select": {
				".ui-slider-switch": function ($o,v) {
				//on-off in jQ Mobile
					if (n(v)) {
						$o.val(String(v||""));
						$o.slider("refresh"); 
					}
				},
				"div.select2-container+select":{
					"[multiple]": function ($o, v) {
						if (n(v)) $o.select2("val", (isA(v)?v:[v]));
						return $o.select2("val");
					},
					"":function ($o, v) {
						if (n(v)) $o.select2("val", v+"");
						return $o.select2("val");
					}
				},
				"[multiple]": function ($o,v) {
					if (n(v)) {
						$o.val(v,[]);	
						if ($o.selectmenu) $o.selectmenu("refresh",true);
						//the only way to check if we have jQ UI selectmenu() attached
					}	
				},
				"": function ($o,v) {
					if (n(v)) {
						$o.val(String(v||""));	
						if ($o.selectmenu) {
						//now ditinguish between jQ selectmenu plugin and jQ Mobile
							if ($o.selectmenu("option").theme!=N) $o.selectmenu("refresh",true);
							else $o.find("option").each(function(i){
								var $x = $(this);
								if (f.extval($x) == v) $o.selectmenu("value",i);
							});						
			}}}},
			
	/**/	"textarea": {
				".my-cleditor":function ($o,v) {
					if(n(v)) $o.val(v).cleditor()[0].updateFrame();
					return $o.val();
				},
				"div.redactor_box textarea,.redactor": function($o,v) {
                    var r9 = $o.hasClass('my-redactor-9');
                    if(n(v)) {
                        if(r9) $o.redactor('set', v);
                        else $o.setCode(v);
                        return v;
                    }
                    return r9 ? $o.redactor('get') : $o.getCode();
				},
				".my-codemirror":function($o,v){
					if (n(v)) {
						$o[0].nextSibling.CodeMirror.setValue(v);
						return v;
					}
					return $o[0].nextSibling.CodeMirror.getValue();
				},
				"":function ($o,v) {if(n(v)) $o.val(v);}
			},
			
	/**/	"div,span,a,p,form,fieldset,li,td,th,h1,h2,h3,h4,h5,h6":{
				".ui-slider":function ($o, v){
					if(n(v)) $o.slider("option",$o.slider("option","values")?"values":"value", f.clone(v));
					return f.clone($o.slider("option","values")||$o.slider("option","value")||0);
				},
				".ui-buttonset": function ($o,v) {
				//jQ UI buttonset ()	
					if (!n(v)) {
						var jor = $o.find(":radio:checked");
						if (jor.size() && jor.button) return jor.val()||jor.button("option", "label") ;
					} else if (v!="") {
						var jon = N; 
						$o.find(":radio").each(function () {
							jon=( ($(this).val()||$(this).button("option", "label"))==v?$(this):jon );
						});
						if (jon) {
							jon.attr("checked",true); 
							$o.buttonset("refresh"); 
							return v;
						}
					}
					$o.find(":radio:checked").attr("checked",false);
					$o.buttonset("refresh"); 
					return "";
				},
				".ace_editor":function($o,v) {
					if(n(v)) ace.edit($o[0]).setValue(v);
					return ace.edit($o[0]).getValue(v);
				},
				"": function ($o,v) {
					if(n(v)) $o.html(v);
					return $o.html();
				}
			},
	/**/	"pre,code":function ($o,v) {
				if(n(v)) $o.html(v);
				return $o.html();		
			},
	/**/	"img":function ($o,v) {
				if (n(v)) $o.attr("src",v);
				return $o.attr("src")||"";
			},
	/**/	"":function ($o,v) {
				if (n(v)) $o.html(v);
				return $o.html()||$o.text()||String($o.val())||"";
			}
		},
	
		
	//messages
	//########################################################
		
		msg:{
			"":{en:"Invalid input", ru:(TMP="Неверное значение")},
			
			formError:{en:"Form error",ru:"Ошибка формы"},
			initFailed:{
				en:'<p class="my-error">Form init failed</p>', 
				ru:'<p class="my-error">Ошибка инициализации формы</p>'
			},
			
			badInput:{en:"Invalid input", ru:TMP},
			patternMismatch:{en:"Pattern mismatch", ru:"Не соответствует шаблону"},
			rangeOverflow:{en:"Over maximum", ru:"Больше максимума"},
			rangeUnderflow:{en:"Under minimum", ru:"Меньше минимума"},
			stepMismatch:{en:"Step mismatch", ru:"Не кратно шагу"},
			tooLong:{en:"Too long", ru:"Слишком длинно"},
			typeMismatch:{en:"Invalid type", ru:"Неверный тип"},
			valueMissing:{en:"Required", ru:"Обязательное поле"}
		},
		
		
	//different controls' events to watch for 
	//########################################################
		
		events: {
			".hasDatepicker":"change.my check.my",
			".my-form,.my-tags":"change.my check.my",
			".ui-slider":"slide.my check.my",
			"div.redactor_box textarea":"redactor.my check.my",
			".my-codemirror":"codemirror.my check.my",
			".ace_editor":"ace.my check.my",
			".my-form-list,.ui-sortable":"sortchange.my sortupdate.my check.my",
			".ui-draggable":"drag.my dragstop.my check.my",
			"a, .pseudolink, input[type=button], button": "click.my ",
			"img, :radio, :checkbox": "click.my check.my ",
			"div.select2-container+input,div.select2-container+select":"change.my check.my input.my",
			".ui-buttonset,input, select, textarea":"blur.my change.my check.my"+(navigator.appName.to(5)==="Micro"?" keyup.my":" input.my"),
			"":"check.my"
		},
		
	//functions retrieving container for different controls
	//########################################################
		
		containers: {
			"*[data-role='fieldcontain'] *":{ //jQuery Mobile
				"input,textarea,select,button,:radio": function ($o) {
					return $o.parents('[data-role="fieldcontain"]').eq(0);
				}
			},
			".tagstrip *.value": function ($o){ //$.tagstrip()
				return $o.parents('.tagstrip').eq(0);
			},
			"div.redactor_box textarea":function ($o){
				return $o.parents('div.redactor_box').eq(0).parent();
			},
			".my-tags,.hasDatepicker,.ui-widget,input,textarea,select,button" :{ 
				".my-cleditor": function ($o) {
					return $o.parents('div.cleditorMain').eq(0).parent();
				},
				"": function ($o) { 
					return $o.parents('div,span,a,p,form,fieldset,li,ul,td,th,h1,h2,h3,h4,h5,h6').eq(0);
				}
			},
			"": function ($o) {return $o;}
			
		},
	
	//disablers and enablers
	//########################################################
		
		offon: { //if x==true disables control else enables	
			".ace_editor": function (x,$o) {ace.edit($o[0]).setReadOnly(x);},
			".ui-selectable": function(x,$o) {f.jquix($o,"selectable",x);},
			".ui-slider": function(x,$o) {f.jquix($o,"slider",x);},
			".ui-draggable": function(x,$o) {f.jquix($o,"draggable",x);},
			".ui-buttonset": function(x,$o) {f.jquix($o,"buttonset",x);},
			".hasDatepicker": function(x,$o) {f.jquix($o,"datepicker",x);},
			".my-form":function(x,$o){$o.my("disabled", !!x);},
			"div.select2-container+input,div.select2-container+select": function(x,$o) {f.jquix($o,"select2",x);},
			".my-cleditor": function (x,$o) { $o.cleditor()[0].disable(!!x);},
			"": function (x, $o) {$o.attr("disabled", !!x);}
		},
		
	//destructors
	//########################################################
		destroy:{
			".hasDatepicker":function($o){$o.datepicker("destroy");},
			".ui-slider":function($o){$o.slider("destroy");},
			".ui-sortable":{
				".my-form-list":function ($o){
					$o.find(">.my-form").each(function(){
						$(this).my("remove");
					});
					$o.sortable("destroy");
				},
				"":function($o){$o.sortable("destroy");}
			},
			".my-form-list":function ($o){
				$o.find(">.my-form").each(function(){
					$(this).my("remove");
				});
				
			},
			".ui-draggable":function($o){$o.draggable("destroy");},
			".my-redactor-8":function($o){$o.destroyEditor();},
			"div.select2-container+input,div.select2-container+select":function($o){$o.select2('destroy');},
			".my-form": function($o) {$o.my("remove")}
		}
	};
	
	//default values for .params section of manifest
	//########################################################
	
	MY.params = {
		container:function ($o) {return _traverse($o, MY.containers)($o);},	// container getter
		change:N,
		recalcDepth:2,												// depth of dependencies resolver tree
		delay:0,													// default delay of bind invocation
		strict:false,												// if true form assumed unjsonned
		locale:(TMP=(navigator.language||navigator.userLanguage||"en").substr(0,2)),
		messages:Object.map(MY.msg, function (k,v){return v[TMP]||v.en;}),
		errorTip:".my-error-tip",									// $ selector of err tip container
		errorCss:"my-error",										// class applied on container on err
		pendingCss:"my-form-pending",
		animate:0,													//err tips animation duration
		effect: function ($e, onoff, duration) { 					//err tips animation effect
			if (onoff) return $e.fadeIn(duration); $e.fadeOut(duration);
		},
		remember:0, 												// undo steps to remember
		silent:false,
		history:Object.extended(), 									//form undo history
		historyDelay:100 											//delay in ms between subsequent calls of history()
	};
	
	var f = _getHelpersLib();
	
	//########## SYSTEM FUNCTIONS ##########
		
	function _field ($o, v) {
	//gets or sets the value of $o control
	//selects appropriate function for setting-retrieving
	//and attaches it to $o.data("myval");
		var fn = $o.data("myval");
		if (!fn) {
		//finding appropriate function and caching it
			var fval = _traverse ($o, MY.vals);
			if (isF(fval)) {
				var r = fval($o, N);
				if (r===undefined) {
				//if function returns undefined we use .val() by default
					$o.data("myval", (function ($o, v) {
						if (v!=N) fval($o, v);
						return $o.val();
					}).fill($o, undefined)); 
				} else $o.data("myval", fval.fill($o,undefined)); 
			}
			fn = $o.data("myval");
		}		
		if (isF(fn)) {
			var r = fn();
			if (r!=v || isO(v)) r = fn(v);
			return r;
		} else return N;		
	};
	
	
	
	
	//=======================================
	
	function _traverse ($o, rules) {
	//traverses tree of rules to find  
	//first sprig with selector matching $o.
	//returns match or null
		var fval = N, flevel=0, fselector="";
		go ($o,rules,1);
		return fval;
		
		// - - - - - - - - - - - - - - - - - - - - - - - 
		
		function go ($o, os, level) {
			for (var i in os) if (i!="" && $o.is(i)) {
				fselector = fselector+ (fselector?" ### ":"") + i;
				var oi=os[i],otype = $.type(oi);
				if ( !(/^(nul|un|ob)/).test(otype) && level>flevel) {
					fval=oi; flevel = level; return;
				} else if (otype==Ob) go ($o, oi, level+1); //recursion down
			};
			if (os[""]!=N && typeof os[""]!=Ob && level>flevel)  {
				fval=os[""]; flevel = level; 
			}
		}
	};
	
	
	//=======================================
	
	function _bind (data, val, uiNode, $formNode) { 
	//sets or retrieves data using bind function		
		var bind = uiNode.bind, i, path=[], ptr, preptr, bt = $.type(bind);
		if (bt == Fu) {
			return bind.call(_form($formNode).manifest, data, val, $formNode);
		} 
		if (bt == St || bt == Ar) {
			if (bt == St && !/\./.test(bind)) {
				//index is flat
				if (val!=N) data[bind] = val;
				else if (data[bind]===undefined) data[bind] = N;
				return data[bind];
			}
			//index is composite, we need to traverse tree
			//and create some branches if needed
			if (bt == St) path = bind.split(".").each(function(a,i){this[i]=String(a).compact();});
			if (bt == Ar) path = bind.slice(0).each(function(a,i){this[i]=String(a).compact();});
			ptr = data;
			for (i=0;i<path.length;i++) {
				if (i==path.length-1) {
					//we'r in the hole
					if (val!=N) ptr[path[i]] = val;
					else if (ptr[path[i]]===undefined) ptr[path[i]] = N;
					return ptr[path[i]];
				}			
				if (i==0) { 
					ptr = data[path[0]]; preptr= data;
				} else {
					preptr = preptr[path[i-1]];
					ptr = ptr[path[i]];
				}
				if (ptr===undefined) ptr = preptr[path[i]] = {};
			}
		}
		return N;
	};
	
	
	//=======================================
	
	function _validate (data,val, uiNode, $formNode) {
		//checks if val fails to meet uiNode.check condition
		var pat = uiNode.check;
		if (pat != N) {
			var msg = _form($formNode).params.messages,
				err = uiNode["error"],
				err0 = err||msg.patternMismatch||msg[""]||"Error";

			if($formNode.size() 
					&& Object.prototype.hasOwnProperty.call($formNode[0],"validity") 
					&& !$formNode[0].validity.valid
			) {
				var syserr=$formNode[0].validationMessage+"";
				if (syserr!=="") return syserr.substr(0,1).toUpperCase()+syserr.substr(1);
				else {
					var v = $formNode[0].validity,
						i;
					for (i in v) if (syserr==="" && i!="valid" && isB(v[i]) && v[i]) {
						if (msg[i]) syserr=msg[i];
					}
					return syserr||err;
				}
			}

			switch($.type(pat).to(1)){
				case "f":	return pat.call(_form($formNode).manifest, data, val, $formNode);
				case "r":	return ( (pat.test(String(val))) ? "":err0 );
				case "a":	return ( (pat.indexOf(val)>-1)?"":err0);
				case "s":	return (val==pat?"":err0);
				case "o":	return pat[val]?"":err0;
				case "b":	{
					if ($formNode.is(".my-form-list,.ui-sortable")) {
						var sel = $formNode.data("listSrc")||$formNode.data("my").listSrc||">*", ret={};
						$formNode
							.find(sel)
							.filter("*:not(.ui-sortable-placeholder)")
							.each(function(idx){
								var $e = $(this);
								if ($e.data("my") && !$e.my("valid")) ret[idx]=$e.my("errors");
							});
						return ret;
					} else if ($formNode.hasClass("my-form")){
						return !pat?"":$formNode.my("valid")?"":$formNode.my("errors");
					}
					return "";
				}
			}
			return msg.formError||"Error";
		}
		return "";
	};
	
	
	//=======================================
	
	function _form ($formNode) {
	//get control's root.my()
		var $my = $formNode.my();
		if (!$my) return null;
		return $my.root?$my.root.my():$my;
	};
	
	
	//=======================================
	
	function _css (onOff, $we, css0) {
	//applies-discards conditional formatting or enables-disables field
		var css = css0.compact(), r = css.replace(/:disabled/g,'');
		
		$we.each(function () {
			var $d = $(this),d = $d.my(), $o = (d?d.container:$d);
			if (onOff) {
				if (!$o.is(r)) $o.addClass(r);
			} else $o.removeClass(r);
			
			if (r!=css && d!==undefined && !!onOff!=!!d.disabled) { 
				//we have :disabled
				$d.my().disabled = !!onOff;
				if (!d._disable) $d.my()._disable = _traverse($we, MY.offon).fill(undefined, $we);
				d._disable(!!onOff);
			}
		});
		return $we;
	};
	
	
	//=======================================
	
	function _update ($o, value, depth) {
	//validates and updates field and all dependent fields, 
	//applies conditional formatting
		var $this = $o, xdata = $this.my(), err="Unknown error";
		
		if (xdata) {
			var selector = xdata.selector, $root = xdata.root, $we = $root.find(selector), ui = $root.my().ui, 
				isForm = $o.hasClass("my-form"), isList = $o.hasClass("my-form-list");
			if (isForm) var $box = $o, d = xdata.ddata, oui = xdata.dui, p =  xdata.dparams;
			else $box = xdata.container, d = xdata.data, oui = xdata.ui, p =  xdata.params;	
			//exec bind if any
			if (oui.bind!=N) {
				if (n(value)) var val = value;
				else val = _field($we,_bind(d,N,oui,$we));
				
				//validating and storing if correct
				//applying or removing error styles
				try {var err = _validate(d,val,oui, $we);} 
				catch (e) {f.con ("Error "+ e.name+" validating "+selector, $root );}
				var ec = p.errorCss;
				var jqec = "ui-state-error";
				
				try { if (value!=N) val = _field($we,_bind(d,value,oui,$we));} 
				catch (e) { err=p.messages.formError||"Error"; }
				
				if (err=="") {
					if (!isForm) xdata.errors[selector]= "";
					else xdata.derrors[selector]= "";
					$box.removeClass(ec);
					if ($box.attr("title")) $box.attr("title","");
					if (!isForm && !isList) p.effect($box.find(p.errorTip), false ,(p.animate/2));
					$this.removeClass(jqec); $this.find(".ui-widget").removeClass(jqec);
				} else {			
					if (isForm) {
						xdata.derrors[selector]= err;
					} else if (isList) {
						xdata.errors[selector]= err;
					} else {
						$box.addClass(ec);
						xdata.errors[selector]= err;
						var $tip=$box.find(p.errorTip).eq(0);
						if ($tip.size()){
							p.effect($tip.addClass(ec).html(err), true, p.animate);
						} else $box.attr("title",(err || "").stripTags());
					}
					
					if ($this.is(".hasDatepicker")) {
						if ($this.is("input")) $this.addClass(jqec);
						else $this.find(".ui-widget").addClass(jqec);
					}
					if ($this.is(".ui-slider")) $this.addClass(jqec);
				}
			}
			//applying conditional formatting if any
			var cssval = (value==N?val:value);
			if (oui.css) {
				for (var css in oui.css) {
					var oc = oui.css[css];
					if (isR(oc)) _css (oc.test(cssval), $we, css); 
					else if (isF(oc)) _css (oc.call($root.my().manifest, d,cssval,$we), $we, css); 
				}
			}
			
			//recalculating dependent fields
			var i, list = oui.recalc, dest = [], once = {}, item;
			
			if (depth && oui.recalc &&  $root.my()) {
				for (var ui = $root.my().ui, i=0;i<list.length;i++) {
					if (list[i] && isS(list[i]) && (item = list[i].compact()) && ui[item]) {
						if (ui[item].recalc) {
							if (dest.indexOf(item)==-1) dest.push(item);
						} else once[item]=true;
					}
				};
				for (i=0; i<dest.length; i++) once = $E(true, once, _update($root.find(dest[i]),N,depth-1));

				if (value!==N) { 
					// here is a trick -- we may call _update ($o, undefined, 1)
					// and force update if we want only retrieve without recalc
					for (i in once) if (once[i]===true && i!=selector) {
						if (ui[i].delay && !ui[i].recalc) ui[i]._update($root.find(i),N,depth-1);
						else _update($root.find(i),N,depth-1);
					}
					return {};
				}
			}
			return once||{};
		}
	};
	
	
	//=======================================
	
	function _history (x, params, remove, silent) {
	// push or retrieves current state to history,

		var p = params, h, l;
		if (
			$.type(p)!=Ob || 
			isNaN(l=p.remember) || 
			$.type(h=p.history)!=Ob
		) return N;
		
		if (isO(x) && l) {
			var step = Object.extended(JSON.parse(JSON.stringify(x))),
				time = (new Date).valueOf(),
				k = h.keys().sort();
			if (k.length && (time-k[k.length-1]< p.historyDelay || h[k[k.length-1]].equals(step))) return N;
			p.history[time] = step; k.push(time);
			if (k.length >= l*2) {
				var newh = Object.extended();
				for (var i=l; i<l*2; i++) newh[k[i]] = h[k[i]];
				params.history = newh;
			}
			if (!silent) p.form.trigger(Ch);
			return p.history[k[k.length-1]];
		} 
		else if (!silent) p.form.trigger(Ch);
		
		if (!isNaN(x) || x===N) {
			var n = parseInt(x) || 0;
			if (n<0) return N;
			var k = h.keys().sort();
			if (n>=k.length) n = k.length-1;
			var old = p.history[k[k.length-n-1]].clone(true);
			if (remove) {
				var newh = Object.extended();
				for (var i=0; i<k.length-n-1; i++) newh[k[i]] = h[k[i]];
				params.history = newh;
			}
			if (!silent) p.form.trigger(Ch);
			return old;
		}
	};
	
	
	//=======================================
			
	function _build ($o, $root, uiNode, selector) {
	//initializes control
		var rd = $root.my(), 
			p = (rd||{}).params, 
			ui=uiNode,
			pi = null, 
			tracker, 
			v, ctr=0, 
			subform;
		
		if (!rd) {
			f.con ("Failed to find $root building "+selector+" selector."); 
			return null;
		}
		
		if ($o.size()) {		
			//first exec init 
			// init if we have one
			if (ui.init!=N) tracker = _prepare(rd.manifest, ui.init, $o, rd);
			
			if (isP(tracker))  {
				//we ve got  async init
				ctr+=1;
				pi = $.Deferred();
				tracker.then(_subform, function(msg, obj){
					_fail("Init of "+selector+" failed: "+msg,obj);
				});
			} else _subform();
		} else f.con ("Not found "+selector+" selector.",$root);
		
		return pi;
		
		
		// - - - - - - - - - - - - - - - - - - - - - - - 
		
		function _subform (){
			var child=null;
			// if we have manifest, retrieve it
			if (isF(ui.manifest) || (isO(ui.manifest) && isO(ui.manifest.ui))) subform = ui.manifest;
			else if (isS(ui.manifest)) {
				// static bind if manifest is string ref,
				// not dynamic to speed up long list renders
				subform=_manifest (rd.manifest, ui.manifest);
			}
			
			// ...and apply	
			if (subform && isS(ui.bind)) {
				//decrypt bind link and check if we have one in .data
				var linked = _getref(rd.data,ui.bind);
				if (pi===null) pi = $.Deferred();
				if (isA(linked) || ui.list){
					
					// we have list
					$o.addClass("my-form-list");

					//generate system fields
					var ltmpl="", lsel =">*"; 
					if (/^<.+>$/.test(ui.list)) ltmpl=ui.list;
					else lsel = ui.list||lsel;
					if (!ltmpl) {
						var $t0 = $o.find(lsel);
						ltmpl='<div></div>';
						if ($t0.size()) {
							ltmpl = $(ltmpl).append($t0.eq(0).clone(true)).html();
							$t0.eq(0).remove();
						}
					}
					
					//mount data
					if (!$o.data("formlist")) $o.data("formlist",{});
					$o.data("formlist").generator={
						manifest:subform, 
						delay:(ui.delay||p.delay||10)/1.3, 
						template:ltmpl, 
						selector:lsel,
						parent:rd.manifest,
						bind:ui.bind
					};
					
					//mount insert
					$o.on("insert.my", function(evt, obj){
						evt.stopPropagation();
						var p = {what:undefined, where:0}
						if (null==obj) p.where=1e6;
						else if (isO(obj)) Object.merge(p,obj);
						else if (isS(obj) || isN(obj)) p.where = obj;
						$(evt.target).my("insert",p.where, p.what);
					});
					
					//mount remove
					$o.on("remove.my", function(evt, obj){
						evt.stopPropagation();
						$(evt.target).my("remove");
					});
					
				} else {			
					try {
						child = $o.my(
							_manifest (rd.manifest, subform),
							isO(linked)?linked:undefined
						);
					}
					catch (e) {_fail("$.my subform init of " +selector+" failed: "+e.message, e.stack);}
				}
			}
			if (isP(child)) {
				//we've got promised subform init
				child.then(_countdown, function(msg, obj){
					_fail("Init of subform "+selector+" failed with error: "+msg,obj);
				});
			} else _countdown();
		}
		
		
		// - - - - - - - - - - - - - - - - - - - - - - - 
		
		function _fail (msg, obj){
			f.con(msg, obj);
			if (pi) pi.reject(msg, obj);
		}
		
		
		// - - - - - - - - - - - - - - - - - - - - - - - 
		
		function _countdown () {
			//start applying monitors to controls 
			//right before this moment all controls are irresponsive
			$o.each(function() {
				var $this = $(this), events, cm;
				
				//codemirror fix
				cm = ($this[0].nextSibling && $this[0].nextSibling.CodeMirror)?$this[0].nextSibling.CodeMirror:null;
				if (cm) $this.addClass("my-codemirror");
				
				//get events 
				events = ui.events||_traverse($this, MY.events);
				
				if (!$this.is(".my-form")) {				
					$this.data("my",{
						events:events,
						selector:selector,
						initial:v,
						previous:v,
						root:$root,
						container:p.container($this),
						id:rd.id,
						ui:ui,
						data:rd.data,
						params:p,
						errors:rd.errors
					});
					uiNode._update = ui.delay?_update.debounce(ui.delay):N;
				} else {
					$E($this.data("my"),{
						dui:ui,
						root:$root,
						selector:selector,
						dparams:p,
						devents:events,
						ddata:rd.data,
						container:p.container($this),
						derrors:rd.errors
					});
				}
				
				//special cleditor fix
				//thanks ima007@stackoverflow.com for concept
				if ($this.cleditor && $this.parent().is(".cleditorMain")) {
					var cledit = $this.cleditor()[0];
					if (cledit && cledit.$frame && cledit.$frame[0]) {	
						//mark as cleditor
						$this.addClass("my-cleditor");
						$E($this.data("my"), {container:p.container($this)});
						var cChange = function (v) {$this.val(v).trigger(Ch);};
						var cleditFrame, r = Number.random(1e5,1e6-1);
						//aux event handlers for cleditor instance
					    $(cledit.$frame[0]).attr("id","cleditCool"+r);
					    if (!document.frames) cleditFrame = $("#cleditCool"+r)[0].contentWindow.document;
					    else cleditFrame = document.frames["cleditCool"+r].document; 
					    var $ibody = $(cleditFrame).find("body");
					    $(cleditFrame).bind('keyup.my', function(){cChange($(this).find("body").html());});
					    $this.parent()
					    	.find("div.cleditorToolbar")
					    	.bind("click.my mouseup.my",function(){cChange($ibody.html());});
					    $("body").on("click", "div.cleditorPopup", function (){cChange($ibody.html());});
					}
				}
				
				//redactor fix
				else if ($this.is("div.redactor_box textarea")) {
                    //$this.getEditor().bind("input keyup blur",(function($o){$o.trigger("redactor");}).fill($this));
                    var editor, version = 'my-redactor-9';
                    try {
                        editor = $this.getEditor();
                        version = 'my-redactor-8';
                    } catch (e) {
                        editor = $this.redactor('getEditor');
                    }
                    if(editor) {
                        $this.addClass(version);
                        editor.bind("input.my keyup.my blur.my",(function($o){$o.trigger("redactor");}).fill($this));
                    }
                }
				
				//ace fix
				else if ($this.is(".ace_editor"))
					ace.edit($o[0]).on(Ch,(function($o){$o.trigger("ace");}).fill($this));
				
				// codemirror fix
				else if (cm) {
					cm.on(Ch, (function($o){$o.trigger("codemirror");}).fill($this));
				}
				
				//create debounced change handler
				$this.my()._changed = (_changed).debounce(uiNode.delay || p.delay);
				$this.my()._recalc = (_recalc).debounce(uiNode.delay || p.delay);
				
				//bind events to the control
				$this.bind(events, function (evt) {
					if (evt.type==Ch) evt.stopPropagation();
					$this.my()._changed($this,$root,uiNode,p);
				});
				
				//bind events to the control
				$this.on("recalc.my, redraw.my", function (evt) {
					evt.stopPropagation();
					$this.my()._recalc($this,$root,uiNode,p);
				});
			});
			
			// we've done
			if (pi) pi.resolve();
		} // end _countdown
	};
	
	
	//=======================================
	
	function _changed ($o,$root,uiNode,p) {
	// called when control is changed
		var d = $o.my(); 
		if (d && !d.disabled) {
			_history(d.ddata||d.data, d.dparams||d.params);
			var $we = $root.find(d.selector),
				val0 = _field($we,N);
			_update($o,val0,uiNode.recalcDepth||p.recalcDepth);
			if (d.root.parent().is(".ui-sortable")) d.root.parent().trigger("check");
			if (p.change) p.change.call($o);
		}
	};
	
//=======================================
	
	function _recalc ($o,$root,uiNode,p) {
	// called when control is changed
		var d = $o.my(); 
		if (d && !d.disabled) {
			var $we = $root.find(d.selector);
			if (($we).is(".my-form")) $we.my("redraw");
			else _update($o,
				($we.is(".my-form-list")?_getref($we.my().data,$we.data("formlist").generator.bind):N),
				uiNode.recalcDepth||p.recalcDepth);
		}
	};
	
	
	//=======================================
	
	function _prepare (that, init, $o, d) {
	//prepares init, applies data if its string template
	//or calls function
		if (isS(init)) $o.html(init.assign(d.data));
		else if (isF(init)) return init.apply(that, Array.prototype.slice.call(arguments,2));
		else if (isA(init)) {
			try {$o.formgen(init);} 
			catch(e){}
		}
		return null;
	};
	
	
	//=======================================

	function _unjson (node){ 
	//recursively unwinds string def of funcs and regexps, modifies  source obj!
		for (var i in node) if (node.hasOwnProperty(i)) {
			var n = node[i], t = $.type(n);
			if (/^(ob|ar)/.test(t)) _unjson(n);
			else if (t==St && /(^function\s\(|^new\sRegExp)/.test(n)) {
				try{
				node[i]=eval('0||('+n+')'); 
				}catch(e){console.log(e.message, e.stack,n)}
			}
			// Fucking IE, it took 8 hours to find this 0|| trick –
			// it allows IE8 eval functions work as expected
		}
	};
	
	
	//=======================================
	
	function _normalize (ui, manifest0) { 
	//unwinds ui recalcs, short defs and watch hooks, modifies source obj!		
	//move shorthand binds to bind attr
		var manifest = isO(manifest0)?manifest0:null;
		Object.each(ui, function (i,v){
			var t = typeof v;
			if (/^str|^fu/.test(t)) ui[i] = {bind:v};
		});
		Object.each(ui, function (i,v){
			//correct ui definitions
			//with simplified syntax -- unfolding
			var t = typeof v;
			//unfold recalcs and watches
			var recalcs=[], list=[], watch=[], row , re=/\s?[,;]\s?/;
			if (v.recalc) {
				if (isS(v.recalc)) list = v.recalc.split(re);
				else if (isA(v.recalc)) list = v.recalc;
				list = list.compact(true).unique();
			}
			if (list.length) ui[i].recalc=list;
			
			if (null==v.bind) v.bind=function(){};
			
			if (v.watch) {
				if (isS(v.watch)) watch = v.watch.split(re);
				else if (isA(v.watch)) watch = v.watch.slice(0);
				watch = watch.compact(true).unique();
				for (var rr, j=0;j<watch.length;j++) if (row = ui[watch[j]]) {
					rr= row.recalc;
					if (!rr) row.recalc=[i];
					else if (isS(rr)) row.recalc+=","+i;
					else if (isA(rr) && rr.indexOf(i)==-1) row["recalc"].push(i);
				}
			}
			
			if (null!==manifest) ["css","check","manifest","list"].each(function(elt){
				var m;
				if (isS(v[elt])) {
					var ref = _getref (manifest, v[elt]);
					if (ref!=null) v[elt]=ref;
				}
			});
		});
		return ui;
	};
	
	
	//=======================================
	
	function _style ($o, manifest, manClass, formClass) {
	// converts .style section of manifest
	// into two <style> sections for form.
	// returns custom style section, global is mounted 
	// to dom if not presented
		var glob={}, loc = {}, aglob=[], aloc=[], man=manifest;
		if (!isO(man) || !isO(man.style)) return "";
		
		crawl(manifest.style, "", aglob, aloc);
		return [aglob, aloc];
		
		
		function crawl (branch, key, aglob, aloc){
			var i, j, b, a;
			if (isS(branch)) aglob.push(key+(/\{/.test(branch)?branch:'{'+branch+'}'));
			else if (isA(branch) && branch.length) for (i=0;i<branch.length; i++) crawl(branch[i], key, aglob, aloc);
			else if (isO(branch)) {
				for (i in branch) {
					a = unfold(key, i);
					for (j=0;j<a.length;j++) crawl(branch[i],a[j], aglob, aloc);
				}
			}
			else if (isF(branch)) {
				try {
					b = branch.call(manifest, $o, manifest);
					crawl (b, key, aloc, aloc);
				} catch (e) {}
			}
		} 
		
		function unfold (key, selector) {
			var pre="", ext=selector+"", a;
			if (" "===ext.to(1) || /^[a-z]/i.test(ext)) pre=" ";
			a = ext.split(/\s*,\s*/).compact(true);
			if (!a.length) a.push("");
			return a.map(function(e) {return key+pre+e;});
		}
	}

	
	
//######### PUBLIC METHODS ##############	
	
	var methods = {
		  
		//######### INIT ##############
			
		"init" : function( A0,A1,A2 ) { 
			var data0, defaults,
				myid, cid, manifest, html,
				d, ui, p, data, i, 
				style, manClass, formClass,
				$style, $locstyle, 
				pi = $.Deferred(), 
				_fail=false,
				tracker, 
				ehandler=function(){},
				mode="std", 
				backup="";
			
			if (isS(A0)) {
				data0=_cache(A0);
				if (data0) {
					if (isO(A2) && isO(A1)) data0=$E(data0,A1), defaults=A2; 
					else defaults = A1;
					mode="repo";
				} else {
					pi.reject("No manifest with id "+A0+" found in repo.");
					return pi.promise();
				}
			} else {
				data0=A0;
				defaults = A1;
			}
				
			if (!data0) return this;
			
			if (isO(defaults) && mode!="repo") data = $E(true,{},data0);
			else data = data0;
			
			var $root = this.eq(0), rd=$root.my();	
			
			if (isO(rd) && rd.id && rd.ui) {
				f.con ("jQuery.my is already bind.",$root);
				$root.my("ui",data.ui);
				$root.my(Da,data.data);
				return pi.resolve($root.my(Da)).promise();
			}
			
			//here we must unwind stringified fn and regexps defs
			//if we are not in strict mode
			if (!data.params || (data.params && !data.params.strict)) _unjson(data);
			manifest = $E(true,{},data);
			
			//mount params
			p = $E(true, {}, MY.params, data.params||{});
			
			ui = _normalize($E(true,{}, data.ui||{}), manifest);
			cid = Number.random(268435456,4294967295).toString(16);
			myid =  data.id || ("my"+cid);
			d={};
			
			p.form=$root;
			
			if (data.params && data.params.depth) p.recalcDepth=data.params.depth;
			
			//bind this to 1st level manifest functions
			for (i in manifest) if (isF(manifest[i])) manifest[i].bind(manifest);
			
			//mount data	
			if ($.type(defaults)=="object") {
				d = f.patch(defaults,data.data||{});
				data.data=d;
			} else d = data.data || {};
			
			//mount error handler
			if (data.error) {
				if (isS(data.error)) {
					ehandler = function (){
						return data.error.assign(d);
					};
				} else if (isF(data.error)) {
					ehandler = function (err, stack) {
						html=null;
						try {html = data.error(err,stack);} 
						catch (e) {	html = p.messages.initFailed;}
						return html;
					};
				}
			} 
			
			
			//extend root with promise methods
			$.extend($root, pi.promise());
	
			//mount params to form DOM node
			$root.data("my", {
				id: myid,
				cid: cid,
				data:d, 
				params:p,
				errors:Object.extended(), 
				ui:Object.extended(ui),
			  	disabled:false,
			  	manifest:manifest,
			  	promise:pi.promise()
			});
			manifest.id = myid;
			
			// mount classes and styles if any 
			$root.addClass("my-form");
			
			manClass = "my-manifest-"+f.sdbmCode(myid);
			formClass = "my-form-"+cid;
			
			$root.addClass(formClass+" "+manClass);
			
			//fail init finalizer
			pi.fail(function(){
				$root.removeClass(formClass+" "+manClass);
			});
			
			
			if (manifest.style) {
				style=_style ($root, manifest, manClass, formClass);
				if (style && style[0].length) {
					$style = $('style#'+manClass);
					if ( !$style.size() ) {
						$style = $('<style id="'+manClass+'" data-count="0">'
							+"."+manClass+style[0].join(' \n.'+manClass)+'\n'
						+'</style>').appendTo($("body"));
					}
					
					$style.data("count", $style.data ("count")*1+1);
					$root.data("my").style = $style;
				}
				
				if (style && style[1].length) {
					$locstyle = $('style#'+formClass);
					if ( !$locstyle.size() ) {
						$locstyle = $('<style id="'+formClass+'" data-count="0">'
							+"."+formClass+style[1].join(' \n.'+formClass)+'\n'
						+'</style>').appendTo($("body"));
					}
					
					$root.data("my").localStyle = $locstyle;
					
				}
			}	
			
			
			//initialize
			if (data.init!=N) {
				backup = $root.find(">*").clone();
				try {
					tracker = _prepare(manifest, data.init, $root, data);
				} catch (e) {
					_f(isS(e)?e:e.message, e.stack);
					return $root;
				}
			}
			
			// init returned promise?
			if (isP(tracker)) {
				$root.addClass(p.pendingCss);
				tracker.then(function(){_controls();}, function(err,obj){_f(err, obj);});
			} else _controls();
			
			if (!_fail) {
				if (!$root.my()) return _f("Internal error initializing controls",""), $root;
				
				//save initial data for $.my("reset")
				$root.data("my").initial = $E(true,{},d);
				
				//init $.mobile if any
				if ($.mobile) $.mobile.changePage($.mobile.activePage);
			}
			
			return $root;
			
			//-----------------------------------------------------
			
			//build and init controls
			function _controls (){
				var formState={}, built, ctr=Object.size(ui);
				
				$root.addClass(p.pendingCss);
				
				// build controls (init and premount)
				Object.each(ui, function (selector,e) {
					if (_fail) return;
					var $o = $root.find(selector),
						built = _build($o, $root, ui[selector], selector);
					
					if (isP(built)) {
						//we've got promise
						built.then(
							_countdown.fill(selector)	
						).fail(function (msg, obj){
							_f("Error building "+selector+", "+msg, obj);
						});
					} 
					else if (!_fail) _countdown(selector);
				});
				
				function _countdown(selector){
					if (!_fail) {
						formState[selector]=_field($root.find(selector),N);
						ctr-=1; if (ctr<.5) _values(formState);
					}
				}
				
			}
			
			//-----------------------------------------------------
			
			//apply values to controls
			function _values (formState) {
				for (selector in ui) {
					if (_fail) return;
					var  $o = $root.find(selector);
					if ($o.size()) {
						try {
							var uiNode = ui[selector];
							var v = _bind(d, N, uiNode, $o);
							if (v!=N) _field($o,v);
							else {
								try {if (formState[selector]!=N && v!==undefined) 
									_bind(d, formState[selector], uiNode, $o);
								} catch(e){}
							}
							$o.eq(0).trigger("check.my");
						} catch (e) {
							_f("Error linking "+selector, e.stack);
						}	
					} 
				};
				$root.removeClass(p.pendingCss);
				backup=null;
				pi.resolve(d);
			}
			
			//-----------------------------------------------------
			
			// Fail handler
			function _f (msg, obj) {
				var html;
				_fail=true;
				f.con("Form "+myid+" failed to initialize: "+msg, obj); 
				$root.removeClass(p.pendingCss);
				html = ehandler(msg, obj);
				if (isS(html) || (isO(html) && html.jquery)) $root.html(html);
				else if (html===true) $root.html(backup);
				if (!p.silent) {
					if(!$root.my().ddata) {
						$root.removeData("my");
						$root.removeClass("my-form");
						if ($style) {
							if ($style.data("count")=="1") {
								try{$style.remove();}catch(e){};
							}
							else $style.data("count", $style.data("count")-1);
						}
						if ($locstyle) {
							try{$locstyle.remove();}catch(e){}
						}
					}
					pi.reject("Form "+myid+" failed to initialize: "+msg, obj);
				} else pi.resolve(d);
			}
		}, //end init
		
		
		
		//###### REDRAW ######
		
		"redraw": function( noRecalc, silent) {
			var $x = this, d = $x.my();
			if (d && d.ui) {
				d.ui.each(function(key) {
					var $n = $x.find(key);
					_update($n, noRecalc?N:undefined , d.params.recalcDepth);
					if (!noRecalc) {
						if ($n.is(".my-form")) $n.my("redraw");
						if ($n.is(".my-form-list")) $n.trigger("redraw");
						else $n.trigger("check.my");
					}
				});
				if (!silent && noRecalc) $x.trigger(Ch);
			}
			return $x;
		},
		
		//###### SET OR RETRIEVE DATA ######
		
		"data": function(data, noRecalc) {
			var $x = this;
			if (isO(data)) {
				$x.my().data = f.overlap($x.my().data, data);
				this.my("redraw", noRecalc);
			}
			return $x.my().data;
		},
		
		//###### RETURNS ERRORS ######
		
		"errors": function() {
			var e0 = $(this).my().errors, e = {};
			for (var i in e0) {
				if (e0[i] && isS(e0[i])) e[i]=e0[i];
				if (isO(e0[i]) && Object.keys(e0[i]).length) e[i]=e0[i];
			}
			return e;
		},
		
		//###### RETURNS true IF FORM VALID ######
		
		"valid": function (){
			var e0 = $(this).my().errors, e = {}, ctr=0;
			for (var i in e0) {
				if (e0[i] && isS(e0[i])) ctr++;
				else if (isO(e0[i]) && Object.keys(e0[i]).length) ctr++;
			}
			return !ctr;
		},
		
		//###### RESET INITIAL VALUES ######
		
		"reset": function () {
			try {
				f.kickoff(this.my().data, this.my().initial);
				this.my("redraw");
			} catch (e) {return false;}
			return true;
		},
		
		//###### GET id OR SEARCH BY id ######
		
		"id": function (id, obj) {
			if (isS(id)) return _cache(id, obj);
			else {
				var d = this.my();
				return (d && d.id)?d.id:N;
			}
		},
		
		//###### UNMOUNT jQuery.my INSTANCE FROM THE DOM ######
		
		"remove": function (fromDOM){	
			var $o = this, 
				$style, 
				$locstyle, 
				d, ui, nodelist=[];
			//child elt requests form removal
			if (this.my().root && !this.my().ddata) $o = this.my().root;
			
			d = $o.my().data;
			
			
			// stop event listeners
			$o.unbind(".my");
			
			// remove stylesheets
			if ($style=$o.my().style) {
				if ($style.data("count")=="1") {
					try{$style.remove();}catch(e){};
				}
				else $style.data("count", $style.data("count")-1);
			}
			if ($locstyle=$o.my().localStyle) {
				try{$locstyle.remove();}catch(e){}
			}
			
			// remove $.my from ui entries
			ui = ($o.my()||{}).ui;
			if (ui) {
				ui.each(function(key){
					var $we = $o.find(key), f;
					$we.unbind(".my");
					try{
						f = _traverse($we, MY.destroy);
						if (isF(f)) f($we);
					}catch(e){}
					$we .removeData("formlist")
						.removeData("myval")
						.removeData("my");
				});
			}
			
			if (($o.data("formlist") && $o.is(".my-form"))|| fromDOM) {
				var $p = $o.parents(".my-form-list").eq(0);
				$o.remove();
				$p.trigger("check")
			}
			else {
				$o.removeData("formlist")
				.removeData("myval")
				.removeData("my")
				.removeClass("my-form");
			}

			return d;//returns data collected by removed instance	
		},
		
		//###### UNDO ######
		
		"undo": function (steps){
			var $this = this, d = $this.my(), h = d.params.history, 
			k = h.keys().sort(), diff = 1*(parseInt(steps)||0);
			if (!k.length || diff<0) return N;		
			if (!d.params.errors || !d.params.errors.values().compact(true).length) {			
				if (h[k[k.length-1]].equals(Object.extended(d.data))) diff+=1;
			} else {
				if (!Object.extended(d.data).equals(Object.extended(d.lastCorrect))) diff+=1;
			}
			
			$this.my().data = Object.merge($this.my().data, _history(diff, d.params, true)||{});
			$this.my("redraw");
			return $this.my().data;
		},
		
		//###### UI RUNTIME GETTER-SETTER ######
		
		"ui": function (u) {
			var $x = this, d = $x.my(), a=[], i;
			if (!d) return N;
			var ui = $E(true, {}, d.ui);
			if ($.type(u)!=Ob) return d.ui;
			for (i in u) if (true || !ui[i]) a.push(i); //controls to (re)init
			d.ui = _normalize(f.overlap(d.ui,u));
			for (i=0;i<a.length;i++) _build($x.find(a[i]), $x, d.ui[a[i]], a[i]);
			for (i in u) $x.find(i).eq(0).trigger("check");
			return d.ui;
		},
		
		//###### ENABLE-DISABLE FORM ######
		
		"disabled": function (bool) {
			var $x = this, d = $x.my();
			if (!d) return undefined;
			if (bool==N) return d.disabled;
			if (!!bool) {
				//disable all controls
				for (var i in d.ui) {
					var $d = $x.find(i).eq(0), dn = $d.my();
					if (dn) dn.predisabled = dn.disabled;
					_css(true, $d, ":disabled");
				}
				$x.addClass("my-disabled");
			} else {
				for (var i in d.ui) {
					var $d = $x.find(i).eq(0), dn = $d.my(), onOff = false;
					if (dn && dn.predisabled) onOff=true;
					_css(onOff, $d, ":disabled");
				}
				$x.removeClass("my-disabled");
				$x.my("redraw");
			}
		},
		
		//###### FIND FORM NODE ######
		
		"find": function _findUiNode(sel) {
			var $x = this, d = $x.my(), $r;
			if (d && d.root) $x=d.root;
			return $x.find(sel);
		},
		
		//###### SYSTEM ######
		
		"manifest": 	function (format) {return format=="json"?f.tojson(this.my().manifest):this.my().manifest;},
		"version": 		function () {return _version;},
		"history": 		function (a,c) {return _history(a, this.my().params, c);},
		"val": 			function (v) {return _field(this, v);},
		"container": 	function ($o) {return _traverse($o, MY.containers)($o);},
		"promise" : 	function (fn) {if (isF(fn)) this.my().promise.then(fn); return this.my().promise;},
		
		//###### LIST RELATED ######
		"index":		function () {var o = (this.my().root && !this.my().ddata)?this.my().root:this; return (o.data("formlist")||{}).index},
		"insert":		function (where, what) {
			var src = this.is(".my-form-list")?this:(this.my().root||this),
				o = src.is(".my-form-list")?src:src.parent(".my-form-list"),
				pos = (src.data("formlist")||{}).index,
				list,
				obj = what,
				idx;
			if (null==pos) pos=0;
			list = _getref(o.my().data, o.data("formlist").generator.bind);
			if (!isO(obj)) {
				if (!isO(o.data("formlist").generator.manifest)) {
					if (o===src) throw "No data to insert, cannot guess when manifest is function.";
					obj = Object.clone(src.my().manifest.data,true);
				}
				else obj = Object.clone(o.data("formlist").generator.manifest.data,true)||{};
			}
				
				
			if ("before"===where) idx=pos;
			else if("after"===where) idx=pos+1;
			else if (!isNaN(where)) {
				idx=(1*where).clamp(0, list.length);
			} else throw "Invalid position for insert";
			list.add(obj, idx);
			o.trigger("redraw");
		}
	};
	
	if (!$.my) $.my={}; 
	
	$.extend($.my,{
		f:f,
		tojson:f.tojson,
		fromjson:f.fromjson,
		rules:MY,
		cache:function (A1, A2) {
			if (isF(A1)) return _cache = A1;
			else return _cache(A1, A2);
		}
	});

	
	// Mount everything over jQuery
	
	$.fn.my = function(method) {
		var form;
		if (method===undefined) return this.data("my");
		if (isS(method) && method.substr(0,1)=="{" ) {
			try{form = JSON.parse(method);}catch(e){}
			if (form) return methods.init.apply(this,[form].add(Array.prototype.slice.call(arguments, 1)));
		}
		if (isS(method) && methods[method]) return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
		else if (isS(method) && _cache(method,"exist")) return methods.init.apply(this,arguments);
		else if (typeof method === Ob || !method ) return methods.init.apply(this,arguments);
		else $.error('Method '+ method+' does not exist on jQuery.my');
	};
	
	return;
	
	
	
	//### Helpers builder
	
	function _getHelpersLib() {
	return {
		"con": function () {try {console.log (arguments);} catch (e) {}},
		"clone": function (o) {return o.clone?o.clone():o;},
		"extval": function ($x) { 
			var d = $x.my(); if (d&&d.data) return d.data;
			return $x.data("value")||$x.val()||$x.text()||$x.html()||"";
		},
		"jquix": function ($o, plugin, offon) {return $o[plugin](offon?"disable":"enable");},
		"overlap": function (o1, o2) {
			if (arguments.length == 0) return {};
			if (arguments.length == 1) return arguments[0];
			for (var i=1; i<arguments.length;i++) Object.merge(arguments[0],arguments[i], false, function(key,a,b) {
				if (b===undefined || b===null) return a;
				if (!isO(b)) return b;
				else return Object.merge(a,b,false);
			});
			return arguments[0];
		},
		"patch": function patcher (a,b) {
			//applies b over a in deep, if a already has non-object node it stays untouched
			//if no, b properties are cloned
			// function merger ({y:{w:2,a:[1,2]}}, {x:1, y:{w:5,z:3,a:[3,4,5]}}) >>{x:1,y:{w:2,a:[1,2],z:3}}.
			//return mutated a
			for (var i in b) {
				if (b.hasOwnProperty(i)) {
					if (isO(b[i])) {
						if (!a.hasOwnProperty(i))  a[i]=Object.clone(b[i],true);
						else patcher (a[i],b[i]);
					} else if (!a.hasOwnProperty(i)) {
						if (isA(b[i])) a[i]=b[i].clone(true);
						else a[i]=b[i];
					}
				}	
			}
			return a;
		},
		"kickoff": function(a,b) {
			//replaces a content with b content;
			for (var i in a) if (a.hasOwnProperty(i)) {
				if (b[i]===undefined) delete a[i];
				else a[i] = b[i];
			};
		},
		"sdbmCode":function(s0){ 
			//very fast hash used in Berkeley DB
		    for (var s = JSON.stringify(s0), hash=0,i=0;i<s.length;i++) hash=s.charCodeAt(i)+(hash<<6)+(hash<<16)-hash;
		    return (1e11+hash).toString(36);
		},
		"tojson":(function(){
			function f(n){return n<10?'0'+n:n;}
			Date.prototype.toJSON=function(){
				var t=this;return t.getUTCFullYear()+'-'+f(t.getUTCMonth()+1)+'-'+f(t.getUTCDate())+
				'T'+f(t.getUTCHours())+':'+f(t.getUTCMinutes())+':'+f(t.getUTCSeconds())+'Z';
			};
			RegExp.prototype.toJSON = function(){return "new RegExp("+this.toString()+")";};
			var tabs= '\t'.repeat(10), fj = JSON.stringify;
			
			// - - - - - - - - - - - - - - - - - - - - - - - 
			function s2 (w, ctab0, tab){
				var tl=0,a,i,k,l,v,ctab=ctab0||0,xt = tabs;
				if (tab && isS(tab)) {tl=String(tab).length;xt = String(tab).repeat(10);}
				switch((typeof w).substr(0,3)){
					case 'str': return fj(w);case'num':return isFinite(w)?''+String(w)+'':'null';
					case 'boo': case'nul':return String(w); 
					case 'fun': return fj(w.toString().replace(/^(function)([^\(]*)(\(.*)/,"$1 $3").replace(/(})([^}]*$)/,'$1'));
					case 'obj': if(!w) return'null';
					if (typeof w.toJSON===Fu) return s2(w.toJSON(),ctab+(tab?1:0),tab);
					a=[];
					if (isA(w)){
						for(i=0; i<w.length; i+=1){a.push(s2(w[i],ctab+(tab?1:0),tab)||'null');}
						return'['+a.join(','+(tab?"\n"+xt.to(ctab*tl+tl):""))+']';
					}
					for (k in w) if (isS(k)) {
						v=s2(w[k],ctab+(tab?1:0),tab);
						if(v) a.push((tab?"\n"+xt.to(ctab*tl+tl):"")+s2(k,ctab+(tab?1:0),tab)+': '+v);
					};
					return '{'+a.join(',')+(tab?"\n"+xt.to(ctab*tl):"")+'}';
				}
			}
			
			return s2.fill(undefined,0,undefined);
			
		})(),
		"fromjson": function (s) {var obj = JSON.parse(s); _unjson(obj);return obj;},
		"mask":function (src, mask0) {
			//returns src obj masked with mask
			if (!isO(src)) return null;
			var res, mask=mask0;
			if (isS(mask)) {
				return _getref(src, mask);
			} else if (isA(mask)) {
				res = [];
				for (var i=0;i<mask.length;i++) {
					res[i]=isS(mask[i])?_getref(src, mask[i])||null:null;
				}
				return res;
			} else if (isO(mask)) 
				return _merge(src, mask);
			//- - - -
			function _merge(src, mask) {
				if (!isO(mask)) return {};
				var dest = {};
				for (var i in mask) {
					if (!isO(mask[i]) && src.hasOwnProperty(i)) {
						dest[i]=Object.clone(src[i],true);
					}
					else if (src.hasOwnProperty(i)) {
						if (isO(src[i])) dest[i]=_merge(src[i],mask[i]);
						else dest[i] = Object.clone(src[i],true);
					}
				}
				return dest;
			}
		},
		"unmask": function (src, mask) {
			// unfolds masked into obj
			var res={};
			if (isO(src) && isO(mask)) return f.mask(src,mask);
			else if (isA(src) && isA(mask)) {
				for (var i=0;i<mask.length;i++) {
					if (src[i]!=null) _blow(res, src[i], mask[i]);
				}
				return res;
			} else if (isS(mask)) return _blow({}, src, mask);
			else return null;
			
			//- - -
			function _blow(data, src, ref) {		
				var ptr, path, preptr, val=Object.clone(src,true), i=0;
				if (!/\./.test(ref)) {
					//ref is flat
					if (null!=src) data[ref] = val;
				} else {
					path = ref.split(".").each(function(a,i){this[i]=String(a).compact();});
					ptr = data;
					for (;i<path.length;i++) {
						if (i===path.length-1) ptr[path[i]] = val; //we'r in the hole		
						if (i===0) ptr = data[path[0]], preptr= data;
						else preptr = preptr[path[i-1]], ptr = ptr[path[i]];
						if (undefined===ptr) ptr = preptr[path[i]] = {};
					}
				}
				return data;	
			} 
		},
		"getref":_getref,
		"unjson":function (obj) {
			_unjson(obj);
			return obj;
		}
	}
	}; //### end helpers
	
		
})(jQuery);

// end $.my









//#############################################################################################

/*
 * jQuery.formgen 0.3
 * Generates forms markup for $.my from lean-syntax DSL.
 * Returns html string.
 * 
 * $(somediv).formgen("[
 * 		// Redefines params for subsequent rows, can be partial
 * 		{ row:"400px", label:"100px", rowCss:"rowClass", labelCss:"", labelTag:""},
 * 
 * 		// First row
 * 		["Text4label", "inp#Name.person-name",{placeholder:"Your name"}],
 * 
 * 		// Some free HTML
 * 		'<div class="shim"><div>',
 * 
 * 		// Row with several controls and HTML, no label
 * 		["", "num#age",{style:"width:50px"}, "<i>years</i> ", "num#year", {style:"width:100px"}, " born"],
 * 
 * 		// Select with opts, understands many formats
 * 		["Choose one", "sel#mychoice", 
 * 			{vals:[
 * 				"Fish", 
 * 				"Meat", 
 * 				{id:"Poultry", text:"Chicken"}, 
 * 				{"Ice Tea":"Tea1"}
 * 		]}] 
 * 
 *		//and so on. Shortcuts for controls are below in the code.
 * ]")
 * 
 * */

(function($){
	//Some shortcuts and constants
	var $E = $.extend, n = function (o) {return o!==null && o!==undefined;},  N = null, 
		Ob="object", Da="data", Ar = "array", St = "string", Fu="function", Ch = "change",
		isA = Object.isArray, isB = Object.isBoolean, isS = Object.isString, isO = Object.isObject,
		isN = Object.isNumber, isR = Object.isRegExp, isF = Object.isFunction;
	var iHead = '<input type="',
		iTail = ' {ext} ';
	var f = {
		tmpl:{
			"num"	:iHead+'number" {ext}/>',
			"inp"	:iHead+'text" {ext}/>',
			"sli"	:iHead+'range" {ext}/>',
			"dat"	:iHead+'date" {ext}/>',
			"btn"	:iHead+'button" {ext}/>',
			"div"	:'<div {ext}>{txt}</div>',
			"spn"	:'<span {ext}>{txt}</span>',
			"sel"	:'<select {ext}>{txt}</select>',
			"mul"	:'<select {ext} multiple="multiple">{txt}</select>',
			"txt"	:'<textarea {ext}>{txt}</textarea>',
			"err"	:' <span class="my-error-tip {class}" style="{style}">{txt}</span>',
			"msg"	:'<div class="my-error-tip {class}" style="{style}">{txt}</div>',
			"val"	:function (p) {
				if (!isA(p.vals)) return "";
				var p0=$E({style:"",css:""},p);
				p0.txt=p.vals.reduce(function(a,b){
					return a+'<span class="my-shortcut" '
							+'onclick="$(this).parents(\'.my-row\').find(\'input,textarea\').val($(this).text()).trigger(\'blur\')">'
							+b+'</span> ';
				}," ");
				return ('<span class="my-shortcuts {css}" style="{style}">{txt}</span>').assign(p0);
			},
			""	:'<{_tag} {ext}>{txt}</{_tag}>'
		},
		txt:{
			sel:function(p) {
				if (!p.vals) return "";
				var obj = decrypt(p.vals);
				return Object.keys(obj).reduce(function(a,b){
					return a+'<option value="'+b+'">'+obj[b]+'</option>';
				},'');
			}
		},
		params:{
			styles:{num:"width:30%;", dat:"width:30%;", inp:"width:100%", 
					txt:"width:100%;max-width:100%;min-height:1px;word-break:break-word;", 
					err:"display:none",msg:"display:none"},
			alias: {number:"num",date:"dat",slider:"sli",textarea:"txt",input:"inp",
					span:"spn",select:"select",vals:"val"},
			row:"",
			rowTag:"div",
			rowCss:"my-row",
			label:"",
			labelTag:"span",
			labelCss:"my-label"					
		},
		
		defaults:{id:"","class":"",style:"",placeholder:"",value:"",rows:1},
		attnames:{css:"class",plc:"placeholder",val:"value",txt:"",vals:"",tip:"title"}
	};
		

	function chain(a,b,sys) {
		if (isS(b)) return a+b;
		if (isO(b)) {
			sys = $E(true,sys, b);
			return a;
		} else if (isA(b) && b.length>1 && isS(b[1])) {
				
			var lbl = b[0],html="",key,type,a0,b0,i=1,j,p,tmpl,ext;
			
			//iterate through row's inside items
			while (i<b.length) {
				if (isS(b[i])) {
					b0 = b[i].replace(/\s/g,"");
					a0 = b0.split(/[\.#]/i);
					type=sys.alias[a0[0]]||a0[0];
					key = b0.substr(a0[0].length);
					if (/^[a-z0-9]+(#[a-z0-9\-_]+)?(\.[a-z0-9\-_]+)*$/i.test(b0)) {
						tmpl = f.tmpl[type] || f.tmpl[""];
						p={style:"","class":"",txt:""};ext="";
						
						//mount params over p
						var isExt = isO(b[i+1]);
						if (isExt) {
							i+=1; 
							for (j in b[i]) if (f.attnames[j]!=="") p[f.attnames[j]||j]=b[i][j];
						}
						//apply default styles-classes
						if (!p.style && !p["class"] && sys.styles[type]) p.style=sys.styles[type];
						if (!p.id && key.to(1)=="#") p.id=key.from(1).split(".")[0];
						if (!p["class"] && key.has(".")) p["class"]=(key.to(1)=="#"?key.substr(p.id.length+1):key).split(".").compact(true).join(" ");
						
						//combine attributes and others
						for (j in p) ext+=j+'="'+p[j]+'" ';
						if (isExt)	for (j in b[i]) if (f.attnames[j]==="") p[j]=b[i][j];
						p.ext=ext;
						
						//try to gen text if no
						if (!p.txt && f.txt[type]) p.txt=f.txt[type](p);
						
						//attach _tag
						p._tag=type;
							
						//execute template
						html+=typeof tmpl == Fu?tmpl(p)||"":typeof tmpl == St?tmpl.assign(p):"";
						
					} else html+=b[i];
				}
				i+=1;
			}
			//somth is generated, make row
			if (html) {
				html = 
					'<'+sys.rowTag+' class="'+sys.rowCss+'" '
					+(sys.row?'style="width:'+sys.row+'; ':"")
					+(sys.label && lbl?'padding-left:'+sys.label+'; ':"")
					+'">'
					+(lbl?(
						'<'+sys.labelTag+' class="'+sys.labelCss+'" '
						+(sys.label?'style="display:inline-block;width:'+sys.label+';margin-left:-'+sys.label+'" ':"")
						+'>'+lbl+'</'+sys.labelTag+'>'
					):"")
					+html+'</'+sys.rowTag+'>';
			}
			return a+html;
		} 
		return a;
	}
	
	function decrypt (elt0) {
	//translates different forms like [val, val val]
	//{id:"",text:""} {key:"",value:""} and so on
	// into object {key1:val1, key2:val2, ...}
		var elt = elt0;
		if (isS(elt)) {
			elt = elt.split(/[\s,]/).compact(true);
		} 
		if (isA(elt)) {
			var obj={}; 
			for (var i=0;i<elt.length;i++) {
				var e = elt[i];
				if (isO(e)) {
					var keys=Object.keys(e);
					if (keys.length==1) obj[keys[0]]=e[keys[0]]+"";
					else obj[e.id||e.key||e.name||""]=(e.text||e.value||e.title||"");
					
				} else obj[e]=e+"";
			}
			elt=obj;
		} 
		if (isO(elt)) return elt;
		else return {};
	}
	
	function formgen (form, params){
		//find params in form if any
		var sys={};
		if (isA(form)) {
			$E(true,sys,f.params, params||{});
			/*for (var i in form) {
				if (isO(form[i])) sys = $E(true,sys, form[i]);
			}
			sys = $E(true,sys, params||{});*/
			var html = form.length?form.reduce(chain.fill(undefined,undefined,sys),''):"";
			return html;
		} else if (isO(form)) {
			$.extend(f, form)
		}else return "";
	}
	
	//return formgen;
	var methods={
		init: function (form, params) {
			return $(this).html(formgen(form, params));
		}
	};
	
	
	if (!$.my) $.my={};
	$.my.formgen = formgen;
	$.fn.formgen = function(method) {		
		if (isS(method) && methods[method]) return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
		else if (typeof method === 'object' || !method ) return methods.init.apply(this,arguments);
		else $.error('Method '+ method+' does not exist on jQuery.formgen');
	};
	
})(jQuery);




//#############################################################################################

/* jQuery.my.modal 0.4
 * Requires Sugar 1.4.1+, jQuery 1.11+, $.my 0.9.5+
 * 
 * Modal dialog constructor/manager. Singleton, allows only one instance of popup.
 * Returns promise, which is resolved on dialog normal close or rejected if modal fails to init.
 * After content is succesfully initialized promise progress receives notification "Ready".
 * 
 * $.my.modal (Obj, done, width) >> null or 
 * 									promise [resolve(formData or true), reject (errMessage, errStack)]
 * 
 * Obj is one of following types:
 * 		1. jQuery image – will raise modal with the image and text from title or data-text attributes
 * 		2. HTML string – will raise modal with html content
 * 		3. Object of type
 * 			{ 
 * 				manifest: formManifest Object,
 * 				data: initialData Object or none,
 * 				width: formWidth Number or none,
 * 				done: callback Function (formErrors, data) or none,
 * 				esc: false, enables/disables close on escape keypress
 * 			}
 * 			will raise modal with $.my form inside. Form must call $.my.modal(false) or emit
 * 			"commit" event on itself to close with sendind data. Calling $.my.modal(true) or 
 * 			emitting "cancel" event on form will close modal sending null as data with no error.
 * 
 * 			Callback in obj overlaps done provided as second arg, same for width.
 * 
 * 			Callback is called prior promise and unlike promise receives 2 arguments,
 * 			not one, even when form succeded. If callback returns true, dialog remains
 *			opened and promise – pending.
 * 
 * 		4. null, undefined or false – close dialog and calls done(formErrors, data),
 * 		   if done return false or null promise is resoved with data,
 * 		   else modal stays open
 * 		5. true (strict boolean) – close dialog and calls done (null, null),
 * 		   then promise is rejected with "Cancelled" string
 * 
 * 		If modal is already open invoking $.my.modal return promise that is immidiately 
 * 		rejected with error "Locked", done is called with (null, null).
 * 
 * $.my.modal.visible() >> Boolean
 * 		Indicates if modal is opened.
 * 
 * $.my.modal.parent (selector or null) >> jQuery object
 * 		Sets or gets parent DOM node, where all $.my.modal stuff is prepended. 
 * 		To work good must be called prior to 1st $.my.modal call.
*/

(function(jQuery){
	
	var $bg, $m, $f, root={}, parent = "body", isOpen = false, promise,
		isA = Object.isArray, isB = Object.isBoolean, isS = Object.isString, isO = Object.isObject,
		isN = Object.isNumber, isR = Object.isRegExp, isF = Object.isFunction;
	
	//Close modal on escape
	
	$(document).keydown(function(e) {
	    if (e.keyCode == 27 
	    	&& $(parent).find(">.my-modal").is(":visible") 
	    	&& (
	    		!$f.is(".my-form")
	    		||
	    		$f.data("escapable")
	    		||
	    		Object.equal($f.data("my").initial, $f.my("data"))
	    	)
	    ) root.modal(true);
	});
	
	root.modal = function modal (obj, done0, css0) {
		var done = done0||(function(){return false;}), 
			proxy,
			stop = false, 
			show = false, 
			data = true,
			text="",
			$img,
			width=css0||820, 
			height=300;
		
		// check if opened
		if (isOpen) {
			
			// No obj – close
			if (isB(obj) || obj===null || obj===undefined) {
				if (isF($m.data("done"))) done = $m.data("done");
				else done = function(){return false;};
				
				stop=false, data=true;

				if (!obj) {
					if (!$f.is(".my-form")) stop=done(null,true);
					else {
						stop=done($f.my("valid")?null:$f.my("errors"),$f.my("data"));
						if (!stop) data=$f.my("remove");
					}
				} else if (obj===true && promise.state()!="rejected"){
					if ($f.is(".my-form")) $f.my("remove");
					done(null,null);
					promise.reject("Cancelled");
				}
				if (!stop) {
					$f.html("");
					$m.css({display:"none"});
					(function() {if (!isOpen) $bg.css({display:"none"});}).delay(5);
					isOpen = false;
					$m.data("done",null);
					(function(){promise.resolve(data);}).delay(0);
				}
				return;
			}
			
			// Trying to open new modal
			// when prev is not closed
			proxy=$.Deferred();
			done(null,null);
			proxy.reject("Locked");
			return proxy.promise();
		}
		
		promise = $.Deferred();
		isOpen = true;
		
		// create wrappers if none defined
		if (!$m || !$(parent).find(">.my-modal").size()) {
			$m= $('<div class="my-modal" style="display:none;"></div>').prependTo($(parent));	
		}
		//rebuild modal form obj
		$m.html('<div class="my-modal-form"></div>');
		$f = $m.find(".my-modal-form");
		$('<div class="my-modal-close" title="Close">×</div>')
			.prependTo($m).on("click",function (){root.modal(true);});
		
		if (!$bg || !$(parent).find(">.my-modal-screen").size())  {
			$bg= $('<div class="my-modal-screen" style="display:none;"></div>')
					.prependTo($(parent)).on("click", function(){
						if (!$f.is(".my-form")||$f.data("escapable")) root.modal(true);
					});
		}
		
		// jQuery image
		if (typeof obj == "object" && obj.jquery) {
			if (obj.is("img")) {
				
				text = obj.attr("alt") || obj.attr("title") || obj.data("text");
				
				$f.html((function(){
					var $i = obj, 
					w = $i[0].naturalWidth, 
					h = $i[0].naturalHeight,
					w0=jQuery(window).width()-90,
					h0=jQuery(window).height()-90, 
					html;
					if (h0<h) w = (w*(h0/h))|0, h=h0;
					if (w0<w) w=w0, h=(h*(w0/w))|0;
					html = '<img src = "'+$i.attr("src")+'" class="db" style="max-width:'+w+'px;max-height:'+h+'px">';
					width=w<300?300:w;
					return html;
				})() + (text?'<h4 class="mt10">'+text+'</h4>':""));
				
				$f.find("img").on("click",function(){root.modal();});
				$m.css({top:"3000px",display:"block"});
				height=$m.height();
				show=1;
			}
		}
		
		// $.my form
		else if (isO(obj) && obj.manifest) {
			data = obj.data ||{};
			done = isF(obj.done)?obj.done:done;
			width=1*($.my.f.getref(
					isS(obj.manifest)?$.my.cache(obj.manifest):obj.manifest,
					"params.width"
				)
				||obj.width||width);
			$m.css({top:"3000px",display:"block"});
			$f.data("my",null);
			show=1;
			$f.my(obj.manifest, data).then(function(){
				_adjust.delay(20);
				promise.notify("Ready");
			}).fail(function(err){
				promise.reject(err);
				show=0;
				root.modal(true);
			});
			$m.data("done", done);
			$f.data("escapable", !!obj.esc);
			$f.bind("commit.my", function (){
				root.modal();
			}.debounce(50))
			.bind("cancel.my", function (){
				root.modal(true);
			}.debounce(50))
			.bind("layout.my", function (){
				_adjust();
			});
		} 
		
		//plain html
		else if (isS(obj)) {
			$f.html(obj);
			$m.css({top:"3000px",display:"block",width:"auto"});
			width=1*($m.width()||width);
			show=1;
		} 
		
		else if (obj===true) return isOpen = false, promise.reject("Cancelled").promise();
		else return isOpen = false, promise.reject("Invalid data").promise();
		
		//show all objs
		if (show) {
			_adjust(width);
			//If we have images, count them and reheight on load
			$img = $f.find("img").filter(function(){return $(this).attr("src")!="";});	
			if ($img.size()) {
				var _imgdone = (function(){
					_adjust(css0);
					promise.notify("Ready");
				}).after($img.size());
				$img.each(function (){$(this).bind("load", _imgdone);});
			} else {
				promise.notify("Ready");
			}
		}
		
		return promise.promise();
	};
	
	root.modal.loading = function (onoff) {
		$(parent).find(">.my-modal").toggleClass("my-modal-loading",!!onoff);
	};
	
	root.modal.parent = function (s) {
	// sets parent DOM node selector for $.my.modal
		if (!s || !$(s).size()) return $(parent);
		parent = s;
	};
	
	root.modal.visible = function () {return isOpen;};
	
	if (!jQuery.my) jQuery.my={};
	jQuery.my.modal = root.modal;
	
	
	
	function _adjust (width0){
		//adjust modal position,
		// centers it when content is ready
		
		var W = window,
			h=W.innerHeight || jQuery(W).height(), 
			w=W.innerWidth || jQuery(W).width(),
			height = $m.height(),
			width = width0||$f.width();
		$m.removeClass("loading")
			.css({
				left:((w-width-60)/2)+"px", 
				width:(width*1+60)+"px",
				display:"block"
			});
		$bg.css({width:(w*2)+"px", height:(h*2)+"px",display:"block"});	
		
		if (height>h) {
			$m.height(h);
			$f.css({"overflow-y":"overlay"});
		} else {
			$f.css({"overflow-y":"none"});
		}
		
		$m.animate(
			{top:(height>=h?0:(h-height)/3.5)+"px"},
			parseFloat($m.css("top"))<h?300:0
		);
	}
	
})(jQuery);





