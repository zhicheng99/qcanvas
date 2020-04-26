/*画线类*/	
function Qline(qcanvas){
	this.qlineVersion = '1.0';
	this.qcanvas = qcanvas;
	// console.log(this);
	

	
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
Qline.prototype.line = function(options){
	
	var OPTIONS = {
		TYPE:'line',
		
		color:'#000',  //颜色
		like:'-',     //画出来的样子 [-][->][--][-->]
		width:1,
		start:[0,0],
		end:[50,50],
		//withText:'text', //带着的文本
		//withTextAlign:'center'  //文本的横向位置 [left center(默认) right]
	}
	
	
			
						
	this.qcanvas.extend(OPTIONS,options);		
	this.qcanvas.appendSetFun(OPTIONS);
	
	//分离文字
	if(typeof OPTIONS.withText !='undefined' && OPTIONS.withText!=''){
		
		this.splitText(OPTIONS);
			
	}
	
	return OPTIONS;
}

Qline.prototype.getMiddleCoordinates = function(obj){

	var start = this.qcanvas.isFun(obj.start)?obj.start():obj.start;
	var end = this.qcanvas.isFun(obj.end)?obj.end():obj.end;

	return [
		(start[0] < end[0] ? start[0]:end[0])+Math.abs(start[0]-end[0]) * 0.5,
		(start[1] < end[1] ? start[1]:end[1])+Math.abs(start[1]-end[1]) * 0.5,
	];
	
}
		
//分离携带的文字	
Qline.prototype.splitText = function(obj){
	

	var _this = this;
	this.qcanvas.qtext.text({
			TYPE:'text',
			text:obj.withText,
			color:obj.color,
			withTextAlign:obj.withTextAlign?obj.withTextAlign:'center',
			start:function(){return _this.getMiddleCoordinates.call(_this,obj)}
	});
		
}	
	
Qline.prototype.paintLine  = function(obj){
	this.qcanvas.qanimation.createAnimation(obj);

	var start = this.qcanvas.isFun(obj.start)?obj.start():obj.start;
	var end = this.qcanvas.isFun(obj.end)?obj.end():obj.end;

	switch(obj.like)
	{
		case '-':
			this.qcanvas.context.strokeStyle = obj.color;
			this.qcanvas.context.beginPath();
			this.qcanvas.context.lineWidth=obj.width;
			//if(obj.like == '--'){
			//	this.qcanvas.context.setLineDash([2, 4]);
			//}
			
			this.qcanvas.context.moveTo(start[0],start[1]);
			this.qcanvas.context.lineTo(end[0],end[1]);
			this.qcanvas.context.stroke();
			
			
			
			break;
		case '->':
			this.qcanvas.context.strokeStyle = obj.color;
			this.qcanvas.context.beginPath();
			this.qcanvas.context.lineWidth=obj.width;
			//if(obj.like == '--'){
			//	this.qcanvas.context.setLineDash([2, 4]);
			//}
			
			this.qcanvas.context.moveTo(start[0],start[1]);
			this.qcanvas.context.lineTo(end[0],end[1]);
			this.qcanvas.context.stroke();
			
			//分解出两条实线 生成箭头效果
			// if(this.lineIsChange(obj)){
			// 		this.appendArrow(obj);
			// }

			// //画箭头			
			// if(typeof obj.arrow !='undefined'){ 
			// 		arguments.callee.call(this,obj.arrow[0]);
			// 		arguments.callee.call(this,obj.arrow[1]);
			// }
			this.drawArrow(start[0], start[1], end[0], end[1],30,10,1,obj.color);

			
			break;

		case '--':
			this.qcanvas.context.strokeStyle = obj.color;
			this.qcanvas.context.beginPath();
			this.qcanvas.context.lineWidth=obj.width; 

			this.qcanvas.context.setLineDash([3]);
			this.qcanvas.context.moveTo(start[0],start[1]);
			this.qcanvas.context.lineTo(end[0],end[1]);
			this.qcanvas.context.stroke();

			// this.paintDashLine(obj);
			break;
		
		case '-->':
			this.qcanvas.context.strokeStyle = obj.color;
			this.qcanvas.context.beginPath();
			this.qcanvas.context.lineWidth=obj.width; 

			this.qcanvas.context.setLineDash([3]);
			this.qcanvas.context.moveTo(start[0],start[1]);
			this.qcanvas.context.lineTo(end[0],end[1]);
			this.qcanvas.context.stroke();


			//分解出两条实线 生成箭头效果
			// if(this.lineIsChange(obj)){
			// 		this.appendArrow(obj);
			// }

			// //画箭头 虚线加箭头 线段可以能比较短  后期修复			
			// if(typeof obj.arrow !='undefined'){ 
			// 		arguments.callee.call(this,obj.arrow[0]);
			// 		arguments.callee.call(this,obj.arrow[1]);
			// }

			// this.paintDashLine(obj);

			
			//画箭头
			// if(typeof obj.arrow !='undefined'){ 
			// 		arguments.callee.call(this,obj.arrow[0]);
			// 		arguments.callee.call(this,obj.arrow[1]);
			// }
			this.drawArrow(start[0], start[1], end[0], end[1],30,10,1,obj.color);
			
			
			
			

			break;
	}	
	
}	


/**
 * 画箭头的两条实线
 * @param  {[type]} fromX   [description]
 * @param  {[type]} fromY   [description]
 * @param  {[type]} toX     [description]
 * @param  {[type]} toY     [description]
 * @param  {[type]} theta   [description]
 * @param  {[type]} headlen [description]
 * @param  {[type]} width   [description]
 * @param  {[type]} color   [description]
 * @return {[type]}         [description]
 */
Qline.prototype.drawArrow = function(fromX, fromY, toX, toY,theta,headlen,width,color) {
 
    theta = typeof(theta) != 'undefined' ? theta : 30;
    headlen = typeof(theta) != 'undefined' ? headlen : 10;
    width = typeof(width) != 'undefined' ? width : 1;
    color = typeof(color) != 'color' ? color : '#000';
 
    // 计算各角度和对应的P2,P3坐标
    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);
 
    this.qcanvas.context.save();
    this.qcanvas.context.beginPath();
 
    var arrowX = fromX - topX,
        arrowY = fromY - topY;
 		this.qcanvas.context.beginPath();
  		this.qcanvas.context.setLineDash([]);
    // this.qcanvas.context.moveTo(arrowX, arrowY);
    // this.qcanvas.context.moveTo(fromX, fromY);
    // this.qcanvas.context.lineTo(toX, toY);
    arrowX = toX + topX;
    arrowY = toY + topY;
    this.qcanvas.context.moveTo(arrowX, arrowY);
    this.qcanvas.context.lineTo(toX, toY);
    arrowX = toX + botX;
    arrowY = toY + botY;
    this.qcanvas.context.lineTo(arrowX, arrowY);
    this.qcanvas.context.strokeStyle = color;
    this.qcanvas.context.lineWidth = width;
    this.qcanvas.context.stroke();

}



//附加箭头对象 (不用这个了)
Qline.prototype.appendArrow = function(obj){

	var start = this.qcanvas.isFun(obj.start)?obj.start():obj.start;
	var end = this.qcanvas.isFun(obj.end)?obj.end():obj.end;

				arrowObj = this._calcH({
				
				},{
					'x':start[0],
					'y':start[1],
				},{
					'x':end[0],
					'y':end[1],
				});
	
			obj.arrow = [
							{
									like:'-',
									start:[arrowObj.h1.x,arrowObj.h1.y],
									end:[end[0],end[1]]
							},
							{
									like:'-',
									start:[arrowObj.h2.x,arrowObj.h2.y],
									end:[end[0],end[1]]
							},	
					]
}	
	
	
 //计算头部坐标
Qline.prototype._calcH=function(a,sp,ep){
	 var theta=Math.atan((ep.x-sp.x)/(ep.y-sp.y));
	 var cep=this._scrollXOY(ep,-theta);
	 var csp=this._scrollXOY(sp,-theta);
	 var ch1={x:0,y:0};
	 var ch2={x:0,y:0};
	 var l=cep.y-csp.y;
	 ch1.x=cep.x+l*(a.sharp||0.025);
	 ch1.y=cep.y-l*(a.size||0.05);
	 ch2.x=cep.x-l*(a.sharp||0.025);
	 ch2.y=cep.y-l*(a.size||0.05);
	 var h1=this._scrollXOY(ch1,theta);
	 var h2=this._scrollXOY(ch2,theta);
	 return {
		h1:h1,
		h2:h2
		};
 };
 //旋转坐标
Qline.prototype._scrollXOY=function(p,theta){
	 return {
		x:p.x*Math.cos(theta)+p.y*Math.sin(theta),
		y:p.y*Math.cos(theta)-p.x*Math.sin(theta)
	 };
 };
	
	

Qline.prototype.getBeveling = function(x,y){  
    return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));  
}  	


//起止点是否有变化	
Qline.prototype.lineIsChange = function(obj){
	
	var start = this.qcanvas.isFun(obj.start)?obj.start():obj.start;
	var end = this.qcanvas.isFun(obj.end)?obj.end():obj.end;
	//当前的起止点和原来的做比较
	
	if(typeof obj.oldStart =='undefined'){
			obj.oldStart = JSON.parse(JSON.stringify(start));
			obj.oldEnd = JSON.parse(JSON.stringify(end));
			return true;
	}else{
		
		if(start[0]==obj.oldStart[0] &&
			 start[1]==obj.oldStart[1] &&
			 end[0]==obj.oldEnd[0] &&
			 end[1]==obj.oldEnd[1]
			){
			
			return false;
		}else{
			obj.oldStart = JSON.parse(JSON.stringify(start));
			obj.oldEnd = JSON.parse(JSON.stringify(end));
			return true;
		}
		
		
	}
}	
	
