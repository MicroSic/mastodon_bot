require('dotenv').config();
const Mastodon = require('mastodon-api');
const fs = require('fs');
const PythonShell = require('python-shell').PythonShell;

console.log("Mastodon Bot starting...");
const poem_posters = new Set();

const M = new Mastodon({
    client_key: process.env.CLIENT_KEY,
    client_secret: process.env.CLIENT_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    api_url: process.env.API_URL, // optional, defaults to https://mastodon.social/api/v1/
})

function toot(mystr, id, visib) {
    const params = {
        status: mystr,
    }
    if (id) {
        params.in_reply_to_id = id;
    }
    if (visib) {
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
    console.log("got a message.");

    if (msg.event === 'notification') {

        // 若有人关注，则发一条博文艾特并感谢
        if (msg.data.type === 'follow') {
            const acct = msg.data.account.acct;
            // toot(`@${acct} 谢谢关注！`, null ,"direct");
            console.log("Followed by somebody");
        } else if (msg.data.type === 'mention') {

            // 给对方点赞
            const regex1 = /(喜欢|点赞|喜歡|點贊)/i;
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
            const regex2 = /(转发|转嘟|轉發|轉嘟)/i;
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
                            // toot("有人叫我转这条↑");
                        }
                    });
                }
            }


            // 调用 python 1： 解答之书
            const regex3 = /(解答之书|答案之书|解答之書)/i;
            if (regex3.test(content)) {
                var options = {
                    mode: 'text',
                    pythonOptions: ['-u'],
                };
                console.log("somebody ask for answer in the book");
                const acct = msg.data.account.acct;
                PythonShell.run('answer_book.py', options, function (err, results) {
                    if (err) {
                        console.error("Python 脚本执行失败:", err);
                        toot(`@${acct} 抱歉，我找不到答案。`, id, visib);
                        return;
                    }    
                    console.log(results[0]);
                    const reply = results[0];
                    toot(`@${acct} 的答案是：` + reply, id, visib);
                });
            }

         

        }
    }
});

listener.on('error', err => {
  console.error("Stream connection error:", err.message);
  // 可选：加入重连机制
  setTimeout(() => {
    listener = M.stream('streaming/user');
  }, 5000);
});
