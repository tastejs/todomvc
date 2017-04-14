/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("loader-rollup",function(e,t){e.Loader.prototype._rollup=function(){var e,t,n,r,i=this.required,s,o=this.moduleInfo,u,a,f;if(this.dirty||!this.rollups){this.rollups={};for(e in o)o.hasOwnProperty(e)&&(n=this.getModule(e),n&&n.rollup&&(this.rollups[e]=n))}for(;;){u=!1;for(e in this.rollups)if(this.rollups.hasOwnProperty(e)&&!i[e]&&(!this.loaded[e]||this.forceMap[e])){n=this.getModule(e),r=n.supersedes||[],s=!1;if(!n.rollup)continue;a=0;for(t=0;t<r.length;t++){f=o[r[t]];if(this.loaded[r[t]]&&!this.forceMap[r[t]]){s=!1;break}if(i[r[t]]&&n.type===f.type){a++,s=a>=n.rollup;if(s)break}}s&&(i[e]=!0,u=!0,this.getRequires(n))}if(!u)break}}},"3.7.3",{requires:["loader-base"]});