//画虚线	
Qline.prototype.paintDashLine = function(obj){
	
			this.qcanvas.context.strokeStyle = obj.color;
			this.qcanvas.context.beginPath();
			this.qcanvas.context.lineWidth=obj.width;

			var start = this.qcanvas.isFun(obj.start)?obj.start():obj.start;
			var end = this.qcanvas.isFun(obj.end)?obj.end():obj.end;
	
			if(this.lineIsChange(obj)){
				
					var dashLen = 2;  
					//得到斜边的总长度  
					var beveling = this.getBeveling(end[0]-start[0],end[0]-start[1]);  
					//计算有多少个线段  
					var num = Math.floor(beveling/dashLen);  
			
					obj.dashPoint = [];
						
					for(var i = 0 ; i < num; i++)  
					{  
						obj.dashPoint.push([
							start[0]+(end[0]-start[0])/num*i,
							start[1]+(end[1]-start[1])/num*i
						])  
					}  
				
				if(obj.like=='-->'){
						this.appendArrow(obj);
				}
				
					
				
				
			}else{
				
				for(var i = 0 ; i < obj.dashPoint.length; i++){
					  
						this.qcanvas.context[i%2 == 0 ? 'moveTo' : 'lineTo'](obj.dashPoint[i][0],obj.dashPoint[i][1]);  
				} 
			
			}
			
			
	
			this.qcanvas.context.stroke();  
}	
	
	

	
	

	
/*文字类--------------------------------------------------------*/
function Qtext(qcanvas){
	this.qtextVersion = '1.0';
	this.qcanvas = qcanvas;
	
	
}	

Qtext.prototype.text = function(options){
		var OPTIONS = {
			TYPE:'text',
			text:'Qcanvas Text',
			color:'red',
			textAlign:'center',
			textBaseline:'middle',
			fontSize:"12px",
			fontFamily:'Microsoft YaHei',
			start:[0,0],
			drag:true,
			pointerEvent:'auto',
			range:{width:0,height:0},
			degree:0,
			centerPoints:function(){ //元素中心点相对于整个画布的坐标

				var x = 0;
				var y = 0;


				if(this.textAlign == 'left'){
					x = this.range.width*0.5+this.start[0];

				}else if(this.textAlign == 'center'){
					x = this.start[0];
				}else if(this.textAlign == 'right'){
					x = this.start[0] - this.range.width*0.5;
				}

				if(this.textBaseline == 'top'){
					y = this.range.height *0.5+this.start[1];
				}else if(this.textBaseline == 'middle'){
					y = this.start[1];
				}else if(this.textBaseline == 'bottom'){
					y = this.start[1] - this.range.height*0.5;
				}

				return {
					x:x,
					y:y
				}
			},
			polyPoints:function(){  //顶点坐标序列
					var half_x = this.range.width*0.5;
					var half_y = this.range.height*0.5; 
					var center = this.centerPoints();



					// var pos1x = 0,pos1y = 0,pos2x = 0,pos2y = 0,pos3x = 0,pos3y = 0,pos4x = 0,pos4y = 0;


					// if(this.textAlign == 'center'){
					// 	pos1x = this.start[0]-half_x;
					// 	pos2x = this.start[0]+half_x;
					// 	pos3x = this.start[0]+half_x;
					// 	pos4x = this.start[0]-half_x;
					// }else if(this.textAlign == 'left'){
					// 	pos1x = this.start[0];
					// 	pos2x = this.start[0]+half_x*2;
					// 	pos3x = this.start[0];
					// 	pos4x = this.start[0]+half_x*2;
					// }else if(this.textAlign == 'right'){
					// 	pos1x = this.start[0]-half_x*2;
					// 	pos2x = this.start[0];
					// 	pos3x = this.start[0];
					// 	pos4x = this.start[0]-half_x*2;
					// }

					// if(this.textBaseline == 'middle'){
					// 	pos1y = this.start[1]-half_y;
					// 	pos2y = this.start[1]-half_y;
					// 	pos3y = this.start[1]+half_y;
					// 	pos4y = this.start[1]+half_y;
					// }else if(this.textBaseline == 'top'){
					// 	pos1y = this.start[1];
					// 	pos2y = this.start[1];
					// 	pos3y = this.start[1]+half_y*2;
					// 	pos4y = this.start[1]+half_y*2;
					// }else if(this.textBaseline == 'bottom'){
					// 	pos1y = this.start[1]-half_y*2;
					// 	pos2y = this.start[1]-half_y*2;
					// 	pos3y = this.start[1];
					// 	pos4y = this.start[1];
					// }

					// return [
					// 	{"x":pos1x,"y":pos1y},
					// 	{"x":pos2x,"y":pos2y},
					// 	{"x":pos3x,"y":pos3y},
					// 	{"x":pos4x,"y":pos4y}

					// ]


					// return [
					// 	{"x":this.start[0]-half_x,"y":this.start[1]-half_y},
					// 	{"x":this.start[0]+half_x,"y":this.start[1]-half_y},
					// 	{"x":this.start[0]+half_x,"y":this.start[1]+half_y},
					// 	{"x":this.start[0]-half_x,"y":this.start[1]+half_y},
					// ]
					var temp = 0;
					if(this.degree <0){ 
						temp = 360+this.degree;
					}else{
						temp = this.degree;
					}
					
					
					if((temp>0 && temp<=90) || (temp>180 && temp<=270)){

						if(temp >180){
							temp = temp-180;
						}

						var E_x = center.x-Math.cos(temp*Math.PI/180)*half_x;
						var E_y = center.y-Math.sin(temp*Math.PI/180)*half_x;
						 
						return [
							{x:E_x-Math.sin(temp*Math.PI/180)*half_y,y:E_y+Math.cos(temp*Math.PI/180)*half_y},
							{x:E_x+Math.sin(temp*Math.PI/180)*half_y,y:E_y-Math.cos(temp*Math.PI/180)*half_y},
							{x:center.x-(E_x-Math.sin(temp*Math.PI/180)*half_y)+center.x,y:center.y-(E_y+Math.cos(temp*Math.PI/180)*half_y)+center.y},
							{x:center.x-(E_x+Math.sin(temp*Math.PI/180)*half_y)+center.x,y:center.y-(E_y-Math.cos(temp*Math.PI/180)*half_y)+center.y}
						];



					}else if((temp>90 && temp<180) || (temp>270 && temp<360)){

						if(temp>270){
							temp = temp-180;
						}

						temp = 180 - temp;
						var E_x = center.x+Math.cos(temp*Math.PI/180)*half_x;
						var E_y = center.y-Math.sin(temp*Math.PI/180)*half_x;
 

						return [
							{x:E_x-Math.sin(temp*Math.PI/180)*half_y,y:E_y-Math.cos(temp*Math.PI/180)*half_y},
							{x:E_x+Math.sin(temp*Math.PI/180)*half_y,y:E_y+Math.cos(temp*Math.PI/180)*half_y},
							{x:center.x-(E_x-Math.sin(temp*Math.PI/180)*half_y)+center.x,y:center.y-(E_y-Math.cos(temp*Math.PI/180)*half_y)+center.y},
							{x:center.x-(E_x+Math.sin(temp*Math.PI/180)*half_y)+center.x,y:center.y-(E_y+Math.cos(temp*Math.PI/180)*half_y)+center.y}
						]




					}else{
						return [
							{"x":center.x-half_x,"y":center.y-half_y},
							{"x":center.x+half_x,"y":center.y-half_y},
							{"x":center.x+half_x,"y":center.y+half_y},
							{"x":center.x-half_x,"y":center.y+half_y}
						]
					}
					
					
			},	
		}
			
	this.qcanvas.extend(OPTIONS,options);
	this.qcanvas.appendSetFun(OPTIONS);
	
	return OPTIONS;
}

Qtext.prototype.paintText = function(obj){
	obj.range = {width:this.qcanvas.context.measureText(this.qcanvas.isFun(obj.text)?obj.text():obj.text).width,
							 height:parseInt(obj.fontSize)	
							};
		//有角度时 移动画布原点 旋转画布
		var centerPos = this.qcanvas.setDegree(obj);  

		//设置字体颜色
    	// this.qcanvas.context.strokeStyle = obj.color;
    	this.qcanvas.context.fillStyle = obj.color;
 
		//可能路径是虚线形式的 设置成实线
		this.qcanvas.context.setLineDash([]); 
		
		var start = this.qcanvas.isFun(obj.start)?obj.start():obj.start;
		this.qcanvas.context.textBaseline = obj.textBaseline;
		this.qcanvas.context.font = obj.fontSize + ' '+obj.fontFamily;
		this.qcanvas.context.textAlign = obj.textAlign;
    	// this.qcanvas.context.strokeText(this.qcanvas.isFun(obj.text)?obj.text():obj.text,  start[0],  start[1]);
    	this.qcanvas.context.fillText(this.qcanvas.isFun(obj.text)?obj.text():obj.text,  start[0],  start[1]);


    	

		// //重置画布原点 旋转复原
		this.qcanvas.resetDegree(obj,centerPos); 
		

		//重置
		this.qcanvas.context.textAlign ='center';
		this.qcanvas.context.textBaseline ='middle';
	
				
				
				
}


/*矩形类-----------------------------------------------------*/
function Qrect(qcanvas){
	this.qrectVersion = '1.0';
	this.qcanvas = qcanvas;

}

