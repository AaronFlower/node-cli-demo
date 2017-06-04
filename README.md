## 创建自己的 node cli

### npm cli , shell 命令 demo 

第一步是利用 `npm init` 创建一个 npm 项目。创建的`package.json`文件如下：

```json
{
  "name": "aaron-cli-demo",
  "version": "1.0.0",
  "description": "node cli demo",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "npm",
    "node",
    "cli",
    "demo"
  ],
  "author": "aaronflower",
  "license": "ISC"
}
```

下一步，我们需要写一个 js 脚本文件，根据默认约定命令为 `index.js` 脚本。

```javascript
#!/usr/bin/env node
console.log('Hello world, node cli demo')
```

文件中第一行加上`#!`释伴(Shebang) 是指名用那个解释程序来执行脚本。

接下来，我们需要在`package.json`文件中添加一个 `bin section`，key 值是触发脚本执行的命令， value 是相对于 package.json 文件目录的执行文件。

```json
diff --git a/package.json b/package.json
index 251dd01..9463c11 100644
--- a/package.json
+++ b/package.json
@@ -13,5 +13,8 @@
     "demo"
   ],
   "author": "aaronflower",
-  "license": "ISC"
+  "license": "ISC",
+  "bin": {
+    "aaron-cli": "./index.js"
+  }
 }
```

现在我们就可以全局安装并测试它了。

```shell
$ npm i -g
$ aaron-cli
Hello world, node cli demo
```

大功告成！

**注意：** `npm install -g` 实际上是把脚本软链到 node 的全局 bin 目录下。

```shell
$ which aaron-cli
/Users/easonzhan/.nvm/versions/node/v7.5.0/bin/aaron-cli
$ readlink $(which aaron-cli)
../lib/node_modules/aaron-cli-demo/index.js
```

在开发过程中为了方便可以使用 `npm link`命令直接链接到我们的开发环境的入口文件。

```
$ npm link
npm WARN cli-demo@1.0.0 No repository field.
/Users/easonzhan/.nvm/versions/node/v7.5.0/bin/aaron-cli -> /Users/easonzhan/.nvm/versions/node/v7.5.0/lib/node_modules/cli-demo/index.js
/Users/easonzhan/.nvm/versions/node/v7.5.0/lib/node_modules/cli-demo -> /Users/easonzhan/learning/git_repos/node_/npm-aaronflower
```

可以看出全局的`cli-demo`已经是链接的我们的开发目录了。

```javascript
diff --git a/index.js b/index.js
old mode 100644
new mode 100755
index e69de29..55493da
--- a/index.js
+++ b/index.js
@@ -0,0 +1,3 @@
+#!/usr/bin/env node
+console.log('Hello world, node cli demo')
+console.log('use npm link when developing your npm projet')
```

经过`npm link`后在命令中执行`aaron-cli`会直接看到更新。

```shell
$ aaron-cli
Hello world, node cli demo
use npm link when developing your npm projet
```

当脚本都开发完成后，就可以用`npm publish`把我们的脚本发布到 npm 库上了。然后大家就可以通过 npm 安装使用我们开发的脚本了。

```shell
$ npm i -g aaron-cli-demo
```

## Links
[Building command line tools with Node.js](https://developer.atlassian.com/blog/2015/11/scripting-with-node/)

