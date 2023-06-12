let joinStats = true;  //可選加入統計。加入統計不會收集任何隱私信息，僅統計訪問量。
let webPath = 'https://raw.githubusercontent.com/jianjianai/NewBingGoGo-Web/master/src/main/resources'; //web页面地址，可以修改成自己的仓库来自定义前端页面
let serverConfig = {
    "h1": "Welcome to Klnboard",
    "h2": "bing.klnboard.top",
    "p":"",
    "firstMessages":[
        "好的，我已清理好板子，可以重新開始了。我可以幫助你探索什麼?",
        "明白了，我已經抹去了過去，專注於現在。我們現在應該探索什麼?",
        "重新開始總是很棒。問我任何問題!",
        "好了，我已經為新的對話重置了我的大腦。你現在想聊些什麼?",
        "很好，讓我們來更改主題。你在想什麼?",
        "謝謝你幫我理清頭緒! 我現在能幫你做什麼?",
        "沒問題，很高興你喜歡上一次對話。讓我們轉到一個新主題。你想要了解有關哪些內容的詳細信息?",
        "謝謝你! 知道你什麼時候準備好繼續前進總是很有幫助的。我現在能為你回答什麼問題?",
        "當然，我已準備好進行新的挑戰。我現在可以為你做什麼?"
    ],
    "firstProposes":[
        "教我一個新單詞",
        "我需要有關家庭作業的幫助",
        "我想學習一項新技能",
        "最深的海洋是哪個?",
        "一年有多少小時?",
        "宇宙是如何開始的?",
        "尋找非虛構作品",
        "火烈鳥為何為粉色?",
        "有什麼新聞?",
        "讓我大笑",
        "給我看鼓舞人心的名言",
        "世界上最小的哺乳動物是什麼?",
        "向我顯示食譜",
        "最深的海洋是哪個?",
        "為什麼人類需要睡眠?",
        "教我有關登月的信息",
        "我想學習一項新技能",
        "如何創建預算?",
        "給我說個笑話",
        "全息影像的工作原理是什麼?",
        "如何設定可實現的目標?",
        "金字塔是如何建成的?",
        "激勵我!",
        "宇宙是如何開始的?",
        "如何製作蛋糕?"
    ]
}
let cookies = [
    ""
]


export default {
    async fetch(request, _env) {
        return await handleRequest(request);
    }
}
let serverConfigString = JSON.stringify(serverConfig);
/**
 * Respond to the request
 * @param {Request} request
 */
async function handleRequest(request) {
    let url = new URL(request.url);
    let path = url.pathname;

    if(path === '/challenge'){//过验证的接口
        let r = url.searchParams.get('redirect');
        if (r){
            return getRedirect(r);
        }
        return new Response(`验证成功`,{
            status: 200,
            statusText: 'ok',
            headers: {
                "content-type": "text/html; charset=utf-8"
            }
        })
    }

    if (path === '/sydney/ChatHub') { //魔法聊天
        return goChatHub(request);
    }
    if (path === "/turing/conversation/create") { //创建聊天
        return goUrl(request, "https://www.bing.com/turing/conversation/create",{
            "referer":"https://www.bing.com/search?q=Bing+AI"
        });
    }

    if(path==="/edgesvc/turing/captcha/create"){//请求验证码图片
        return goUrl(request,"https://edgeservices.bing.com/edgesvc/turing/captcha/create",{
            "referer":"https://edgeservices.bing.com/edgesvc/chat?udsframed=1&form=SHORUN&clientscopes=chat,noheader,channelstable,&shellsig=709707142d65bbf48ac1671757ee0fd1996e2943&setlang=zh-CN&lightschemeovr=1"
        });
    }
    if(path==="/edgesvc/turing/captcha/verify"){//提交验证码
        return goUrl(request,"https://edgeservices.bing.com/edgesvc/turing/captcha/verify?"+ url.search,{
            "referer":"https://edgeservices.bing.com/edgesvc/chat?udsframed=1&form=SHORUN&clientscopes=chat,noheader,channelstable,&shellsig=709707142d65bbf48ac1671757ee0fd1996e2943&setlang=zh-CN&lightschemeovr=1"
        });
    }

    if (path.startsWith('/msrewards/api/v1/enroll')) { //加入候补
        return goUrl(request, "https://www.bing.com/msrewards/api/v1/enroll" + url.search);
    }
    if (path === '/images/create') { //AI画图
        return goUrl(request, "https://www.bing.com/images/create" + url.search, {
            "referer": "https://www.bing.com/search?q=bingAI"
        });
    }
    if (path.startsWith('/images/create/async/results')) { //请求AI画图图片
        url.hostname = "www.bing.com";
        return goUrl(request, url.toString(), {
            "referer": "https://www.bing.com/images/create?partner=sydney&showselective=1&sude=1&kseed=7000"
        });
    }
    if (path.startsWith('/rp')) { //显示AI画图错误提示图片
        url.hostname = "www.bing.com";
        return goUrl(request, url.toString(), {
            "referer": "https://www.bing.com/search?q=bingAI"
        });
    }
    //用于测试
    if (path.startsWith("/test/")) {
        let a = path.replace("/test/",'');
        return goUrl(request, a);
    }
    //请求服务器配置
    if(path==='/web/resource/config.json'){
        return new Response(serverConfigString,{
            status: 200,
            statusText: 'ok',
            headers: {
                "content-type": "application/x-javascript; charset=utf-8",
                "cache-control":"max-age=14400"
            }
        })
    }
    if (path.startsWith("/web/")||path === "/favicon.ico") { //web请求
        if(!joinStats){
            if(path==="/web/js/other/stats.js"){
                return new Response("console.log(\"未加入统计\");",{
                    status: 200,
                    statusText: 'ok',
                    headers: {
                        "content-type": "application/x-javascript; charset=utf-8",
                        "cache-control":"max-age=14400"
                    }
                })
            }
        }
        let a = `${webPath}${path}`;
        return await goWeb(a);
    }
    return getRedirect('/web/NewBingGoGo.html');
}