Qrect.prototype.rect = function(options){
	var _this = this;
	var OPTIONS = {
			TYPE:'rect',
			lineWidth:1,
			start:[0,0],
			width:100,
			height:50,
			borderColor:'#000', 
			fillColor:'',
			drag:true,
			degree:0,
			radius:0,
			pointerEvent:'auto',
			centerPoints:function(){ //元素中心点相对于整个画布的坐标
					var start = _this.qcanvas.isFun(this.start)?this.start():this.start;
					var width = _this.qcanvas.isFun(this.width)?this.width():this.width;
					var height = _this.qcanvas.isFun(this.height)?this.height():this.height;


					return {
						x:start[0]+width*0.5,
						y:start[1]+height*0.5
					}

			},
			polyPoints:function(){  //顶点坐标序列
					var start = _this.qcanvas.isFun(this.start)?this.start():this.start;
					var width = _this.qcanvas.isFun(this.width)?this.width():this.width;
					var height = _this.qcanvas.isFun(this.height)?this.height():this.height;

					var half_x = width*0.5;
					var half_y = height*0.5; 
					var center = this.centerPoints();


					var temp = 0;
					if(this.degree <0){ 
						temp = 360+this.degree;
					}else{
						temp = this.degree;
					}
					
					
					if((temp>0 && temp<=90) || (temp>180 && temp<=270)){

						if(temp >180){
							temp = temp-180;
						}

						var E_x = center.x-Math.cos(temp*Math.PI/180)*half_x;
						var E_y = center.y-Math.sin(temp*Math.PI/180)*half_x;
						 
						return [
							{x:E_x-Math.sin(temp*Math.PI/180)*half_y,y:E_y+Math.cos(temp*Math.PI/180)*half_y},
							{x:E_x+Math.sin(temp*Math.PI/180)*half_y,y:E_y-Math.cos(temp*Math.PI/180)*half_y},
							{x:center.x-(E_x-Math.sin(temp*Math.PI/180)*half_y)+center.x,y:center.y-(E_y+Math.cos(temp*Math.PI/180)*half_y)+center.y},
							{x:center.x-(E_x+Math.sin(temp*Math.PI/180)*half_y)+center.x,y:center.y-(E_y-Math.cos(temp*Math.PI/180)*half_y)+center.y}
						];



					}else if((temp>90 && temp<180) || (temp>270 && temp<360)){

						if(temp>270){
							temp = temp-180;
						}

						temp = 180 - temp;
						var E_x = center.x+Math.cos(temp*Math.PI/180)*half_x;
						var E_y = center.y-Math.sin(temp*Math.PI/180)*half_x;
 

						return [
							{x:E_x-Math.sin(temp*Math.PI/180)*half_y,y:E_y-Math.cos(temp*Math.PI/180)*half_y},
							{x:E_x+Math.sin(temp*Math.PI/180)*half_y,y:E_y+Math.cos(temp*Math.PI/180)*half_y},
							{x:center.x-(E_x-Math.sin(temp*Math.PI/180)*half_y)+center.x,y:center.y-(E_y-Math.cos(temp*Math.PI/180)*half_y)+center.y},
							{x:center.x-(E_x+Math.sin(temp*Math.PI/180)*half_y)+center.x,y:center.y-(E_y+Math.cos(temp*Math.PI/180)*half_y)+center.y}
						]




					}else{
						
						return [
							{"x":start[0],"y":start[1]},
							{"x":start[0]+width,"y":start[1]},
							{"x":start[0]+width,"y":start[1]+height},
							{"x":start[0],"y":start[1]+height},
						]
					}
					
			},	
			// mouseup:function(position){
			// 		console.log('添加一些点击的事件');
			// }			

		
			
		}
			
	this.qcanvas.extend(OPTIONS,options);
	this.qcanvas.appendSetFun(OPTIONS);
	
	return OPTIONS;
}

Qrect.prototype.drawRoundedRect = function(ctx, x, y, width, height, obj) {
			

            ctx.beginPath(); // draw top and top right corner 

            ctx.lineWidth=obj.lineWidth;
            ctx.strokeStyle=obj.borderColor;
           
            ctx.moveTo(x + obj.radius, y);
            ctx.arcTo(x + width, y, x + width, y + obj.radius, obj.radius); // draw right side and bottom right corner 
            ctx.arcTo(x + width, y + height, x + width - obj.radius, y + height, obj.radius); // draw bottom and bottom left corner 
            ctx.arcTo(x, y + height, x, y + height - obj.radius, obj.radius); // draw left and top left corner 
            ctx.arcTo(x, y, x + obj.radius, y, obj.radius);
            

            ctx.stroke();


            
            var rgb = this.qcanvas.colorRgb(obj.fillColor).replace('RGB(','').replace(')','');

		(obj.fillColor!='') && 
			(obj.opacity && (ctx.fillStyle="rgba("+rgb+','+obj.opacity+")") ||
			(ctx.fillStyle = obj.fillColor)) &&
			ctx.fill();
 
        }

Qrect.prototype.paintRect = function(obj){
		this.qcanvas.qanimation.createAnimation(obj);	

		var start = this.qcanvas.isFun(obj.start)?obj.start():obj.start;
		var width = this.qcanvas.isFun(obj.width)?obj.width():obj.width;
		var height = this.qcanvas.isFun(obj.height)?obj.height():obj.height;


		//有角度时 移动画布原点 旋转画布
		var centerPos = this.qcanvas.setDegree(obj);   

		if(this.qcanvas.isNum(obj.radius) && (obj.radius>0)){  //圆角矩形

			this.drawRoundedRect(this.qcanvas.context,start[0],start[1],width,height,obj);
		}else{
			this.qcanvas.context.beginPath();
			this.qcanvas.context.lineWidth=obj.lineWidth;
			this.qcanvas.context.strokeStyle=obj.borderColor;
		
			
		
			this.qcanvas.context.rect(start[0],start[1],width,height);
			this.qcanvas.context.stroke();

			var rgb = this.qcanvas.colorRgb(obj.fillColor).replace('RGB(','').replace(')','');
		
		(obj.fillColor!='') && 
			(obj.opacity && (this.qcanvas.context.fillStyle="rgba("+rgb+','+obj.opacity+")") ||
			(this.qcanvas.context.fillStyle = obj.fillColor)) &&
			this.qcanvas.context.fill();
		}

		
	
	
		// (obj.fillColor!='') && (this.qcanvas.context.fillStyle = obj.fillColor) && this.qcanvas.context.fill();

		// //重置画布原点 旋转复原
		this.qcanvas.resetDegree(obj,centerPos); 

}

		
/*不规则图形类*/
function Qshape(qcanvas){
	this.qshapeVersion = '1.0';
	this.qcanvas = qcanvas;
	
	
}	

Qshape.prototype.shape = function(options){
		var _this = this;
		var OPTIONS = {
			TYPE:'shape',
			fillColor:'#666',
			points:[
				[310,20],
				[556,100],
				[530,191],
				[350,180]
			],
			drag:true,
			pointerEvent:'auto',
			polyPoints:function(){  //顶点坐标序列
					
				var temp = [];
				var points = _this.qcanvas.isFun(this.points)?this.points():this.points;
				points.forEach(function(v,index){
					temp.push({
						"x":v[0],
						"y":v[1]
					})
				})
				
				return temp;
					
			},	
			
		}
			
	this.qcanvas.extend(OPTIONS,options);
	this.qcanvas.appendSetFun(OPTIONS);
	
	return OPTIONS;
}

Qshape.prototype.paintShape = function(obj){
	this.qcanvas.context.lineWidth=1;
	this.qcanvas.context.strokeStyle = "#000";
	this.qcanvas.context.beginPath();
	
	var _this = this;
	var points = this.qcanvas.isFun(obj.points)?obj.points():obj.points;
	points.forEach(function(v,index){
		if(index==0){
			_this.qcanvas.context.moveTo(v[0], v[1]);
		}else{
			_this.qcanvas.context.lineTo(v[0], v[1]);
		}
	})
	
	
	//先关闭绘制路径。注意，此时将会使用直线连接当前端点和起始端点。
	this.qcanvas.context.closePath();
	this.qcanvas.context.stroke();
	
	var rgb = this.qcanvas.colorRgb(obj.fillColor).replace('RGB(','').replace(')','');
	
	(obj.fillColor!='') && 
		(obj.opacity && (this.qcanvas.context.fillStyle="rgba("+rgb+','+obj.opacity+")") ||
		(this.qcanvas.context.fillStyle = obj.fillColor)) &&
		this.qcanvas.context.fill();
}
		
	

/*圆类--------------------*/
function Qarc(qcanvas){
	this.qarcVersion = '1.0';
	this.qcanvas = qcanvas;
  this.unit = Math.PI / 180;
}

Qarc.prototype.arc = function(options){
	var  _this = this;
	var OPTIONS = {
			TYPE:'arc',
			lineWidth:1,
			borderColor:'#000',
			fillColor:'red',
			start:[0,0],
			r:20,
			sAngle:0,
			eAngle:0,
			counterclockwise:false,
		  drag:true,
		  pointerEvent:'auto',
			polyPoints:function(){  //顶点坐标序列 (注意顺序 要形成一个闭合的区域)
				
				var start = _this.qcanvas.isFun(this.start)?this.start():this.start;
				//平均分八个点 有45度的
				var temp =  [
					
					
					{'x':start[0]+this.r,'y':start[1]},
					{'x':start[0]+0.7071*this.r,'y':start[1]-0.7071*this.r}, //第一象限的45度的点
					{'x':start[0],'y':start[1]-this.r},
					{'x':start[0]-0.7071*this.r,'y':start[1]-0.7071*this.r}, //第二象限的45度的点
					{'x':start[0]-this.r,'y':start[1]},
					{'x':start[0]-0.7071*this.r,'y':start[1]+0.7071*this.r}, //第三象限的45度的度
					{'x':start[0],'y':start[1]+this.r},
					
					
					
					
					{'x':start[0]+0.7071*this.r,'y':start[1]+0.7071*this.r}, //第四象限的45度的度
				];
				return temp;	
					
			},	
		}
			
	this.qcanvas.extend(OPTIONS,options);
	this.qcanvas.appendSetFun(OPTIONS);
	
	return OPTIONS;
}	
	
