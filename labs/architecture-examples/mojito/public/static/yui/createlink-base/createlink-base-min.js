/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("createlink-base",function(e,t){var n={};n.STRINGS={PROMPT:"Please enter the URL for the link to point to:",DEFAULT:"http://"},e.namespace("Plugin"),e.Plugin.CreateLinkBase=n,e.mix(e.Plugin.ExecCommand.COMMANDS,{createlink:function(t){var r=this.get("host").getInstance(),i,s,o,u,a=prompt(n.STRINGS.PROMPT,n.STRINGS.DEFAULT);return a&&(u=r.config.doc.createElement("div"),a=a.replace(/"/g,"").replace(/'/g,""),a=r.config.doc.createTextNode(a),u.appendChild(a),a=u.innerHTML,this.get("host")._execCommand(t,a),o=new r.EditorSelection,i=o.getSelected(),!o.isCollapsed&&i.size()?(s=i.item(0).one("a"),s&&i.item(0).replace(s),e.UA.gecko&&s.get("parentNode").test("span")&&s.get("parentNode").one("br.yui-cursor")&&s.get("parentNode").insert(s,"before")):this.get("host").execCommand("inserthtml",'<a href="'+a+'">'+a+"</a>")),s}})},"3.7.3",{requires:["editor-base"]});
