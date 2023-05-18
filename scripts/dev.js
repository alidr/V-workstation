import esbuild from "esbuild";
import minimist from "minimist";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const args = minimist(process.argv.slice(2));
const format = args.f || "iife";
const target = args._[0] || "reactivity";

const __dirname = dirname(fileURLToPath(import.meta.url)); //当前文件所在的目录名称
console.log(`output->args`, __dirname);

const IIFENameMap = {
  'reactivity': 'VueReactivity',
}; // 针对iife打包方式


esbuild.context({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
  bundle: true,
  sourcemap: true,
  format,
  platform: "browser",
  globalName: IIFENameMap[target],
}).then((ctx)=>{
  ctx.watch()
  console.log(`output->打包完成~~~~`)
});
