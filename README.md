# mastodon_bot 长毛象机器人

fork from CaoCao

# English Summary:

CaoCao (Fuck*2 in Chinese) is an autoresponder bot project for mastodon. The functions are: accept sentences from users to write a sonnet solitaire, drift bottle, find a random work in ao3, find a random poem online, accept two character names to return a random story, etc. 

All the texts involved are Chinese. If you are a newbie like me and working on build your own bot, I (strongly) recommend <a href="https://www.youtube.com/watch?v=sKSxBd56H70">this tutorial</a>.

# 以下为中文介绍
长毛象机器人：<a rel="me" href="https://bgme.me/@ciao">操操</a>

mastodon即长毛象，是一个去中心化的社交平台。操操是长毛象平台的自动回复机器人项目。

艾特操操，并在文本中提问关键词，操操就会用你选择的可见范围回复你。

关注操操，操操会发一条嘟文感谢。

有些特别词语可以触发操操的特定回复，bot.js中均有标注。

> 上述简介来自原项目。本项目fork from 操操，所有我不需要的功能所需文件均保留在save文件夹下。


-------以下是不需要特殊格式的功能-------


【喜欢/点赞】 -> 我会给你的嘟文点赞

【转发/转嘟】-> 我会转嘟

【解答之书/答案之书】-> 我会随机给你一个问题的答案（真随机）

# 逻辑

bot.js持续监听长毛象API，通过bot.js或fork python程序完成指令，bot.js向用户发嘟文返回结果

python程序对应：

解答之书 -> answer_book.py

# 为了跑这些代码，你需要

1. nodejs[14.16.1]（library文件里包含了）

2. python[3.7.4]（以下是需要的library）

   ----- requests

   ----- bs4

3. 服务器跑额外需要pm2

# 环境布置好后启动程序

1. 在自己电脑跑：打开一个terminal，输入【node bot.js】启动即可。关机会停止工作

2. 在服务器：ssh到服务器，输入【pm2 start bot.js】启动即可

# 边学边做的保姆级教学

<a href="https://www.youtube.com/watch?v=sKSxBd56H70">油管up主：The Coding Train</a>

我没有node基础，全程是看这个教程做的，讲得很细致（对于做一个bot足够用）

# 如果你不太熟悉代码且不想学且真的想跑这个机器人的教程（会有这种勇士吗）

以下所有步骤针对干净如纸纯洁善良未历世事的windows。

### 1. <a href="https://www.bilibili.com/read/cv13671309">安装python</a>

访问[Python官网的windows下载页](https://www.python.org/downloads/windows/)，选一个稳定版本，下载官网推荐的Windows installer (64-bit)安装就可。安装过程中记得勾选Add to PATH选项，很重要。

### 2. <a href="https://blog.csdn.net/qq_45752401/article/details/122299475">安装node</a>

访问[Nodejs官网下载页](https://nodejs.org/en/download/)，点击Windows Installer下载安装。

### 3. 检查装没装好

打开一个cmd（win+r,cmd,回车）输入

`python --version`回车

`node --version`回车（或者`node -v`）

分别回复给你相应版本号就行了（版本比上边写的高就行了，低一点应该也问题不大？）

### 4. 安装 python library。在命令行里输入

`pip install requests`回车

`pip install bs4`回车

### 4. 下载 github 提供的该项目打包文件

解压，打开解压的文件（此时你看到了乱七八糟一堆后缀.py和.json和.js之类的文件），复制目录

比如说 D:\mastodon_bot（是个意思，在下面粘你复制好的你的目录不要粘我的）。在cmd里输入

cd D:\mastodon_bot 回车，然后把这个窗口放一边备用

### 5. 获取你的长毛象应用接口（高级说法API）

长毛象主页左下角那一堆平时没人看的东西里有一个“开发”，选创建应用，起个名，权限按她默认的勾选不用动即可，之后会得到三个乱码。把三个乱码填进`.env-example`这个文件，把乱码粘到等于号后边，不要有空格。

- 应用ID 对应 `CLIENT_KEY`

- 应用密钥 对应 `CLIENT_SECRET`

- 你的访问令牌 对应 `ACCESS_TOKEN` 【这个必须贴对，上边这俩我一开始好像贴反了，不影响用】

- API_URL=https://your.domain/api/v1/ ，换成你的mastodon站点

然后把这个文件重命名，去掉-example，变成`.env`

### 6. 拿出刚才准备好的，cd到指定目录的窗口，输入

node bot.js 回车

发现屏幕上出现一行Mastodon Bot starting...就可以了！

我在尝试的过程中发现启动后第一次通知往往收不到（可能是我连接的问题？）多艾特一次就好了

# 服务器运行bot，我的环境是debian10

[debian安装python3](https://computingforgeeks.com/how-to-install-python-on-debian-linux/)。

```
sudo apt update && sudo apt upgrade  #更新系统
sudo apt install build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev libsqlite3-dev wget libbz2-dev   #安装依赖
wget https://www.python.org/ftp/python/3.10.0/Python-3.10.0.tgz  #下载包
tar -xf Python-3.10.*.tgz  #解压
cd Python-3.10.*/
./configure --enable-optimizations  #运行配置命令以检查所需的依赖项是否可用
make -j 4   #源代码构建 Python 3.10，稍微等一会，2g内存服务器也能跑起来，记得提前分swap虚拟内存
sudo make altinstall   #继续安装
python3.10 --version   #返回python3的版本号，检查是否安装
sudo apt install python3-pip   #安装pip
```

swap虚拟内存脚本：

```
wget https://web.archive.org/web/20200920015125if_/https://www.moerats.com/usr/shell/swap.sh && bash swap.sh
```
输入数字 1，再输入需要添加的swap大小，建议为内存的2倍。比如，我的 VPS 服务器有 2 GB 内存，因此输入 4096，即创建 4 GB 的虚拟内存。

安装node：

`sudo snap install node --channel=18/stable --classic`（需安装snap）
或者
```
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```
检查是否安装
```
node --version
```

确定安装好node之后运行`npm install pm2@latest -g`安装pm2

pm2教程参考：[https://linuxeye.com/435.html](https://linuxeye.com/435.html)

安装python包：

`pip3 install requests`

`pip3 install bs4`

`apt install unzip`安装解压zip软件。然后
```
cd /home   #先切到某个目录
wget https://github.com/MicroSic/mastodon_bot/archive/refs/heads/main.zip  #下载本项目的zip包
unzip main.zip  #解压
cd mastodon_bot-main   #进入解压后的目录下
mv .env-example .env   #给.env-example文件重命名为.env
nano .env    #打开.env
```
像上面一样也是获取`CLIENT_KEY`，`CLIENT_SECRET`和`ACCESS_TOKEN`并且贴上去，同时修改API_URL，Ctrl+X保存，按y确定。

`pm2 start bot.js`启动就行了。