Qarc.prototype.paintArc = function(obj){
	this.qcanvas.qanimation.createAnimation(obj);
	this.qcanvas.context.beginPath();
	this.qcanvas.context.lineWidth=obj.lineWidth;
	this.qcanvas.context.strokeStyle=obj.borderColor;
	var start = this.qcanvas.isFun(obj.start)?obj.start():obj.start;
	this.qcanvas.context.arc(start[0],start[1],obj.r,obj.sAngle*this.unit,obj.eAngle*this.unit);
	this.qcanvas.context.stroke();
	
	var rgb = this.qcanvas.colorRgb(obj.fillColor).replace('RGB(','').replace(')','');
	
	(obj.fillColor!='') && 
		(obj.opacity && (this.qcanvas.context.fillStyle="rgba("+rgb+','+obj.opacity+")") ||
		(this.qcanvas.context.fillStyle = obj.fillColor)) &&
		this.qcanvas.context.fill();
	
}	
	
	
/*多边形类----------------*/
function Qpolygon(qcanvas){
	this.qpolygonVersion = '1.0';
	this.qcanvas = qcanvas;
}
Qpolygon.prototype.polygon = function(options){
	var OPTIONS = {
			TYPE:'polygon',
			lineWidth:1,
			borderColor:'#000',
			fillColor:'red',
			start:[0,0],
			r:20,
			num:4,
			drag:true,
			pointerEvent:'auto'
		}
			
	this.qcanvas.extend(OPTIONS,options);
	this.qcanvas.appendSetFun(OPTIONS);
	
	return OPTIONS;
}	
	
	
Qpolygon.prototype.paintPolygon = function(obj){
	var ctx = this.qcanvas.context;
	
	var x = obj && obj.start[0] || 0;  //中心点x坐标
    var y = obj && obj.start[1] || 0;  //中心点y坐标
    var num = obj && obj.num || 3;   //图形边的个数
    var r = obj && obj.r || 100;   //图形的半径
    var width = obj && obj.lineWidth || 1;
    var strokeStyle = obj && obj.borderColor;
    var fillStyle = obj && obj.fillColor;
    //开始路径
    ctx.beginPath();
    var points = [];
    var startX = x + r * Math.cos(2*Math.PI*0/num);
    var startY = y + r * Math.sin(2*Math.PI*0/num);
    ctx.moveTo(startX, startY);
    points.push({x:startX,y:startY});
    for(var i = 1; i <= num; i++) {
        var newX = x + r * Math.cos(2*Math.PI*i/num);
        var newY = y + r * Math.sin(2*Math.PI*i/num);
        ctx.lineTo(newX, newY);
        points.push({x:newX,y:newY});
    }
    ctx.closePath();


    //顶点坐标序列 用于点击时目标元素的判断
    obj.polyPoints = function(){
    	return points;
    }



    //路径闭合
    if(strokeStyle) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = width;
        ctx.lineJoin = 'round';
        ctx.stroke();
    }
    if(fillStyle) {
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }
	
}		

/*动画类----------------*/
function Qanimation(qcanvas){
	this.qanimationVersion = '1.0';
	this.qcanvas = qcanvas;
}	

Qanimation.prototype.animate = function(aim,startStyle,endStyle,during,isLoop,tweenType,finishCallback){
	
	//要求 startStyle对象和endStyle对象属性必须是一样的
	//序列帧对象(属性=>值)  
	var frames = {};
	var framesCount = this.qcanvas.fps * during;
	var tweenType = typeof tweenType !='undefined'?(tweenType==''?'Linear':tweenType):'Linear';
	// console.log(tweenType);
	
	var tween = eval('this.qcanvas.Tween["'+tweenType.split('.').join('"]["')+'"]');
	// console.log(tween);
	
	for(var i in startStyle){
			
			//如果是属性的值是数组的 生成成对的数组序列 用于渲染动画
			if(this.qcanvas.isArr(startStyle[i])){
				frames[i] = [];
				
				var perArr = [];
				for(var j=0;j<startStyle[i].length;j++){
						perArr.push((endStyle[i][j] - startStyle[i][j])/framesCount);
				}
				
				
				
				for(var t=0;t<framesCount;t++){
					var temp = [];
					for(var p=0;p<perArr.length;p++){
							//temp.push(startStyle[i][p]+ t*perArr[p]);  //暂时都是线性变化 
						temp.push(tween(t,startStyle[i][p],perArr[p]*framesCount,framesCount));
					}
					
					frames[i].push(temp);
				}
				
			}
			
			//属性的值是数字的
			if(this.qcanvas.isNum(startStyle[i])){
				frames[i] = [];
				var per = (endStyle[i] - startStyle[i])/framesCount;
				
				for(var t=0;t<framesCount;t++){
					frames[i].push(tween(t,startStyle[i],endStyle[i] - startStyle[i],framesCount));
					
					//frames[i].push(startStyle[i]+ t*per);
					//
				}
				
			}
		
		
		
		
	}
	
	aim.animation = {
		'framesIndex':0,
		'framesCount':framesCount,
		'during':during,
		'frames':frames,
		'isLoop':isLoop?isLoop:false,
		'isExeCallback':false,  //是否已执行了finishCallback
		'finishCallback':finishCallback?finishCallback:function(){}
	}
	
}
//通过对象的animation属性中序列对象frames 改变相应的属性值
//使渲染过程中生成动画		
Qanimation.prototype.createAnimation = function(obj){
		
		if(typeof obj.animation !='undefined' && obj.animation && obj.animation.frames){
				
				var framesIndex = obj.animation.framesIndex;
				var framesCount = obj.animation.framesCount;
				var frames = obj.animation.frames;
				var isLoop = obj.animation.isLoop;
		
				obj.animation.step = typeof obj.animation.step !='undefined'?obj.animation.step:1;//控制方向  
				
				var step = obj.animation.step;
				
				obj.animation.framesIndex=obj.animation.framesIndex+step;
		
				obj.animation.framesIndex = obj.animation.framesIndex<=0?0:obj.animation.framesIndex;
		
				obj.animation.framesIndex = obj.animation.framesIndex>=framesCount?(framesCount-1):obj.animation.framesIndex;
				
				if(typeof isLoop !='undefined'){

					if(this.qcanvas.isNum(isLoop)){ //循环次数

						isLoop = isLoop > 0?isLoop:1;

						if(typeof obj.animation.loopNum =='undefined'){
							obj.animation.loopNum = 1;
						}
						
						if(obj.animation.framesIndex==(framesCount-1)){
								obj.animation.loopNum ++;

								if(obj.animation.loopNum <= isLoop){
									obj.animation.step = -1; //反方向运动回去	
								}

								if((obj.animation.loopNum -1) == isLoop){
									obj.animation.finishCallback(obj);
								}
						}

						if(obj.animation.framesIndex == 0){
							obj.animation.loopNum ++;


							if(obj.animation.loopNum <= isLoop){
								obj.animation.step = 1; //反方向运动回去	
								// obj.animation.framesIndex = 0;
							}

							if((obj.animation.loopNum -1) == isLoop){
								obj.animation.finishCallback(obj);
							}
						}



					}else{

						if(isLoop){
							if(obj.animation.framesIndex==(framesCount-1)){
								obj.animation.step = -1; //反方向运动回去	
								// obj.animation.framesIndex = 0;
								obj.animation.finishCallback(obj);
							}
				
							
							if(obj.animation.framesIndex==0){
								obj.animation.step = 1; 
								obj.animation.finishCallback(obj);		
							}							
						}else{
							if(obj.animation.framesIndex==(framesCount-1)){
								!obj.animation.isExeCallback && (obj.animation.isExeCallback = true) && 
								obj.animation.finishCallback(obj);
							}
							
						}

					}


		
				}else{

					if(obj.animation.framesIndex==(framesCount-1)){
						!obj.animation.isExeCallback && (obj.animation.isExeCallback = true) && 
						obj.animation.finishCallback(obj);
					}

				}
		
				//console.log(framesIndex);
				
			
				for(var i in obj.animation.frames){
						obj[i] =  obj.animation.frames[i][framesIndex];
				}
				
		
		}
		
}	

	
/*画图片类*/
function Qimg(qcanvas){
	this.qimgVersion = '1.0';
	this.qcanvas = qcanvas;
}	

Qimg.prototype.sourcePosition = function(pic,w,h){
			
			//原图及目标区域的宽高比
			var sourceRate = pic.width/pic.height;
			var targetRate = w/h;
			var x,y,w,h;
			
			if(sourceRate>=targetRate){
					h = pic.height;
					w = targetRate*pic.height;
					y = 0;
					x = (pic.width - w)*0.5;
			}else{
					w = pic.width;
					h = pic.width/targetRate;
					x = 0;
					y = (pic.height - h)*0.5;
			
			}
			
	return {
		sStart:[x,y],
		sWidth:w,
		sHeight:h,
		sourceRate:sourceRate,
		targetRate:targetRate
	}
	
	
}

