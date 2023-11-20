import{_ as t}from"./app-Xr76NGup.js";var a={provider:"Waline",dark:'html[data-theme="dark"]',serverURL:"https://quentine-walline-blog-comments.vercel.app"};const i=async()=>{try{const{pageviewCount:e}=await t(()=>import("./app-Xr76NGup.js").then(r=>r.Z),__vite__mapDeps([]));return e({serverURL:a.serverURL})}catch{console.error("@waline/client is not installed!");return}};export{i as updatePageview};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = []
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}