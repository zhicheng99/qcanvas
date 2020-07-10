
function Qflow(options){
	this.options = options;
	this.toolLayer = null;
	this.menuLayer = null;

	this.init();
}

Qflow.prototype.init = function() {
 
	this.qcanvas = new Qcanvas(this.options);
	this.toolLayer = this.qcanvas.qlayer.layer();

	this.initTool();

};

Qflow.prototype.initTool = function() {

	var h = this.options[2]-100;
	var tool = this.qcanvas.qrect.rect({  //工具栏外边框
				start:[50,50],
				width:200,
				lineWidth:0.5,
				height:h,
				drag:false
			});
	var rect = this.qcanvas.qrect.rect({  //矩形元素
			start:function(){return [tool.start[0]+20,tool.start[1]+20]},
			width:70,
			height:50,
			drag:false
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