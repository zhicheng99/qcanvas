"use strict"
// v2.0版本
// 是一个完全新的版本 


/**
 * 二次贝塞尔曲线曲线类
 */
function QquadraticCurve(prototype) {
    //主类原型中的方法全部引用过来 放到本实例的原型上
    //都引用过来的原因是 一些通用的方法 可以直接用this.调用
    for (var i in prototype) {
        QquadraticCurve.prototype[i] = prototype[i];
    }
}
QquadraticCurve.prototype.quadraticCurve = function(options) {
    //注：this是主类的上下文 

    var _this = this;
    var OPTIONS = {
        TYPE: 'quadraticCurve',
        color: '#000', //颜色
        like: '-', //画出来的样子 [-][->][<->][--][-->][<-->]
        width: 1,
        start: [0, 0],
        handler: [50, 130],
        end: [100, 100],
        drag: true,
        pointerEvent: 'auto',
        handlerShow: false,
        //withText:'text', //带着的文本
        //withTextAlign:'center'  //文本的横向位置 [left center(默认) right]
        centerPoints: function() { //元素中心点相对于整个画布的坐标

            var start = _this.isFun(this.start) ? this.start() : this.start;
            var handler = _this.isFun(this.handler) ? this.handler() : this.handler;
            var end = _this.isFun(this.end) ? this.end() : this.end;
            var center = [
                (start[0] < end[0] ? start[0] : end[0]) + Math.abs(start[0] - end[0]) * 0.5,
                (start[1] < end[1] ? start[1] : end[1]) + Math.abs(start[1] - end[1]) * 0.5
            ]


            return [
                (handler[0] < center[0] ? handler[0] : center[0]) + Math.abs(handler[0] - center[0]) * 0.5,
                (handler[1] < center[1] ? handler[1] : center[1]) + Math.abs(handler[1] - center[1]) * 0.5
            ]

        },
        downFun: function(e, position) {

            //线的拖动要特殊处理 鼠标点击点距结束点的距离也得记录
            var start = _this.isFun(this.start) ? this.start() : this.start;
            var handler = _this.isFun(this.handler) ? this.handler() : this.handler;
            var end = _this.isFun(this.end) ? this.end() : this.end;
            this.dis = [
                position.x - start[0],
                position.y - start[1],
                position.x - handler[0],
                position.y - handler[1],
                position.x - end[0],
                position.y - end[1]
            ];
        },
        moveFun: function(e, position) { //当配置drageRange时  开始限制坐标


            var dragIsBool = _this.isBool(this.drag);
            var dis = this.dis;
            var start = _this.isFun(this.start) ? this.start() : this.start;
            var handler = _this.isFun(this.handler) ? this.handler() : this.handler;
            var end = _this.isFun(this.end) ? this.end() : this.end;



            var x0, y0, x1, y1, x2, y2;

            if (dragIsBool && this.drag) {
                x0 = position.x - dis[0];
                y0 = position.y - dis[1];

                x1 = position.x - dis[2];
                y1 = position.y - dis[3];

                x2 = position.x - dis[4];
                y2 = position.y - dis[5];

            } else if (this.drag == 'vertical') {
                x0 = start[0];
                y0 = position.y - dis[1];
                x1 = handler[0];
                y1 = position.y - dis[3];
                x2 = end[0];
                y2 = position.y - dis[5];


            } else if (this.drag == 'horizontal') {
                x0 = position.x - dis[0];
                y0 = start[1];
                x1 = position.x - dis[2];
                y1 = handler[1];
                x2 = position.x - dis[4];
                y2 = end[1];

            }


            //如果创建时位置数据依赖于别的元素 那么一旦拖动该元素 数据的依赖关系就会断开 切记
            this.start = [x0, y0];
            this.handler = [x1, y1];
            this.end = [x2, y2]

            this.handlerShow && (this.handlerObj !== null) && this.handlerObj.setStart([x1, y1]);

        },
        drawArrow: function(fromX, fromY, toX, toY, theta, headlen, width, color) {

            var theta = typeof(theta) != 'undefined' ? theta : 30;
            var headlen = typeof(theta) != 'undefined' ? headlen : 10;
            var width = typeof(width) != 'undefined' ? width : 1;
            var color = typeof(color) != 'color' ? color : '#000';

            // 计算各角度和对应的P2,P3坐标
            var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI;
            var angle1 = (angle + theta) * Math.PI / 180;
            var angle2 = (angle - theta) * Math.PI / 180;
            var topX = headlen * Math.cos(angle1);
            var topY = headlen * Math.sin(angle1);
            var botX = headlen * Math.cos(angle2);
            var botY = headlen * Math.sin(angle2);

            // this.qcanvas.context.save();
            // this.qcanvas.context.beginPath();

            var arrowX = fromX - topX;
            var arrowY = fromY - topY;
            // this.qcanvas.context.beginPath();
            // 	this.qcanvas.context.setLineDash([]); 


            arrowX = toX + topX;
            arrowY = toY + topY;
            // this.qcanvas.context.moveTo(arrowX, arrowY);
            // this.qcanvas.context.lineTo(toX, toY);
            var arrow2X = toX + botX;
            var arrow2Y = toY + botY;
            // this.qcanvas.context.lineTo(arrow2X, arrow2Y);
            // this.qcanvas.context.strokeStyle = color;
            // this.qcanvas.context.lineWidth = width;
            // this.qcanvas.context.stroke();

            _this.qline.paintLine.call(_this,{
                like: '-',
                start: [arrowX, arrowY],
                end: [toX, toY],
                width: width,
                color: color,
                pointerEvent: 'none'

            })

            _this.qline.paintLine.call(_this,{
                like: '-',
                start: [toX, toY],
                end: [arrow2X, arrow2Y],
                width: width,
                color: color,
                pointerEvent: 'none'
            })
        }
    }
    this.extend(OPTIONS, options);
    this.appendSetFun(OPTIONS);

    //分离文字
    if (typeof OPTIONS.withText != 'undefined' && OPTIONS.withText != '') {

        this.qquadraticCurve.splitText(this, OPTIONS);

    }


    //显示控制点
    OPTIONS.handlerShow && this.qquadraticCurve.drawHandler.call(this, OPTIONS);




    return OPTIONS;
};
QquadraticCurve.prototype.drawHandler = function(obj) {
    var _this = this;
    var handler = _this.isFun(obj.handler) ? obj.handler() : obj.handler;

    obj.handlerObj = this.qarc.arc.call(this,{
        start: handler,
        sAngle: 0,
        eAngle: 360,
        fillColor: 'blue',
        opacity: 0.2,
        r: 8,
        borderColor: '#ccc',
        mousemove: function() {
            if (_this.dragAim !== null) {
                obj.handler = this.start;
            }
        }
    });

}
QquadraticCurve.prototype.paintQuadraticCurve = function(obj) {
    //注：this是主类的上下文 

    this.qanimation.createAnimation(obj);

    var start = this.isFun(obj.start) ? obj.start() : obj.start;
    var handler = this.isFun(obj.handler) ? obj.handler() : obj.handler;
    var end = this.isFun(obj.end) ? obj.end() : obj.end;

    this.context.strokeStyle = obj.color;
    this.context.beginPath();
    this.context.lineWidth = obj.width;

    var drawLine = function() {
        this.context.moveTo(start[0], start[1]);
        this.context.quadraticCurveTo(handler[0], handler[1], end[0], end[1]);
        this.context.stroke();
    }

    switch (obj.like) {
        case '-':
            drawLine.call(this)
            break;
        case '--':

            this.context.setLineDash([3]);
            drawLine.call(this)

            //可能路径是虚线形式的 设置成实线
            this.context.setLineDash([]);


            break;
        case '->':
            drawLine.call(this)

            //可能路径是虚线形式的 设置成实线
            this.context.setLineDash([]);

            obj.drawArrow(handler[0], handler[1], end[0], end[1], 30, 10, 1, obj.color)

            break;
        case '<-':
            drawLine.call(this)

            //可能路径是虚线形式的 设置成实线
            this.context.setLineDash([]);

            obj.drawArrow(handler[0], handler[1], start[0], start[1], 30, 10, 1, obj.color)

            break;
        case '<->':
            drawLine.call(this)

            //可能路径是虚线形式的 设置成实线
            this.context.setLineDash([]);

            obj.drawArrow(handler[0], handler[1], end[0], end[1], 30, 10, 1, obj.color);
            obj.drawArrow(handler[0], handler[1], start[0], start[1], 30, 10, 1, obj.color);


            break;
        case '-->':

            this.context.setLineDash([3]);
            drawLine.call(this)


            //可能路径是虚线形式的 设置成实线
            this.context.setLineDash([]);

            obj.drawArrow(handler[0], handler[1], end[0], end[1], 30, 10, 1, obj.color);

            break;
        case '<--':

            this.context.setLineDash([3]);
            drawLine.call(this)


            //可能路径是虚线形式的 设置成实线
            this.context.setLineDash([]);

            obj.drawArrow(handler[0], handler[1], start[0], start[1], 30, 10, 1, obj.color);

            break;
        case '<-->':

            this.context.setLineDash([3]);
            drawLine.call(this)

            //可能路径是虚线形式的 设置成实线
            this.context.setLineDash([]);

            obj.drawArrow(handler[0], handler[1], end[0], end[1], 30, 10, 1, obj.color);
            obj.drawArrow(handler[0], handler[1], start[0], start[1], 30, 10, 1, obj.color);

            break;
    }







    //需要响应事件
    //影子画布上需要再画一份
    if (obj.pointerEvent == 'auto') {
        this.shadowContext.strokeStyle = obj.shadowFillColor;
        this.shadowContext.beginPath();
        this.shadowContext.lineWidth = 20;


        this.shadowContext.moveTo(start[0], start[1]);
        this.shadowContext.quadraticCurveTo(handler[0], handler[1], end[0], end[1]);
        this.shadowContext.stroke();
    }



}
//分离携带的文字	
QquadraticCurve.prototype.splitText = function(canvas_context,obj) {

 
    var tmp = canvas_context.text({
        TYPE: 'text',
        text: obj.withText,
        color: obj.color,
        withTextAlign: obj.withTextAlign ? obj.withTextAlign : 'center',
        start: function() { return obj.centerPoints() },
        pointerEvent: 'none'
    });
    obj.withTextId = tmp.id;
}



/**
 * 三次贝塞尔曲线类
 */
function QbezierCurve(prototype){
	 //主类原型中的方法全部引用过来 放到本实例的原型上
    //都引用过来的原因是 一些通用的方法 可以直接用this.调用
    for (var i in prototype) {
        QbezierCurve.prototype[i] = prototype[i];
    }
}

QbezierCurve.prototype.bezierCurve = function(options) {
    //注：this是主类的上下文 

	var _this = this;
	var OPTIONS = {
		TYPE:'bezierCurve',
		color:'#000',  //颜色
		like:'-',     //画出来的样子 [-][->][<->][--][-->][<-->]
		width:1,
		start:[50,50],
		handler1:[70,20],
		handler2:[100,80],
		end:[200,50],
		drag:true,
		pointerEvent:'auto',
		handlerShow:false,
		//withText:'text', //带着的文本
		//withTextAlign:'center'  //文本的横向位置 [left center(默认) right]
		centerPoints:function(){ //元素中心点相对于整个画布的坐标

			var start = _this.isFun(this.start)?this.start():this.start;
			var handler1 = _this.isFun(this.handler1)?this.handler1():this.handler1;
			var handler2 = _this.isFun(this.handler2)?this.handler2():this.handler2;

			var end = _this.isFun(this.end)?this.end():this.end;

			var center1 = [
				(handler1[0] < start[0] ? handler1[0]:start[0])+Math.abs(handler1[0]-start[0]) * 0.5,
				(handler1[1] < start[1] ? handler1[1]:start[1])+Math.abs(handler1[1]-start[1]) * 0.5
			]

			var center2 = [
				(handler2[0] < end[0] ? handler2[0]:end[0])+Math.abs(handler2[0]-end[0]) * 0.5,
				(handler2[1] < end[1] ? handler2[1]:end[1])+Math.abs(handler2[1]-end[1]) * 0.5
			]


			return [
				(center2[0] < center1[0] ? center2[0]:center1[0])+Math.abs(center2[0]-center1[0]) * 0.5,
				(center2[1] < center1[1] ? center2[1]:center1[1])+Math.abs(center2[1]-center1[1]) * 0.5
			]

		},
		downFun:function(e,position){ 

			//线的拖动要特殊处理 鼠标点击点距结束点的距离也得记录
			var start = _this.isFun(this.start)?this.start():this.start;
			var handler1 = _this.isFun(this.handler1)?this.handler1():this.handler1;
			var handler2 = _this.isFun(this.handler2)?this.handler2():this.handler2;

		 	var end = _this.isFun(this.end)?this.end():this.end; 
			this.dis = [
				position.x-start[0],
				position.y-start[1],
				position.x-handler1[0],
				position.y-handler1[1],
				position.x-handler2[0],
				position.y-handler2[1],
				position.x-end[0],
				position.y-end[1]
			]; 
		},
		moveFun:function(e,position){  //当配置drageRange时  开始限制坐标


			var dragIsBool = _this.isBool(this.drag);
					var dis  =this.dis;
					var start = _this.isFun(this.start)?this.start():this.start;
					var handler1 = _this.isFun(this.handler1)?this.handler1():this.handler1;
					var handler2 = _this.isFun(this.handler2)?this.handler2():this.handler2;

				 	var end = _this.isFun(this.end)?this.end():this.end;


 					
 					var x0,y0,x1,y1,x2,y2,x3,y3;
						 
						if(dragIsBool && this.drag){
							 x0 = position.x-dis[0];
							 y0 = position.y-dis[1];

							 x1 = position.x-dis[2];
							 y1 = position.y-dis[3];

							 x2 = position.x-dis[4];
							 y2 = position.y-dis[5];

							 x3 = position.x-dis[6];
							 y3 = position.y-dis[7];

						}else if(this.drag == 'vertical'){
							 x0 = start[0];
							 y0 = position.y-dis[1];
							 x1 = handler1[0];
							 y1 = position.y-dis[3];
							 x2 = handler2[0];
							 y2 = position.y-dis[5];
							 x3 = end[0];
							 y3 = position.y-dis[7];

						}else if(this.drag == 'horizontal'){
							 x0 = position.x-dis[0];
							 y0 = start[1];
							 x1 = position.x-dis[2];
							 y1 = handler1[1];
							 x2 = position.x-dis[4];
							 y2 = handler2[1];
							 x3 = position.x-dis[6];
							 y3 = end[1];

						} 
 

					 //如果创建时位置数据依赖于别的元素 那么一旦拖动该元素 数据的依赖关系就会断开 切记
					this.start = [x0,y0];
					this.handler1 = [x1,y1];
					this.handler2 = [x2,y2];
					this.end = [x3,y3] 


					this.handlerShow && (this.handlerObj1 !== null) && this.handlerObj1.setStart([x1,y1]);
					this.handlerShow && (this.handlerObj2 !== null) && this.handlerObj2.setStart([x2,y2]);



			},
			drawArrow: function(fromX, fromY, toX, toY,theta,headlen,width,color) {
				 
				    var theta = typeof(theta) != 'undefined' ? theta : 30;
				    var headlen = typeof(theta) != 'undefined' ? headlen : 10;
				    var width = typeof(width) != 'undefined' ? width : 1;
				    var color = typeof(color) != 'color' ? color : '#000';
				 
				    // 计算各角度和对应的P2,P3坐标
				    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI;
				    var angle1 = (angle + theta) * Math.PI / 180;
				    var angle2 = (angle - theta) * Math.PI / 180;
				    var topX = headlen * Math.cos(angle1);
				    var topY = headlen * Math.sin(angle1);
				    var botX = headlen * Math.cos(angle2);
				    var botY = headlen * Math.sin(angle2);
				 
				    // this.qcanvas.context.save();
				    // this.qcanvas.context.beginPath();
				 
				    var arrowX = fromX - topX;
				    var arrowY = fromY - topY;
				 		// this.qcanvas.context.beginPath();
				  	// 	this.qcanvas.context.setLineDash([]); 


				    arrowX = toX + topX;
				    arrowY = toY + topY;
				    // this.qcanvas.context.moveTo(arrowX, arrowY);
				    // this.qcanvas.context.lineTo(toX, toY);
				    var arrow2X = toX + botX;
				    var arrow2Y = toY + botY;
				    // this.qcanvas.context.lineTo(arrow2X, arrow2Y);
				    // this.qcanvas.context.strokeStyle = color;
				    // this.qcanvas.context.lineWidth = width;
				    // this.qcanvas.context.stroke();

				    _this.qline.paintLine.call(_this,{
						    	like:'-',
								start:[arrowX, arrowY],
								end:[toX, toY],
								width:width,
								color:color,
								pointerEvent:'none'

				    })

				    _this.qline.paintLine.call(_this,{
						    	like:'-',
								start:[toX, toY],
								end:[arrow2X,arrow2Y],
								width:width,
								color:color,
								pointerEvent:'none'
				    }) 
				}
	}

	this.extend(OPTIONS,options);		
	this.appendSetFun(OPTIONS);

	//分离文字
	if(typeof OPTIONS.withText !='undefined' && OPTIONS.withText!=''){
		
		this.qbezierCurve.splitText(this,OPTIONS);
			
	}
	//显示控制点
	OPTIONS.handlerShow && this.qbezierCurve.drawHandler.call(this,OPTIONS);
	

	return OPTIONS;
};

