import{f as _,g as f,h as m,s,i as g,v as R,j as y,k as a,$ as h,_ as u}from"./app-Xr76NGup.js";const w=e=>JSON.parse(decodeURIComponent(e));var V=_({name:"VuePlayground",props:{title:{type:String,default:""},files:{type:String,required:!0},settings:{type:String,default:"{}"}},setup(e){const n=f(),i=m(!0),t=s(),l=s(),r=s(),o=g(()=>R({},n,w(e.settings))),d=async()=>{const[{ReplStore:v,Repl:p},{default:c}]=await Promise.all([u(()=>import("./vue-repl-LhYjCInL.js"),__vite__mapDeps([0,1,2])),u(()=>import("./codemirror-editor-D_RvkYgD.js"),__vite__mapDeps([3,2,1]))]);t.value=p,r.value=c,l.value=new v({serializedState:decodeURIComponent(e.files)}),o.value.vueVersion&&await l.value.setVueVersion(o.value.vueVersion)};return y(async()=>{await d(),i.value=!1}),()=>[a("div",{class:"vue-playground-wrapper"},[e.title?a("div",{class:"header"},decodeURIComponent(e.title)):null,a("div",{class:"repl-container"},[i.value?a(h,{class:"preview-loading",height:192}):null,t.value?a(t.value,{editor:r.value,store:l.value,autoResize:!0,...o.value,layout:"horizontal"}):null])])]}});export{V as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/vue-repl-LhYjCInL.js","assets/app-Xr76NGup.js","assets/utils-5585d0be-XOQqDqQW.js","assets/codemirror-editor-D_RvkYgD.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}