Qimg.prototype.img = function(options){
	var _this = this;
	var OPTIONS = {
			TYPE:'img',
			img:{},
			size:"",
			drag:true,
			pointerEvent:'auto',
			degree:0,
			/*sStart:[0,0],
			sWidth:options.width,
			sHeight:options.height,
			tStart:[0,0],
			tWidth:options.width,
			tHeight:options.height,*/
			centerPoints:function(){ //元素中心点相对于整个画布的坐标
					var tStart = _this.qcanvas.isFun(this.tStart)?this.tStart():this.tStart; 

					return {
						x:tStart[0]+this.tWidth*0.5,
						y:tStart[1]+this.tHeight*0.5
					}

			},
			polyPoints:function(){  //顶点坐标序列 
				var tStart = _this.qcanvas.isFun(this.tStart)?this.tStart():this.tStart;


					var half_x = this.tWidth*0.5;
					var half_y = this.tHeight*0.5; 
					var center = this.centerPoints();


					var temp = 0;
					if(this.degree <0){ 
						temp = 360+this.degree;
					}else{
						temp = this.degree;
					}
					
					
					if((temp>0 && temp<=90) || (temp>180 && temp<=270)){

						if(temp >180){
							temp = temp-180;
						}

						var E_x = center.x-Math.cos(temp*Math.PI/180)*half_x;
						var E_y = center.y-Math.sin(temp*Math.PI/180)*half_x;
						 
						return [
							{x:E_x-Math.sin(temp*Math.PI/180)*half_y,y:E_y+Math.cos(temp*Math.PI/180)*half_y},
							{x:E_x+Math.sin(temp*Math.PI/180)*half_y,y:E_y-Math.cos(temp*Math.PI/180)*half_y},
							{x:center.x-(E_x-Math.sin(temp*Math.PI/180)*half_y)+center.x,y:center.y-(E_y+Math.cos(temp*Math.PI/180)*half_y)+center.y},
							{x:center.x-(E_x+Math.sin(temp*Math.PI/180)*half_y)+center.x,y:center.y-(E_y-Math.cos(temp*Math.PI/180)*half_y)+center.y}
						];



					}else if((temp>90 && temp<180) || (temp>270 && temp<360)){

						if(temp>270){
							temp = temp-180;
						}

						temp = 180 - temp;
						var E_x = center.x+Math.cos(temp*Math.PI/180)*half_x;
						var E_y = center.y-Math.sin(temp*Math.PI/180)*half_x;
 

						return [
							{x:E_x-Math.sin(temp*Math.PI/180)*half_y,y:E_y-Math.cos(temp*Math.PI/180)*half_y},
							{x:E_x+Math.sin(temp*Math.PI/180)*half_y,y:E_y+Math.cos(temp*Math.PI/180)*half_y},
							{x:center.x-(E_x-Math.sin(temp*Math.PI/180)*half_y)+center.x,y:center.y-(E_y-Math.cos(temp*Math.PI/180)*half_y)+center.y},
							{x:center.x-(E_x+Math.sin(temp*Math.PI/180)*half_y)+center.x,y:center.y-(E_y+Math.cos(temp*Math.PI/180)*half_y)+center.y}
						]




					}else{
						
						return [
							{"x":tStart[0],"y":tStart[1]},
							{"x":tStart[0]+this.tWidth,"y":tStart[1]},
							{"x":tStart[0]+this.tWidth,"y":tStart[1]+this.tHeight},
							{"x":tStart[0],"y":tStart[1]+this.tHeight},
						]
					}
					
			},	
		}
			
	this.qcanvas.extend(OPTIONS,options);
	this.qcanvas.appendSetFun(OPTIONS);
	
	
	if(OPTIONS.size!=''){
		
		//重新计算sStart sWidth sHeight
		//全覆盖目标区域 图像的某些部分也许无法显示在目标区域中
		if(OPTIONS.size =='cover'){ 
				delete OPTIONS.sStart;
			  	delete OPTIONS.sWidth;
				delete OPTIONS.sHeight;
			  
				
				var sourceObj = this.sourcePosition(OPTIONS.img,OPTIONS.tWidth,OPTIONS.tHeight);
				
				
				OPTIONS.sStart = sourceObj.sStart;
				OPTIONS.sWidth = sourceObj.sWidth;
				OPTIONS.sHeight = sourceObj.sHeight;
			
			
			
		}
	
	
	}
	
	return OPTIONS;
}	
Qimg.prototype.paintImg = function(obj){ 
	
	var tStart = this.qcanvas.isFun(obj.tStart)?obj.tStart():obj.tStart;


	//有角度时 移动画布原点 旋转画布
	var centerPos = this.qcanvas.setDegree(obj);   
	 

	this.qcanvas.context.drawImage(obj.img,obj.sStart[0],obj.sStart[1],obj.sWidth,obj.sHeight,tStart[0],tStart[1],obj.tWidth,obj.tHeight);
	

	// //重置画布原点 旋转复原
	this.qcanvas.resetDegree(obj,centerPos); 
}	
	
/*精灵类-------------------------*/
function Qspirit(qcanvas){
	this.qspiritVersion = '1.0';
	this.qcanvas = qcanvas;
}
Qspirit.prototype.spirit = function(options){
	var OPTIONS = {
			TYPE:'spirit',
			stop:function(){this.isLoop = false},
			play:function(){this.isLoop = true},
		  	drag:true,
		  	pointerEvent:'auto',
			degree:0,

			/*img:{},
			row:0,
			column:0,
			frameIndex:[],
			isLoop:true,
			during:2*/
			centerPoints:function(){ //元素中心点相对于整个画布的坐标
					
					return {
						x:this.tStart[0]+this.tWidth*0.5,
						y:this.tStart[1]+this.tHeight*0.5
					}

			},
			polyPoints:function(){  //顶点坐标序列

					var half_x = this.tWidth*0.5;
					var half_y = this.tHeight*0.5; 
					var center = this.centerPoints();


					var temp = 0;
					if(this.degree <0){ 
						temp = 360+this.degree;
					}else{
						temp = this.degree;
					}
					
					
					if((temp>0 && temp<=90) || (temp>180 && temp<=270)){

						if(temp >180){
							temp = temp-180;
						}

						var E_x = center.x-Math.cos(temp*Math.PI/180)*half_x;
						var E_y = center.y-Math.sin(temp*Math.PI/180)*half_x;
						 
						return [
							{x:E_x-Math.sin(temp*Math.PI/180)*half_y,y:E_y+Math.cos(temp*Math.PI/180)*half_y},
							{x:E_x+Math.sin(temp*Math.PI/180)*half_y,y:E_y-Math.cos(temp*Math.PI/180)*half_y},
							{x:center.x-(E_x-Math.sin(temp*Math.PI/180)*half_y)+center.x,y:center.y-(E_y+Math.cos(temp*Math.PI/180)*half_y)+center.y},
							{x:center.x-(E_x+Math.sin(temp*Math.PI/180)*half_y)+center.x,y:center.y-(E_y-Math.cos(temp*Math.PI/180)*half_y)+center.y}
						];



					}else if((temp>90 && temp<180) || (temp>270 && temp<360)){

						if(temp>270){
							temp = temp-180;
						}

						temp = 180 - temp;
						var E_x = center.x+Math.cos(temp*Math.PI/180)*half_x;
						var E_y = center.y-Math.sin(temp*Math.PI/180)*half_x;
 

						return [
							{x:E_x-Math.sin(temp*Math.PI/180)*half_y,y:E_y-Math.cos(temp*Math.PI/180)*half_y},
							{x:E_x+Math.sin(temp*Math.PI/180)*half_y,y:E_y+Math.cos(temp*Math.PI/180)*half_y},
							{x:center.x-(E_x-Math.sin(temp*Math.PI/180)*half_y)+center.x,y:center.y-(E_y-Math.cos(temp*Math.PI/180)*half_y)+center.y},
							{x:center.x-(E_x+Math.sin(temp*Math.PI/180)*half_y)+center.x,y:center.y-(E_y+Math.cos(temp*Math.PI/180)*half_y)+center.y}
						]




					}else{
						
						return [
							{"x":this.tStart[0],"y":this.tStart[1]},
							{"x":this.tStart[0]+this.tWidth,"y":this.tStart[1]},
							{"x":this.tStart[0]+this.tWidth,"y":this.tStart[1]+this.tHeight},
							{"x":this.tStart[0],"y":this.tStart[1]+this.tHeight},
						];
					}
			}
			
		}
			
	this.qcanvas.extend(OPTIONS,options);
	this.qcanvas.appendSetFun(OPTIONS);
	
	this.createFrames(OPTIONS);
	
	return OPTIONS;
}	

Qspirit.prototype.createFrames = function(obj){
	
	var frameWidth = obj.img.width/obj.column;
	var frameHeight = obj.img.height/obj.row;
	
	var framesCount = this.qcanvas.fps * obj.during;
	
	var num = 1;
	if(framesCount>obj.column){
			num = Math.floor(framesCount/obj.column);
	}
	
	
	
	//生成二维坐标数组
	var frames = [];
	for(var i=0; i<obj.row;i++){
		frames[i] = [];
		for(var j=0; j<obj.column;j++){
			
			//为了控制速度 加入同样的序列帧
			for(var t=0; t<num;t++){
				frames[i].push([j*frameWidth,i*frameHeight]);
				//frames[i].push([i*frameHeight,j*frameWidth]);
			}
			
		}
	}
	
	obj.framesIndex = typeof obj.framesIndex=='undefined'?[0,0]:obj.framesIndex;
	obj.frames = frames;
}
	
Qspirit.prototype.moveFrameIndex = function(obj){
		
		obj.step = typeof obj.step !='undefined'?obj.step:1;//控制方向  
				
		var step = obj.step;
		var max = obj.frames[obj.framesIndex[0]].length;
		
		obj.framesIndex[1] = obj.framesIndex[1]+step;
	  	obj.framesIndex[1] = obj.framesIndex[1]<=0?0:obj.framesIndex[1];
		obj.framesIndex[1] = obj.framesIndex[1]>=max?(max-1):obj.framesIndex[1];
		
		
	
		if(obj.isLoop){
			
			if(obj.framesIndex[1]==(max-1)){
					//obj.step=-1;
					obj.framesIndex[1] = 0;
			}
			
			if(obj.framesIndex[1]==0){
						obj.step = 1; 		
			}
	
		}	
	
}		
	
	
Qspirit.prototype.paintSpirit = function(obj){
		this.qcanvas.qanimation.createAnimation(obj);
		this.moveFrameIndex(obj);
		
	//console.log(obj.framesIndex);
	
	
		var sx = obj.frames[obj.framesIndex[0]][obj.framesIndex[1]][0];
		var sy = obj.frames[obj.framesIndex[0]][obj.framesIndex[1]][1];
		var sWidth = obj.img.width/obj.column;//obj.tWidth;
		var sHeight = obj.img.height/obj.row;//obj.tHeight;
	
		//console.log(obj.frames[obj.framesIndex[1]][obj.framesIndex[0]]);
		
		//有角度时 移动画布原点 旋转画布
		var centerPos = this.qcanvas.setDegree(obj);   
		 
	
		this.qcanvas.context.drawImage(obj.img,sx,sy,sWidth,sHeight,obj.tStart[0],obj.tStart[1],obj.tWidth,obj.tHeight);

		// //重置画布原点 旋转复原
		this.qcanvas.resetDegree(obj,centerPos);
}	
	

