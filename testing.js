const Mastodon = require('mastodon-api');
const PythonShell = require('python-shell').PythonShell;

console.log("Mastodon Bot starting...");

const M = new Mastodon({
    client_key: "ye_GtOvfu6cvlLp0rskJNaYCqDClfgv9jzZI67Xt-rcY",
    client_secret: "hpRhLZjslyXBxAqypI_dtZRLEt2ICXfSGiubypRNJCo",
    access_token: "gHhyw2wEh1qDMoSPMdNscEglmKlPaxCw7MIQOm9r00g",
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    api_url: "https://bgme.me/api/v1/", // optional, defaults to https://mastodon.social/api/v1/
})

function toot(mystr, id, visib) {
    const params = {
        status: mystr,
    }
    if (id) {
        params.in_reply_to_id = id;
    }
    if(visib){
        params.visibility = visib;
    }

    M.post('statuses', params, (error, data) => {
        if (error) {
            console.error(error);
        } else {
            console.log(`Posted: ${data.content}`);
        }
    });
}


const listener = M.stream('streaming/user')

listener.on('message', msg => {
    // fs.writeFileSync(`data${new Date().getTime()}.json`, JSON.stringify(msg, null, 2));
    console.log("get a message");

    if (msg.event === 'notification') {

        // 若有人关注，则发一条博文艾特并感谢
        if (msg.data.type === 'follow') {
            const acct = msg.data.account.acct;
            toot(`@${acct} 谢谢关注XD 操！`);
        } else if (msg.data.type === 'mention') {

            // 给对方点赞
            const regex1 = /(喜欢|点赞)/i;
            const content = msg.data.status.content;
            const id = msg.data.status.id;
            const visib = msg.data.status.visibility;
            console.log("mentioned by someone!");
            if (regex1.test(content)) {
                M.post(`statuses/${id}/favourite`, (error, data) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log(`Favorated: ${data.content}`);
                    }
                });
            }

            // 转发博文
            const regex2 = /(转发|转嘟)/i;
            if (regex2.test(content)) {
                console.log(msg);
                const vis = msg.data.status.visibility;
                if (vis === 'private') {
                    console.log("but, this is a private message.");
                } else if (vis === 'direct') {
                    console.log("but, this is a direct message.");
                } else {
                    M.post(`statuses/${id}/reblog`, (error, data) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log(`Reblogged: ${data.content}`);
                            toot("有人叫我转这条↑ 操！");
                        }
                    });
                }
            }

            // 回复 0~99 之间的一个随机数
            const regex3 = /(幸运数|lucky)/i;
            if (regex3.test(content)) {
                console.log("somebody ask for a num");
                const acct = msg.data.account.acct;
                const num = Math.floor(Math.random() * 100);
                const reply = `@${acct} 今天的幸运数是：${num} 操！`;
                toot(reply, id, visib);
            }

            // 调用 python 1： LanguageTool
            const regex4 = /(LanguageTool|grammar)/i;
            if (regex4.test(content)) {
                var options = {
                    mode: 'text',
                    pythonOptions: ['-u'],
                    args: [content]
                };
                console.log("somebody ask for grammar check");
                const acct = msg.data.account.acct;
                PythonShell.run('grammar_check.py', options, function (err, results) {
                    if (err) 
                      throw err;
                    console.log(results[0]);
                    const reply = results[0];
                    toot(`@${acct} 泥嚎! I told LanguageTool to check the grammar for you. -> ` + reply + " 操！", id, visib);
                });
            }

            // 调用 python 2： 随机两个AU
            const regex5 = /(paro|AU|梗)/i;
            if (regex5.test(content)) {
                var options = {
                    mode: 'text',
                    pythonOptions: ['-u'],
                };
                console.log("somebody ask for AU");
                const acct = msg.data.account.acct;
                PythonShell.run('AU.py', options, function (err, results) {
                    if (err) 
                      throw err;
                    console.log(results[0]);
                    const reply = results[0];
                    toot(`@${acct} 泥嚎! 我的建议是： ` + reply + " 操！", id, visib);
                });
            }

            // 调用 python 3： 奇遇
            const regex6 = /(奇遇|冒险)/i;
            if (regex6.test(content)) {
                var options = {
                    mode: 'text',
                    pythonOptions: ['-u'],
                    args: [content]
                };
                console.log("somebody ask for adventure");
                console.log(content);
                const acct = msg.data.account.acct;
                PythonShell.run('adventure.py', options, function (err, results) {
                    if (err) 
                      throw err;
                    console.log(results[0]);
                    const reply = results[0];
                    toot(`@${acct} ` + reply + " 操！", id, visib);
                });
            }

            // 调用 python 4： 诗
            const regex7 = /(诗|poem)/i;
            if (regex7.test(content)) {
                var options = {
                    mode: 'text',
                    pythonOptions: ['-u']
                };
                console.log("somebody ask for a poem");
                const acct = msg.data.account.acct;
                PythonShell.run('poem.py', options, function (err, results) {
                    if (err) 
                      throw err;
                    console.log(results);
                    const reply = results.join('\r\n');
                    toot(`@${acct} ` + reply + " \r\n 操！", id, visib);
                });
            }
        }
    }
});

listener.on('error', err => console.log(err))

