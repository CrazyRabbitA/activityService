let express=require('express');
app=express();
ejs=require('ejs');
http = require('http');
const fs = require('fs')
const data = fs.readFileSync('./views/index.html', 'utf8').split('\n')

// console.dir(app)
//设置渲染文件的目录
app.set('views','./views');
//设置html模板渲染引擎
app.engine('html',ejs.__express);
//设置渲染引擎为html
app.set('view engine','html');



http.createServer(function (req, res) {
    // res.writeHead(200, { 'Content-Type': 'text-plain' });
    // res.writeHead(200, { 'Content-Type': 'text-plain' });
    // console.log(req.method);
    // console.dir(req);
    // console.dir(req.headers);
    let str=req.method+'\n'+JSON.stringify(req.headers)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write('恭喜你拿到数据了')
    res.end(str);
    var body = [];
    console.log('加一句话，看能不能同步过去')
    console.log(req.method);
    console.log(req.headers);

    req.on('data', function (chunk) {
        console.log(1)
        body.push(chunk);
    });
    req.on('end', function () {
        console.log(2)

        body = Buffer.concat(body);
        // console.dir(body)
        // console.log(body.toString());
        // console.dir(JSON.parse(body.toString()))
        let startIndex=data.findIndex(item=>{
            return item=='<i class="begin" style="display:none"></i>'
        })
        let endIndex=data.findIndex(item=>{
            return item=='<i class="end" style="display:none"></i>'
        })
        console.log(3)



        // 删除之前的组件
        let tempArr=JSON.parse(JSON.stringify(data))
        let head=tempArr.slice(0,startIndex+1)
        let foot=tempArr.slice(endIndex)
        let modules=JSON.parse(body.toString())
        console.log('没问题')
        console.dir(modules)
        let moduleArr=[]
        modules.forEach((item,index)=>{
            moduleArr.push(`<%- include("${item.type}.ejs",{data:data[${index}].data})%>`)
        })
        let finalData=head.concat(moduleArr).concat(foot)
        fs.writeFile('./views/index.html', finalData.join('\n'), 'utf8',(err)=>{
            if (err) throw err;
            console.log('文件已被保存');
            //调用路由，进行页面渲染
            app.get('/',function(request,response){
                //调用渲染模板
                response.render('index',{
                    //传参
                    title:'抗击疫情，你我同在',
                    data:modules,
                });

            });
            console.log('看一下源文件')
            console.dir(data)
            app.listen(8006);
            console.log('http://127.0.0.1:8006');
        })



    });
    // req.on('data', function (chunk) {
    //     res.write(chunk);
    // });
    // req.on('end', function () {
    //     res.end();
    // });


}).listen(8888);
