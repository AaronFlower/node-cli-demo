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

```shell
# 发布
$ npm adduser # 省略，默认版本是 1.0.0 中的 package.json 中的版本。
$ npm publish # 如果，package.json 中的 description 是空的话，将会用 README.md 来当作描述。
$ npm i -g cli-demo
```



### 引入命令行参数解析

对执行脚本时的命令行参数解析，我们可以使用一个很[方便的 `commander`库](https://www.npmjs.com/package/commander)。下面为我们的主程序加上参数解析功能：

```javascript
|  #!/usr/bin/env node
| -console.log('Hello world, node cli demo')
| -console.log('use npm link when developing your npm projet')
| +var program = require('commander')
| +program
| +     .arguments('<file>')
| +     .option('-u, --username <username>', 'The user to authenticate to')
| +     .option('-p, --password <password>', 'The user\'s password')
| +     .action(function (file) {
| +             console.log('user: %s, password: %s, file: %s', program.username, program.password, file)
| +     })
| +     .parse(process.argv)
```

接下来我们可发布我们的 cli-demo 啦。一个新的版本。

```shell
~/learning/git_repos/node_/npm-aaronflower on  master! ⌚ 23:27:06
$ npm version patch
v1.0.1

~/learning/git_repos/node_/npm-aaronflower on  master! ⌚ 23:28:26
$ npm publish
+ aaron-cli-demo@1.0.1
```

测试, `commander`会自动为我们生成 `-h, --help`  参数哟。

```shell
~/learning/git_repos/node_/npm-aaronflower on  master! ⌚ 23:39:07
$ aaron-cli -u aaron --password flower cli-demo-parse.js
user: aaron, password: flower, file: cli-demo-parse.js

~/learning/git_repos/node_/npm-aaronflower on  master! ⌚ 23:39:59
$ aaron-cli -h

  Usage: aaron-cli [options] <file>

  Options:

    -h, --help                 output usage information
    -u, --username <username>  The user to authenticate to
    -p, --password <password>  The user's password
```

### 处理用户输入

有些时间脚本也支持用户输入，我们可以使用 `process.stdin`来处理。但是`co-prompt`库更加方便使用，`co-prompt` 是基于 `co` 来实现的，这样我们就可以使用 ES6 的 `yield` 语法了。

```
npm i -S co co-prompt
```

更新我们的脚本程序：

```javascript
@@ -1,10 +1,23 @@
-#!/usr/bin/env node
+#!/usr/bin/env node --harmony
+var co = require('co')
+var prompt = require('co-prompt')
 var program = require('commander')
+
 program
        .arguments('<file>')
        .option('-u, --username <username>', 'The user to authenticate to')
        .option('-p, --password <password>', 'The user\'s password')
        .action(function (file) {
-               console.log('user: %s, password: %s, file: %s', program.username, program.password, file)
+               co(function* () {
+                       let username = program.username
+                       let password = program.password
+                       if (!username) {
+                               username = yield prompt('username: ')
+                       }
+                       if (!password) {
+                               password = yield prompt.password('password: ')
+                       }
+                       console.log('user: %s, password: %s, file: %s', username, password, file)
+               })
        })
        .parse(process.argv)
```

测试，现在我们的命令行参数即支持指定又支持输入了。

```shell
~/learning/git_repos/node_/npm-aaronflower on  master! ⌚ 0:08:15
$ aaron-cli -u aaron -p flower foo.js
user: aaron, password: flower, file: foo.js

~/learning/git_repos/node_/npm-aaronflower on  master! ⌚ 0:11:44
$ aaron-cli -u aaron  foo.js
password: *************
user: aaron, password: yesmypassowrd, file: foo.js

~/learning/git_repos/node_/npm-aaronflower on  master! ⌚ 0:11:58
$ aaron-cli  foo.js
username: aaaronflower
password: ******
user: aaaronflower, password: kdiggg, file: foo.js
```

## Links
[Building command line tools with Node.js](https://developer.atlassian.com/blog/2015/11/scripting-with-node/)

