/*
* @Author: ZhiCheng
* @Date:   2019-07-30 23:10:50
* @Last Modified by:   ZhiCheng
* @Last Modified time: 2019-07-30 23:15:11
*/
function Game(){

	this.init();
}

Game.prototype.init = function() {
	
	new Qcanvas(["game",300,300]);
};



var game = new Game();