/*Qevent类---------*/
function Qevent(qcanvas){
	this.qeventVersion = '1.0';
	this.qcanvas = qcanvas;
	var _this = this;
	var eventCallback = {
		'mousedown_or_touchstart':function(position){
			// var position = _this.getEventPosition(e);
			var aim  = _this.findElmByEventPosition(position);
			
			if(aim!==null && aim.drag && 
				(aim.TYPE == 'rect' || aim.TYPE == 'text' || aim.TYPE == 'arc' || aim.TYPE == 'polygon')
			 ){
			 	var start = _this.qcanvas.isFun(aim.start)?aim.start():aim.start;
				aim.dis = [position.x-start[0],position.y-start[1]];
				_this.qcanvas.dragAim = aim;
			}
			
			if(aim!==null && aim.drag && 
				(aim.TYPE == 'img' || aim.TYPE == 'spirit')
				){
				var tStart = _this.qcanvas.isFun(aim.tStart)?aim.tStart():aim.tStart;
				aim.dis = [position.x-tStart[0],position.y-tStart[1]];
				_this.qcanvas.dragAim = aim;
			}
			
			
			
			if(aim!==null && aim.TYPE == 'shape' && aim.drag){
				
				
				aim.dis = [
					//position.x-aim.points[0][0],position.y-aim.points[0][1]
				];

				var points = _this.qcanvas.isFun(aim.points)?aim.points():aim.points;
				points.forEach(function(v,index){
						aim.dis.push([
							position.x-points[index][0],
							position.y-points[index][1]
						])				
				})
				
				
				
				_this.qcanvas.dragAim = aim;
			}
			
		},
		'mousemove_or_touchmove':function(position){

				//处理拖动的元素
				// var position = _this.getEventPosition(e);
			
				if(_this.qcanvas.dragAim !== null && 
					(_this.qcanvas.dragAim.TYPE=='rect' || 
						_this.qcanvas.dragAim.TYPE=='text' || 
						_this.qcanvas.dragAim.TYPE=='arc' ||
						_this.qcanvas.dragAim.TYPE=='polygon')
					){
					var dis  =_this.qcanvas.dragAim.dis;
					var start = _this.qcanvas.isFun(_this.qcanvas.dragAim.start)?_this.qcanvas.dragAim.start():_this.qcanvas.dragAim.start;
					 start[0] = position.x-dis[0];
					 start[1] = position.y-dis[1];


					 //如果创建时位置数据依赖于别的元素 那么一旦拖动该元素 数据的依赖关系就会断开 切记
					_this.qcanvas.dragAim.start = start;
				}
			
				if(_this.qcanvas.dragAim !== null && 
					(_this.qcanvas.dragAim.TYPE=='img' || _this.qcanvas.dragAim.TYPE=='spirit')){
					var dis  =_this.qcanvas.dragAim.dis;
					_this.qcanvas.dragAim.tStart[0] = position.x-dis[0];
					_this.qcanvas.dragAim.tStart[1] = position.y-dis[1];
				}
				
			
			
				if(_this.qcanvas.dragAim !== null && _this.qcanvas.dragAim.TYPE=='shape'){
					var dis  =_this.qcanvas.dragAim.dis;
					var points = _this.qcanvas.isFun(_this.qcanvas.dragAim.points)?_this.qcanvas.dragAim.points():_this.qcanvas.dragAim.points;
					
					points.forEach(function(v,index){
							points[index][0] = position.x- dis[index][0];
							points[index][1] = position.y- dis[index][1];
						
					})

					_this.qcanvas.dragAim.points = points;
					
				} 
		},
		'mouseup_or_mouseout_or_touchend':function(position){
			_this.qcanvas.dragAim = null;
		}
	};

	this.PC_Event = {
		"mousedown":eventCallback['mousedown_or_touchstart'],
		"mousemove":eventCallback['mousemove_or_touchmove'],
		"mouseup":eventCallback['mouseup_or_mouseout_or_touchend'],
		"mouseout":eventCallback['mouseup_or_mouseout_or_touchend'],
	};
	this.MOBILE_Event = {
		"touchstart":eventCallback['mousedown_or_touchstart'],
		"touchmove":eventCallback['mousemove_or_touchmove'],
		"touchend":eventCallback['mouseup_or_mouseout_or_touchend']
	};	
	
	this.init();
}

Qevent.prototype.init = function(){
	var canvas = this.qcanvas.canvas;
	var _this = this;
	

	
	if("ontouchstart" in window){
		for(var i in this.MOBILE_Event){
			// canvas.addEventListener(i,callback,false);		
			canvas.addEventListener(i,function(e){
				var position = _this.getEventPosition(e);
				_this.eventCallback(e,position);	//用户定义的回调函数
				_this.MOBILE_Event[e.type](position); //系统定义的回调函数
			},false);		

		}
		
	}else{
		for(var i in this.PC_Event){
			canvas.addEventListener(i,function(e){
				var position = _this.getEventPosition(e);
				_this.eventCallback(e,position);	 //用户定义的回调函数
				_this.PC_Event[e.type](position);  //系统定义的回调函数
			},false);		
		}
		
	}
	
}	

Qevent.prototype.executeMouseOut = function(aim,position){
	//修复对象mouseout自定义事件不执行的问题 
	if(this.qcanvas.isObj(aim)){

		if(this.qcanvas.moveAim == null){
				this.qcanvas.moveAim = aim;

		}else if(this.qcanvas.moveAim.id !== aim.id){ //划过了不同的对象 需要执行上一个对象的moveout事件
				// console.log('划过了不同的对象');
				this.qcanvas.moveAim['mouseout'] && this.qcanvas.moveAim['mouseout'](position);
				this.qcanvas.moveAim = aim;
			}

	}else{


		if(this.qcanvas.isObj(this.qcanvas.moveAim)){
			this.qcanvas.moveAim['mouseout'] && this.qcanvas.moveAim['mouseout'](position);
			this.qcanvas.moveAim = null;
		}
	}

}




Qevent.prototype.eventCallback = function(e,position){

	 	var aim = this.findElmByEventPosition(position);

	 	//修复对象mouseout自定义事件不执行的问题
	  	this.executeMouseOut(aim,position);

	  	//触发aim的事件(调用配置好的事件)
	  	(aim !== null) && (typeof aim[e.type] !='undefined') && aim[e.type](position);

	  
}	
	

//根据点击的坐标 找到要触发事件的元素
Qevent.prototype.findElmByEventPosition = function(position){
	
		var elements = this.qcanvas.elements;
		var aim = null;	
		
	
		//elements数组从后往前 碰到第一个元素 点击的坐标正好在它的范围内 那么就触发它的事件
		//越往后的元素 在画布上是越在上面的 
		for(var i=elements.length-1;i>=0;i--){

			//跳过不显示的元素和不响应事件的元素
			if(elements[i].display=='none' || elements[i].pointerEvent == 'none'){
				continue;
			};
			
			if(elements[i].TYPE=='rect' 
				 || elements[i].TYPE=='spirit' 
				 || elements[i].TYPE=='img'
				 || elements[i].TYPE=='text'
				 || elements[i].TYPE=='shape'
				 || elements[i].TYPE=='arc'
				 || elements[i].TYPE=='polygon'
				 || elements[i].TYPE=='layer'
				){


				//如果是容器对象 要判断属于该容器里的元素
				if(elements[i].TYPE == 'layer'){  
					for (var j = 0; j < elements[i].elements.length; j++) {
						
						if(this.rayCasting(position,elements[i].elements[j].polyPoints())=='in'){
							aim = elements[i].elements[j];
							break;
						}
					}
				}


				if((aim === null) && (elements[i].TYPE !== 'layer')){
					if(this.rayCasting(position,elements[i].polyPoints())=='in'){
						aim = elements[i];
						break;
					}
				} 

				
					
			}
		}
	
		
		return aim;
	
}
	
Qevent.prototype.getEventPosition = function(ev){
  var x, y;
	//console.log(ev);
	if(this.MOBILE_Event[ev.type]){
		var c = ev.type!='touchend'?ev.touches[0]:ev.changedTouches[0];
		x= c.clientX-c.target.offsetLeft;
		y= c.clientY-c.target.offsetTop;
		
	}else{
		 if (ev.layerX || ev.layerX == 0) {
			x = ev.layerX;
			y = ev.layerY;
		} else if (ev.offsetX || ev.offsetX == 0) { // Opera
			x = ev.offsetX;
			y = ev.offsetY;
		}
	}
	
	
 
  return {x: x, y: y};
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

    for(var i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
      var sx = poly[i].x,
          sy = poly[i].y,
          tx = poly[j].x,
          ty = poly[j].y

      // 点与多边形顶点重合
      if((sx === px && sy === py) || (tx === px && ty === py)) {
        return 'on'
      }

      // 判断线段两端点是否在射线两侧
      if((sy < py && ty >= py) || (sy >= py && ty < py)) {
        // 线段上与射线 Y 坐标相同的点的 X 坐标
        var x = sx + (py - sy) * (tx - sx) / (ty - sy)

        // 点在多边形的边上
        if(x === px) {
          return 'on'
        }

        // 射线穿过多边形的边界
        if(x > px) {
          flag = !flag
        }
      }
    }

    // 射线穿过多边形边界的次数为奇数时点在多边形内
    return flag ? 'in' : 'out'
  }	



