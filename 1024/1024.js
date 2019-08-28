/*
* @Author: ZhiCheng
* @Date:   2019-07-30 23:10:50
* @Last Modified by:   ZhiCheng
* @Last Modified time: 2019-07-30 23:28:32
*/
function Game(){
	this.options = {
		gap:5, //块与块之间的间隔
		row:4,
		col:4,
		gridAreaW:300,
		gridAreaH:300,
		grid:[],
		gridWithNumObj:[],
		score:0,
		maxScore:0,

		triggerDis:50  //多大距离触发合并行为
	}



	this.init();
}

Game.prototype.init = function() {
	
	this.qcanvas = new Qcanvas(["game",300,400]);

	this.createPanel();
	this.createBglayer();
	this.createGrid();


	//生成带数字的格子 
	this.createGridByNum();
};
/**
 * 生成带数字的格子 每次划动完成后 再生成一组
 * @return {[type]} [description]
 */
Game.prototype.createGridByNum = function() {
	//只生成横纵坐标即可 具体坐标值直接对应this.options.grid背景格子
	var x = Math.floor(Math.random()*this.options.col);
	var y = Math.floor(Math.random()*this.options.row);

	//随机生成2或4 先写固定值
	var num = 2;

	//先写固定值 用于测试
	var x = 3;
	var y = 0;

	console.log(x,y);

	//生成块
	var _this = this;
	var obj = {
		start:this.options.grid[x][y].start,
		 
		width:this.options.perGridW,
		height:this.options.perGridH,
		fillColor:'#f7d476',
		borderColor:'#534928',
		pointerEvent:'none',
		position:[x,y] // 所处的位置

	}


	var length = this.options.gridWithNumObj.push(this.qcanvas.qrect.rect(obj));
 	
 	// 依赖于块的数值
 	this.qcanvas.qtext.text({
 		start:function(){
 			// 取得依赖块的中心点坐标做为文字的位置
 			return [this.dependRect.start[0]+this.context.options.perGridW*0.5,this.dependRect.start[1]+this.context.options.perGridH*0.5];
 		},
		color:'#322e22',
		text:num,
		fontSize:'30px',
		// fontFamily:'Arial',
		pointerEvent:'none',
		context:this,
		dependRectId:this.options.gridWithNumObj[length-1].id,  //用于合并块 动画完成后 删除依赖于矩形的文字 （先删文字后删矩形）
		dependRect:this.options.gridWithNumObj[length-1]  //依赖块对象
 	})
 	



};

/**
 * 创建背景小格子
 * @return {[type]} [description]
 */
Game.prototype.createGrid = function() {

	//每个格子的大小
	this.options.perGridW = (this.options.gridAreaW - this.options.gap*(this.options.col+1))/this.options.col;
	this.options.perGridH = (this.options.gridAreaH - this.options.gap*(this.options.row+1))/this.options.row;
	
	//生成格子的二维数据
	//行
	for (var i = 0; i < this.options.row; i++) {
		!this.options.grid[i] && this.options.grid.push([]);

		//列
		for (var j = 0; j < this.options.col; j++) {

			var obj = {
				start:[i*this.options.perGridW+this.options.gap*(i+1),j*this.options.perGridH+this.options.gap*(j+1)+100],
				width:this.options.perGridW,
				height:this.options.perGridH,
				fillColor:'#756940',
				borderColor:'#534928',
				pointerEvent:'none'

			};

			this.options.grid[i].push(obj);


			this.qcanvas.qrect.rect(obj);		

		}
		
	}
	

	console.log(this.options.grid);

};

/**
 * 计数面板
 * @return {[type]} [description]
 */
