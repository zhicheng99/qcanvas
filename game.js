
/**
 * 塔防游戏类
 */

function Game(cav) {
	this.cav = cav;
	this.init();
}

Game.prototype.init = function() {

	this.createHome(); //基地
	this.createToolBar(); //工具条
	this.createHandle(); //切换按钮
	this.weaponBase(); //武器

	
};


Game.prototype.weaponBase = function() {
	var _this = this;

	//暂时设置三种武器模板
	this.weaponTemp1 = this.cav.qarc.arc({
		start:function(){
			return [
				_this.ToolBar.start[0] + _this.ToolBar.width*0.5,
				_this.ToolBar.start[1] + 40
			]
		},
		sAngle:0,
		eAngle:0,
		fillColor:'',
		//opacity:0.1,
		r:30,
		drag:false,
	})

	this.weaponTemp2 = this.cav.qarc.arc({
		start:function(){
			return [
				_this.ToolBar.start[0] + _this.ToolBar.width*0.5,
				_this.ToolBar.start[1] + 40 + 60
			]
		},
		sAngle:0,
		eAngle:0,
		fillColor:'',
		//opacity:0.1,
		r:30,
		drag:false,
	})

	this.weaponTemp3 = this.cav.qarc.arc({
		start:function(){
			return [
				_this.ToolBar.start[0] + _this.ToolBar.width*0.5,
				_this.ToolBar.start[1] + 40 + 60 + 60
			]
		},
		sAngle:0,
		eAngle:0,
		fillColor:'',
		//opacity:0.1,
		r:30,
		drag:false,
	})



	this.cav.qanimation.animate(this.weaponTemp1,{
		sAngle:360
	},{
		sAngle:0
	},10,false,'',function(obj){
		obj.fillColor = '#ffff00';
	})


	this.cav.qanimation.animate(this.weaponTemp2,{
		sAngle:360
	},{
		sAngle:0
	},15,false,'',function(obj){
		obj.fillColor = '#f3f3f3';
	})

	this.cav.qanimation.animate(this.weaponTemp3,{
		sAngle:360
	},{
		sAngle:0
	},15,false,'',function(obj){
		obj.fillColor = '#f6f6f6';
	})





	
};


Game.prototype.createHandle = function() {

	var _this = this;

	//开
	this.handle1 = this.cav.qshape.shape({
			fillColor:'#999',
				opacity:0.3,
				drag:false,
				points:function(){

					return [
						[_this.ToolBar.start[0]-10,_this.ToolBar.start[1]+8],
						[_this.ToolBar.start[0],_this.ToolBar.start[1]],
						[_this.ToolBar.start[0],_this.ToolBar.start[1]+15],

					]
				},
				mouseup:function(){
					_this.cav.qanimation.animate(_this.ToolBar,{
						start:[500,50],
					},{
						start:[420,50],
					},0.5,false,'Linear',function(){
						_this.handle1.setDisplay('none');
						_this.handle2.setDisplay('block');

					})
				}
		})

	//关
	this.handle2 = this.cav.qshape.shape({
			fillColor:'#666',
				opacity:0.3,
				drag:false,
				display:'none',
				points:function(){

					return [
						[_this.ToolBar.start[0]-10,_this.ToolBar.start[1]],
						[_this.ToolBar.start[0],_this.ToolBar.start[1]+8],
						[_this.ToolBar.start[0]-10,_this.ToolBar.start[1]+15],

					]
				},
				mouseup:function(){
					_this.cav.qanimation.animate(_this.ToolBar,{
						start:[420,50],
					},{
						start:[500,50],
					},0.5,false,'Linear',function(){
						_this.handle2.setDisplay('none');
						_this.handle1.setDisplay('block');

					})
				}
		})

};

Game.prototype.createToolBar = function() {

	this.ToolBar = this.cav.qrect.rect({
		start:[500,50],
		height:350,
		width:80,
		borderColor:'red',
		drag:false
	})

	
};


Game.prototype.start = function() {

	var _this = this;
	var callback = function(){
		console.log('动画完成了');
		_this.Home.blood-=0.2;
		_this.Home.blood = _this.Home.blood<=0?0:_this.Home.blood;

		if(_this.Home.blood==0){

			_this.blood && _this.cav.removeEle(_this.blood);
		}
	}

	this.cav.qanimation.animate(this.Enemy,{
		tStart: this.Enemy.tStart,
	},{
		tStart: this.Home.tStart
	},20,false,'Linear',callback);

	
};

/**
 * 创建基地
 * @return {[type]} [description]
 */
Game.prototype.createHome = function() {
	var _this = this;
	this.cav.load({
		"b":"http://sandbox.runjs.cn/uploads/rs/475/t0qpfflr/hand.png"
	},function(){ 
		var b = _this.cav.getSourceByName("b");
		
		
		_this.Home = _this.cav.qimg.img({
			img:b,
			sStart:[0,0],
			sWidth:b.width,
			sHeight:b.height,
			size:"cover",
			tStart:[210,160],
			tWidth:80,
			tHeight:80,
			drag:false,
			blood:100,
			mousemove:function(position){
				console.log(position);
			}
			
		});

		//基地的血量
		_this.cav.qrect.rect({
			start:[380,20],
			height:20,
			width:100,
			borderColor:'#fff',
			drag:false
		})
		_this.blood = _this.cav.qrect.rect({
			start:[380,20],
			height:20,
			width:function(){ return _this.Home.blood;},
			fillColor:'#ffff00',
			drag:false
		})





		_this.createEnemy();
	});	
	var textfps = _this.cav.qtext.text({
		start:[20,20],
			text:function(){ return _this.cav.currFps},
		color:'blue',
		fontSize:'20px'
	})	


	
};

Game.prototype.createEnemy = function() {
	var _this = this;
	_this.cav.load({			
		"person":"http://sandbox.runjs.cn/uploads/rs/475/t0qpfflr/spirit.png"
	},function(){
		
			var spiritSource = _this.cav.getSourceByName("person");
		
			_this.Enemy = _this.cav.qspirit.spirit({
				img:spiritSource,
				row:2,
				column:10,
				framesIndex:[1,0],
				tStart:[0,0],
				tWidth:50,
				tHeight:50,
				isLoop:true,
				during:1,
				drag:false,
				mouseup:function(){
					console.log(this);
					console.log('触发mouseup事件');
				}
			})


			//生成行进的路线
			// _this.cav.qline.line({
			// 	start:function(){
			// 		return _this.Enemy.tStart;
			// 	},
			// 	end:function(){
			// 		return _this.Home.tStart;
			// 	},
			// 	width:1,
			// 	like:'->',
			// 	color:'#fff',
			// });

			_this.start();
				
					
	})		


	
};

new Game(new Qcanvas(["qcanvas",500,400]));