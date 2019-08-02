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
		score:0,
		maxScore:0
	}



	this.init();
}

Game.prototype.init = function() {
	
	this.qcanvas = new Qcanvas(["game",300,400]);

	this.createPanel();
	this.createBglayer();
	this.createGrid();
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
		start:[180,30],
		width:50,
		height:50,
		fillColor:'#756940',
		borderColor:'#534928',
		pointerEvent:'none'
	})

	this.qcanvas.qrect.rect({
		start:[240,30],
		width:50,
		height:50,
		fillColor:'#756940',
		borderColor:'#534928',
		pointerEvent:'none'
	})

	this.qcanvas.qtext.text({
		start:[205,45],
		color:'#c3c3c3',
		text:'得分',
		fontSize:'12px',
		fontFamily:'Arial',
		pointerEvent:'none'
		
	})

	this.qcanvas.qtext.text({
		start:[265,45],
		color:'#c3c3c3',
		text:'最高分',
		fontSize:'12px',
		fontFamily:'Arial',
		pointerEvent:'none'
		
	})

	var _this = this;
	this.qcanvas.qtext.text({
		start:[205,65],
		color:'#c3c3c3',
		text:function(){return _this.options.score},
		fontSize:'12px',
		fontFamily:'Arial',
		pointerEvent:'none'
		
	})
	this.qcanvas.qtext.text({
		start:[265,65],
		color:'#c3c3c3',
		text:function(){return _this.options.maxScore},
		fontSize:'12px',
		fontFamily:'Arial',
		pointerEvent:'none'
		
	})



};
/**
 * 创建背景层
 * @return {[type]} [description]
 */
Game.prototype.createBglayer = function(){

	//格子区域矩形
	this.qcanvas.qrect.rect({
		start:[0,100],
		width:this.options.gridAreaW,
		height:this.options.gridAreaH,
		borderColor:'#000',
		fillColor:'#7d7d7d',
		drag:false,
		mouseup:function(){
			console.log('mouseup')
		}
	})




}

 new Game();