//元素容器类
function Qlayer(qcanvas){
	this.qlayerVersion = '1.0';
	this.qcanvas = qcanvas;
}
Qlayer.prototype.layer = function(options){
	var _this = this;
	var OPTIONS = {
			TYPE:'layer',
			display:'block',
			width:_this.qcanvas.stage.width,
			height:_this.qcanvas.stage.height,
			elements:[],   //容器里包含的元素
			canvasEle:_this.createCanvas(),
			push:this.push,
			qcanvas:this.qcanvas,
			getEleById:this.getEleById,
			removeEle:this.removeEle,
			getIndexById:this.getIndexById,
			lower:this.lower,
			lowerToBottom:this.lowerToBottom,
			raise:this.raise,
			raiseToTop:this.raiseToTop

		}

	this.qcanvas.extend(OPTIONS,options);
	this.qcanvas.appendSetFun(OPTIONS);


	return OPTIONS;	

}
Qlayer.prototype.createCanvas = function(){

	var t = document.createElement('canvas');
	t.width = this.qcanvas.stage.width;
	t.height = this.qcanvas.stage.height;


	return {
		layerCanvas:t,
		context:t.getContext('2d')
	}

}

Qlayer.prototype.paintLayer = function(obj){

	//把属于该容器的元素绘在layerCanvas
	for(var i = 0; i<obj.elements.length; i++){
		var o = obj.elements[i];

		if(o.display=='none'){
			continue;
		}

		this.qcanvas.TypeGroup[o.TYPE].call(this.qcanvas['q'+o.TYPE],o);

	}
	// console.log(this);
	//把临时canvas直接绘到主canvas上
	// this.qcanvas.context.drawImage(obj.canvasEle.layerCanvas,0,0);
}
Qlayer.prototype.push = function(ele){

	//核心Qcanvas类成员 elements中 删掉该元素
	this.qcanvas.removeEle(ele);


	//添加到Qlayer类成员elements中
	this.elements.push(ele);

}

Qlayer.prototype.getEleById = function(id){
	
	for(var i=0;i<this.elements.length;i++){
		if(this.elements[i].id == id){
				return this.elements[i];
				break;
		}	
	}
	
}

//从elements数组中删除 
//该方法使用时要注意 如果其它元素的某一属性与该元素有关联 为了不让它出现在画布中最好用setDisplay()方法
Qlayer.prototype.removeEle = function(obj){
	
	for(var i=0;i<this.elements.length;i++){
		if(this.elements[i].id == obj.id){
				this.elements.splice(i,1);
				//return this.elements[i];
				break;
		}	
	}
	
}


Qlayer.prototype.getIndexById = function(id){
	
	for(var i=0;i<this.elements.length;i++){
		if(this.elements[i].id == id){
				return i;
				break;
		}	
	}
	
}


Qlayer.prototype.lower = function(el){

	var currIndex = this.getIndexById(el.id); 
	if((currIndex-1 < 0) || (typeof this.elements[currIndex-1] == 'undefined')){
		return false;
	}

	this.elements[currIndex] = this.elements.splice(currIndex-1,1,this.elements[currIndex])[0];


}

Qlayer.prototype.lowerToBottom = function(el){

	if(this.getIndexById(el.id) == 0){  //已经是最底层
		return false;
	}

	this.removeEle(el);
	this.elements.unshift(el);

}

Qlayer.prototype.raise = function(el){ 

	var currIndex = this.getIndexById(el.id); 
	if(typeof this.elements[currIndex+1] == 'undefined'){
		return false;
	}

	this.elements[currIndex] = this.elements.splice(currIndex+1,1,this.elements[currIndex])[0];


}

Qlayer.prototype.raiseToTop = function(el){
 
	if(this.getIndexById(el.id) == (this.elements.length-1)){  //已经是最顶层
		return false;
	}

	this.removeEle(el);
	this.elements.push(el);
}

	
/*-------end---------*/	
	
	
	
	

/*
画布框架Qcanvas结构---------------------------------------------------------
*/
/*主类*/
/*
c_p:初始化canvas参数数组
*/	
function Qcanvas(c_p){
	
	var doc = document;
	if(c_p.length<3 ){
		// console.log('Qcanvas 初始化参数不正确');
		return false;
	}
	
	var c_obj = doc.getElementById(c_p[0]);
	c_obj.width = c_p[1];
	c_obj.height = c_p[2];
	
	
	
	this.qcanvasVersion = '1.0';
	this.context = c_obj.getContext('2d');
	this.canvas = c_obj;
	this.fps = 60;
	this.dragAim = null;  //当前拖动的对象
	this.moveAim = null;  //当前鼠标划过的对象
	
	
	//舞台对象
	this.stage = {
		"id":c_p[0],
		"width":c_p[1],
		"height":c_p[2]
	};
	
	
	
	//元素数组 （按z-index由小到大排序）
	this.elements = [];
	
	//分组对象（元素属于哪个组）
	this.group = {};
	
	 
	
	
	this.qline = new Qline(this);
	this.qtext = new Qtext(this);
	this.qrect = new Qrect(this);
	this.qarc = new Qarc(this);
	this.qpolygon = new Qpolygon(this);
	this.qanimation = new Qanimation(this);
	this.qimg = new Qimg(this);
	this.qspirit = new Qspirit(this);
	this.qshape = new Qshape(this);
	this.qlayer = new Qlayer(this);

	
	
	this.event = new Qevent(this);
	
	// this.animationFrame = this.requestNextAnimationFrame();
	// console.log('animationFrame');
	// console.log(this.animationFrame.toString());
	
	//计算fps
	this.lastLoop = (new Date()).getMilliseconds();
	this.count = 1;
  	this.currFps = 0;

  	this.TypeGroup = {
  		'line':this.qline.paintLine,
  		'text':this.qtext.paintText,
  		'rect':this.qrect.paintRect,
  		'arc':this.qarc.paintArc,
  		'polygon':this.qpolygon.paintPolygon,
  		'img':this.qimg.paintImg,
  		'spirit':this.qspirit.paintSpirit,
  		'shape':this.qshape.paintShape,
  		'layer':this.qlayer.paintLayer
  	} 


	//启动
	// this.start();
	// this.requestNextAnimationFrame1.call(this,this.start);
	// 
	// 
window.requestNextAnimationFrame(this.start.bind(this))


// this.animationFrame(this.start.bind(this));


}

