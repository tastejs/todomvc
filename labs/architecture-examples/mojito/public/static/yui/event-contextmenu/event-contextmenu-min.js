/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("event-contextmenu",function(e,t){var n=e.Event,r=e.DOM,i=e.UA,s=e.UA.os,o=i.ie,u=i.gecko,a=i.webkit,f=i.opera,l=s==="windows",c=s==="macintosh",h={},p={on:function(t,i,s,p){var d=[];d.push(n._attach(["contextmenu",function(n){n.preventDefault();var r=e.stamp(t),i=h[r];i&&(n.clientX=i.clientX,n.clientY=i.clientY,n.pageX=i.pageX,n.pageY=i.pageY,delete h[r]),s.fire(n)},t])),d.push(t[p?"delegate":"on"]("keydown",function(n){var i=this.getDOMNode(),p=n.shiftKey,d=n.keyCode,v=p&&d==121,m=l&&d==93,g=n.ctrlKey,y=d===77,b=c&&(a||u)&&g&&p&&n.altKey&&y,w=c&&f&&g&&p&&y,E=0,S=0,x,T,N,C,k,L,A;if(l&&(v||m)||b||w){((o||l&&(u||f))&&v||w)&&n.preventDefault(),k=r.getXY(i),L=k[0],A=k[1],x=r.docScrollX(),T=r.docScrollY(),e.Lang.isUndefined(L)||(E=L+i.offsetWidth/2-x,S=A+i.offsetHeight/2-T),N=E+x,C=S+T;if(m||l&&a&&v)h[e.stamp(t)]={clientX:E,clientY:S,pageX:N,pageY:C};if((o||l&&(u||f))&&v||c)n.clientX=E,n.clientY=S,n.pageX=N,n.pageY=C,s.fire(n)}},p)),i._handles=d},detach:function(t,n,r){e.each(n._handles,function(e){e.detach()})}};p.delegate=p.on,p.detachDelegate=p.detach,n.define("contextmenu",p,!0)},"3.7.3",{requires:["event-synthetic","dom-screen"]});
