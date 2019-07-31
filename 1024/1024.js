/*
* @Author: ZhiCheng
* @Date:   2019-07-30 23:10:50
* @Last Modified by:   ZhiCheng
* @Last Modified time: 2019-07-30 23:28:32
*/
function Game(){
	this.option = {
		gap:5, //块与块之间的间隔
	}

	this.init();
}

Game.prototype.init = function() {
	
	this.qcanvas = new Qcanvas(["game",300,300]);

	this.createBglay();
};

/**
 * 创建背景层
 * @return {[type]} [description]
 */
Game.prototype.createBglay = function(){

	//画一个和画布一样大小的矩形
	this.qcanvas.qrect.rect({
		start:[0,0],
		width:300,
		height:300,
		borderColor:'#000',
		fillColor:'#7d7d7d',
		drag:false,
		mouseup:function(){
			console.log('mouseup')
		}
	})

}

 new Game();