QbezierCurve.prototype.drawHandler = function(obj){
	var _this = this;
	var handler1 = _this.isFun(obj.handler1)?obj.handler1():obj.handler1;
	var handler2 = _this.isFun(obj.handler2)?obj.handler2():obj.handler2;
	


	obj.handlerObj1 = this.qarc.arc.call(this,{
		start:handler1, 
		sAngle:0,
		eAngle:360,
		fillColor:'blue',
		opacity:0.2,
		r:8, 
		borderColor:'#ccc',
		mousemove:function(){
			if(_this.dragAim !== null){
				obj.handler1 = this.start;
			}
		}
	});	 

	obj.handlerObj2 = this.qarc.arc.call(this,{
		start:handler2, 
		sAngle:0,
		eAngle:360,
		fillColor:'blue',
		opacity:0.2,
		r:8, 
		borderColor:'#ccc',
		mousemove:function(){
			if(_this.dragAim !== null){
				obj.handler2 = this.start;
			}
		}
	});	 





}
QbezierCurve.prototype.paintBezierCurve = function(obj) {
	this.qanimation.createAnimation(obj);
 
	var start = this.isFun(obj.start)?obj.start():obj.start;
	var handler1 = this.isFun(obj.handler1)?obj.handler1():obj.handler1;
	var handler2 = this.isFun(obj.handler2)?obj.handler2():obj.handler2;
	var end = this.isFun(obj.end)?obj.end():obj.end;

	this.context.strokeStyle = obj.color;
	this.context.beginPath();
	this.context.lineWidth = obj.width;
	var drawLine = function(){
		this.context.moveTo(start[0],start[1]); 
		this.context.bezierCurveTo(handler1[0],handler1[1],handler2[0],handler2[1], end[0],end[1]);
		this.context.stroke();
	}

	switch(obj.like)
	{
		case '-': 
			drawLine.call(this)
			break;
		case '--': 

			this.context.setLineDash([3]);
			drawLine.call(this)


			//可能路径是虚线形式的 设置成实线
			this.context.setLineDash([]);

 
			break;	
		case '->': 
			drawLine.call(this)

			 
			//可能路径是虚线形式的 设置成实线
			this.context.setLineDash([]);

			obj.drawArrow(handler2[0], handler2[1], end[0], end[1],30,10,1,obj.color)
			
			break;
		case '<-': 
			drawLine.call(this)
			 
			//可能路径是虚线形式的 设置成实线
			this.context.setLineDash([]);

			obj.drawArrow(handler1[0], handler1[1], start[0], start[1],30,10,1,obj.color)
			
			break;
		case '<->': 
			drawLine.call(this)
			

			//可能路径是虚线形式的 设置成实线
			this.context.setLineDash([]);

			obj.drawArrow(handler2[0], handler2[1], end[0], end[1],30,10,1,obj.color);
			obj.drawArrow(handler1[0], handler1[1],start[0], start[1],30,10,1,obj.color);
			
			
			break;
		case '-->': 

			this.context.setLineDash([3]);
			drawLine.call(this)


			//可能路径是虚线形式的 设置成实线
			this.context.setLineDash([]);
			
			obj.drawArrow(handler2[0], handler2[1], end[0], end[1],30,10,1,obj.color);

			break;
		case '<--': 

			this.context.setLineDash([3]);
			drawLine.call(this)


			//可能路径是虚线形式的 设置成实线
			this.context.setLineDash([]);
			
			obj.drawArrow(handler1[0], handler1[1], start[0], start[1],30,10,1,obj.color);

			break;
		case '<-->': 

			this.context.setLineDash([3]);
			drawLine.call(this)

			//可能路径是虚线形式的 设置成实线
			this.context.setLineDash([]);
 			
			obj.drawArrow(handler2[0], handler2[1], end[0], end[1],30,10,1,obj.color);
			obj.drawArrow(handler1[0], handler1[1],start[0], start[1],30,10,1,obj.color);

			break;

	}


	//需要响应事件
	//影子画布上需要再画一份
	if(obj.pointerEvent == 'auto'){ 
		this.shadowContext.strokeStyle = obj.shadowFillColor;
		this.shadowContext.beginPath();
		this.shadowContext.lineWidth = 20;

		
		this.shadowContext.moveTo(start[0],start[1]); 
		this.shadowContext.bezierCurveTo(handler1[0],handler1[1],handler2[0],handler2[1], end[0],end[1]);
		this.shadowContext.stroke();
	}


};

//分离携带的文字	
QbezierCurve.prototype.splitText = function(canvas_context,obj){
	

	var tmp = canvas_context.text.call(this,{
			TYPE:'text',
			text:obj.withText,
			color:obj.color,
			withTextAlign:obj.withTextAlign?obj.withTextAlign:'center',
			start:function(){return obj.centerPoints()},
			pointerEvent:'none'
	});
	obj.withTextId = tmp.id;
}





/*画线类*/
function Qline(prototype) {
    //主类原型中的方法全部引用过来 放到本实例的原型上
    //都引用过来的原因是 一些通用的方法 可以直接用this.调用
    for (var i in prototype) {
        Qline.prototype[i] = prototype[i];
    }
}

/*
四种形式的线 
参数对象
{
TYPE:'line',
start:[0,0],  //开始坐标
end:[50,50],  //结束坐标
color:'red',  //颜色
like:'-',     //画出来的样子 [-][->][--][-->]
width:1,			//线条宽度
withText:'text', //带着的文本
withTextAlign:'center'  //文本的横向位置 [left center(默认) right]
}
*/
Qline.prototype.line = function(options) {
    //注：this是主类的上下文 

    var _this = this;
    var OPTIONS = {
        TYPE: 'line',

        color: '#000', //颜色
        like: '-', //画出来的样子 [-][->][<->][--][-->][<-->]
        width: 1,
        start: [0, 0],
        end: [50, 50],
        drag: true,
        pointerEvent: 'auto',
        //withText:'text', //带着的文本
        //withTextAlign:'center'  //文本的横向位置 [left center(默认) right]
        centerPoints: function() { //元素中心点相对于整个画布的坐标

            var start = _this.isFun(this.start) ? this.start() : this.start;
            var end = _this.isFun(this.end) ? this.end() : this.end;

            return {
                x: (start[0] < end[0] ? start[0] : end[0]) + Math.abs(start[0] - end[0]) * 0.5,
                y: (start[1] < end[1] ? start[1] : end[1]) + Math.abs(start[1] - end[1]) * 0.5
            }
        },
        downFun: function(e, position) {
            //线的拖动要特殊处理 鼠标点击点距结束点的距离也得记录
            var start = _this.isFun(this.start) ? this.start() : this.start;
            var end = _this.isFun(this.end) ? this.end() : this.end;
            this.dis = [position.x - start[0], position.y - start[1], position.x - end[0], position.y - end[1]];
        },
        moveFun: function(e, position) { //当配置drageRange时  开始限制坐标


            var dragIsBool = _this.isBool(this.drag);
            var dis = this.dis;
            var start = _this.isFun(this.start) ? this.start() : this.start;
            var end = _this.isFun(this.end) ? this.end() : this.end;


            var x1, y1, x2, y2;

            if (dragIsBool && this.drag) {
                x1 = position.x - dis[0];
                y1 = position.y - dis[1];

                x2 = position.x - dis[2];
                y2 = position.y - dis[3];

            } else if (_this.dragAim.drag == 'vertical') {
                x1 = start[0];
                y1 = position.y - dis[1];
                x2 = end[0];
                y2 = position.y - dis[3];


            } else if (_this.dragAim.drag == 'horizontal') {
                x1 = position.x - dis[0];
                y1 = start[1];
                x2 = position.x - dis[2];
                y2 = end[1];

            }



            //如果创建时位置数据依赖于别的元素 那么一旦拖动该元素 数据的依赖关系就会断开 切记
            this.start = [x1, y1];
            this.end = [x2, y2]

        },
        drawArrow: function(fromX, fromY, toX, toY, theta, headlen, width, color) {

            var theta = typeof(theta) != 'undefined' ? theta : 30;
            var headlen = typeof(theta) != 'undefined' ? headlen : 10;
            var width = typeof(width) != 'undefined' ? width : 1;
            var color = typeof(color) != 'color' ? color : '#000';

            // 计算各角度和对应的P2,P3坐标
            var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI;
            var angle1 = (angle + theta) * Math.PI / 180;
            var angle2 = (angle - theta) * Math.PI / 180;
            var topX = headlen * Math.cos(angle1);
            var topY = headlen * Math.sin(angle1);
            var botX = headlen * Math.cos(angle2);
            var botY = headlen * Math.sin(angle2);

            // this.qcanvas.context.save();
            // this.qcanvas.context.beginPath();

            var arrowX = fromX - topX;
            var arrowY = fromY - topY;
            // this.qcanvas.context.beginPath();
            // 	this.qcanvas.context.setLineDash([]); 


            arrowX = toX + topX;
            arrowY = toY + topY;
            // this.qcanvas.context.moveTo(arrowX, arrowY);
            // this.qcanvas.context.lineTo(toX, toY);
            var arrow2X = toX + botX;
            var arrow2Y = toY + botY;
            // this.qcanvas.context.lineTo(arrow2X, arrow2Y);
            // this.qcanvas.context.strokeStyle = color;
            // this.qcanvas.context.lineWidth = width;
            // this.qcanvas.context.stroke();

            _this.qline.paintLine.call(_this, {
                like: '-',
                start: [arrowX, arrowY],
                end: [toX, toY],
                width: width,
                color: color,
                pointerEvent: 'none'

            })

            _this.qline.paintLine.call(_this, {
                like: '-',
                start: [toX, toY],
                end: [arrow2X, arrow2Y],
                width: width,
                color: color,
                pointerEvent: 'none'
            })

        }
    }

    this.extend(OPTIONS, options);
    this.appendSetFun(OPTIONS);

    //分离文字
    if (typeof OPTIONS.withText != 'undefined' && OPTIONS.withText != '') {

        this.qline.splitText(this, OPTIONS);

    }

    return OPTIONS;
}

Qline.prototype.getMiddleCoordinates = function(obj) {

    var start = this.isFun(obj.start) ? obj.start() : obj.start;
    var end = this.isFun(obj.end) ? obj.end() : obj.end;

    return [
        (start[0] < end[0] ? start[0] : end[0]) + Math.abs(start[0] - end[0]) * 0.5,
        (start[1] < end[1] ? start[1] : end[1]) + Math.abs(start[1] - end[1]) * 0.5,
    ];

}

//分离携带的文字	
Qline.prototype.splitText = function(canvas_context, obj) {
    var self = this;
    var tmp = canvas_context.text({
        TYPE: 'text',
        text: obj.withText,
        color: obj.color,
        withTextAlign: obj.withTextAlign ? obj.withTextAlign : 'center',
        start: function() { return self.getMiddleCoordinates.call(canvas_context, obj) },
        pointerEvent: 'none'
    });
    obj.withTextId = tmp.id;
}

Qline.prototype.paintLine = function(obj) {
    //注：this是主类的上下文

    // this.qcanvas.qanimation.createAnimation(obj);

    var start = this.isFun(obj.start) ? obj.start() : obj.start;
    var end = this.isFun(obj.end) ? obj.end() : obj.end;


    this.context.strokeStyle = obj.color;
    this.context.beginPath();
    this.context.lineWidth = obj.width;
    var drawLine = function() {
        this.context.moveTo(start[0], start[1]);
        this.context.lineTo(end[0], end[1]);
        this.context.stroke();
    }

    switch (obj.like) {
        case '-':
            drawLine.call(this)
            break;
        case '--':

            this.context.setLineDash([3]);
            drawLine.call(this)

            //可能路径是虚线形式的 设置成实线
            this.context.setLineDash([]);

            break;
        case '->':
            drawLine.call(this)

            //可能路径是虚线形式的 设置成实线
            this.context.setLineDash([]);

            obj.drawArrow(start[0], start[1], end[0], end[1], 30, 10, 1, obj.color)

            break;
        case '<-':
            drawLine.call(this)

            //可能路径是虚线形式的 设置成实线
            this.context.setLineDash([]);

            obj.drawArrow(end[0], end[1], start[0], start[1], 30, 10, 1, obj.color)

            break;
        case '<->':
            drawLine.call(this)

            //可能路径是虚线形式的 设置成实线
            this.context.setLineDash([]);

            obj.drawArrow(start[0], start[1], end[0], end[1], 30, 10, 1, obj.color);
            obj.drawArrow(end[0], end[1], start[0], start[1], 30, 10, 1, obj.color);


            break;
        case '-->':

            this.context.setLineDash([3]);
            drawLine.call(this)

            //可能路径是虚线形式的 设置成实线
            this.context.setLineDash([]);

            obj.drawArrow(start[0], start[1], end[0], end[1], 30, 10, 1, obj.color);
            break;
        case '<--':

            this.context.setLineDash([3]);
            drawLine.call(this)

            //可能路径是虚线形式的 设置成实线
            this.context.setLineDash([]);

            obj.drawArrow(end[0], end[1], start[0], start[1], 30, 10, 1, obj.color);
            break;
        case '<-->':

            this.context.setLineDash([3]);
            drawLine.call(this)

            //可能路径是虚线形式的 设置成实线
            this.context.setLineDash([]);

            obj.drawArrow(start[0], start[1], end[0], end[1], 30, 10, 1, obj.color);
            obj.drawArrow(end[0], end[1], start[0], start[1], 30, 10, 1, obj.color);

            break;
    }

    //需要响应事件
    //影子画布上需要再画一份
    if (obj.pointerEvent == 'auto') {

        this.shadowContext.strokeStyle = obj.shadowFillColor;
        this.shadowContext.lineWidth = 20;
        this.shadowContext.beginPath();
        this.shadowContext.moveTo(start[0], start[1]);
        this.shadowContext.lineTo(end[0], end[1]);
        this.shadowContext.stroke();

    }


}

/*文字类--------------------------------------------------------*/
function Qtext(prototype) {
    //主类原型中的方法全部引用过来 放到本实例的原型上
    //都引用过来的原因是 一些通用的方法 可以直接用this.调用
    for (var i in prototype) {
        Qtext.prototype[i] = prototype[i];
    }

}

