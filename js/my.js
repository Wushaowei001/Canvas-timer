var WINDOW_WIDTH=1024;
var WINDOW_HEIGHT=600;
var RADIUS=8;             //小球的半径
var MARGIN_TOP=60;        //每一个数字距离画布顶端的距离
var MARGIN_LEFT=30;       //第一个数字距离画布左边距的距离
var endTime=new Date();
endTime.setTime(endTime.getTime()+3600*1000);    //倒计时的截止时间,为1小时之后
var curShowTimeSeconds=0;

var balls=[];
const colors=["#33b5e5","#0099cc","#aa66cc","#9933cc","#99cc00","#669900","#ffbb33","#ff8800","#ff4444","#cc0000"];
window.onload=function(){
    var canvas=document.getElementById("canvas");
    var context=canvas.getContext("2d");

    canvas.width=WINDOW_WIDTH;
    canvas.height=WINDOW_WIDTH;
    curShowTimeSeconds=getCurrentShowTimeSeconds();
    setInterval(function(){
        render(context);
        update();
    },50);

}
function update(){
    //更新显示的时间,产生时间变化的动画
    var nextShowTimeSeconds=getCurrentShowTimeSeconds();
    var nextHours=parseInt(nextShowTimeSeconds/3600);
    var nextMinutes=parseInt((nextShowTimeSeconds-nextHours*3600)/60);
    var nextSeconds=nextShowTimeSeconds%60;

    var curHours=parseInt(curShowTimeSeconds/3600);
    var curMinutes=parseInt((curShowTimeSeconds-curHours*3600)/60);
    var curSeconds=curShowTimeSeconds%60;
    //只比较秒即可，因为每50毫秒就比较一次
    if(nextSeconds!=curSeconds){
        //如果小时的十位数发生改变，就产生该小时十位数对应的小球数个小球
        if(parseInt(curHours/10)!=parseInt(nextHours/10)){
            addBalls(MARGIN_LEFT+0,MARGIN_TOP,parseInt(curHours/10));
        }
        //如果小时的个位数发生改变，就产生该小时个位数对应的小球数个小球
        if(parseInt(curHours%10)!=parseInt(nextHours%10)){
            addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHours%10));
        }
        if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10)){
            addBalls(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10));
        }
        if(parseInt(curMinutes%10)!=parseInt(nextMinutes%10)){
            addBalls(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes%10));
        }
        if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10)){
            addBalls(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds/10));
        }
        if(parseInt(curSeconds%10)!=parseInt(nextSeconds%10)){
            addBalls(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds%10));
        }
        curShowTimeSeconds=nextShowTimeSeconds;
    }
    //更新掉落小球的函数
    updateBalls();
}
function updateBalls(){
    for(var i=0;i<balls.length;i++){
        balls[i].x+=balls[i].vx;
        balls[i].y+=balls[i].vy;
        balls[i].vy+=balls[i].g;
        //碰撞检测，如果当前小球碰到地面，让小球弹起
        if(balls[i].y>=WINDOW_HEIGHT-RADIUS){
            balls[i].y=WINDOW_HEIGHT-RADIUS;
            balls[i].vy=-balls[i].vy*0.75;
        }
    }

    //下面几行代码是对性能进行优化
    //对移出屏幕的小球进行删除操作，否则balls里面的小球会一直增加
    var cnt=0;          //记录还有多少个小球保留在画面中
    for(var i=0;i<balls.length;i++){
        if(balls[i].x+RADIUS>0&&balls[i].x-RADIUS<WINDOW_WIDTH){
            //将在屏幕内的小球放在数组前面，这样balls[cnt-1]后面的小球都是可以删掉的
            balls[cnt++]=balls[i];
        }
    }
    //将移出屏幕的小球删掉
    while(balls.length>Math.min(300,cnt)){     //屏幕中小球的个数为300和cnt中的最小值
        balls.pop();
    }
}

function addBalls(x,y,num){
    for(var i=0;i<digit[num].length;i++){
        for(var j=0;j<digit[num][i].length;j++){
            if(digit[num][i][j]==1){
                //产生一个小球对象
                var aBall={
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(),              //小球的重力加速度
                    vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,   //使小球x方向正负移动为随机
                    vy:-5,
                    color:colors[parseInt(Math.random()*colors.length)]
                }
                balls.push(aBall);
            }
        }
    }
}

function getCurrentShowTimeSeconds(){
    var curTime=new Date();
    var ret=endTime.getTime()-curTime.getTime();
    ret=Math.round(ret/1000);
    return ret>=0?ret:0;
}
function render(cxt){
    //每一次更新画面，都要先清除画布，否则会叠加
    cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
    var hours=parseInt(curShowTimeSeconds/3600);
    var minutes=parseInt((curShowTimeSeconds-hours*3600)/60);
    var seconds=curShowTimeSeconds%60;
    //绘制数字的函数
    renderDigit(MARGIN_LEFT,MARGIN_TOP,parseInt(hours/10),cxt);                          //绘制小时得第一个数字
    renderDigit(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),cxt);            //绘制小时的第二个数字,14*(RADIUS+1)为一个数字的宽度
    renderDigit(MARGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,cxt);                            //绘制冒号
    renderDigit(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),cxt);          //绘制分钟的第一个数字
    renderDigit(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),cxt);          //绘制分钟的第二个数字
    renderDigit(MARGIN_LEFT+69*(RADIUS+1),MARGIN_TOP,10,cxt);                            //绘制冒号
    renderDigit(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),cxt);          //绘制秒钟的第一个数字
    renderDigit(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),cxt);         //绘制秒钟的第二个数字

    //绘制掉落的小球
    for(var i=0;i<balls.length;i++){
        cxt.fillStyle=balls[i].color;
        cxt.beginPath();
        cxt.arc(balls[i].x,balls[i].y,RADIUS,0,Math.PI*2);
        cxt.closePath();
        cxt.fill();
    }
}
function renderDigit(x,y,num,cxt){  //参数分别为绘制起始位置，绘制的数字，context对象
    cxt.fillStyle="rgb(0,102,153)";
    for(var i=0;i<digit[num].length;i++){
        for(var j=0;j<digit[num][i].length;j++){
            if(digit[num][i][j]==1){
                cxt.beginPath();
                cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);
                cxt.closePath();
                cxt.fill();
            }
        }
    }
}