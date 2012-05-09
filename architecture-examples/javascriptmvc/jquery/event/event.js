/**
 * @page specialevents Special Events
 * @tag core
 * JavaScriptMVC provides a bunch of useful special events.  Find out more info on the left.  The following is a 
 * brief summary:
 * 
 * ## [jQuery.event.special.default Default Events]
 * 
 * Lets you supply default behavior for an event that is preventable 
 * with event.preventDefault().  This is extremely useful for providing DOM-like api's for your widgets.
 * 
 *     $("#tabs").delegate(".panel","default.open", function(){
 *       $(this).show()
 *     })
 *     
 * ## [jQuery.event.special.destroyed Destroyed Events]
 * 
 * Know if an element has been removed from the page.
 * 
 *     $("#contextMenu").bind("destroyed", function(){
 *       // cleanup
 *       $(document.body).unbind("click.contextMenu");
 *     })
 *     
 * ## [jQuery.Drag Drag] and [jQuery.Drop Drop] Events
 * 
 * Listen to drag-drop events with event delegation.
 * 
 *     $(".item").live("dragover", function(ev, drag){
 *       // let user know that the item can be dropped
 *       $(this).addClass("canDrop");
 *     }).live("dropover", function(ev, drop, drag){
 *       // let user know that the item can be dropped on
 *       $(this).addClass('drop-able')
 *     })
 * 
 * ## 
 * 
 */
steal.plugins('jquery');