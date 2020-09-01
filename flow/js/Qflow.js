
function Qflow(options){
	this.options = options;
	this.toolLayer = null;
	this.menuLayer = null;

	//初始画布
	this.initCanvas();

	//初始节点
	this.initNode();

	//初始连线
	this.initLink();
}
Qflow.prototype.initLink = function() {
	
};
Qflow.prototype.initNode = function() {
	
};
Qflow.prototype.initCanvas = function() {
 
	this.qcanvas = new Qcanvas({
		id:this.options.id,
		width:this.options.width,
		height:this.options.height,
		mousedown:this.canvasDownFun,
		mousemove:this.canvasMoveFun,
		mouseup:this.canvasUpFun

	});
	// this.toolLayer = this.qcanvas.qlayer.layer();

	// this.initTool();

};
Qflow.prototype.addContainer = function(obj) {

	var rect = this.qcanvas.qrect.rect({
	 start:[obj.x,obj.y], 
	 borderColor:'red', 
	 fillColor:'',
	 dashed:true, 
	})

	
};
Qflow.prototype.addNode = function(obj) {
	
	if(obj.id == '-1'){
		this.addContainer(obj);
	}

};
Qflow.prototype.canvasUpFun = function() {
	console.log('canvasUpFun');
};
Qflow.prototype.canvasMoveFun = function() {
	// console.log('canvasMoveFun');
};
Qflow.prototype.canvasDownFun = function() {
	// console.log('canvasDownFun');
};

Qflow.prototype.rectDown = function(pos) {
	console.log(pos);
	console.log(this);
};


Qflow.prototype.initTool = function() {

	var h = this.options[2];
	var tool = this.qcanvas.qrect.rect({  //工具栏外边框
				start:[0,0],
				width:200,
				lineWidth:0.5,
				height:h,
				drag:false
			});
	var rect = this.qcanvas.qrect.rect({  //矩形元素
			start:function(){return [tool.start[0]+20,tool.start[1]+20]},
			width:70,
			height:50,
			drag:false,
			mousedown:this.rectDown
		})
	var diamond = this.qcanvas.qshape.shape({

		// points:[[80,10],[80,50],[150,70],[160,20]],
		fillColor:'',
		points:function(){
			return [
				[tool.start[0]+rect.width+30,tool.start[1]+45],
				[tool.start[0]+rect.width+70,tool.start[1]+20],
				[tool.start[0]+rect.width+110,tool.start[1]+45], 
				[tool.start[0]+rect.width+70,tool.start[1]+70],  
			]
		},
		drag:false
	})

	var arc = this.qcanvas.qarc.arc({
		start:[300,100],
		sAngle:0,
		eAngle:200,
		fillColor:'',
		r:10
	})

	this.toolLayer.push(tool,rect,diamond,arc);
	



};