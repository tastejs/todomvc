(function(){window.i18n={};var MessageFormat={locale:{}};MessageFormat.locale.en = function ( n ) {
  if ( n === 1 ) {
    return "one";
  }
  return "other";
};
;window.i18n['todo']={};;window.i18n['todo']['todos']=function(d){
var r = "";
r += "todos";
return r;
};window.i18n['todo']['whatNeedsDone']=function(d){
var r = "";
r += "What needs to be done?";
return r;
};window.i18n['todo']['markAllAsComplete']=function(d){
var r = "";
r += "Mark all as complete";
return r;
};window.i18n['todo']['itemCount']=function(d){
var r = "";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["ITEMS"];
r += " ";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
var lastkey_1 = "ITEMS";
var k_1=d[lastkey_1];
var off_0 = 0;
var pf_0 = { 
"one" : function(d){
var r = "";
r += "item";
return r;
},
"other" : function(d){
var r = "";
r += "items";
return r;
}
};
if ( pf_0[ k_1 + "" ] ) {
r += pf_0[ k_1 + "" ]( d ); 
}
else {
r += (pf_0[ MessageFormat.locale["en"]( k_1 - off_0 ) ] || pf_0[ "other" ] )( d );
}
r += " left";
return r;
};window.i18n['todo']['clearCompleted']=function(d){
var r = "";
r += "Clear completed";
return r;
};window.i18n['todo']['all']=function(d){
var r = "";
r += "All";
return r;
};window.i18n['todo']['active']=function(d){
var r = "";
r += "Active";
return r;
};window.i18n['todo']['complete']=function(d){
var r = "";
r += "Complete";
return r;
};window.i18n['todo']['doubleClickEdit']=function(d){
var r = "";
r += "Double-click to edit a todo";
return r;
};window.i18n['todo']['fullSource']=function(d){
var r = "";
r += "Full Source";
return r;
};window.i18n['todo']['createdBy']=function(d){
var r = "";
r += "Created by <a href=\"";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["URL"];
r += "\">";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["NAME"];
r += "</a>";
return r;
};window.i18n['todo']['partOf']=function(d){
var r = "";
r += "Part of <a href=\"";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["URL"];
r += "\">";
if(!d){
throw new Error("MessageFormat: No data passed to function.");
}
r += d["NAME"];
r += "</a>";
return r;
}})();