Qtext.prototype.text = function(options) {
    //注：this是主类的上下文

    var _this = this;
    var OPTIONS = {
        TYPE: 'text',
        text: 'Qcanvas Text',
        color: 'red',
        textAlign: 'center',
        textBaseline: 'middle',
        lineHeight: '12px',
        fontSize: "12px",
        fontFamily: 'Microsoft YaHei',
        start: [0, 0],
        drag: true,
        dragRange: [], //限制拖动的区域 必须为两个坐标点[[左上角x,左上角y]，[右下角x,右下角y]]

        pointerEvent: 'auto',
        range: { width: 0, height: 0 },
        degree: 0,
        centerPoints: function() { //元素中心点相对于整个画布的坐标

            var x = 0;
            var y = 0;
            var start = _this.isFun(this.start) ? this.start() : this.start;


            if (this.textAlign == 'left') {
                x = this.range.width * 0.5 + start[0];

            } else if (this.textAlign == 'center') {
                x = start[0];
            } else if (this.textAlign == 'right') {
                x = start[0] - this.range.width * 0.5;
            }

            if (this.textBaseline == 'top') {
                y = this.range.height * 0.5 + start[1];
            } else if (this.textBaseline == 'middle') {
                y = start[1];
            } else if (this.textBaseline == 'bottom') {
                y = start[1] - this.range.height * 0.5;
            }

            return {
                x: x,
                y: y
            }
        },
        polyPoints: function() { //顶点坐标序列
            var half_x = this.range.width * 0.5;
            var half_y = this.range.height * 0.5;
            var center = this.centerPoints();

            var temp = 0;
            if (this.degree < 0) {
                temp = 360 + this.degree;
            } else {
                temp = this.degree;
            }


            if ((temp > 0 && temp <= 90) || (temp > 180 && temp <= 270)) {

                if (temp > 180) {
                    temp = temp - 180;
                }

                var E_x = center.x - Math.cos(temp * Math.PI / 180) * half_x;
                var E_y = center.y - Math.sin(temp * Math.PI / 180) * half_x;

                return [
                    { x: E_x + Math.sin(temp * Math.PI / 180) * half_y, y: E_y - Math.cos(temp * Math.PI / 180) * half_y },
                    { x: center.x - (E_x - Math.sin(temp * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y + Math.cos(temp * Math.PI / 180) * half_y) + center.y },
                    { x: center.x - (E_x + Math.sin(temp * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y - Math.cos(temp * Math.PI / 180) * half_y) + center.y },
                    { x: E_x - Math.sin(temp * Math.PI / 180) * half_y, y: E_y + Math.cos(temp * Math.PI / 180) * half_y },
                ];



            } else if ((temp > 90 && temp < 180) || (temp > 270 && temp < 360)) {

                if (temp > 270) {
                    temp = temp - 180;
                }

                temp = 180 - temp;
                var E_x = center.x + Math.cos(temp * Math.PI / 180) * half_x;
                var E_y = center.y - Math.sin(temp * Math.PI / 180) * half_x;


                return [
                    { x: E_x + Math.sin(temp * Math.PI / 180) * half_y, y: E_y + Math.cos(temp * Math.PI / 180) * half_y },
                    { x: center.x - (E_x - Math.sin(temp * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y - Math.cos(temp * Math.PI / 180) * half_y) + center.y },
                    { x: center.x - (E_x + Math.sin(temp * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y + Math.cos(temp * Math.PI / 180) * half_y) + center.y },
                    { x: E_x - Math.sin(temp * Math.PI / 180) * half_y, y: E_y - Math.cos(temp * Math.PI / 180) * half_y },
                ]




            } else {
                return [
                    { "x": center.x - half_x, "y": center.y - half_y },
                    { "x": center.x + half_x, "y": center.y - half_y },
                    { "x": center.x + half_x, "y": center.y + half_y },
                    { "x": center.x - half_x, "y": center.y + half_y }
                ]
            }


        },
        downFun: function(e, position) {
            var start = _this.isFun(this.start) ? this.start() : this.start;
            this.dis = [position.x - start[0], position.y - start[1]];
        },
        moveFun: function(e, position) { //当配置drageRange时  开始限制坐标

            var dragIsBool = _this.isBool(this.drag);
            var dis = this.dis;
            var start = _this.isFun(this.start) ? this.start() : this.start;
            var range = _this.isFun(this.dragRange) ? this.dragRange() : this.dragRange;

            var x, y;
            if (dragIsBool && this.drag) {
                x = position.x - dis[0];
                y = position.y - dis[1];

                if (range.length == 2) {
                    x = x >= range[1][0] ? range[1][0] : x;
                    x = x <= range[0][0] ? range[0][0] : x;

                    y = y >= range[1][1] ? range[1][1] : y;
                    y = y <= range[0][1] ? range[0][1] : y;
                }

            } else if (this.drag == 'vertical') {
                x = this.start[0];
                y = position.y - dis[1];


                if (range.length == 2) {

                    y = y >= range[1][1] ? range[1][1] : y;
                    y = y <= range[0][1] ? range[0][1] : y;
                }


            } else if (this.drag == 'horizontal') {
                x = position.x - dis[0];
                y = this.start[1];


                if (range.length == 2) {
                    x = x >= range[1][0] ? range[1][0] : x;
                    x = x <= range[0][0] ? range[0][0] : x;
                }
            }
            //如果创建时位置数据依赖于别的元素 那么一旦拖动该元素 数据的依赖关系就会断开 切记
            this.start = [x, y];
        },
        formatText: function(obj) { //处理多行文本
            var text = _this.isFun(obj.text) ? obj.text() : obj.text;
            var t;
            if ((text + '').indexOf('\n') > -1) {
                t = text.split('\n');
            } else {

                t = [text];
            }

            //计算每行的宽度
            var w = [];
            t.forEach(function(item) {
                w.push(_this.context.measureText(item).width);
            })

            return {
                text: t,
                width: w
            }
        }
    }

    this.extend(OPTIONS, options);
    this.appendSetFun(OPTIONS);

    return OPTIONS;
}

Qtext.prototype.paintText = function(obj) {
    //注：this是主类的上下文

    var _this = this;
    var textArr = obj.formatText(obj);

    obj.range = {
        // width:this.qcanvas.context.measureText(this.qcanvas.isFun(obj.text)?obj.text():obj.text).width,
        //    height:parseInt(obj.fontSize),
        width: Math.max.apply(null, textArr.width),
        height: parseInt(obj.lineHeight) * textArr.text.length
    };

    //设置字体颜色
    this.context.fillStyle = obj.color;

    //可能路径是虚线形式的 设置成实线
    this.context.setLineDash([]);

    var start = this.isFun(obj.start) ? obj.start() : obj.start;
    this.context.textBaseline = obj.textBaseline;
    this.context.font = obj.fontSize + ' ' + obj.fontFamily;
    this.context.textAlign = obj.textAlign;

    textArr.text.forEach(function(item, index) {
        _this.context.fillText(item, start[0], start[1] + parseInt(obj.lineHeight) * index);
    })

    //重置
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';

}


/*圆类--------------------*/
function Qarc(prototype) {
    //主类原型中的方法全部引用过来 放到本实例的原型上
    //都引用过来的原因是 一些通用的方法 可以直接用this.调用
    for (var i in prototype) {
        Qarc.prototype[i] = prototype[i];
    }
}

Qarc.prototype.arc = function(options) {
    //注：this是主类的上下文

    var _this = this;
    var OPTIONS = {
        TYPE: 'arc',
        lineWidth: 1,
        borderColor: '#000',
        fillColor: 'red',
        start: [0, 0],
        r: 20,
        sAngle: 0,
        eAngle: 0,
        counterclockwise: false,
        drag: true,
        dragRange: [], //限制拖动的区域 必须为两个坐标点[[左上角x,左上角y]，[右下角x,右下角y]]
        pointerEvent: 'auto',
        like: '-',
        downFun: function(e, position) {
            var start = _this.isFun(this.start) ? this.start() : this.start;
            this.dis = [position.x - start[0], position.y - start[1]];
        },
        moveFun: function(e, position) { //当配置drageRange时  开始限制坐标

            var dragIsBool = _this.isBool(this.drag);
            var dis = this.dis;
            var start = _this.isFun(this.start) ? this.start() : this.start;
            var range = _this.isFun(this.dragRange) ? this.dragRange() : this.dragRange;


            var x, y;
            if (dragIsBool && this.drag) {
                x = position.x - dis[0];
                y = position.y - dis[1];

                if (range.length == 2) {
                    x = x >= range[1][0] ? range[1][0] : x;
                    x = x <= range[0][0] ? range[0][0] : x;

                    y = y >= range[1][1] ? range[1][1] : y;
                    y = y <= range[0][1] ? range[0][1] : y;
                }

            } else if (this.drag == 'vertical') {
                x = this.start[0];
                y = position.y - dis[1];


                if (range.length == 2) {

                    y = y >= range[1][1] ? range[1][1] : y;
                    y = y <= range[0][1] ? range[0][1] : y;
                }


            } else if (this.drag == 'horizontal') {
                x = position.x - dis[0];
                y = this.start[1];


                if (range.length == 2) {
                    x = x >= range[1][0] ? range[1][0] : x;
                    x = x <= range[0][0] ? range[0][0] : x;
                }
            }
            //如果创建时位置数据依赖于别的元素 那么一旦拖动该元素 数据的依赖关系就会断开 切记
            this.start = [x, y];
        }
    }

    this.extend(OPTIONS, options);
    this.appendSetFun(OPTIONS);

    return OPTIONS;
}

Qarc.prototype.paintArc = function(obj) {
    //注：this是主类的上下文

    if (obj.like == '--') {
        this.context.setLineDash([3]);
    }

    var unit = Math.PI / 180;
    // this.qanimation.createAnimation(obj);
    this.context.beginPath();
    this.context.lineWidth = obj.lineWidth;
    this.context.strokeStyle = obj.borderColor;
    var start = this.isFun(obj.start) ? obj.start() : obj.start;
    this.context.arc(start[0], start[1], obj.r, obj.sAngle * unit, obj.eAngle * unit);

    this.context.stroke();

    var rgb = this.colorRgb(obj.fillColor).replace('RGB(', '').replace(')', '');

    (obj.fillColor != '') &&
    (obj.opacity && (this.context.fillStyle = "rgba(" + rgb + ',' + obj.opacity + ")") ||
        (this.context.fillStyle = obj.fillColor)) &&
    this.context.fill();

    this.context.setLineDash([]);


    //需要响应事件
    //影子画布上需要再画一份
    if (obj.pointerEvent == 'auto') {

        this.shadowContext.strokeStyle = obj.shadowFillColor;
        this.shadowContext.lineWidth = 1;

        this.shadowContext.beginPath();
        this.shadowContext.arc(start[0], start[1], obj.r, obj.sAngle * unit, obj.eAngle * unit);
        this.shadowContext.stroke();
        this.shadowContext.fillStyle = obj.shadowFillColor;
        this.shadowContext.fill();

    }
}



/*正多边形类----------------*/
function Qpolygon(prototype) {
    //主类原型中的方法全部引用过来 放到本实例的原型上
    //都引用过来的原因是 一些通用的方法 可以直接用this.调用
    for (var i in prototype) {
        Qpolygon.prototype[i] = prototype[i];
    }
}
Qpolygon.prototype.polygon = function(options) {
    //注：this是主类的上下文

    var _this = this;
    var OPTIONS = {
        TYPE: 'polygon',
        lineWidth: 1,
        borderColor: '#000',
        fillColor: 'red',
        start: [0, 0],
        r: 20,
        num: 4,
        drag: true,
        dragRange: [],
        opacity: 1,
        pointerEvent: 'auto',
        downFun: function(e, position) {
            var start = _this.isFun(this.start) ? this.start() : this.start;
            this.dis = [position.x - start[0], position.y - start[1]];
        },
        moveFun: function(e, position) { //当配置drageRange时  开始限制坐标

            var dragIsBool = _this.isBool(this.drag);
            var dis = this.dis;
            var start = _this.isFun(this.start) ? this.start() : this.start;
            var range = _this.isFun(this.dragRange) ? this.dragRange() : this.dragRange;


            var x, y;
            if (dragIsBool && this.drag) {
                x = position.x - dis[0];
                y = position.y - dis[1];

                if (range.length == 2) {
                    x = x >= range[1][0] ? range[1][0] : x;
                    x = x <= range[0][0] ? range[0][0] : x;

                    y = y >= range[1][1] ? range[1][1] : y;
                    y = y <= range[0][1] ? range[0][1] : y;
                }

            } else if (this.drag == 'vertical') {
                x = this.start[0];
                y = position.y - dis[1];


                if (range.length == 2) {

                    y = y >= range[1][1] ? range[1][1] : y;
                    y = y <= range[0][1] ? range[0][1] : y;
                }


            } else if (this.drag == 'horizontal') {
                x = position.x - dis[0];
                y = this.start[1];


                if (range.length == 2) {
                    x = x >= range[1][0] ? range[1][0] : x;
                    x = x <= range[0][0] ? range[0][0] : x;
                }
            }
            //如果创建时位置数据依赖于别的元素 那么一旦拖动该元素 数据的依赖关系就会断开 切记
            this.start = [x, y];
        }
    }

    this.extend(OPTIONS, options);
    this.appendSetFun(OPTIONS);

    return OPTIONS;
}

Qpolygon.prototype.paintPolygon = function(obj) {
    //注：this是主类的上下文

    var ctx = this.context;

    var x = obj && obj.start[0] || 0; //中心点x坐标
    var y = obj && obj.start[1] || 0; //中心点y坐标
    var num = obj && obj.num || 3; //图形边的个数
    var r = obj && obj.r || 100; //图形的半径
    var width = obj && obj.lineWidth || 1;
    var strokeStyle = obj && obj.borderColor;
    var fillStyle = obj && obj.fillColor;
    var opacity = obj && obj.opacity;
    //开始路径
    ctx.beginPath();
    var points = [];
    var startX = x + r * Math.cos(2 * Math.PI * 0 / num);
    var startY = y + r * Math.sin(2 * Math.PI * 0 / num);
    ctx.moveTo(startX, startY);
    points.push({ x: startX, y: startY });
    for (var i = 1; i <= num; i++) {
        var newX = x + r * Math.cos(2 * Math.PI * i / num);
        var newY = y + r * Math.sin(2 * Math.PI * i / num);
        ctx.lineTo(newX, newY);
        points.push({ x: newX, y: newY });
    }
    ctx.closePath();


    //顶点坐标序列 用于点击时目标元素的判断
    obj.polyPoints = function() {
        return points;
    }



    //路径闭合
    if (strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = width;
        ctx.lineJoin = 'round';
        ctx.stroke();
    }
    if (fillStyle) {

        var rgb = this.colorRgb(fillStyle).replace('RGB(', '').replace(')', '');

        ctx.fillStyle = "rgba(" + rgb + ',' + obj.opacity + ")";


        ctx.fill();
    }
}

/*不规则图形类*/
function Qshape(prototype) {
    //主类原型中的方法全部引用过来 放到本实例的原型上
    //都引用过来的原因是 一些通用的方法 可以直接用this.调用
    for (var i in prototype) {
        Qshape.prototype[i] = prototype[i];
    }
}

Qshape.prototype.shape = function(options) {
    //注：this是主类的上下文

    var _this = this;
    var OPTIONS = {
        TYPE: 'shape',
        fillColor: '#666',
        points: [
            [310, 20],
            [556, 100],
            [530, 191],
            [350, 180]
        ],
        drag: true,
        pointerEvent: 'auto',
        polyPoints: function() { //顶点坐标序列

            var temp = [];
            var points = _this.isFun(this.points) ? this.points() : this.points;
            points.forEach(function(v, index) {
                temp.push({
                    "x": v[0],
                    "y": v[1]
                })
            })

            return temp;

        },
        downFun: function(e, position) {
            var _self = this;
            this.dis = [];
            var points = _this.isFun(this.points) ? this.points() : this.points;
            points.forEach(function(v, index) {
                _self.dis.push([
                    position.x - points[index][0],
                    position.y - points[index][1]
                ])
            })
        },
        moveFun: function(e, position) {
            var dragIsBool = _this.isBool(this.drag);
            var dis = this.dis;
            var points = _this.isFun(this.points) ? this.points() : this.points;
            points.forEach(function(v, index) {
                points[index][0] = position.x - dis[index][0];
                points[index][1] = position.y - dis[index][1];

            })

            if (dragIsBool && this.drag) {
                points.forEach(function(v, index) {
                    points[index][0] = position.x - dis[index][0];
                    points[index][1] = position.y - dis[index][1];

                })
            } else if (this.drag == 'vertical') {
                points.forEach(function(v, index) {
                    // points[index][0] = position.x- dis[index][0];
                    points[index][1] = position.y - dis[index][1];

                })

            } else if (this.drag == 'horizontal') {
                points.forEach(function(v, index) {
                    points[index][0] = position.x - dis[index][0];
                    // points[index][1] = position.y- dis[index][1];

                })
            }


            this.points = points;
        }

    }

    this.extend(OPTIONS, options);
    this.appendSetFun(OPTIONS);

    return OPTIONS;
}

Qshape.prototype.paintShape = function(obj) {
    //注：this是主类的上下文

    this.context.lineWidth = 1;
    this.context.strokeStyle = "#000";
    this.context.beginPath();

    var _this = this;
    var points = this.isFun(obj.points) ? obj.points() : obj.points;
    points.forEach(function(v, index) {
        if (index == 0) {
            _this.context.moveTo(v[0], v[1]);
        } else {
            _this.context.lineTo(v[0], v[1]);
        }
    })


    //先关闭绘制路径。注意，此时将会使用直线连接当前端点和起始端点。
    this.context.closePath();
    this.context.stroke();

    var rgb = this.colorRgb(obj.fillColor).replace('RGB(', '').replace(')', '');

    (obj.fillColor != '') &&
    (obj.opacity && (this.context.fillStyle = "rgba(" + rgb + ',' + obj.opacity + ")") ||
        (this.context.fillStyle = obj.fillColor)) &&
    this.context.fill();
}



/*画图片类*/
function Qimg(prototype) {
    //主类原型中的方法全部引用过来 放到本实例的原型上
    //都引用过来的原因是 一些通用的方法 可以直接用this.调用
    for (var i in prototype) {
        Qimg.prototype[i] = prototype[i];
    }

}

Qimg.prototype.sourcePosition = function(pic, w, h) {

    //原图及目标区域的宽高比
    var sourceRate = pic.width / pic.height;
    var targetRate = w / h;
    var x, y, w, h;

    if (sourceRate >= targetRate) {
        h = pic.height;
        w = targetRate * pic.height;
        y = 0;
        x = (pic.width - w) * 0.5;
    } else {
        w = pic.width;
        h = pic.width / targetRate;
        x = 0;
        y = (pic.height - h) * 0.5;

    }

    return {
        sStart: [x, y],
        sWidth: w,
        sHeight: h,
        sourceRate: sourceRate,
        targetRate: targetRate
    }


}

Qimg.prototype.img = function(options) {
    //注：this是主类的上下文

    var _this = this;
    var OPTIONS = {
        TYPE: 'img',
        img: {},
        size: "",
        drag: true,
        pointerEvent: 'auto',
        degree: 0,
        /*sStart:[0,0],
        sWidth:options.width,
        sHeight:options.height,
        tStart:[0,0],
        tWidth:options.width,
        tHeight:options.height,*/
        centerPoints: function() { //元素中心点相对于整个画布的坐标
            var tStart = _this.isFun(this.tStart) ? this.tStart() : this.tStart;

            return {
                x: tStart[0] + this.tWidth * 0.5,
                y: tStart[1] + this.tHeight * 0.5
            }

        },
        polyPoints: function() { //顶点坐标序列 
            var tStart = _this.isFun(this.tStart) ? this.tStart() : this.tStart;


            var half_x = this.tWidth * 0.5;
            var half_y = this.tHeight * 0.5;
            var center = this.centerPoints();


            var temp = 0;
            if (this.degree < 0) {
                temp = 360 + this.degree;
            } else {
                temp = this.degree;
            }


            if ((temp > 0 && temp <= 90) || (temp > 180 && temp <= 270)) {

                if (temp > 180) {
                    temp = temp - 180;
                }

                var E_x = center.x - Math.cos(temp * Math.PI / 180) * half_x;
                var E_y = center.y - Math.sin(temp * Math.PI / 180) * half_x;

                return [
                    { x: E_x - Math.sin(temp * Math.PI / 180) * half_y, y: E_y + Math.cos(temp * Math.PI / 180) * half_y },
                    { x: E_x + Math.sin(temp * Math.PI / 180) * half_y, y: E_y - Math.cos(temp * Math.PI / 180) * half_y },
                    { x: center.x - (E_x - Math.sin(temp * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y + Math.cos(temp * Math.PI / 180) * half_y) + center.y },
                    { x: center.x - (E_x + Math.sin(temp * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y - Math.cos(temp * Math.PI / 180) * half_y) + center.y }
                ];



            } else if ((temp > 90 && temp < 180) || (temp > 270 && temp < 360)) {

                if (temp > 270) {
                    temp = temp - 180;
                }

                temp = 180 - temp;
                var E_x = center.x + Math.cos(temp * Math.PI / 180) * half_x;
                var E_y = center.y - Math.sin(temp * Math.PI / 180) * half_x;


                return [
                    { x: E_x - Math.sin(temp * Math.PI / 180) * half_y, y: E_y - Math.cos(temp * Math.PI / 180) * half_y },
                    { x: E_x + Math.sin(temp * Math.PI / 180) * half_y, y: E_y + Math.cos(temp * Math.PI / 180) * half_y },
                    { x: center.x - (E_x - Math.sin(temp * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y - Math.cos(temp * Math.PI / 180) * half_y) + center.y },
                    { x: center.x - (E_x + Math.sin(temp * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y + Math.cos(temp * Math.PI / 180) * half_y) + center.y }
                ]




            } else {

                return [
                    { "x": tStart[0], "y": tStart[1] },
                    { "x": tStart[0] + this.tWidth, "y": tStart[1] },
                    { "x": tStart[0] + this.tWidth, "y": tStart[1] + this.tHeight },
                    { "x": tStart[0], "y": tStart[1] + this.tHeight },
                ]
            }

        },
        downFun: function(e, position) {
            var tStart = _this.isFun(this.tStart) ? this.tStart() : this.tStart;
            this.dis = [position.x - tStart[0], position.y - tStart[1]];
        },
        moveFun: function(e, position) {
            var dragIsBool = _this.isBool(this.drag);
            var dis = this.dis;

            if (dragIsBool && this.drag) {
                this.tStart[0] = position.x - dis[0];
                this.tStart[1] = position.y - dis[1];
            } else if (this.drag == 'vertical') {
                this.tStart[1] = position.y - dis[1];

            } else if (this.drag == 'horizontal') {
                this.tStart[0] = position.x - dis[0];
            }
        }
    }

    //占位图替换掉options.img
    var tmp = '';
    if (this.isStr(options.img)) {
        tmp = options.img;
        options.img = this.placeHolderImg;
    }


    this.extend(OPTIONS, options);
    this.appendSetFun(OPTIONS);


    //如果指定的img参数是一个图片地址 则需要去加载 完成后替找掉OPTIONS.img
    if (tmp != '') {
        OPTIONS.sWidth = 1;
        OPTIONS.sHeight = 1;

        this.loadImgSource(tmp).then(function(img) {
            var img = img[0];
            OPTIONS.sWidth = img.width;
            OPTIONS.sHeight = img.height;
            OPTIONS.img = img;


            if (OPTIONS.size != '') {

                //重新计算sStart sWidth sHeight
                //全覆盖目标区域 图像的某些部分也许无法显示在目标区域中
                if (OPTIONS.size == 'cover') {
                    delete OPTIONS.sStart;
                    delete OPTIONS.sWidth;
                    delete OPTIONS.sHeight;


                    var sourceObj = _this.qimg.sourcePosition(OPTIONS.img, OPTIONS.tWidth, OPTIONS.tHeight);


                    OPTIONS.sStart = sourceObj.sStart;
                    OPTIONS.sWidth = sourceObj.sWidth;
                    OPTIONS.sHeight = sourceObj.sHeight;



                }


            }

        }, function() {
            console.log('加载资源失败')
        })

    }


    if (OPTIONS.size != '') {

        //重新计算sStart sWidth sHeight
        //全覆盖目标区域 图像的某些部分也许无法显示在目标区域中
        if (OPTIONS.size == 'cover') {
            delete OPTIONS.sStart;
            delete OPTIONS.sWidth;
            delete OPTIONS.sHeight;


            var sourceObj = _this.qimg.sourcePosition(OPTIONS.img, OPTIONS.tWidth, OPTIONS.tHeight);


            OPTIONS.sStart = sourceObj.sStart;
            OPTIONS.sWidth = sourceObj.sWidth;
            OPTIONS.sHeight = sourceObj.sHeight;



        }


    }

    return OPTIONS;
}
Qimg.prototype.paintImg = function(obj) {
    //注：this是主类的上下文

    var tStart = this.isFun(obj.tStart) ? obj.tStart() : obj.tStart;


    //有角度时 移动画布原点 旋转画布
    var centerPos = this.setDegree(obj);


    this.context.drawImage(obj.img, obj.sStart[0], obj.sStart[1], obj.sWidth, obj.sHeight, tStart[0], tStart[1], obj.tWidth, obj.tHeight);


    // //重置画布原点 旋转复原
    this.resetDegree(obj, centerPos);
}


/*精灵类-------------------------*/
function Qspirit(prototype) {
    //主类原型中的方法全部引用过来 放到本实例的原型上
    //都引用过来的原因是 一些通用的方法 可以直接用this.调用
    for (var i in prototype) {
        Qspirit.prototype[i] = prototype[i];
    }
}
Qspirit.prototype.spirit = function(options) {
    //注：this是主类的上下文

    var _this = this;
    var OPTIONS = {
        TYPE: 'spirit',
        stop: function() { this.isLoop = false },
        play: function() { this.isLoop = true },
        drag: true,
        pointerEvent: 'auto',
        degree: 0,

        /*img:{},
        row:0,
        column:0,
        frameIndex:[],
        isLoop:true,
        during:2*/
        centerPoints: function() { //元素中心点相对于整个画布的坐标

            return {
                x: this.tStart[0] + this.tWidth * 0.5,
                y: this.tStart[1] + this.tHeight * 0.5
            }

        },
        polyPoints: function() { //顶点坐标序列

            var half_x = this.tWidth * 0.5;
            var half_y = this.tHeight * 0.5;
            var center = this.centerPoints();


            var temp = 0;
            if (this.degree < 0) {
                temp = 360 + this.degree;
            } else {
                temp = this.degree;
            }


            if ((temp > 0 && temp <= 90) || (temp > 180 && temp <= 270)) {

                if (temp > 180) {
                    temp = temp - 180;
                }

                var E_x = center.x - Math.cos(temp * Math.PI / 180) * half_x;
                var E_y = center.y - Math.sin(temp * Math.PI / 180) * half_x;

                return [
                    { x: E_x - Math.sin(temp * Math.PI / 180) * half_y, y: E_y + Math.cos(temp * Math.PI / 180) * half_y },
                    { x: E_x + Math.sin(temp * Math.PI / 180) * half_y, y: E_y - Math.cos(temp * Math.PI / 180) * half_y },
                    { x: center.x - (E_x - Math.sin(temp * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y + Math.cos(temp * Math.PI / 180) * half_y) + center.y },
                    { x: center.x - (E_x + Math.sin(temp * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y - Math.cos(temp * Math.PI / 180) * half_y) + center.y }
                ];



            } else if ((temp > 90 && temp < 180) || (temp > 270 && temp < 360)) {

                if (temp > 270) {
                    temp = temp - 180;
                }

                temp = 180 - temp;
                var E_x = center.x + Math.cos(temp * Math.PI / 180) * half_x;
                var E_y = center.y - Math.sin(temp * Math.PI / 180) * half_x;


                return [
                    { x: E_x - Math.sin(temp * Math.PI / 180) * half_y, y: E_y - Math.cos(temp * Math.PI / 180) * half_y },
                    { x: E_x + Math.sin(temp * Math.PI / 180) * half_y, y: E_y + Math.cos(temp * Math.PI / 180) * half_y },
                    { x: center.x - (E_x - Math.sin(temp * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y - Math.cos(temp * Math.PI / 180) * half_y) + center.y },
                    { x: center.x - (E_x + Math.sin(temp * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y + Math.cos(temp * Math.PI / 180) * half_y) + center.y }
                ]




            } else {

                return [
                    { "x": this.tStart[0], "y": this.tStart[1] },
                    { "x": this.tStart[0] + this.tWidth, "y": this.tStart[1] },
                    { "x": this.tStart[0] + this.tWidth, "y": this.tStart[1] + this.tHeight },
                    { "x": this.tStart[0], "y": this.tStart[1] + this.tHeight },
                ];
            }
        },
        moveFrameIndex: function(obj) {
            obj.step = typeof obj.step != 'undefined' ? obj.step : 1; //控制方向  

            var step = obj.step;
            var max = obj.frames[obj.framesIndex[0]].length;

            obj.framesIndex[1] = obj.framesIndex[1] + step;
            obj.framesIndex[1] = obj.framesIndex[1] <= 0 ? 0 : obj.framesIndex[1];
            obj.framesIndex[1] = obj.framesIndex[1] >= max ? (max - 1) : obj.framesIndex[1];



            if (obj.isLoop) {

                if (obj.framesIndex[1] == (max - 1)) {
                    //obj.step=-1;
                    obj.framesIndex[1] = 0;
                }

                if (obj.framesIndex[1] == 0) {
                    obj.step = 1;
                }

            }
        },
        downFun: function(e, position) {
            var tStart = _this.isFun(this.tStart) ? this.tStart() : this.tStart;
            this.dis = [position.x - tStart[0], position.y - tStart[1]];
        },
        moveFun: function(e, position) {
            var dragIsBool = _this.isBool(this.drag);
            var dis = this.dis;

            if (dragIsBool && this.drag) {
                this.tStart[0] = position.x - dis[0];
                this.tStart[1] = position.y - dis[1];
            } else if (this.drag == 'vertical') {
                this.tStart[1] = position.y - dis[1];

            } else if (this.drag == 'horizontal') {
                this.tStart[0] = position.x - dis[0];
            }
        }


    }

    //占位图替换掉options.img
    var tmp = '';
    if (this.isStr(options.img)) {
        tmp = options.img;
        options.img = this.placeHolderImg;
    }

    this.extend(OPTIONS, options);
    this.appendSetFun(OPTIONS);

    //如果指定的img参数是一个图片地址 则需要去加载 完成后替找掉OPTIONS.img
    if (tmp != '') {

        this.load({ img: tmp }, function() {
            var img = _this.getSourceByName("img");

            OPTIONS.img = img;
            _this.qspirit.createFrames.call(_this, OPTIONS);

        })
    }

    this.qspirit.createFrames.call(this, OPTIONS);

    return OPTIONS;
}

Qspirit.prototype.createFrames = function(obj) {
    var frameWidth = obj.img.width / obj.column;
    var frameHeight = obj.img.height / obj.row;

    var framesCount = this.fps * obj.during;

    var num = 1;
    if (framesCount > obj.column) {
        num = Math.floor(framesCount / obj.column);
    }



    //生成二维坐标数组
    var frames = [];
    for (var i = 0; i < obj.row; i++) {
        frames[i] = [];
        for (var j = 0; j < obj.column; j++) {

            //为了控制速度 加入同样的序列帧
            for (var t = 0; t < num; t++) {
                frames[i].push([j * frameWidth, i * frameHeight]);
                //frames[i].push([i*frameHeight,j*frameWidth]);
            }

        }
    }

    obj.framesIndex = typeof obj.framesIndex == 'undefined' ? [0, 0] : obj.framesIndex;
    obj.frames = frames;
}

Qspirit.prototype.moveFrameIndex = function(obj) {

    obj.step = typeof obj.step != 'undefined' ? obj.step : 1; //控制方向  

    var step = obj.step;
    var max = obj.frames[obj.framesIndex[0]].length;

    obj.framesIndex[1] = obj.framesIndex[1] + step;
    obj.framesIndex[1] = obj.framesIndex[1] <= 0 ? 0 : obj.framesIndex[1];
    obj.framesIndex[1] = obj.framesIndex[1] >= max ? (max - 1) : obj.framesIndex[1];



    if (obj.isLoop) {

        if (obj.framesIndex[1] == (max - 1)) {
            //obj.step=-1;
            obj.framesIndex[1] = 0;
        }

        if (obj.framesIndex[1] == 0) {
            obj.step = 1;
        }

    }

}


Qspirit.prototype.paintSpirit = function(obj) {
    //注：this是主类的上下文

    // this.qcanvas.qanimation.createAnimation(obj);

    var moveFrameIndex = function(obj) {
        obj.step = typeof obj.step != 'undefined' ? obj.step : 1; //控制方向  

        var step = obj.step;
        var max = obj.frames[obj.framesIndex[0]].length;

        obj.framesIndex[1] = obj.framesIndex[1] + step;
        obj.framesIndex[1] = obj.framesIndex[1] <= 0 ? 0 : obj.framesIndex[1];
        obj.framesIndex[1] = obj.framesIndex[1] >= max ? (max - 1) : obj.framesIndex[1];



        if (obj.isLoop) {

            if (obj.framesIndex[1] == (max - 1)) {
                //obj.step=-1;
                obj.framesIndex[1] = 0;
            }

            if (obj.framesIndex[1] == 0) {
                obj.step = 1;
            }

        }
    }
    // this.moveFrameIndex(obj);
    obj.moveFrameIndex(obj);




    var sx = obj.frames[obj.framesIndex[0]][obj.framesIndex[1]][0];
    var sy = obj.frames[obj.framesIndex[0]][obj.framesIndex[1]][1];
    var sWidth = obj.img.width / obj.column; //obj.tWidth;
    var sHeight = obj.img.height / obj.row; //obj.tHeight;



    this.context.drawImage(obj.img, sx, sy, sWidth, sHeight, obj.tStart[0], obj.tStart[1], obj.tWidth, obj.tHeight);

}
/**
 * 矩形类
 */
function Qrect(prototype) {

    //主类原型中的方法全部引用过来 放到本实例的原型上
    //都引用过来的原因是 一些通用的方法 可以直接用this.调用
    for (var i in prototype) {
        Qrect.prototype[i] = prototype[i];
    }
}
Qrect.prototype.rect = function(options) {
    //注：this是主类的上下文 

    var _this = this;
    var OPTIONS = {
        TYPE: 'rect',
        lineWidth: 1,
        start: [0, 0],
        width: 100,
        height: 50,
        borderColor: '#000',
        fillColor: '',
        drag: true,
        dragRange: [],
        dashed: false,
        degree: 0,
        radius: 0,
        pointerEvent: 'auto',
        resize: false,
        rotate: false,
        centerPoints: function() { //元素中心点相对于整个画布的坐标
            var start = _this.isFun(this.start) ? this.start() : this.start;
            var width = _this.isFun(this.width) ? this.width() : this.width;
            var height = _this.isFun(this.height) ? this.height() : this.height;


            return {
                x: start[0] + width * 0.5,
                y: start[1] + height * 0.5
            }
        },
        polyPoints: function() { //顶点坐标序列
            var start = _this.isFun(this.start) ? this.start() : this.start;
            var width = _this.isFun(this.width) ? this.width() : this.width;
            var height = _this.isFun(this.height) ? this.height() : this.height;

            var half_x = width * 0.5;
            var half_y = height * 0.5;
            var center = this.centerPoints();


            var temp = 0;
            if (this.degree < 0) {
                temp = 360 + this.degree;
            } else {
                temp = this.degree;
            }


            if ((temp > 0 && temp <= 90) || (temp > 180 && temp <= 270)) {
                var acuteAngle = temp;
                if (acuteAngle > 180) {
                    acuteAngle = acuteAngle - 180;
                }

                var E_x = center.x - Math.cos(acuteAngle * Math.PI / 180) * half_x;
                var E_y = center.y - Math.sin(acuteAngle * Math.PI / 180) * half_x;

                //0~360内对应4个点的位置
                if(temp > 0 && temp <= 90){
                   return [
                        { x: E_x + Math.sin(acuteAngle * Math.PI / 180) * half_y, y: E_y - Math.cos(acuteAngle * Math.PI / 180) * half_y },
                        { x: center.x - (E_x - Math.sin(acuteAngle * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y + Math.cos(acuteAngle * Math.PI / 180) * half_y) + center.y },
                        { x: center.x - (E_x + Math.sin(acuteAngle * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y - Math.cos(acuteAngle * Math.PI / 180) * half_y) + center.y },
                        { x: E_x - Math.sin(acuteAngle * Math.PI / 180) * half_y, y: E_y + Math.cos(acuteAngle * Math.PI / 180) * half_y },
                    ]; 
                }

                if(temp > 180 && temp <= 270){
                     return [
                        { x: center.x - (E_x + Math.sin(acuteAngle * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y - Math.cos(acuteAngle * Math.PI / 180) * half_y) + center.y },
                        { x: E_x - Math.sin(acuteAngle * Math.PI / 180) * half_y, y: E_y + Math.cos(acuteAngle * Math.PI / 180) * half_y },
                        { x: E_x + Math.sin(acuteAngle * Math.PI / 180) * half_y, y: E_y - Math.cos(acuteAngle * Math.PI / 180) * half_y },
                        { x: center.x - (E_x - Math.sin(acuteAngle * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y + Math.cos(acuteAngle * Math.PI / 180) * half_y) + center.y },
                    ];
                }

               



            } else if ((temp > 90 && temp < 180) || (temp > 270 && temp < 360)) {
                var acuteAngle = temp;
                if (acuteAngle > 270) {
                    acuteAngle = acuteAngle - 180;
                }

                acuteAngle = 180 - acuteAngle;
                var E_x = center.x + Math.cos(acuteAngle * Math.PI / 180) * half_x;
                var E_y = center.y - Math.sin(acuteAngle * Math.PI / 180) * half_x;


                //0~360内对应4个点的位置
                if(temp > 90 && temp < 180){
                    return [
                        { x: E_x + Math.sin(acuteAngle * Math.PI / 180) * half_y, y: E_y + Math.cos(acuteAngle * Math.PI / 180) * half_y },
                        { x: center.x - (E_x - Math.sin(acuteAngle * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y - Math.cos(acuteAngle * Math.PI / 180) * half_y) + center.y },
                        { x: center.x - (E_x + Math.sin(acuteAngle * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y + Math.cos(acuteAngle * Math.PI / 180) * half_y) + center.y },
                        { x: E_x - Math.sin(acuteAngle * Math.PI / 180) * half_y, y: E_y - Math.cos(acuteAngle * Math.PI / 180) * half_y },
                    ]
                }

                if(temp > 270 && temp < 360){
                  return [
                      { x: center.x - (E_x + Math.sin(acuteAngle * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y + Math.cos(acuteAngle * Math.PI / 180) * half_y) + center.y },
                      { x: E_x - Math.sin(acuteAngle * Math.PI / 180) * half_y, y: E_y - Math.cos(acuteAngle * Math.PI / 180) * half_y },
                      { x: E_x + Math.sin(acuteAngle * Math.PI / 180) * half_y, y: E_y + Math.cos(acuteAngle * Math.PI / 180) * half_y },
                      { x: center.x - (E_x - Math.sin(acuteAngle * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y - Math.cos(acuteAngle * Math.PI / 180) * half_y) + center.y },
                  ]  
                }


                // return [
                //     { x: E_x + Math.sin(acuteAngle * Math.PI / 180) * half_y, y: E_y + Math.cos(acuteAngle * Math.PI / 180) * half_y },
                //     { x: center.x - (E_x - Math.sin(acuteAngle * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y - Math.cos(acuteAngle * Math.PI / 180) * half_y) + center.y },
                //     { x: center.x - (E_x + Math.sin(acuteAngle * Math.PI / 180) * half_y) + center.x, y: center.y - (E_y + Math.cos(acuteAngle * Math.PI / 180) * half_y) + center.y },
                //     { x: E_x - Math.sin(acuteAngle * Math.PI / 180) * half_y, y: E_y - Math.cos(acuteAngle * Math.PI / 180) * half_y },
                // ]




            } else {

                return [
                    { "x": start[0], "y": start[1] },
                    { "x": start[0] + width, "y": start[1] },
                    { "x": start[0] + width, "y": start[1] + height },
                    { "x": start[0], "y": start[1] + height },
                ]
            }

        },
        downFun: function(e, position) {
            var start = _this.isFun(this.start) ? this.start() : this.start;
            this.dis = [position.x - start[0], position.y - start[1]];

            if(this.resizeLayer){ //带缩放句柄的矩形 按下鼠标隐藏句柄
                // console.log('有句柄的矩形')
                this.resizeLayer.setDisplay('none');
            }

            if(this.rotateLayer){ //带角度句柄的矩形 按下鼠标隐藏句柄
                this.rotateLayer.setDisplay('none');
            }
        },
        moveFun: function(e, position) { //当配置drageRange时  开始限制坐标

            var dragIsBool = _this.isBool(this.drag);
            var dis = this.dis;
            var start = _this.isFun(this.start) ? this.start() : this.start;
            var range = _this.isFun(this.dragRange) ? this.dragRange() : this.dragRange;


            var x, y;
            if (dragIsBool && this.drag) {
                x = position.x - dis[0];
                y = position.y - dis[1];

                if (range.length == 2) {
                    x = x >= range[1][0] ? range[1][0] : x;
                    x = x <= range[0][0] ? range[0][0] : x;

                    y = y >= range[1][1] ? range[1][1] : y;
                    y = y <= range[0][1] ? range[0][1] : y;
                }

            } else if (this.drag == 'vertical') {
                x = this.start[0];
                y = position.y - dis[1];


                if (range.length == 2) {

                    y = y >= range[1][1] ? range[1][1] : y;
                    y = y <= range[0][1] ? range[0][1] : y;
                }


            } else if (this.drag == 'horizontal') {
                x = position.x - dis[0];
                y = this.start[1];


                if (range.length == 2) {
                    x = x >= range[1][0] ? range[1][0] : x;
                    x = x <= range[0][0] ? range[0][0] : x;
                }
            }
            //如果创建时位置数据依赖于别的元素 那么一旦拖动该元素 数据的依赖关系就会断开 切记
            this.start = [x, y];
        },
        upFun:function(e,position){

             if(this.resizeLayer){ //带缩放句柄的矩形 按下鼠标隐藏句柄
                // console.log('有句柄的矩形')

                //重置缩放句柄位置
                var point = this.polyPoints();
                this.resizeHandles[0].setDegree(this.degree).setStart([point[0].x - 5, point[0].y - 5]);
                this.resizeHandles[1].setDegree(this.degree).setStart([point[1].x - 5, point[1].y - 5]);
                this.resizeHandles[2].setDegree(this.degree).setStart([point[2].x - 5, point[2].y - 5]);
                this.resizeHandles[3].setDegree(this.degree).setStart([point[3].x - 5, point[3].y - 5]);

                this.refRect.setStart(this.start);
                this.resizeLayer.setDisplay('block');
            }


            if(this.rotateLayer){
                this.rotateLayer.setDisplay('block');

            }
        }
    }

    this.extend(OPTIONS, options);
    this.appendSetFun(OPTIONS);


    if(OPTIONS.resize){  //需要创建缩放句柄
        // console.log('需要创建缩放句柄')

        //创建的缩放句柄对象 参考矩形 都放到resizeLayer层上
        // 创建0角度的参考矩形 用于计算
        OPTIONS.resizeLayer = this.layer();
        OPTIONS.resizeLayer.push(this.qrect.drawResizeHandler(this,OPTIONS).concat([this.qrect.referenceRect(this,OPTIONS)]));

        // OPTIONS.resizeLayer.push(this.qrect.referenceRect(this,OPTIONS))
    }

    if(OPTIONS.rotate){ //需要创建方向句柄  
        // console.log('需要创建方向句柄')
        OPTIONS.rotateLayer = this.layer();
        OPTIONS.rotateLayer.push(this.qrect.drawRotateHandler(this,OPTIONS));
    }
    return OPTIONS;
}

Qrect.prototype.drawRotateHandler = function(qcanvas,rect){
    var line  = qcanvas.line({
            start:function(){
                var tmp = rect.centerPoints();
                return [tmp.x,tmp.y];
            },
            end:function(){

                //0度时的位置
                var x = rect.start[0]+rect.width *0.5;
                var y = rect.start[1] - 50;

                
                var c = rect.centerPoints();

                //按矩形的角度旋转
                var pos = qcanvas.getEndPointByRotate(
                    [x, y],
                    [c.x,c.y],
                    rect.degree * (Math.PI / 180)
                )

                return pos;
            },
            width:1,
            like:'--',
            pointerEvent: 'none',
        })
    var angleHandle = qcanvas.rect({
            start:function(){
                var tmp = line.end();
                return [tmp[0]-5,tmp[1]-5];
            },
            degree: rect.degree,
            width: 10,
            height: 10,
            borderColor: 'gray',
            fillColor: '',
            disCenter: 0, //距大矩形中心点距离 
            dragRange: [],
            drag:false,
            mousedown:function(e,pos){

                //角度控制句柄的起始位置 默认是null
                rect.angleHandleStart = this.centerPoints();


                rect.oldDegree = rect.degree;
                rect.resizeLayer && rect.resizeLayer.setDisplay('none');


                //在句柄上按下鼠标后 创建一个临时的rect（透明）的 和画布一样大小 
                //因为操作的动作要远远快于渲染的速度 那么鼠标就会划出该句柄 所以直接在这个rect执行的mousemove mouseup

                var tmp = qcanvas.rect({
                    start:[-10,-10],
                    width:qcanvas.stage.width+20,
                    height:qcanvas.stage.height+20, 
                    drag:false,
                    opacity:0,
                    mousemove:function(e,pos){
                        if(rect.angleHandleStart!==null){

                            var c = rect.centerPoints();
                            var angle = qcanvas.getRotateAngle([c.x,c.y], [rect.angleHandleStart.x,rect.angleHandleStart.y], [pos.x,pos.y])

                            if(parseInt(angle* 180 / Math.PI)== 89 || parseInt(angle* 180 / Math.PI)== -89){
                                rect.oldDegree = rect.degree;

                                //重置起始位置
                                rect.angleHandleStart = rect.angleHandle.centerPoints();
                                var angle = qcanvas.getRotateAngle([c.x,c.y], [rect.angleHandleStart.x,rect.angleHandleStart.y], [pos.x,pos.y])


                                rect.setDegree(rect.oldDegree+parseInt(angle* 180 / Math.PI));
                                rect.angleHandle.setDegree(rect.degree);

                            }else{

                                rect.setDegree(rect.oldDegree+parseInt(angle* 180 / Math.PI));

                                rect.angleHandle.setDegree(rect.degree);

                            }
                        }
                    },
                    mouseup:function(e,pos){
                        rect.angleHandleStart = null;

                        if(rect.resizeLayer){
                           //重置缩放句柄位置
                            var point = rect.polyPoints();
                            rect.resizeHandles[0].setDegree(rect.degree).setStart([point[0].x - 5, point[0].y - 5]);
                            rect.resizeHandles[1].setDegree(rect.degree).setStart([point[1].x - 5, point[1].y - 5]);
                            rect.resizeHandles[2].setDegree(rect.degree).setStart([point[2].x - 5, point[2].y - 5]);
                            rect.resizeHandles[3].setDegree(rect.degree).setStart([point[3].x - 5, point[3].y - 5]);

                            rect.resizeLayer && rect.resizeLayer.setDisplay('block');  
                        }

                        qcanvas.removeEle(tmp);
                    }
                })

            },
        })

    //记录角度句柄
    rect.angleHandle = angleHandle;

    return [line,angleHandle];
}

/**
 * 0角度的参考矩形  用于缩放计算
 * @return {[type]} [description]
 */
Qrect.prototype.referenceRect = function(qcanvas,rect){
    var start = this.isFun(rect.start)?rect.start():rect.start;
    var refRect = qcanvas.rect({
        start: start,
        width: rect.width,
        height: rect.height,
        borderColor: 'blue',
        pointerEvent: 'none',
        dashed: true,
        display: 'none',
        description:'矩形旋转计算时的0度参考对象 不用显示'
    })

    //把参考矩形记录下来
    rect.refRect = refRect;
    return refRect;

}

/**
 * 创建缩放句柄
 * @param  {[type]} qcanvas [description]
 * @param  {[type]} rect    [description]
 * @return {[type]}         [description]
 */
Qrect.prototype.drawResizeHandler = function(qcanvas,rect){
    var point = rect.polyPoints();
    var h1 = qcanvas.rect({
            start: [point[0].x - 5, point[0].y - 5],
            degree: rect.degree,
            width: 10,
            height: 10,
            borderColor: 'gray',
            fillColor: '',
            disCenter: 0, //距大矩形中心点距离 
            dragRange: [],
            mousedown: function() {

                //resizeLayer层级提高
                qcanvas.raiseToTop(rect.resizeLayer);
                //当前句柄层级提高
                rect.resizeLayer.raiseToTop(this);
 
                rect.rotateLayer && rect.rotateLayer.setDisplay('none');


                //把原矩形的四个点 中心点 宽 高都记下来
                rect.oldPoint = rect.polyPoints();
                rect.oldCenter = rect.centerPoints();

                // rect.rect1Point = rect1.polyPoints();
                rect.rect1Point = rect.refRect.polyPoints();



                //计算出句柄可以拖动的范围 如果句柄超出了范围（通过qcanvas.rayCasting 射线法判断点是否在多边形内部） 那么矩形大小及位置就不用响应了
                //第一步 以0度角的矩形rect确定四个点的位置 
                //第二步 计算出旋转角度后的四个点的新坐标 组成一个封闭的坐标序列

                var points = [
                    { x: 0, y: 0 },
                    { x: rect.start[0] + rect.width, y: 0 },
                    { x: rect.start[0] + rect.width, y: rect.start[1] + rect.height },
                    { x: 0, y: rect.start[1] + rect.height },
                ]

                var tmp = [];
                points.forEach(function(item) {
                    //旋转角度后的坐标
                    var pos = qcanvas.getEndPointByRotate(
                        [item.x, item.y],
                        [rect.oldCenter.x, rect.oldCenter.y],
                        rect.degree * (Math.PI / 180)
                    )

                    tmp.push({ x: pos[0], y: pos[1] });
                })


                rect.handleRange = tmp;

                //记录正在缩放的对象
                qcanvas.resizingObj = rect;
                // console.log(rect); 
            },
             mousemove: function(e, pos) {
                if (qcanvas.dragAim !== null) {

                    //判断拖动句柄是否在handleRange内 
                    if (qcanvas.event.rayCasting(pos, rect.handleRange) == 'out') {
                        return false;
                    }
                    var h1_center = rect.resizeHandles[0].centerPoints();
                    var rectPoint = rect.oldPoint; 
                    //以0度角的矩形做基本计算
                    var rect1Point = rect.rect1Point;

                    var rectOldCenter = rect.oldCenter;

                    //通过对角线(第0点-->第3点)确定中心点位置 
                    var obj = {
                        start: [h1_center.x, h1_center.y],
                        end: [rectPoint[2].x, rectPoint[2].y]
                    }

                    // var c = getMiddleCoordinates(obj);


                    //基于原中心点旋转
                    var pos = qcanvas.getEndPointByRotate(
                        [h1_center.x, h1_center.y],
                        // c,
                        [rectOldCenter.x, rectOldCenter.y],
                        -rect.degree * (Math.PI / 180) 
                    )
                    // console.log(pos);

                    //计算宽 高（通过rect1的位置）
                    var width = Math.abs(pos[0] - rect1Point[1].x);
                    var height = Math.abs(pos[1] - rect1Point[2].y); 

                    rect.setStart(pos).setWidth(width).setHeight(height);
                    // rect1.setStart(pos).setWidth(width).setHeight(height);
                    rect.refRect.setStart(pos).setWidth(width).setHeight(height);



                    //会影响第二 四控制点 所以得更新其位置
                    //二
                    var p = qcanvas.getEndPointByRotate(
                        [pos[0] + width, pos[1]],
                        [rectOldCenter.x, rectOldCenter.y],
                        rect.degree * (Math.PI / 180)
                    )
                    // h2.setStart([p[0] - 5, p[1] - 5])
                    rect.resizeHandles[1].setStart([p[0] - 5, p[1] - 5])

                    //四
                    var p1 = qcanvas.getEndPointByRotate(
                        [pos[0], pos[1] + height],
                        [rectOldCenter.x, rectOldCenter.y],
                        rect.degree * (Math.PI / 180)
                    )
                    // h4.setStart([p1[0] - 5, p1[1] - 5])
                    rect.resizeHandles[3].setStart([p1[0] - 5, p1[1] - 5])

                }
            },
            mouseup: function(e, pos) {

                rect.rotateLayer && rect.rotateLayer.setDisplay('block');



                //判断鼠标弹起时 坐标点是否在handleRange区域内
                //如果在区域内 那么就用控制点的中心位置作为 对角线起点（为了确定中心点）
                //如果在区域外 则用rect的点作来对角线起点（为了确定中心点）
                if (qcanvas.event.rayCasting(pos, rect.handleRange) == 'out') {

                    var rectOldCenter = rect.oldCenter;

                    var tmp = [
                        rect.start[0],
                        rect.start[1]
                    ]

                    //基于原中心点旋转
                    var p = qcanvas.getEndPointByRotate(
                        tmp,
                        [rectOldCenter.x, rectOldCenter.y],
                        rect.degree * (Math.PI / 180)
                    )

                    var end_center = {
                        x: p[0],
                        y: p[1]
                    }



                } else {
                    // var end_center = h1.centerPoints();
                    var end_center = rect.resizeHandles[0].centerPoints();

                }

                var rectOldPoint = rect.oldPoint;

                //通过对角线(第0点-->第3点)确定中心点位置 
                var obj = {
                    start: [end_center.x, end_center.y],
                    end: [rectOldPoint[2].x, rectOldPoint[2].y]
                }


                //基于当前中心点旋转
                var c = qcanvas.qline.getMiddleCoordinates(obj);

                var pos = qcanvas.getEndPointByRotate(
                    [end_center.x, end_center.y],
                    c,
                    -rect.degree * (Math.PI / 180)
                )

                rect.setStart(pos);
                // rect1.setStart(pos);
                rect.refRect.setStart(pos);


                //重置当前控制点位置
                var point = rect.polyPoints();
                // this.setStart([point[0].x - 5, point[0].y - 5]);
                rect.resizeHandles[0].setStart([point[0].x - 5, point[0].y - 5]);

                qcanvas.resizingObj = null; 

            }
    })

    var h2 = qcanvas.rect({
            start: [point[1].x - 5, point[1].y - 5],
            degree: rect.degree,
            width: 10,
            height: 10,
            borderColor: 'gray',
            fillColor: '',
            disCenter: 0, //距大矩形中心点距离 
            dragRange: [],
            mousedown: function() {

                //resizeLayer层级提高
                qcanvas.raiseToTop(rect.resizeLayer);
                //当前句柄层级提高
                rect.resizeLayer.raiseToTop(this);

                rect.rotateLayer && rect.rotateLayer.setDisplay('none');




                //把原矩形的四个点 中心点 宽 高都记下来
                rect.oldPoint = rect.polyPoints();
                rect.oldCenter = rect.centerPoints();

                // rect.rect1Point = rect1.polyPoints();
                rect.rect1Point = rect.refRect.polyPoints();





                //计算出句柄可以拖动的范围 如果句柄超出了范围（通过qcanvas.rayCasting 射线法判断点是否在多边形内部） 那么矩形大小及位置就不用响应了
                //第一步 以0度角的矩形rect确定四个点的位置 
                //第二步 计算出旋转角度后的四个点的新坐标 组成一个封闭的坐标序列
                //+1000扩大范围
                var points = [
                    { x: rect.start[0], y: -1000 },
                    { x: qcanvas.stage.width + 1000, y: -1000 },
                    { x: qcanvas.stage.width + 1000, y: rect.start[1] + rect.height },
                    { x: rect.start[0], y: rect.start[1] + rect.height },
                ]

                var tmp = [];
                points.forEach(function(item) {
                    //旋转角度后的坐标
                    var pos = qcanvas.getEndPointByRotate(
                        [item.x, item.y],
                        [rect.oldCenter.x, rect.oldCenter.y],
                        rect.degree * (Math.PI / 180)
                    )

                    tmp.push({ x: pos[0], y: pos[1] });
                })


                rect.handleRange = tmp;


                //记录正在缩放的对象
                qcanvas.resizingObj = rect;
                // console.log(rect);  
            },
             mousemove: function(e, pos) {
                if (qcanvas.dragAim !== null) {

                    //判断拖动句柄是否在handleRange内 
                    if (qcanvas.event.rayCasting(pos, rect.handleRange) == 'out') {
                        return false;
                    }

                    var h2_center = rect.resizeHandles[1].centerPoints();
                    // var rectPoint = rect.polyPoints(); 
                    var rectPoint = rect.oldPoint;
                    // var rect1Point = rect1.polyPoints();  //以0度角的矩形做基本计算
                    var rect1Point = rect.rect1Point;

                    var rectOldCenter = rect.oldCenter;

                    //通过对角线(第2点-->第4点)确定中心点位置 
                    var obj = {
                        start: [h2_center.x, h2_center.y],
                        end: [rectPoint[3].x, rectPoint[3].y]
                    }

                    // var c = getMiddleCoordinates(obj);


                    //基于原中心点旋转
                    var pos = qcanvas.getEndPointByRotate(
                        [h2_center.x, h2_center.y],
                        // c,
                        [rectOldCenter.x, rectOldCenter.y],
                        -rect.degree * (Math.PI / 180)
                    )
                    // console.log(pos);

                    //计算宽 高（通过rect1的位置）
                    var width = Math.abs(pos[0] - rect1Point[0].x);
                    var height = Math.abs(pos[1] - rect1Point[2].y);
                    var start = [pos[0] - width, pos[1]];


                    rect.setStart(start).setWidth(width).setHeight(height);
                    // rect1.setStart(start).setWidth(width).setHeight(height);
                    rect.refRect.setStart(start).setWidth(width).setHeight(height);



                    //会影响第一 三控制点 所以得更新其位置
                    //一
                    var p = qcanvas.getEndPointByRotate(
                        start,
                        [rectOldCenter.x, rectOldCenter.y],
                        rect.degree * (Math.PI / 180)
                    )
                    // h1.setStart([p[0] - 5, p[1] - 5])
                    rect.resizeHandles[0].setStart([p[0] - 5, p[1] - 5])


                    //三
                    var p1 = qcanvas.getEndPointByRotate(
                        [start[0] + width, start[1] + height],
                        [rectOldCenter.x, rectOldCenter.y],
                        rect.degree * (Math.PI / 180)
                    )
                    rect.resizeHandles[2].setStart([p1[0] - 5, p1[1] - 5])
                }
            },
            mouseup: function(e, pos) {
                rect.rotateLayer && rect.rotateLayer.setDisplay('block');



                //判断鼠标弹起时 坐标点是否在handleRange区域内
                //如果在区域内 那么就用控制点的中心位置作为 对角线起点（为了确定中心点）
                //如果在区域外 则用rect的点作来对角线起点（为了确定中心点）
                if (qcanvas.event.rayCasting(pos, rect.handleRange) == 'out') {

                    var rectOldCenter = rect.oldCenter;

                    var tmp = [
                        rect.start[0] + rect.width,
                        rect.start[1]
                    ]

                    //基于原中心点旋转
                    var p = qcanvas.getEndPointByRotate(
                        tmp,
                        [rectOldCenter.x, rectOldCenter.y],
                        rect.degree * (Math.PI / 180)
                    )

                    var end_center = {
                        x: p[0],
                        y: p[1]
                    }



                } else {
                    // var end_center = h2.centerPoints();
                    var end_center = rect.resizeHandles[1].centerPoints();

                }

                var rectOldPoint = rect.oldPoint;

                //通过对角线(第2点-->第4点)确定中心点位置 
                var obj = {
                    start: [end_center.x, end_center.y],
                    end: [rectOldPoint[3].x, rectOldPoint[3].y]
                }


                //基于当前中心点旋转
                var c = qcanvas.qline.getMiddleCoordinates(obj);

                var pos = qcanvas.getEndPointByRotate(
                    [end_center.x, end_center.y],
                    c,
                    -rect.degree * (Math.PI / 180)
                )

                var start = [pos[0] - rect.width, pos[1]];
                rect.setStart(start);
                // rect1.setStart(start);
                rect.refRect.setStart(start);


                //重置当前控制点位置
                var point = rect.polyPoints();
                // this.setStart([point[1].x - 5, point[1].y - 5]);
                rect.resizeHandles[1].setStart([point[1].x - 5, point[1].y - 5]);

                qcanvas.resizingObj = null;

            }
        })
    var h3 = qcanvas.rect({
            start:[point[2].x - 5, point[2].y - 5],
            degree: rect.degree,
            width: 10,
            height: 10,
            borderColor: 'gray',
            fillColor: '',
            disCenter: 0, //距大矩形中心点距离 
            dragRange: [],
            mousedown: function() {
                //resizeLayer层级提高
                qcanvas.raiseToTop(rect.resizeLayer);
                //当前句柄层级提高
                rect.resizeLayer.raiseToTop(this);

                rect.rotateLayer && rect.rotateLayer.setDisplay('none');



                //把原矩形的四个点 中心点 宽 高都记下来
                rect.oldPoint = rect.polyPoints();
                rect.oldCenter = rect.centerPoints();

                // rect.rect1Point = rect1.polyPoints();
                rect.rect1Point = rect.refRect.polyPoints();





                //计算出句柄可以拖动的范围 如果句柄超出了范围（通过qcanvas.rayCasting 射线法判断点是否在多边形内部） 那么矩形大小及位置就不用响应了
                //第一步 以0度角的矩形rect确定四个点的位置 
                //第二步 计算出旋转角度后的四个点的新坐标 组成一个封闭的坐标序列
                //+1000扩大范围
                var points = [
                    { x: rect.start[0], y: rect.start[1] },
                    { x: qcanvas.stage.width + 1000, y: rect.start[1] },
                    { x: qcanvas.stage.width + 1000, y: qcanvas.stage.height + 1000 },
                    { x: rect.start[0], y: qcanvas.stage.height + 1000 },
                ]

                var tmp = [];
                points.forEach(function(item) {
                    //旋转角度后的坐标
                    var pos = qcanvas.getEndPointByRotate(
                        [item.x, item.y],
                        [rect.oldCenter.x, rect.oldCenter.y],
                        rect.degree * (Math.PI / 180)
                    )

                    tmp.push({ x: pos[0], y: pos[1] });
                })


                rect.handleRange = tmp;


                //记录正在缩放的对象
                qcanvas.resizingObj = rect;
                // console.log(rect);  
            },
            mousemove: function(e, pos) {
                if (qcanvas.dragAim !== null) {

                    //判断拖动句柄是否在handleRange内 
                    if (qcanvas.event.rayCasting(pos, rect.handleRange) == 'out') {
                        return false;
                    }

                    var h3_center = rect.resizeHandles[2].centerPoints();
                    // var rectPoint = rect.polyPoints(); 
                    var rectPoint = rect.oldPoint;
                    // var rect1Point = rect1.polyPoints();  //以0度角的矩形做基本计算
                    var rect1Point = rect.rect1Point;

                    var rectOldCenter = rect.oldCenter;

                    //通过对角线(第3点-->第1点)确定中心点位置 
                    var obj = {
                        start: [h3_center.x, h3_center.y],
                        end: [rectPoint[0].x, rectPoint[0].y]
                    }

                    // var c = getMiddleCoordinates(obj);


                    //基于原中心点旋转
                    var pos = qcanvas.getEndPointByRotate(
                        [h3_center.x, h3_center.y],
                        // c,
                        [rectOldCenter.x, rectOldCenter.y],
                        -rect.degree * (Math.PI / 180)
                    )
                    // console.log(pos);

                    //计算宽 高（通过rect1的位置）
                    var width = Math.abs(pos[0] - rect1Point[0].x);
                    var height = Math.abs(pos[1] - rect1Point[1].y);
                    var start = [pos[0] - width, pos[1] - height];


                    rect.setStart(start).setWidth(width).setHeight(height);
                    // rect1.setStart(start).setWidth(width).setHeight(height);
                    rect.refRect.setStart(start).setWidth(width).setHeight(height);



                    //会影响第二 四控制点 所以得更新其位置
                    //二
                    // var tmp = [start[0],start[1]];
                    var p = qcanvas.getEndPointByRotate(
                        [start[0] + width, start[1]],
                        [rectOldCenter.x, rectOldCenter.y],
                        rect.degree * (Math.PI / 180)
                    )
                    // h2.setStart([p[0] - 5, p[1] - 5])
                    rect.resizeHandles[1].setStart([p[0] - 5, p[1] - 5])

                    //四
                    var p1 = qcanvas.getEndPointByRotate(
                        [start[0], start[1] + height],
                        [rectOldCenter.x, rectOldCenter.y],
                        rect.degree * (Math.PI / 180)
                    )
                    // h4.setStart([p1[0] - 5, p1[1] - 5])
                    rect.resizeHandles[3].setStart([p1[0] - 5, p1[1] - 5])
                }
            },
            mouseup: function(e, pos) {
                rect.rotateLayer && rect.rotateLayer.setDisplay('block');



                //判断鼠标弹起时 坐标点是否在handleRange区域内
                //如果在区域内 那么就用控制点的中心位置作为 对角线起点（为了确定中心点）
                //如果在区域外 则用rect的点作来对角线起点（为了确定中心点）
                if (qcanvas.event.rayCasting(pos, rect.handleRange) == 'out') {

                    var rectOldCenter = rect.oldCenter;

                    var tmp = [
                        rect.start[0] + rect.width,
                        rect.start[1] + rect.height
                    ]

                    //基于原中心点旋转
                    var p = qcanvas.getEndPointByRotate(
                        tmp,
                        [rectOldCenter.x, rectOldCenter.y],
                        rect.degree * (Math.PI / 180)
                    )

                    var end_center = {
                        x: p[0],
                        y: p[1]
                    }



                } else {
                    // var end_center = h3.centerPoints();
                    var end_center = rect.resizeHandles[2].centerPoints();

                }

                var rectOldPoint = rect.oldPoint;

                //通过对角线(第3点-->第1点)确定中心点位置 
                var obj = {
                    start: [end_center.x, end_center.y],
                    end: [rectOldPoint[0].x, rectOldPoint[0].y]
                }


                //基于当前中心点旋转
                var c = qcanvas.qline.getMiddleCoordinates(obj);

                var pos = qcanvas.getEndPointByRotate(
                    [end_center.x, end_center.y],
                    c,
                    -rect.degree * (Math.PI / 180)
                )

                var start = [pos[0] - rect.width, pos[1] - rect.height];
                rect.setStart(start);
                // rect1.setStart(start);
                rect.refRect.setStart(start);


                //重置当前控制点位置
                var point = rect.polyPoints();
                // this.setStart([point[2].x - 5, point[2].y - 5]);
                rect.resizeHandles[2].setStart([point[2].x - 5, point[2].y - 5]);


                qcanvas.resizingObj = null;

            }
        })
    var h4 = qcanvas.rect({
            start: [point[3].x - 5, point[3].y - 5],
            degree: rect.degree,
            width: 10,
            height: 10,
            borderColor: 'gray',
            fillColor: '',
            disCenter: 0, //距大矩形中心点距离 
            dragRange: [],
            mousedown: function() {
                //resizeLayer层级提高
                qcanvas.raiseToTop(rect.resizeLayer);
                //当前句柄层级提高
                rect.resizeLayer.raiseToTop(this);

                rect.rotateLayer && rect.rotateLayer.setDisplay('none');



                //把原矩形的四个点 中心点 宽 高都记下来
                rect.oldPoint = rect.polyPoints();
                rect.oldCenter = rect.centerPoints();

                // rect.rect1Point = rect1.polyPoints();
                rect.rect1Point = rect.refRect.polyPoints();


                //计算出句柄可以拖动的范围 如果句柄超出了范围（通过qcanvas.rayCasting 射线法判断点是否在多边形内部） 那么矩形大小及位置就不用响应了
                //第一步 以0度角的矩形rect确定四个点的位置 
                //第二步 计算出旋转角度后的四个点的新坐标 组成一个封闭的坐标序列
                //+1000扩大范围
                var points = [
                    { x: 0, y: rect.start[1] },
                    { x: rect.start[0] + rect.width, y: rect.start[1] },
                    { x: rect.start[0] + rect.width, y: qcanvas.stage.height },
                    { x: 0, y: qcanvas.stage.height },
                ]

                var tmp = [];
                points.forEach(function(item) {
                    //旋转角度后的坐标
                    var pos = qcanvas.getEndPointByRotate(
                        [item.x, item.y],
                        [rect.oldCenter.x, rect.oldCenter.y],
                        rect.degree * (Math.PI / 180)
                    )

                    tmp.push({ x: pos[0], y: pos[1] });
                })


                rect.handleRange = tmp;


                //记录正在缩放的对象
                qcanvas.resizingObj = rect;
                // console.log(rect);  
            },
            mousemove: function(e, pos) {
                if (qcanvas.dragAim !== null) {

                    //判断拖动句柄是否在handleRange内 
                    if (qcanvas.event.rayCasting(pos, rect.handleRange) == 'out') {
                        return false;
                    }

                    // var h4_center = this.centerPoints();
                    var h4_center = rect.resizeHandles[3].centerPoints();

                    // var rectPoint = rect.polyPoints(); 
                    var rectPoint = rect.oldPoint;
                    // var rect1Point = rect1.polyPoints();  //以0度角的矩形做基本计算
                    var rect1Point = rect.rect1Point;

                    var rectOldCenter = rect.oldCenter;

                    //通过对角线(第4点-->第2点)确定中心点位置 
                    var obj = {
                        start: [h4_center.x, h4_center.y],
                        end: [rectPoint[1].x, rectPoint[1].y]
                    }

                    // var c = getMiddleCoordinates(obj);


                    //基于原中心点旋转
                    var pos = qcanvas.getEndPointByRotate(
                        [h4_center.x, h4_center.y],
                        // c,
                        [rectOldCenter.x, rectOldCenter.y],
                        -rect.degree * (Math.PI / 180)
                    )
                    // console.log(pos);

                    //计算宽 高（通过rect1的位置）
                    var width = Math.abs(pos[0] - rect1Point[1].x);
                    var height = Math.abs(pos[1] - rect1Point[1].y);
                    var start = [pos[0], pos[1] - height];


                    rect.setStart(start).setWidth(width).setHeight(height);
                    // rect1.setStart(start).setWidth(width).setHeight(height);
                    rect.refRect.setStart(start).setWidth(width).setHeight(height);



                    //会影响第一 三控制点 所以得更新其位置
                    //一
                    // var tmp = [start[0],start[1]];
                    var p = qcanvas.getEndPointByRotate(
                        start,
                        [rectOldCenter.x, rectOldCenter.y],
                        rect.degree * (Math.PI / 180)
                    )
                    // h1.setStart([p[0] - 5, p[1] - 5])
                    rect.resizeHandles[0].setStart([p[0] - 5, p[1] - 5])


                    var p1 = qcanvas.getEndPointByRotate(
                        [start[0] + width, start[1] + height],
                        [rectOldCenter.x, rectOldCenter.y],
                        rect.degree * (Math.PI / 180)
                    )
                    // h3.setStart([p1[0] - 5, p1[1] - 5])
                    rect.resizeHandles[2].setStart([p1[0] - 5, p1[1] - 5])

                }
            },
            mouseup: function(e, pos) {
                rect.rotateLayer && rect.rotateLayer .setDisplay('block');



                //判断鼠标弹起时 坐标点是否在handleRange区域内
                //如果在区域内 那么就用控制点的中心位置作为 对角线起点（为了确定中心点）
                //如果在区域外 则用rect的点作来对角线起点（为了确定中心点）
                if (qcanvas.event.rayCasting(pos, rect.handleRange) == 'out') {

                    var rectOldCenter = rect.oldCenter;

                    var tmp = [
                        rect.start[0],
                        rect.start[1] + rect.height
                    ]

                    //基于原中心点旋转
                    var p = qcanvas.getEndPointByRotate(
                        tmp,
                        [rectOldCenter.x, rectOldCenter.y],
                        rect.degree * (Math.PI / 180)
                    )

                    var end_center = {
                        x: p[0],
                        y: p[1]
                    }



                } else {
                    // var end_center = h4.centerPoints();
                    var end_center = rect.resizeHandles[3].centerPoints();
                }

                var rectOldPoint = rect.oldPoint;

                //通过对角线(第4点-->第2点)确定中心点位置 
                var obj = {
                    start: [end_center.x, end_center.y],
                    end: [rectOldPoint[1].x, rectOldPoint[1].y]
                }


                //基于当前中心点旋转
                var c = qcanvas.qline.getMiddleCoordinates(obj);

                var pos = qcanvas.getEndPointByRotate(
                    [end_center.x, end_center.y],
                    c,
                    -rect.degree * (Math.PI / 180)
                )

                var start = [pos[0], pos[1] - rect.height];
                rect.setStart(start);
                // rect1.setStart(start);
                rect.refRect.setStart(start);


                //重置当前控制点位置
                var point = rect.polyPoints();
                // this.setStart([point[3].x - 5, point[3].y - 5]);
                rect.resizeHandles[3].setStart([point[3].x - 5, point[3].y - 5]);


                qcanvas.resizingObj = null;

            }
        })

    //把句柄都记录下来
    rect.resizeHandles = [h1,h2,h3,h4];
    
    return [h1,h2,h3,h4];
}


/**
 * 绘制矩形方法   由主类的paint方法来调用(会把this置为主类的上下文)
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
Qrect.prototype.paintRect = function(obj) {
    //注：this是主类的上下文  

    this.qanimation.createAnimation(obj);

    var start = this.isFun(obj.start) ? obj.start() : obj.start;
    var width = this.isFun(obj.width) ? obj.width() : obj.width;
    var height = this.isFun(obj.height) ? obj.height() : obj.height;


    if (obj.dashed) {
        this.context.setLineDash([3]);
    }


    if (this.isNum(obj.radius) && (obj.radius > 0)) { //圆角矩形

        //因为this是主类的上下文  
        //所有调用Qrect.drawRoundedRect时 需要用this.qrect.drawRoundedRect, qrect在主类中做了初始化
        this.qrect.drawRoundedRect(this.context, start[0], start[1], width, height, obj);

    } else {
        this.context.beginPath();
        this.context.lineWidth = obj.lineWidth;
        this.context.strokeStyle = obj.borderColor;

        this.context.rect(start[0], start[1], width, height);
        this.context.stroke();

        var rgb = this.colorRgb(obj.fillColor).replace('RGB(', '').replace(')', '');

        (obj.fillColor != '') &&
        (typeof obj.opacity!='undefined' && (this.context.fillStyle = "rgba(" + rgb + ',' + obj.opacity + ")") ||
            (this.context.fillStyle = obj.fillColor)) &&
        this.context.fill();
    }

    this.context.setLineDash([]);
}
Qrect.prototype.drawRoundedRect = function(ctx, x, y, width, height, obj) {
    //注：this为Qrect的实例

    ctx.beginPath(); // draw top and top right corner 

    ctx.lineWidth = obj.lineWidth;
    ctx.strokeStyle = obj.borderColor;

    ctx.moveTo(x + obj.radius, y);
    ctx.arcTo(x + width, y, x + width, y + obj.radius, obj.radius); // draw right side and bottom right corner 
    ctx.arcTo(x + width, y + height, x + width - obj.radius, y + height, obj.radius); // draw bottom and bottom left corner 
    ctx.arcTo(x, y + height, x, y + height - obj.radius, obj.radius); // draw left and top left corner 
    ctx.arcTo(x, y, x + obj.radius, y, obj.radius);
    ctx.stroke();


    var rgb = this.colorRgb(obj.fillColor).replace('RGB(', '').replace(')', '');

    (obj.fillColor != '') &&
    (obj.opacity && (ctx.fillStyle = "rgba(" + rgb + ',' + obj.opacity + ")") ||
        (ctx.fillStyle = obj.fillColor)) &&
    ctx.fill();

}


/**
 * Qlayer类似于Qcanvas 得完全实现Qcanvas的功能
 * 区别：它是一个离屏的canvas
 */
function Qlayer(prototype) {


}

/**
 * 创建一个离屏的canvas 实现Qcanvas类的所有功能
 * @return {[type]} [description]
 */
Qlayer.prototype.layer = function() {
    //注：this是主类的上下文

    var _this = this;
    var stage = this.getStage();

    //创建一个屏屏canvas
    var dpr = window.devicePixelRatio || 2; // 假设this.dpr为2
    var canvas = document.createElement('canvas');
    // var canvas = document.getElementById('layer');
    canvas.width = stage.width * dpr;
    canvas.height = stage.height * dpr;
    canvas.style.width = stage.width + 'px';
    canvas.style.height = stage.height + 'px';

    var context = canvas.getContext('2d');
    context.scale(dpr, dpr);

    var layer = {
        TYPE: "layer",
        elements: [],
        canvas: canvas,
        context: context,
        dpr: dpr,
        display: 'block',

        //影子画布
        shadowCanvas: _this.shadowCanvas,
        shadowContext: _this.shadowContext,

        push: function(ele) {

            if(!this.isArr(ele)){

            var t = Array.prototype.slice.apply(arguments);
        }else{
            var t = ele;
        }
            
            var l = t.length;
            for (var i = 0; i < l; i++) {

                //不支持layer对象上再放入layer或group
                if ((t[i].TYPE == 'layer') || (t[i].TYPE == 'group')) {
                    continue;
                }

                if (this.isObj(t[i])) {
                    _this.removeEle.call(_this, t[i]);
                    this.elements.push(t[i]);

                    if ((t[i].TYPE == 'line' || t[i].TYPE == 'bezierCurve' || t[i].TYPE == 'quadraticCurve') && typeof t[i].withTextId != 'undefined') {
                        //如果线段上带有文本 也需要把文本加入到该layer里 
                        var withTextObj = _this.getEleById.call(_this, t[i].withTextId);
                        _this.removeEle.call(_this, withTextObj);
                        this.elements.push(withTextObj);

                    }
                }

            }
        },
        hasOwnEle:function(ele){  //当前layer对象里是存在ele元素
                var tmp = this.elements.filter(function(item){
                    return item.id == ele.id;
                })

                return tmp.length>0;
        },

        qanimation: _this.qanimation,
        qrect: _this.qrect,
        qline: _this.qline,
        qtext: _this.qtext,
        qarc: _this.qarc,
        qpolygon: _this.polygon,
        qshape: _this.shape,
        qimg: _this.img,
        qspirit: _this.spirit,
        qquadraticCurve: _this.quadraticCurve,
        qbezierCurve:_this.bezierCurve,


        TypeGroup: {
            'rect': this.qrect.paintRect,
            'line': this.qline.paintLine,
            'text': this.qtext.paintText,
            'arc': this.qarc.paintArc,
            'polygon': this.qpolygon.paintPolygon,
            'shape': this.qshape.paintShape,
            'img': this.qimg.paintImg,
            'spirit': this.qspirit.paintSpirit,
            'quadraticCurve': this.qquadraticCurve.paintQuadraticCurve,
            'bezierCurve':this.qbezierCurve.paintBezierCurve




        }
    }

    //把原型中的方法引用过来  作为layer的实例成员
    for (var i in this.__proto__) {
        layer[i] = this.__proto__[i];
    }

    this.extend(layer, {});
    this.appendSetFun(layer, layer);

    return layer;

}

Qlayer.prototype.paintLayer = function() {
    //注：this为Qlayer的实例
    this.clear();

    //把实例的elements保存的成员都画到离线canvas上
    var l = this.elements.length;
    for (var i = 0; i < l; i++) {
        var o = this.elements[i];

        if (o.display == 'none') {
            continue;
        }

        //有角度时 移动画布原点 旋转画布
        var centerPos = this.setDegree(o);
        this.TypeGroup[o.TYPE].call(this, o);

        //重置画布原点 旋转复原
        this.resetDegree(o, centerPos);
    }

}


//元素分组类
function Qgroup(qcanvas) {}
Qgroup.prototype.group = function(options) {
    //注：this是主类的上下文

    var _this = this;
    var group = {
        TYPE: 'group',
        display: 'block',
        elements: [], //容器里包含的元素 
        push: function() {
            var t = Array.prototype.slice.apply(arguments);
            var l = t.length;
            for (var i = 0; i < l; i++) {

                //不支持group对象上再放入group
                if (t[i].TYPE == 'group' || t[i].TYPE == 'layer') {
                    continue;
                }

                if (this.isObj(t[i])) {
                    _this.removeEle(t[i]);
                    this.elements.push(t[i]);
                }
            }
        }
    }

    //把原型中的方法引用过来  作为layer的实例成员
    for (var i in this.__proto__) {
        group[i] = this.__proto__[i];
    }


    this.extend(group, {});
    this.appendSetFun(group);


    return group;

}

Qgroup.prototype.paintGroup = function(obj) {
    //注：this是主类的上下文
    //把属于该容器的元素绘在layerCanvas
    var l = obj.elements.length;
    for (var i = 0; i < l; i++) {
        var o = obj.elements[i];

        if (o.display == 'none') {
            continue;
        }

        // this.TypeGroup[o.TYPE].call(this['q'+o.TYPE],o);
        this.TypeGroup[o.TYPE].call(this, o);


    }
}


/*动画类----------------*/
function Qanimation(qcanvas) {
    this.qanimationVersion = '1.0';
    this.qcanvas = qcanvas;
}

Qanimation.prototype.animate = function(aim, startStyle, endStyle, during, isLoop, tweenType, finishCallback) {

    //要求 startStyle对象和endStyle对象属性必须是一样的
    //序列帧对象(属性=>值)  
    var frames = {};
    var framesCount = this.fps * during;
    var tweenType = typeof tweenType != 'undefined' ? (tweenType == '' ? 'Linear' : tweenType) : 'Linear';
    // console.log(tweenType);

    var tween = eval('this.Tween["' + tweenType.split('.').join('"]["') + '"]');
    // console.log(tween);

    for (var i in startStyle) {

        //如果是属性的值是数组的 生成成对的数组序列 用于渲染动画
        if (this.isArr(startStyle[i])) {
            frames[i] = [];

            var perArr = [];
            for (var j = 0; j < startStyle[i].length; j++) {
                perArr.push((endStyle[i][j] - startStyle[i][j]) / framesCount);
            }



            for (var t = 0; t < framesCount; t++) {
                var temp = [];
                for (var p = 0; p < perArr.length; p++) {
                    //temp.push(startStyle[i][p]+ t*perArr[p]);  //暂时都是线性变化 
                    temp.push(tween(t, startStyle[i][p], perArr[p] * framesCount, framesCount));
                }

                frames[i].push(temp);
            }

        }

        //属性的值是数字的
        if (this.isNum(startStyle[i])) {
            frames[i] = [];
            var per = (endStyle[i] - startStyle[i]) / framesCount;

            for (var t = 0; t < framesCount; t++) {
                frames[i].push(tween(t, startStyle[i], endStyle[i] - startStyle[i], framesCount));

                //frames[i].push(startStyle[i]+ t*per);
                //
            }

        }




    }

    aim.animation = {
        'framesIndex': 0,
        'framesCount': framesCount,
        'during': during,
        'frames': frames,
        'isLoop': isLoop ? isLoop : false,
        'isExeCallback': false, //是否已执行了finishCallback
        'finishCallback': finishCallback ? finishCallback : function() {}
    }
}
//通过对象的animation属性中序列对象frames 改变相应的属性值
//使渲染过程中生成动画		
Qanimation.prototype.createAnimation = function(obj) {

    if (typeof obj.animation != 'undefined' && obj.animation && obj.animation.frames) {

        var framesIndex = obj.animation.framesIndex;
        var framesCount = obj.animation.framesCount;
        var frames = obj.animation.frames;
        var isLoop = obj.animation.isLoop;

        obj.animation.step = typeof obj.animation.step != 'undefined' ? obj.animation.step : 1; //控制方向  

        var step = obj.animation.step;

        obj.animation.framesIndex = obj.animation.framesIndex + step;

        obj.animation.framesIndex = obj.animation.framesIndex <= 0 ? 0 : obj.animation.framesIndex;

        obj.animation.framesIndex = obj.animation.framesIndex >= framesCount ? (framesCount - 1) : obj.animation.framesIndex;

        if (typeof isLoop != 'undefined') {

            if (this.qcanvas.isNum(isLoop)) { //循环次数

                isLoop = isLoop > 0 ? isLoop : 1;

                if (typeof obj.animation.loopNum == 'undefined') {
                    obj.animation.loopNum = 1;
                }

                if (obj.animation.framesIndex == (framesCount - 1)) {
                    obj.animation.loopNum++;

                    if (obj.animation.loopNum <= isLoop) {
                        obj.animation.step = -1; //反方向运动回去	
                    }

                    if ((obj.animation.loopNum - 1) == isLoop) {
                        obj.animation.finishCallback(obj);
                    }
                }

                if (obj.animation.framesIndex == 0) {
                    obj.animation.loopNum++;


                    if (obj.animation.loopNum <= isLoop) {
                        obj.animation.step = 1; //反方向运动回去	
                        // obj.animation.framesIndex = 0;
                    }

                    if ((obj.animation.loopNum - 1) == isLoop) {
                        obj.animation.finishCallback(obj);
                    }
                }



            } else {

                if (isLoop) {
                    if (obj.animation.framesIndex == (framesCount - 1)) {
                        obj.animation.step = -1; //反方向运动回去	
                        // obj.animation.framesIndex = 0;
                        obj.animation.finishCallback(obj);
                    }


                    if (obj.animation.framesIndex == 0) {
                        obj.animation.step = 1;
                        obj.animation.finishCallback(obj);
                    }
                } else {
                    if (obj.animation.framesIndex == (framesCount - 1)) {
                        !obj.animation.isExeCallback && (obj.animation.isExeCallback = true) &&
                            obj.animation.finishCallback(obj);
                    }

                }

            }



        } else {

            if (obj.animation.framesIndex == (framesCount - 1)) {
                !obj.animation.isExeCallback && (obj.animation.isExeCallback = true) &&
                    obj.animation.finishCallback(obj);
            }

        }

        //console.log(framesIndex);


        for (var i in obj.animation.frames) {
            obj[i] = obj.animation.frames[i][framesIndex];
        }


    }

}


/*Qevent类---------*/
function Qevent(qcanvas) {
    this.qeventVersion = '1.0';
    this.qcanvas = qcanvas;

    this.triggerEleType = { //触发事件的元素类型
        "rect": 1,
        "spirit": 1,
        "img": 1,
        "text": 1,
        "shape": 1,
        "arc": 1,
        "polygon": 1,
        "layer": 1, //是容器 本身不响应事件 只判断其中的元素
        "group": 1, //是容器 本身不响应事件 只判断其中的元素
        "line": 1,
        "quadraticCurve": 1, //二次曲线
        "bezierCurve": 1 //三次曲线
    }
    var _this = this;


    var eventCallback = {
        'mouseenter': function(e, position) {

        },
        'mousedown_or_touchstart': function(e, position) {
            // var position = _this.getEventPosition(e);
            var aim = _this.findElmByEventPosition(position);

            (aim !== null && aim.drag && _this.triggerEleType[aim.TYPE] &&
                (function() {
                    aim.downFun(e, position);
                    _this.qcanvas.dragAim = aim;

                })()) ||
            (aim !== null && aim.TYPE == 'canvas' && (function() {
                _this.qcanvas.dragAim = aim;

            })())

        },
        'mousemove_or_touchmove': function(e, position) {
 


            if (_this.qcanvas.dragAim !== null) {
                _this.triggerEleType[_this.qcanvas.dragAim.TYPE] &&
                    _this.qcanvas.dragAim.moveFun(e, position);
            }

        },
        'mouseup_or_mouseout_or_touchend': function(e, position) {
            _this.qcanvas.dragAim !== null && 
            typeof _this.qcanvas.dragAim.upFun != 'undefined' &&
             _this.qcanvas.dragAim.upFun !== null &&
             _this.qcanvas.dragAim.upFun(e, position);
            _this.qcanvas.dragAim = null;
        }
    };

    this.PC_Event = {
        "mouseenter": eventCallback['mouseenter'],
        "mousedown": eventCallback['mousedown_or_touchstart'],
        "mousemove": eventCallback['mousemove_or_touchmove'],
        "mouseup": eventCallback['mouseup_or_mouseout_or_touchend'],
        "mouseout": eventCallback['mouseup_or_mouseout_or_touchend'],
        "dblclick": function() {}
    };
    this.MOBILE_Event = {
        "touchstart": eventCallback['mousedown_or_touchstart'],
        "touchmove": eventCallback['mousemove_or_touchmove'],
        "touchend": eventCallback['mouseup_or_mouseout_or_touchend']
    };

    this.init();
}

Qevent.prototype.init = function() {
    var canvas = this.qcanvas.canvas;
    var _this = this;



    if ("ontouchstart" in window) {
        for (var i in this.MOBILE_Event) {
            // canvas.addEventListener(i,callback,false);		
            canvas.addEventListener(i, function(e) {
                var position = _this.getEventPosition(e);
                _this.eventCallback(e, position); //用户定义的回调函数
                _this.MOBILE_Event[e.type](e, position); //系统定义的回调函数
            }, false);

        }

    } else {
        for (var i in this.PC_Event) {
            canvas.addEventListener(i, function(e) {
                var position = _this.getEventPosition(e);
                _this.eventCallback(e, position); //用户定义的回调函数
                _this.PC_Event[e.type](e, position); //系统定义的回调函数
            }, false);
        }


        canvas.oncontextmenu = function(ev) {
            ev.preventDefault();
        }

    }

}

Qevent.prototype.executeMouseOutOrMouseEnter = function(aim, position) {
    //修复对象mouseout自定义事件不执行的问题 
    if (this.qcanvas.isObj(aim)) {

        if (this.qcanvas.moveAim == null) {
            this.qcanvas.moveAim = aim;
            aim['mouseenter'] && aim['mouseenter'](aim, position);


        } else if (this.qcanvas.moveAim.id !== aim.id) { //划过了不同的对象 需要执行上一个对象的moveout事件
            // console.log('划过了不同的对象');
            this.qcanvas.moveAim['mouseout'] && this.qcanvas.moveAim['mouseout'](this.qcanvas.moveAim, position);
            aim['mouseenter'] && aim['mouseenter'](aim, position);
            this.qcanvas.moveAim = aim;
        }

    } else {


        if (this.qcanvas.isObj(this.qcanvas.moveAim)) {
            this.qcanvas.moveAim['mouseout'] && this.qcanvas.moveAim['mouseout'](this.qcanvas.moveAim, position);
            this.qcanvas.moveAim = null;
        }
    }

}

Qevent.prototype.eventCallback = function(e, position) {

    var aim = this.findElmByEventPosition(position);

    //修复对象mouseout mouserenter自定义事件不执行的问题
    this.executeMouseOutOrMouseEnter(aim, position);


    //触发aim的事件(调用用户配置好的事件) 
    (aim !== null) && (typeof aim[e.type] != 'undefined') && aim[e.type](e, position);

    // //模拟drag事件 
    // (aim !== null) && 
    // (this.qcanvas.dragAim !==null)  && 
    // (e.type =='mousemove') && 
    // (typeof aim['drag'] !='undefined') &&  aim['drag'](e,position);

}

//根据点击的坐标 找到要触发事件的元素 
Qevent.prototype.findElmByEventPosition = function(position) {
    var elements = this.qcanvas.elements;
    var aim = null;


    //elements数组从后往前 碰到第一个元素 点击的坐标正好在它的范围内 那么就触发它的事件
    //越往后的元素 在画布上是越在上面的 
    var len = elements.length;

    if (len == 0) {
        return this.qcanvas;
    }

    for (var i = len - 1; i >= 0; i--) {

        //跳过不显示的元素和不响应事件的元素
        if (elements[i].display == 'none' || (elements[i].pointerEvent == 'none')) {
            continue;
        };

        if (this.triggerEleType[elements[i].TYPE]) {


            //如果是容器对象 要判断属于该容器里的元素
            if ((elements[i].TYPE == 'layer') || (elements[i].TYPE == 'group')) {
                var childLen = elements[i].elements.length;
                if (childLen == 0) {
                    continue;
                }

                for (var j = childLen - 1; j >= 0; j--) {


                    //跳过不显示的元素和不响应事件的元素
                    if (elements[i].elements[j].display == 'none' || (elements[i].elements[j].pointerEvent == 'none')) {
                        continue;
                    };

                    //曲线、直线、圆的拾取 需要用到影子画布实现
                    if (elements[i].elements[j].TYPE == 'quadraticCurve' ||
                        elements[i].elements[j].TYPE == 'bezierCurve' ||
                        elements[i].elements[j].TYPE == 'line' ||
                        elements[i].elements[j].TYPE == 'arc'
                    ) {
                        var color = this.qcanvas.getShadowPixelColor.call(this.qcanvas, position);

                        if (color.rgba === elements[i].elements[j].shadowFillColor) {
                            aim = elements[i].elements[j];
                            break;
                        }

                    } else if (this.rayCasting(position, elements[i].elements[j].polyPoints()) == 'in') {
                        aim = elements[i].elements[j];
                        break;
                    }
                }

                if (aim !== null) {
                    break;
                }

            } else {

                //曲线、直线、圆的拾取 需要用到影子画布实现
                if (elements[i].TYPE == 'quadraticCurve' ||
                    elements[i].TYPE == 'bezierCurve' ||
                    elements[i].TYPE == 'line' ||
                    elements[i].TYPE == 'arc'

                ) {
                    // console.log(position);
                    var color = this.qcanvas.getShadowPixelColor.call(this.qcanvas, position);

                    if (color.rgba === elements[i].shadowFillColor) {
                        aim = elements[i];
                        break;
                    }
                } else {

                    if (this.rayCasting(position, elements[i].polyPoints()) == 'in') {
                        aim = elements[i];
                        break;
                    }

                }


            }



        }
    }


    //如果aim == null那么点中的目标就是主canvas
    aim === null && (aim = this.qcanvas);


    return aim;

}

Qevent.prototype.getEventPosition = function(ev) {
    var x, y;
    //console.log(ev);
    if (this.MOBILE_Event[ev.type]) {
        var c = ev.type != 'touchend' ? ev.touches[0] : ev.changedTouches[0];
        x = c.clientX - c.target.offsetLeft;
        y = c.clientY - c.target.offsetTop;

    } else {
        if (ev.layerX || ev.layerX == 0) {
            x = ev.layerX;
            y = ev.layerY;
        } else if (ev.offsetX || ev.offsetX == 0) { // Opera
            x = ev.offsetX;
            y = ev.offsetY;
        }
    }



    return { x: x, y: y };
}

/**
 * @description 射线法判断点是否在多边形内部
 * @param {Object} p 待判断的点，格式：{ x: X坐标, y: Y坐标 }
 * @param {Array} poly 多边形顶点，数组成员的格式同 p
 * @return {String} 点 p 和多边形 poly 的几何关系
 */
Qevent.prototype.rayCasting = function(p, poly) {
    var px = p.x,
        py = p.y,
        flag = false

    for (var i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
        var sx = poly[i].x,
            sy = poly[i].y,
            tx = poly[j].x,
            ty = poly[j].y

        // 点与多边形顶点重合
        if ((sx === px && sy === py) || (tx === px && ty === py)) {
            return 'on'
        }

        // 判断线段两端点是否在射线两侧
        if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
            // 线段上与射线 Y 坐标相同的点的 X 坐标
            var x = sx + (py - sy) * (tx - sx) / (ty - sy)

            // 点在多边形的边上
            if (x === px) {
                return 'on'
            }

            // 射线穿过多边形的边界
            if (x > px) {
                flag = !flag
            }
        }
    }

    // 射线穿过多边形边界的次数为奇数时点在多边形内
    return flag ? 'in' : 'out'
}



/**
 * 主类
 */
function Qcanvas(options) {

    if ((typeof options.id == 'undefined') ||
        (typeof options.height == 'undefined') ||
        (typeof options.width == 'undefined')) {
        console.log('初始化参数不正确');
        return false;
    }



    this.version = '2.0';
    this.dpr = window.devicePixelRatio || 2; // 假设this.dpr为2

    //是否延时执行 (如果元素多以静态为主 建议开启 增加渲染效率)
    this.delayRender = typeof options.delayRender != 'undefined' ? options.delayRender : false;

    this.TYPE = 'canvas';
    this.id = (new Date()).getTime() + '' + parseInt(Math.random() * 100000000);


    //初始化canvas标签大小
    this.canvas = document.getElementById(options.id);
    this.canvas.width = options.width * this.dpr;
    this.canvas.height = options.height * this.dpr;
    this.canvas.style.width = options.width + 'px';
    this.canvas.style.height = options.height + 'px';



    //舞台对象
    this.stage = {
        "canvas": this.canvas,
        "id": this.id,
        "width": options.width,
        "height": options.height
    };

    this.context = this.canvas.getContext('2d');
    // 需要将绘制比例放大
    this.context.scale(this.dpr, this.dpr);


    //主画布的事件
    this.mousedown = options.mousedown || function() {};
    this.mousemove = options.mousemove || function() {};
    this.mouseup = options.mouseup || function() {};
    this.mouseout = options.mouseout || function() {};
    this.mouseenter = options.mouseenter || function() {};
    this.dblclick = options.dblclick || function() {};



    this.dragAim = null; //当前拖动的对象
    this.moveAim = null; //当前鼠标划过的对象
 

    this.resizingObj = null;  //正在被缩放的对象（暂只支持rect）

    //元素数组 （按z-index由小到大排序）
    this.elements = [];

    this.createShadowCanvas();


    //动画类
    this.qanimation = new Qanimation(this);
    this.animate = this.qanimation.animate.bind(this);


    //事件类
    this.event = new Qevent(this);



    this.qrect = new Qrect(this.__proto__);
    this.qlayer = new Qlayer(this.__proto__);
    this.qline = new Qline(this.__proto__);
    this.qtext = new Qtext(this.__proto__);
    this.qarc = new Qarc(this.__proto__);
    this.qpolygon = new Qpolygon(this.__proto__);
    this.qshape = new Qshape(this.__proto__);
    this.qimg = new Qimg(this.__proto__);
    this.qspirit = new Qspirit(this.__proto__);
    this.qgroup = new Qgroup(this.__proto__);
    this.qquadraticCurve = new QquadraticCurve(this.__proto__);
    this.qbezierCurve = new QbezierCurve(this.__proto__);

    this.rect = this.qrect.rect.bind(this);
    this.layer = this.qlayer.layer.bind(this);
    this.line = this.qline.line.bind(this);
    this.text = this.qtext.text.bind(this);
    this.arc = this.qarc.arc.bind(this);
    this.polygon = this.qpolygon.polygon.bind(this);
    this.shape = this.qshape.shape.bind(this);
    this.img = this.qimg.img.bind(this);
    this.spirit = this.qspirit.spirit.bind(this);
    this.group = this.qgroup.group.bind(this);
    this.quadraticCurve = this.qquadraticCurve.quadraticCurve.bind(this);
    this.bezierCurve = this.qbezierCurve.bezierCurve.bind(this);





    //计算fps
    this.fps = 60;
    this.lastLoop = (new Date()).getMilliseconds();
    this.count = 1;
    this.currFps = 0;

    this.TypeGroup = {
        'rect': this.qrect.paintRect,
        'layer': this.qlayer.paintLayer,
        'line': this.qline.paintLine,
        'text': this.qtext.paintText,
        'arc': this.qarc.paintArc,
        'polygon': this.qpolygon.paintPolygon,
        'shape': this.qshape.paintShape,
        'img': this.qimg.paintImg,
        'spirit': this.qspirit.paintSpirit,
        'group': this.qgroup.paintGroup,
        'quadraticCurve': this.qquadraticCurve.paintQuadraticCurve,
        'bezierCurve':this.qbezierCurve.paintBezierCurve


    }

    //1px占位图 
    this.placeHolderImg = new Image();
    this.placeHolderImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDlEMzc4NzlFMDJDMTFFQUE1QkREQzVDRjA2NDgzNEQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDlEMzc4N0FFMDJDMTFFQUE1QkREQzVDRjA2NDgzNEQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0OUQzNzg3N0UwMkMxMUVBQTVCRERDNUNGMDY0ODM0RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0OUQzNzg3OEUwMkMxMUVBQTVCRERDNUNGMDY0ODM0RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ph/0HDsAAAAQSURBVHjaYvj//z8DQIABAAj8Av7bok0WAAAAAElFTkSuQmCC'



    this.start();

}
Qcanvas.prototype.getStage = function() {
    return this.stage;
}
Qcanvas.prototype.colorRgb = function(color) {

    if (color == '') {
        return '0,0,0';
    }

    //17种基本色
    var basicColor = {
        "aqua": "#00FFFF",
        "black": "#000000",
        "blue": "#0000FF",
        "fuchsia": "#FF00FF",
        "c": "#808080",
        "green": "#008000",
        "lime": "#00FF00",
        "maroon": "#800000",
        "navy": "#000080",
        "olive": "#808000",
        "orange": "#FFA500",
        "purple": "#800080",
        "red": "#FF0000",
        "silver": "#C0C0C0",
        "teal": "#008080",
        "white": "#FFFFFF",
        "yellow": "#FFFF00"
    }

    if (color.indexOf('#') < 0) {
        color = basicColor[color.toLowerCase()];
    }


    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var sColor = color.toLowerCase();
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return "RGB(" + sColorChange.join(",") + ")";
    } else {
        return sColor;
    }
};
Qcanvas.prototype.setDegree = function(obj) {
    var centerPos = {};

    if (obj.degree != 0 && obj.centerPoints) {
        if(
            typeof this.resizingObj !='undefined' && 
            this.resizingObj !== null && 
            typeof this.resizingObj.id !='undefined' && 
            this.resizingObj.id == obj.id
            ){
            centerPos = obj.oldCenter;
        }else{
            centerPos = obj.centerPoints();
        }

        this.context.translate(centerPos.x, centerPos.y);
        this.context.rotate(obj.degree * Math.PI / 180);
        this.context.translate(-centerPos.x, -centerPos.y);

    }

    return centerPos;
}

Qcanvas.prototype.resetDegree = function(obj, centerPos) {
    if (obj.degree != 0 && obj.centerPoints) {
        this.context.translate(centerPos.x, centerPos.y);
        this.context.rotate(-obj.degree * Math.PI / 180);
        this.context.translate(-centerPos.x, -centerPos.y);
    }
}
Qcanvas.prototype.clear = function() {
    this.canvas.width = this.canvas.width;
    this.context.scale(this.dpr, this.dpr);
    if(this.TYPE == 'canvas'){ //只有上下文是主画布时 才清除影子画布
	    this.shadowCanvas.width = this.shadowCanvas.width;
    }

}
//根据elements数组 画所有元素
Qcanvas.prototype.paint = function() {
    var l = this.elements.length;
    for (var i = 0; i < l; i++) {
        var o = this.elements[i];

        if (o.display == 'none') {
            continue;
        }

        //有角度时 移动画布原点 旋转画布
        var centerPos = this.setDegree(o);

        if (o.TYPE == 'layer') {

            this.TypeGroup[o.TYPE].call(o, o);

            //把离屏画布整体都画到主画布上
            this.context.drawImage(
                o.canvas, 0, 0,
                this.canvas.width,
                this.canvas.height, 0, 0,
                this.stage.width,
                this.stage.height
            );


        } else {
            this.TypeGroup[o.TYPE].call(this, o);
        }

        //重置画布原点 旋转复原
        this.resetDegree(o, centerPos);
    }
}
Qcanvas.prototype.delayRenderFun = function() {
    this.renderTime = (new Date()).getTime();
    this.clear();
    this.paint();

    if (((new Date()).getTime() - this.renderTime) > 16) {
        // console.log('渲染超过16ms了，重新更新时间');
        this.renderTime = (new Date()).getTime();
    }

};

Qcanvas.prototype.getEleById = function(id) {
    var l = this.elements.length;
    for (var i = 0; i < l; i++) {
        if (this.elements[i].id == id) {
            return this.elements[i];
            break;
        }
    }

}

//从elements数组中删除 
//该方法使用时要注意 如果其它元素的某一属性与该元素有关联 为了不让它出现在画布中最好用setDisplay()方法
Qcanvas.prototype.removeEle = function(obj) {
    var l = this.elements.length;
    for (var i = 0; i < l; i++) {
        if (this.elements[i].id == obj.id) {
            this.elements.splice(i, 1);
            break;
        }
    }


}
//从elements数组中删除 
//该方法使用时要注意 如果其它元素的某一属性与该元素有关联 为了不让它出现在画布中最好用setDisplay()方法
Qcanvas.prototype.removeEleById = function(id) {
    var l = this.elements.length;
    for (var i = 0; i < l; i++) {
        if (this.elements[i].id == id) {
            this.elements.splice(i, 1);
            break;
        }
    }


}


Qcanvas.prototype.getIndexById = function(id) {
    var l = this.elements.length;
    for (var i = 0; i < l; i++) {
        if (this.elements[i].id == id) {
            return i;
            break;
        }
    }

}


Qcanvas.prototype.lower = function(el) {

    var currIndex = this.getIndexById(el.id);
    if ((currIndex - 1 < 0) || (typeof this.elements[currIndex - 1] == 'undefined')) {
        return false;
    }

    this.elements[currIndex] = this.elements.splice(currIndex - 1, 1, this.elements[currIndex])[0];

}

Qcanvas.prototype.lowerToBottom = function(el) {

    if (this.getIndexById(el.id) == 0) { //已经是最底层
        return false;
    }

    this.removeEle(el);
    this.elements.unshift(el);

}

Qcanvas.prototype.raise = function(el) {

    var currIndex = this.getIndexById(el.id);
    if (typeof this.elements[currIndex + 1] == 'undefined') {
        return false;
    }

    this.elements[currIndex] = this.elements.splice(currIndex + 1, 1, this.elements[currIndex])[0];


}

Qcanvas.prototype.raiseToTop = function(el) {

    if (this.getIndexById(el.id) == (this.elements.length - 1)) { //已经是最顶层
        return false;
    }

    this.removeEle(el);
    this.elements.push(el);
}
//启动
Qcanvas.prototype.start = function() {
    if (this.delayRender) {
        if (typeof this.renderTime == 'undefined') {
            this.delayRenderFun();

        } else if (((new Date()).getTime() - this.renderTime) > 16) {
            this.delayRenderFun();
        }

    } else {
        this.clear();
        this.paint();
    }

    var currentLoop = (new Date()).getMilliseconds();
    if (this.lastLoop > currentLoop) {
        this.currFps = this.count;
        this.count = 1;
    } else {
        this.count += 1;
    }

    this.lastLoop = currentLoop;


    window.requestNextAnimationFrame(this.start.bind(this))

}

Qcanvas.prototype.extend = function(o, n) {

    for (var i in n) {
        (i != 'TYPE') && (o[i] = n[i]);
    }

    this.pushElements(o);
}
Qcanvas.prototype.RandomNumBoth = function(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}
Qcanvas.prototype.pushElements = function(element) {
    if (typeof element.id == 'undefined') {
        //自动生成一个唯一id
        element.id = (new Date()).getTime() + '' + parseInt(Math.random() * 100000000);
        element.shadowFillColor = 'rgba(' + this.RandomNumBoth(0, 255) + ',' + this.RandomNumBoth(0, 255) + ',' + this.RandomNumBoth(0, 255) + ',1)';
        this.elements.push(element);
    }

}
//根据对象属性名称自动生成[set+属性名称]方法
Qcanvas.prototype.appendSetFun = function(o) {
    var _this = this;
    var firstToUpperCase = function(s) {
        var p = s.split('');
        p[0] = p[0].toUpperCase();

        return p.join('');
    }

    //所有元素都附加display属性
    if (typeof o.display == 'undefined') {
        o.display = 'block';
    }




    for (var i in o) {

        (i != 'TYPE') &&
        (i != 'id') &&
        (i != 'withText') &&
        (i != 'withTextAlign') &&
        !this.isFun(o[i]) &&
            (o['set' + firstToUpperCase(i)] = (function(index, obj) {
                var p = index;
                return function(t) {
                    obj[p] = t;
                    return obj;
                }
            })(i, o));


    }
}

//promise类
Qcanvas.prototype.loadPromise = function(fn) {
    var value = null,
        succallbacks = [],
        failcallbacks = [];
    this.then = function(fulfilled, rejected) {
        succallbacks.push(fulfilled);
        failcallbacks.push(rejected);
    }

    function resolve(value) {
        setTimeout(function() {
            succallbacks.forEach((callback) => {
                callback(value);
            })
        }, 0)
    }

    function reject(value) {
        setTimeout(function() {
            failcallbacks.forEach((callback) => {
                callback(value);
            })
        }, 0)

    }

    fn(resolve, reject);
}
Qcanvas.prototype.loadImgSource = function(sourceObj) {
    if (this.isArr(sourceObj)) {
        var urlArr = sourceObj;
    } else {
        if (arguments.length > 0) {
            var urlArr = [].slice.call(arguments)
        }
    }

    var _this = this;
    return new this.loadPromise(function(resolve, reject) {
        //先实现加载图片资源
        var imgArr = [];
        var num = 0;

        for (var i = 0; i < urlArr.length; i++) {
            var img = new Image();
            imgArr.push(img);
            img.onload = function() {
                num++;
                if (num == imgArr.length) {
                    resolve(imgArr);
                }
            };
            img.onerror = function() {
                // console.log('err');
                num++;
                if (num == imgArr.length) {
                    resolve(imgArr);
                }
                console.log('索引为' + this.sort + '的资源加载失败');
            }
            img.sort = i;
            img.src = urlArr[i];
        }



    })


}
//加载图片资源				
Qcanvas.prototype.load = function(sourceObj, callback) {

    if (typeof this.source == 'undefined') {
        this.source = {};
    }

    var _this = this;

    //先实现加载图片资源
    var imgArr = [];
    var num = 0;
    for (var i in sourceObj) {


        var img = new Image();
        imgArr.push(img);
        img.onload = function() {
            _this.source[this.alias] = this;

            num++;

            if (num == imgArr.length) {
                callback(_this.source);
            }
        };
        img.alias = i;
        img.src = sourceObj[i];
    }

}

Qcanvas.prototype.getSourceByName = function(name) {

    return this.source[name];
}
Qcanvas.prototype.isObj = function(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
}


Qcanvas.prototype.isFun = function(o) {
    return Object.prototype.toString.call(o) === '[object Function]';
}

Qcanvas.prototype.isArr = function(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

Qcanvas.prototype.isNum = function(o) {
    return Object.prototype.toString.call(o) === '[object Number]';
}

Qcanvas.prototype.isBool = function(o) {
    return Object.prototype.toString.call(o) === '[object Boolean]';
}

Qcanvas.prototype.isStr = function(o) {
    return Object.prototype.toString.call(o) === '[object String]';
}

Qcanvas.prototype.createShadowCanvas = function() {
    this.shadowCanvas = document.createElement('canvas');
    // this.shadowCanvas = document.getElementById('qcanvas1');
    this.shadowCanvas.id = (new Date()).getTime() + '' + parseInt(Math.random() * 100000000);


    this.shadowCanvas.width = this.stage.width;
    this.shadowCanvas.height = this.stage.height;
    this.shadowContext = this.shadowCanvas.getContext('2d');

};
Qcanvas.prototype.getShadowPixelColor = function(pos) {
    var imageData = this.shadowContext.getImageData(pos.x, pos.y, 1, 1);
    var pixel = imageData.data;
    var r = pixel[0];
    var g = pixel[1];
    var b = pixel[2];
    var a = pixel[3] / 255;
    a = Math.round(a * 100) / 100;
    var rHex = r.toString(16);
    r < 16 && (rHex = "0" + rHex);
    var gHex = g.toString(16);
    g < 16 && (gHex = "0" + gHex);
    var bHex = b.toString(16);
    b < 16 && (bHex = "0" + bHex);
    var rgbaColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
    var rgbColor = "rgb(" + r + "," + g + "," + b + ")";
    var hexColor = "#" + rHex + gHex + bHex;
    return {
        rgba: rgbaColor,
        rgb: rgbColor,
        hex: hexColor,
        r: r,
        g: g,
        b: b,
        a: a
    };
};
//销毁所有对象 释放资源
Qcanvas.prototype.destroy = function() {
    this.elements = [];

}
Qcanvas.prototype.Tween = {
    Linear: function(t, b, c, d) { return c * t / d + b; },
    Quad: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        }
    },
    Cubic: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        }
    },
    Quart: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        }
    },
    Quint: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        }
    },
    Sine: {
        easeIn: function(t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOut: function(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }
    },
    Expo: {
        easeIn: function(t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
        },
        easeOut: function(t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    Circ: {
        easeIn: function(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    },
    Elastic: {
        easeIn: function(t, b, c, d, a, p) {
            var s;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                s = p / 4;
                a = c;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        easeOut: function(t, b, c, d, a, p) {
            var s;
            if (t == 0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        easeInOut: function(t, b, c, d, a, p) {
            var s;
            if (t == 0) return b;
            if ((t /= d / 2) == 2) return b + c;
            if (typeof p == "undefined") p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            } else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        }
    },
    Back: {
        easeIn: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    },
    Bounce: {
        easeIn: function(t, b, c, d) {
            //return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
            return c - this.easeOut(d - t, 0, c, d) + b;
        },
        easeOut: function(t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        },
        easeInOut: function(t, b, c, d) {
            if (t < d / 2) {
                //return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
                return this.easeIn(t * 2, 0, c, d) * .5 + b;
            } else {
                //return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
                return this.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
            }
        }
    }
}


/**
 * 
 * 根据旋转起点、旋转中心和旋转角度计算旋转终点的坐标
 * 
 * @param {Array} startPoint  起点坐标
 * @param {Array} centerPoint  旋转点坐标
 * @param {number} angle 旋转角度
 * 
 * @return {Array} 旋转终点的坐标
 */

Qcanvas.prototype.getEndPointByRotate = function(startPoint, centerPoint, angle) {
    var centerX = centerPoint[0];
    var centerY = centerPoint[1];

    var x1 = startPoint[0] - centerX;
    var y1 = startPoint[1] - centerY;


    var x2 = x1 * Math.cos(angle) - y1 * Math.sin(angle);
    var y2 = x1 * Math.sin(angle) + y1 * Math.cos(angle);
    return [x2 + centerX, y2 + centerY];
}

/**
 * 计算旋转角度
 * 
 * @param {Array} centerPoint 旋转中心坐标
 * @param {Array} startPoint 旋转起点
 * @param {Array} endPoint 旋转终点
 * 
 * @return {number} 旋转角度
 */

Qcanvas.prototype.getRotateAngle = function(centerPoint, startPoint, endPoint) {
    var centerX = centerPoint[0];
    var centerY = centerPoint[1];
    var rotateStartX = startPoint[0];
    var rotateStartY = startPoint[1];
    var touchX = endPoint[0];
    var touchY = endPoint[1];

    // 两个向量
    var v1 = [rotateStartX - centerX, rotateStartY - centerY];
    var v2 = [touchX - centerX, touchY - centerY];

    // 公式的分子
    var numerator =  v1[0] * v2[1] - v1[1] * v2[0];
    // 公式的分母
    var denominator = Math.sqrt(Math.pow(v1[0], 2) + Math.pow(v1[1], 2)) 
        * Math.sqrt(Math.pow(v2[0], 2) + Math.pow(v2[1], 2));
    var sin = numerator / denominator;
    return Math.asin(sin);
}



typeof window.requestNextAnimationFrame == 'undefined' &&
    (function() {

        window.requestNextAnimationFrame =
            (function() {
                var originalWebkitRequestAnimationFrame = undefined,
                    wrapper = undefined,
                    callback = undefined,
                    geckoVersion = 0,
                    userAgent = navigator.userAgent,
                    index = 0,
                    self = this;

                // Workaround for Chrome 10 bug where Chrome
                // does not pass the time to the animation function

                if (window.webkitRequestAnimationFrame) {
                    // Define the wrapper

                    wrapper = function(time) {
                        if (time === undefined) {
                            time = +new Date();
                        }
                        self.callback(time);
                    };

                    // Make the switch

                    originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;

                    window.webkitRequestAnimationFrame = function(callback, element) {
                        self.callback = callback;

                        // Browser calls the wrapper and wrapper calls the callback

                        originalWebkitRequestAnimationFrame(wrapper, element);
                    }
                }

                // Workaround for Gecko 2.0, which has a bug in
                // mozRequestAnimationFrame() that restricts animations
                // to 30-40 fps.

                if (window.mozRequestAnimationFrame) {
                    // Check the Gecko version. Gecko is used by browsers
                    // other than Firefox. Gecko 2.0 corresponds to
                    // Firefox 4.0.

                    index = userAgent.indexOf('rv:');

                    if (userAgent.indexOf('Gecko') != -1) {
                        geckoVersion = userAgent.substr(index + 3, 3);

                        if (geckoVersion === '2.0') {
                            // Forces the return statement to fall through
                            // to the setTimeout() function.

                            window.mozRequestAnimationFrame = undefined;
                        }
                    }
                }

                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||

                    function(callback, element) {
                        var start,
                            finish;


                        window.setTimeout(function() {
                            start = +new Date();
                            callback(start);
                            finish = +new Date();

                            self.timeout = 1000 / self.fps - (finish - start);

                        }, self.timeout);
                    };
            })
            ();
    })()