//销毁所有对象 释放资源
Qcanvas.prototype.destroy = function(){
	this.elements = []; 

}
Qcanvas.prototype.Tween = {
    Linear: function(t, b, c, d) { return c*t/d + b; },
    Quad: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c *(t /= d)*(t-2) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t-2) - 1) + b;
        }
    },
    Cubic: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t/d - 1) * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t*t + b;
            return c / 2*((t -= 2) * t * t + 2) + b;
        }
    },
    Quart: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t*t + b;
        },
        easeOut: function(t, b, c, d) {
            return -c * ((t = t/d - 1) * t * t*t - 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t*t - 2) + b;
        }
    },
    Quint: {
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        easeOut: function(t, b, c, d) {
            return c * ((t = t/d - 1) * t * t * t * t + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
            return c / 2*((t -= 2) * t * t * t * t + 2) + b;
        }
    },
    Sine: {
        easeIn: function(t, b, c, d) {
            return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sin(t/d * (Math.PI/2)) + b;
        },
        easeInOut: function(t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t/d) - 1) + b;
        }
    },
    Expo: {
        easeIn: function(t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },
        easeOut: function(t, b, c, d) {
            return (t==d) ? b + c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeInOut: function(t, b, c, d) {
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    },
    Circ: {
        easeIn: function(t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        easeOut: function(t, b, c, d) {
            return c * Math.sqrt(1 - (t = t/d - 1) * t) + b;
        },
        easeInOut: function(t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        }
    },
    Elastic: {
        easeIn: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
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
            if (t==0) return b;
            if ((t /= d) == 1) return b + c;
            if (typeof p == "undefined") p = d * .3;
            if (!a || a < Math.abs(c)) {
                a = c; 
                s = p / 4;
            } else {
                s = p/(2*Math.PI) * Math.asin(c/a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        easeInOut: function(t, b, c, d, a, p) {
            var s;
            if (t==0) return b;
            if ((t /= d / 2) == 2) return b+c;
            if (typeof p == "undefined") p = d * (.3 * 1.5);
            if (!a || a < Math.abs(c)) {
                a = c; 
                s = p / 4;
            } else {
                s = p / (2  *Math.PI) * Math.asin(c / a);
            }
            if (t < 1) return -.5 * (a * Math.pow(2, 10* (t -=1 )) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p ) * .5 + c + b;
        }
    },
    Back: {
        easeIn: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        easeOut: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158;
            return c * ((t = t/d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInOut: function(t, b, c, d, s) {
            if (typeof s == "undefined") s = 1.70158; 
            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2*((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        }
    },
    Bounce: {
        easeIn: function(t, b, c, d) {
            //return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
					return c - this.easeOut(d-t, 0, c, d) + b;
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
	
	//启动
Qcanvas.prototype.start = function(){
	this.clear();
	this.paint();			
	//requestNextAnimationFrame.call(this,[arguments.callee]);
	
	var currentLoop = (new Date()).getMilliseconds();
    if (this.lastLoop > currentLoop) {
			this.currFps = this.count;
      this.count = 1;
    } else {
			this.count  += 1;	
    }
				
		this.lastLoop = currentLoop;		
	
	// this.animationFrame(this.callback = arguments.callee);
	// this.animationFrame(this.start.bind(this));

	// this.requestNextAnimationFrame1.call(this,this.start);


window.requestNextAnimationFrame(this.start.bind(this))
	
}				
	

//根据elements数组 画所有元素
Qcanvas.prototype.paint = function(	){
	
	for(var i = 0; i<this.elements.length; i++){
		var o = this.elements[i];

		if(o.display=='none'){
			continue;
		}

		this.TypeGroup[o.TYPE].call(this['q'+o.TYPE],o);
		
		// switch (o.TYPE){
		// 	case 'line':
		// 		this.qline.paintLine(o);
		// 		break;
		// 	case 'text':
		// 		this.qtext.paintText(o);
		// 		break;
		// 	case 'rect':
		// 		this.qrect.paintRect(o);
		// 		break;
		// 	case 'arc':
		// 		this.qarc.paintArc(o);
		// 		break;	
		// 	case 'polygon':
		// 		this.qpolygon.paintPolygon(o);
		// 		break;	
		// 	case 'img':
		// 		this.qimg.paintImg(o);
		// 		break;
		// 	case 'spirit':
		// 		this.qspirit.paintSpirit(o);
		// 		break;	
		// 	case 'shape':
		// 		this.qshape.paintShape(o);
		// 		break;		
		// }
				
	}
}





	
Qcanvas.prototype.clear = function(){
		this.context.clearRect(0,0,this.stage.width,this.stage.height);
}	

		

//根据对象属性名称自动生成[set+属性名称]方法
Qcanvas.prototype.appendSetFun = function(o){
		var _this = this;
		var firstToUpperCase = function(s){
				var p = s.split('');
				p[0] = p[0].toUpperCase();
				
				return p.join('');
		}		

		//所有元素都附加display属性
		if(typeof o.display =='undefined'){
			o.display = 'block';
		}
		

		
				
		for(var i in o){
			
				(i != 'TYPE') && 
				(i != 'id') && 
				(i != 'withText') && 
				(i != 'withTextAlign') && 
				!this.isFun(o[i]) &&
				(o['set'+firstToUpperCase(i)] = (function(index,obj){
					var p = index;
					return function(t){
						obj[p] = t;
					}
			})(i,o));

				
		}		
}

Qcanvas.prototype.extend = function(o,n){
	 
	for(var i in n){ 
		(i != 'TYPE') && (o[i] = n[i]); 
	}
				 
	this.pushElements(o);
}
	
Qcanvas.prototype.pushElements = function(element){
	
	if(typeof element.id == 'undefined'){
		//自动生成一个唯一id
		element.id = parseInt(Math.random()*10000);
		this.elements.push(element);
	}
	
}

Qcanvas.prototype.getEleById = function(id){
	
	for(var i=0;i<this.elements.length;i++){
		if(this.elements[i].id == id){
				return this.elements[i];
				break;
		}	
	}
	
}

//从elements数组中删除 
//该方法使用时要注意 如果其它元素的某一属性与该元素有关联 为了不让它出现在画布中最好用setDisplay()方法
Qcanvas.prototype.removeEle = function(obj){
	
	for(var i=0;i<this.elements.length;i++){
		if(this.elements[i].id == obj.id){
				this.elements.splice(i,1);
				//return this.elements[i];
				break;
		}	
	}
	
}





Qcanvas.prototype.getIndexById = function(id){
	
	for(var i=0;i<this.elements.length;i++){
		if(this.elements[i].id == id){
				return i;
				break;
		}	
	}
	
}


Qcanvas.prototype.lower = function(el){

	var currIndex = this.getIndexById(el.id); 
	if((currIndex-1 < 0) || (typeof this.elements[currIndex-1] == 'undefined')){
		return false;
	}

	this.elements[currIndex] = this.elements.splice(currIndex-1,1,this.elements[currIndex])[0];


}

Qcanvas.prototype.lowerToBottom = function(el){ 

	if(this.getIndexById(el.id) == 0){  //已经是最底层
		return false;
	}

	this.removeEle(el);
	this.elements.unshift(el);

}

Qcanvas.prototype.raise = function(el){ 

	var currIndex = this.getIndexById(el.id); 
	if(typeof this.elements[currIndex+1] == 'undefined'){
		return false;
	}

	this.elements[currIndex] = this.elements.splice(currIndex+1,1,this.elements[currIndex])[0];


}

Qcanvas.prototype.raiseToTop = function(el){
 
	if(this.getIndexById(el.id) == (this.elements.length-1)){  //已经是最顶层
		return false;
	}

	this.removeEle(el);
	this.elements.push(el);
}



//加载图片资源				
Qcanvas.prototype.load = function(sourceObj,callback){
	
	if(typeof this.source=='undefined'){
			this.source = {};
	}
	
	var _this = this;
	
	//先实现加载图片资源
	var imgArr = [];
	var num = 0;
	for(var i in sourceObj){
		
		
		img = new Image();
		imgArr.push(img);
		img.onload = function(){
			_this.source[this.alias] = this;
			
			num++;
			
			if(num==imgArr.length){
					callback(_this.source);
			}
			
			
		};
		img.alias = i;
		img.src=sourceObj[i];
	}
	
}

Qcanvas.prototype.getSourceByName = function(name){
		
		return this.source[name];		
}				

Qcanvas.prototype.isObj = function(o){
	if(Object.prototype.toString.call(o)=='[object Object]'){
		return true;
	}else{
		return false;
	}
}			

	
Qcanvas.prototype.isFun = function(o){
	if(Object.prototype.toString.call(o)=='[object Function]'){
		return true;
	}else{
		return false;
	}
}
				
Qcanvas.prototype.isArr = function(o){
	if(Object.prototype.toString.call(o)=='[object Array]'){
		return true;
	}else{
		return false;
	}
}	
				
Qcanvas.prototype.isNum = function(o){
	if(Object.prototype.toString.call(o)=='[object Number]'){
		return true;
	}else{
		return false;
	}
}					
				
Qcanvas.prototype.colorRgb = function(color){

	if(color == ''){
		return '0,0,0';
	}

	//17种基本色
	var basicColor = {
		"aqua":"#00FFFF",
		"black":"#000000",
		"blue":"#0000FF",
		"fuchsia":"#FF00FF",
		"gray":"#808080",
		"green":"#008000",
		"lime":"#00FF00",
		"maroon":"#800000",
		"navy":"#000080",
		"olive":"#808000",
		"orange":"#FFA500",
		"purple":"#800080",
		"red":"#FF0000",
		"silver":"#C0C0C0",
		"teal":"#008080",
		"white":"#FFFFFF",
		"yellow":"#FFFF00"
	}

	if(color.indexOf('#')<0){ 
		color = basicColor[color.toLowerCase()];
	}

	
	var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var sColor = color.toLowerCase();
    if(sColor && reg.test(sColor)){
        if(sColor.length === 4){
            var sColorNew = "#";
                for(var i=1; i<4; i+=1){
                    sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));        
                }
                sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for(var i=1; i<7; i+=2){
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));        
        }
        return "RGB(" + sColorChange.join(",") + ")";
    }else{
        return sColor;        
    }};	
	

Qcanvas.prototype.requestNextAnimationFrame1 = function(callback){
         
		var self = this;

        return window.requestNextAnimationFrame ||
               window.webkitRequestAnimationFrame ||
               window.mozRequestAnimationFrame ||
               window.oRequestAnimationFrame ||
               window.msRequestAnimationFrame ||


               function (callback){ 
                    window.setTimeout(callback , self.timeout);
               };
}
				
Qcanvas.prototype.requestNextAnimationFrame = function(){
        var originalWebkitMethod,
            wrapper = undefined,
            callback = undefined,
            geckoVersion = 0,
            userAgent = navigator.userAgent,
            index = 0,
            self = this;
        if(window.webkitRequestAnimationFrame){
            wrapper = function(time){
                if(time === undefined){
                    time += new Date();
                }
                self.callback(time);
            };
            originalWebkitMethod = window.webkitRequestAnimationFrame;
            window.webkitRequestAnimationFrame = function(callback,element){
                self.callback = callback;
                originalWebkitMethod(wrapper , element);
            }
        }
        if(window.mozRequestAnimationFrame){
            index = userAgent.indexOf('rv:');
            if(userAgent.indexOf('Gecko') != -1){
                geckoVersion = userAgent.substr(index+3 , 3);
                if(geckoVersion === '2.0'){
                    window.mozRequestAnimationFrame = undefined;
                }
            }
        }


        return window.requestNextAnimationFrame ||
               window.webkitRequestAnimationFrame ||
               window.mozRequestAnimationFrame ||
               window.oRequestAnimationFrame ||
               window.msRequestAnimationFrame ||


               function (callback , element){
                    var start,
                        finish;
                    window.setTimeout(function(){
                        start = +new Date();
                        callback.call(self,start);
                        finish = +new Date();
                        self.timeout = 1000/self.fps - (finish - start);
                    } , self.timeout);
               };
}

Qcanvas.prototype.setDegree = function(obj){
		var centerPos = {};
		
		if(obj.degree != 0){
			centerPos = obj.centerPoints();

			this.context.translate(centerPos.x,centerPos.y);
			this.context.rotate(obj.degree*Math.PI/180);
			this.context.translate(-centerPos.x,-centerPos.y);

		}	

		return centerPos;
}

Qcanvas.prototype.resetDegree = function(obj,centerPos){
	if(obj.degree != 0){
		this.context.translate(centerPos.x,centerPos.y);
		this.context.rotate(-obj.degree*Math.PI/180);
		this.context.translate(-centerPos.x,-centerPos.y);
	}
}

typeof window.requestNextAnimationFrame =='undefined'
&& (function(){

	window.requestNextAnimationFrame =
   (function () {
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

         wrapper = function (time) {
           if (time === undefined) {
              time = +new Date();
           }
           self.callback(time);
         };

         // Make the switch
          
         originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;    

         window.webkitRequestAnimationFrame = function (callback, element) {
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
      
      return window.requestAnimationFrame   ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         window.oRequestAnimationFrame      ||
         window.msRequestAnimationFrame     ||

         function (callback, element) {
            var start,
                finish;


            window.setTimeout( function () {
               start = +new Date();
               callback(start);
               finish = +new Date();

               self.timeout = 1000 / self.fps - (finish - start);

            }, self.timeout);
         };
      }
   )
();



})()




				