async function goWeb(path) {
    let res = await fetch(path);
    let mimeType;
    if (path.endsWith(".html")) {
        mimeType = "text/html; charset=utf-8";
    } else if (path.endsWith(".js")) {
        mimeType = "application/x-javascript; charset=utf-8";
    } else if (path.endsWith(".css")) {
        mimeType = "text/css; charset=utf-8";
    } else if (path.endsWith(".png")) {
        mimeType = "image/png";
    } else if (path.endsWith(".ico")) {
        mimeType = "image/png";
    }
    return new Response(res.body, {
        status: 200,
        statusText: 'ok',
        headers: {
            "content-type": mimeType,
            "cache-control":"max-age=14400"
        }
    });
}


async function goChatHub(request){
    let url = new URL(request.url);
    //构建 fetch 参数
    let fp = {
        method: request.method,
        headers: {
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.57",
            "Host":"sydney.bing.com",
            "Origin":"https://www.bing.com"
        }
    }
    //保留头部信息
    let reqHeaders = request.headers;
    let dropHeaders = ["Accept-Language","Accept-Encoding","Connection","Upgrade"];
    for (let h of dropHeaders) {
        if (reqHeaders.has(h)) {
            fp.headers[h] = reqHeaders.get(h);
        }
    }
    let randomAddress = url.searchParams.get("randomAddress");
    if(randomAddress){
        fp.headers["X-forwarded-for"] = randomAddress;
    }
    let res = await fetch("https://sydney.bing.com/sydney/ChatHub", fp);
    return new Response(res.body, res);
}
//请求某地址
async function goUrl(request, url, addHeaders) {
    //构建 fetch 参数
    let fp = {
        method: request.method,
        headers: {}
    }
    //保留头部信息
    let reqHeaders = request.headers;
    let dropHeaders = ["accept", "accept-language","accept-encoding"];
    for (let h of dropHeaders) {
        if (reqHeaders.has(h)) {
            fp.headers[h] = reqHeaders.get(h);
        }
    }


    fp.headers["user-agent"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.1774.57"

    //客户端指定的随机地址
    let randomAddress = reqHeaders.get("randomAddress");
    if(!randomAddress){
        randomAddress = "12.24.144.227";
    }
    //添加X-forwarded-for
    fp.headers['x-forwarded-for'] = randomAddress;

    if (addHeaders) {
        //添加头部信息
        for (let h in addHeaders) {
            fp.headers[h] = addHeaders[h];
        }
    }


    let cookieID = 0;
    if(reqHeaders.get('NewBingGoGoWeb')){//如果是web版
        //添加配置的随机cookie
        if (cookies.length === 0) {
            return getReturnError("没有任何可用cookie，请前在第一行代码cookies变量中添加cookie");
        }
        cookieID = Math.floor(Math.random() * cookies.length);
        let userCookieID = reqHeaders.get("cookieID");
        if (userCookieID) {
            if (userCookieID >= 0 && userCookieID <= cookies.length-1) {
                cookieID = userCookieID;
            } else {
                return getReturnError("cookieID不存在，请刷新页面测试！");
            }
        }
        fp.headers["cookie"] = cookies[cookieID];
    }else {//如果是插件版
        fp.headers["cookie"] = reqHeaders.get('cookie');
    }

    let res = await fetch(url, fp);
    let newRes = new Response(res.body,res);
    newRes.headers.set("cookieID",`${cookieID}`);
    return newRes;
}

//获取用于返回的错误信息
function getReturnError(error) {
    return new Response(JSON.stringify({
        value: 'error',
        message: error
    }), {
        status: 200,
        statusText: 'ok',
        headers: {
            "content-type": "application/json",
            "NewBingGoGoError":'true'
        }
    })
}

//返回重定向
function getRedirect(url) {
    return new Response("正在重定向到" + url, {
        status: 302,
        statusText: 'redirect',
        headers: {
            "content-type": "text/html",
            "location": url
        }
    })
}

