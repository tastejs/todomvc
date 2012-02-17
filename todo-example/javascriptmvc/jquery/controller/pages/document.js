/**
@page jquery.controller.documentcontrollers Document Controllers
@parent jQuery.Controller

Document Controllers delegate on the 
documentElement.  You don't have to attach an instance as this will be done
for you when the controller class is created.  Document Controllers, with the 
exception of MainControllers,
add an implicit '#CONTROLLERNAME' before every selector.

To create a document controller, you just have to set 
the controller's [jQuery.Controller.static.onDocument static onDocument]
property to true.

@codestart
$.Controller.extend('TodosController',
{onDocument: true},
{
  ".todo mouseover" : function( el, ev ) { //matches #todos .todo
      el.css("backgroundColor","red")
  },
  ".todo mouseout" : function( el, ev ) { //matches #todos .todo
      el.css("backgroundColor","")
  },
  ".create click" : function() {        //matches #todos .create
      this.find("ol").append("&lt;li class='todo'>New Todo&lt;/li>"); 
  }
})
@codeend

DocumentControllers should be used sparingly.  They are not very reusable.
They should only be used for glueing together other controllers and page
layout.

Often, a Document Controller's <b>"ready"</b> event will be used to create
necessary Element Controllers.

@codestart
$.Controller.extend('SidebarController',
{onDocument: true},
{
  <b>ready</b> : function() {
      $(".slider").slider()
  },
  "a.tag click" : function() {..}
})
@codeend

## MainControllers 

MainControllers are documentControllers that do not add '#CONTROLLERNAME' before every selector.  This controller
should only be used for page wide functionality and setup.

@codestart
$.Controller.extend("MainController",{
  hasActiveElement : document.activeElement || false
},{
  focus : funtion(el){
     if(!this.Class.hasActiveElement)
         document.activeElement = el[0] //tracks active element
  }
})
@codeend
 */
//