Game.prototype.createPanel = function() {

	this.qcanvas.qrect.rect({
		start:[0,0],
		width:300,
		height:90,
		borderColor:'#000',
		fillColor:'#7d7d7d',
		pointerEvent:'none'
	})

	this.qcanvas.qtext.text({
		start:[50,30],
		color:'#322e22',
		text:'1024',
		fontSize:'30px',
		// fontFamily:'Arial',
		pointerEvent:'none'
		
	})


	this.qcanvas.qrect.rect({
		start:[180,10],
		width:50,
		height:40,
		fillColor:'#756940',
		borderColor:'#534928',
		pointerEvent:'none'
	})

	this.qcanvas.qrect.rect({
		start:[240,10],
		width:50,
		height:40,
		fillColor:'#756940',
		borderColor:'#534928',
		pointerEvent:'none'
	})

	this.qcanvas.qtext.text({
		start:[205,20],
		color:'#c3c3c3',
		text:'得分',
		fontSize:'12px',
		fontFamily:'Arial',
		pointerEvent:'none'
		
	})

	this.qcanvas.qtext.text({
		start:[265,20],
		color:'#c3c3c3',
		text:'最高分',
		fontSize:'12px',
		fontFamily:'Arial',
		pointerEvent:'none'
		
	})

	var _this = this;
	this.qcanvas.qtext.text({
		start:[205,40],
		color:'#c3c3c3',
		text:function(){return _this.options.score},
		fontSize:'12px',
		fontFamily:'Arial',
		pointerEvent:'none'
		
	})
	this.qcanvas.qtext.text({
		start:[265,40],
		color:'#c3c3c3',
		text:function(){return _this.options.maxScore},
		fontSize:'12px',
		fontFamily:'Arial',
		pointerEvent:'none'
		
	})

	this.qcanvas.qrect.rect({
		start:[240,60],
		width:50,
		height:20,
		fillColor:'#756940',
		borderColor:'#534928',
		drag:false,
		mouseup:function(){
			alert('mouseup->restart');
		},
		touchend:function(){
			alert('touchend->restart');
		}

	})

	this.qcanvas.qtext.text({
		start:[265,70],
		color:'#c3c3c3',
		text:'restart',
		fontSize:'12px',
		fontFamily:'Arial',
		pointerEvent:'none',
		
		
	})



};
/**
 * 创建背景层
 * @return {[type]} [description]
 */
Game.prototype.createBglayer = function(){

	var _this = this;
	//格子区域矩形
	this.qcanvas.qrect.rect({
		start:[0,100],
		width:this.options.gridAreaW,
		height:this.options.gridAreaH,
		borderColor:'#000',
		fillColor:'#7d7d7d',
		drag:false,
		mousedown:function(e){
			_this.bgMouseDown.call(_this,e);
		},
		mousemove:function(e){
			_this.bgMouseMove.call(_this,e);
		},
		mouseup:function(e){
			_this.bgMouseUp.call(_this,e);
		}
	})




}

Game.prototype.bgMouseDown = function(e) {
	this.options.mouseStart = e;
};

Game.prototype.bgMouseMove = function(e) {
	

	if(typeof this.options.mouseStart == 'undefined'){
		return false;
	}

	//判读划动的方向
	var xdis = e.x - this.options.mouseStart.x;
	var ydis = e.y - this.options.mouseStart.y;

	if(Math.abs(xdis) >= Math.abs(ydis)){

		if(Math.abs(xdis) >= this.options.triggerDis){
			if(xdis>0){
				console.log('向右');
				this.move('r');
			}else{
				console.log('向左');
				this.move('l');
			}
		}

		
	}else{
		if(Math.abs(ydis) >= this.options.triggerDis){
			if(ydis>0){
				console.log('向下');
				this.move('d');
			}else{
				console.log('向上');
				this.move('u')
			}
		}

		
	}

};

Game.prototype.bgMouseUp = function() {
	delete this.options.mouseStart;
};

Game.prototype.move = function(direct) {

	this.qcanvas.qanimation.animate(this.options.gridWithNumObj[0],{
		start:this.options.gridWithNumObj[0].start,
	},{
		start:[200,10],
	},0.1,false,'Linear',function(){console.log('ok')});


	
};


 new Game();
