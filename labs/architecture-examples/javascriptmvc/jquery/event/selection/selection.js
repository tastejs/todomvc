// a text selection event that is useful in mobile safari

steal('jquery/dom/range','jquery/controller','jquery/event/livehack').then(function($){


	var event = $.event;
	
	event.selection = {
		delay : 300,
		preventDefault : event.supportTouch
	};
	
	event.setupHelper( ["selectionStart","selectionEnd","selectionEnding","selectionMoving","selectionMove"], "mousedown", function(ev){
		//now start checking mousemoves to update location
		var delegate = ev.delegateTarget || ev.currentTarget,
			selector = ev.handleObj.selector,
			ready = false,
			el = this,
			startRange = $.Range(ev),
			getRange = function(ev){
				var range = $.Range(ev),
					pos = startRange.compare("START_TO_START", range),
					entire;
				if(pos == -1 || pos == 0){
					return startRange.clone().move("END_TO_END", range)
				} else {
					return range.clone().move("END_TO_END", startRange)
				}
			},
			cleanUp = function(){
				$(delegate).unbind('mousemove', mousemove)
				   .unbind('mouseup',mouseup);
				 clearTimeout(moveTimer);
				 startRange = null;
			},
			mouseup =  function(moveev){
				
				if(!ready){
					cleanUp();
					return 
				}
				$.each(event.find(delegate, ["selectionMoving"], selector), function(){
					this.call(el, moveev, range)
				});
				var range = getRange(moveev);
				cleanUp();
				$.each(event.find(delegate, ["selectionEnd"], selector), function(){
					this.call(el, ev, range);
				});
				
			},
			mousemove = function(moveev){
				// safari keeps triggering moves even if we haven't moved
				if(moveev.clientX == ev.clientX && moveev.clientY == ev.clientY){
					return;
				}
				
				if(!ready){
					return cleanUp();
				}
				$.each(event.find(delegate, ["selectionMoving"], selector), function(){
					this.call(el, moveev, range)
				});
				var range = getRange(moveev);
				$.each(event.find(delegate, ["selectionMove"], selector), function(){
					this.call(el, moveev, range)
				});
			},
			start = function(){
				ready = true;
				var startEv = event.selection.preventDefault ? $.Event('selectionStart') : ev;
				var startEv = $.extend(ev, startEv)
				$.each(event.find(delegate, ["selectionStart"], selector), function(){
					this.call(el, startEv, startRange)
				});
				
				if(event.selection.preventDefault && startEv.isDefaultPrevented()){
					ready = false;
					cleanUp();
				}
			},
			moveTimer;
			
		if(event.selection.preventDefault){
			ev.preventDefault();
			moveTimer = setTimeout(start, event.selection.delay);
		} else {
			start();
		}
		
		
		$(delegate).bind('mousemove', mousemove)
				   .bind('mouseup',mouseup)
	});
	
});