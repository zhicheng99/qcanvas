//
//目前普通node固定宽度(100*50)
//容器container的宽高随着它包含的child的数量而变化 暂不支持手动缩放
//
//
function Qflow(options){
	this.options = options;
	this.toolLayer = null;
	this.menuLayer = null;
	this.qnodes = [];  //qcanvas rect对象
	this.containerPadding = 10;     //容器内边距
	this.containerChildMargin = 10; //子项外边距
	this.containerTitleHeight = 30; //容器标题文本占的高度

	//初始普通节点大小
	this.childNodeHeight = 50;
	this.childNodeWidth = 100;

	//初始容器大小
	this.containerNodeWidth = 120;
	this.containerNodeHeight = 100;


	this.draging = false;

	this.contextMenuNode = null; //右键的对象
	this.contextAimAttr = '';    //右键tab指向的属性


	this.modiTitleObj = null;

	//17种基本颜色
	this.colorRect = { 
		"red":"#FF0000",
		"orange":"#FFA500",
		"yellow":"#FFFF00",
		"green":"#008000",
		"blue":"#0000FF",
		"white":"#FFFFFF",
		"black":"#000000",
		"aqua":"#00FFFF",
		"fuchsia":"#FF00FF",
		"gray":"#808080",
		"lime":"#00FF00",
		"maroon":"#800000",
		"navy":"#000080",
		"olive":"#808000",
		"purple":"#800080",
		"silver":"#C0C0C0",
		"teal":"#008080",
	};

	


	//加工初始数据 重置画布size
	this.reSizeByInitData();

	//初始化子项的的位置
	this.initChildPosition();

	//初始画布
	this.initCanvas();

	//初始节点
	this.initNode();


	//初始连线
	this.lineLayer = this.qcanvas.qlayer.layer();
	this.lineCache = {};
	this.solveLink();
	this.initLink();


	//右击菜单layer对象
	this.contextSettingLayer = this.qcanvas.qlayer.layer();
	this.contextSettingLayer.setDisplay('none');

	//右击显示半透明覆盖层
	this.initContextCover();


	//初始化设置按钮（鼠标划过元素时显示）
	this.settingIco = null;
	this.initSettingIco();


}
Qflow.prototype.initSettingIco = function() {
	var _this = this;
	this.settingIco = this.qcanvas.qimg.img({
		img:'./img/setting.png',
		// img:'svg t="1601365617030" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3290" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M512 959.8c-23.6 0-47.5-1.9-71.1-5.7-11-1.8-19.7-10.2-21.7-21.1-6.3-33.3-35.5-57.5-69.5-57.5-16 0-31.1 5.3-43.7 15.2-8.7 6.9-20.8 7.5-30.2 1.7-51.5-32-95.3-73.4-130.2-123.2-7-9.9-6.3-23.3 1.7-32.5 11.2-12.9 17.4-29.4 17.4-46.3 0-37.8-29.6-68.8-67.4-70.5-12.1-0.6-22.3-9.3-24.6-21.2-5.7-28.7-8.5-57.8-8.5-86.7 0-24.7 2.1-50 6.4-75.1 2.1-12.4 12.7-21.6 25.3-21.9 38.6-1 68.8-32.1 68.8-70.6 0-18.8-7.3-36.5-20.5-49.8-8.9-8.9-10.2-22.9-3.1-33.3 33.7-49.8 76.5-91.8 127.2-124.7 10.3-6.7 23.8-5.4 32.6 3.1 13.3 12.7 30.6 19.7 48.9 19.7 36.8 0 67.8-28.8 70.5-65.5 0.9-12.2 10.1-22.2 22.2-24.1 53.8-8.4 109.2-6.9 162.5 4.3 11.1 2.3 19.4 11.5 20.7 22.8 4.1 35.7 34.3 62.6 70.2 62.6 15.1 0 29.6-4.8 41.9-13.8 9.1-6.7 21.5-6.9 30.8-0.4 45.2 31.7 83.7 70.7 114.5 116.1 7.1 10.4 5.7 24.4-3.1 33.3-13.2 13.3-20.5 31-20.5 49.8 0 38.6 30.2 69.6 68.8 70.6 12.6 0.3 23.2 9.5 25.3 21.9 4.2 25.1 6.4 50.4 6.4 75.1 0 28.9-2.8 58.1-8.5 86.7-2.3 11.9-12.5 20.7-24.6 21.2-37.8 1.8-67.4 32.8-67.4 70.5 0 17 6.2 33.4 17.4 46.3 8 9.1 8.6 22.5 1.7 32.5-30.1 42.8-67.1 79.7-109.9 109.7-9.3 6.5-21.6 6.3-30.8-0.4-12.3-9.1-26.8-13.8-41.9-13.8-35.9 0-66.1 26.9-70.2 62.6-1.3 11.3-9.6 20.4-20.7 22.8-30.7 6.3-62 9.6-93.1 9.6z m-46.2-55.4c37.3 4.4 74.7 3.4 111.4-2.7C592 849.4 640 812 695.9 812c19.8 0 38.9 4.7 56.2 13.6 27.1-20.7 51.3-44.8 72.2-71.7-11.5-19.1-17.6-41-17.6-63.4 0-58.6 40.8-107.9 96.1-120.3 2.9-19.3 4.3-38.8 4.3-58.2 0-15.5-1-31.2-2.9-47-56.2-11.8-97.6-61-97.6-120.7 0-25.1 7.5-49.2 21.4-69.5-21.7-28.8-47.1-54.5-75.9-76.5-17.3 9-36.5 13.6-56.2 13.6-56 0-103.9-37.4-118.7-89.7-35.6-5.9-72-7-108-3.1-13.8 53.5-62.6 92.7-119.5 92.7-24.6 0-48.2-7.2-68.3-20.7-32.7 23.5-61.3 51.5-85.4 83.6 13.9 20.3 21.4 44.3 21.4 69.5 0 59.6-41.4 108.9-97.6 120.7-1.9 15.8-2.9 31.5-2.9 47 0 19.4 1.5 38.8 4.3 58.2 55.4 12.4 96.1 61.7 96.1 120.3 0 22.5-6.2 44.4-17.6 63.4 25.5 32.9 55.6 61.2 89.9 84.6 18.3-10.3 38.8-15.7 60.1-15.7 52.6 0.1 98.7 33.5 116.1 81.7z" fill="#333333" p-id="3291"></path><path d="M512 705.8c-106.9 0-193.8-87-193.8-193.8s87-193.8 193.8-193.8 193.8 87 193.8 193.8S618.9 705.8 512 705.8z m0-335c-77.8 0-141.2 63.3-141.2 141.2S434.2 653.1 512 653.1 653.2 589.8 653.2 512 589.8 370.8 512 370.8z" fill="#333333" p-id="3292"></path></svg>',
		sStart:[0,0],
		tStart:[0,0],
		tWidth:10,
		tHeight:10,
		display:'none',
		drag:false,
		mousemove:function(){
			this.setDisplay('block');
		},
		mouseup:function(e,pos){ 
			_this.contextMenuNode = this.contextMenuNode;
 

			_this.qcanvas.raiseToTop(_this.contextSettingLayer);
			// _this.contextMenuShow.call(_this.contextMenuNode,{x:this.sStart[0],y:this.sStart[1]});
			// _this.contextMenuShow({x:this.sStart[0],y:this.sStart[1]});
			_this.contextMenuShow(pos);


		}
	}); 
};
Qflow.prototype.settingIcoShow = function(node) {
	// console.log('settingIcoShow');
	var start = this.qcanvas.isFun(node.start)?node.start():node.start;
 	var x = start[0]+node.width - 15;
	var y = start[1]+5; 


	this.settingIco.contextMenuNode = node;
	this.settingIco.setTStart([x,y]);
	this.settingIco.setDisplay('block');
	this.qcanvas.raiseToTop(this.settingIco);
};
Qflow.prototype.settingIcoHide = function() {
	this.settingIco.setDisplay('none');
};


Qflow.prototype.initContextCover = function() {
	var _this = this;
	//半透明层覆盖整个画布
	this.contextSettingLayer.push(this.qcanvas.qrect.rect({
			 start:[0,0],  
			 width:this.qcanvas.stage.width,
			 height:this.qcanvas.stage.height,
			 borderColor:'', 
			 fillColor:'#000', 
			 opacity:0.1,
			 drag:false, 
			 mouseup:function(){
			 	_this.contextMenuHide();
			 }
			}))
};
Qflow.prototype.contextMenuShow = function(pos) {
 
 

	//初始化contextMenu右键菜单区rect
	this.initContextMenuArea(pos);

	//修改标题框(用于定位一个input框)
	this.initModiTitleNode();

	//初始化contextMenu中的tab项
	this.initContextMenuTab();

	//17颜色块画到右击菜单区
	this.initColorRect();

	//删除按钮
	this.initDelBtn();

	this.contextSettingLayer.setDisplay('block');
 
};
Qflow.prototype.delNode = function() {
	console.log('delNode');
};
Qflow.prototype.initDelBtn = function() {
	var _this = this;
	var ele = this.contextSettingLayer.elements[1];

	this.contextSettingLayer.push(
		this.qcanvas.qrect.rect({
			start:[ele.start[0]+ele.width-70,ele.start[1]+ele.height-40],
			width:60,
			height:30,
			fillColor:'#fff',
			drag:false,  
			mouseup:function(){
				//删除操作
				_this.delNode();

				_this.contextMenuHide();
			}
		}),
		this.qcanvas.qtext.text({
			text:'删除',
			start:[ele.start[0]+ele.width-40,ele.start[1]+ele.height-25],
			fontSize:'12px',
			color:'#000',
			pointerEvent:'none'
		})
	);

};
Qflow.prototype.modiTitle = function(v) {
	if(this.modiTitleObj){
		this.modiTitleObj.setText(v);
	}

	var jsonObj = this.getJsonObj(this.contextMenuNode.id);
	jsonObj.text = v;

};
Qflow.prototype.initModiTitleNode = function() {

	var ele = this.contextSettingLayer.elements[1];
	var x = ele.start[0]+10;
	var y = ele.start[1]+10;
	var w = ele.width - 20;
	var h = 30;

	this.contextSettingLayer.push(this.qcanvas.qrect.rect({
			start:[x,y],
			width:w,
			height:h,
			fillColor:'#fff',
			drag:false,
			pointerEvent:'none'
		}));

	var d = document.getElementById('titleInput');
	d.style.left = x+'px';
	d.style.top = y+'px';
	d.style.width = w+'px';
	d.style.height = h+'px';
	d.style.display = 'block';

	console.log(this.contextMenuNode);

	var rectJsonObj = this.getJsonObj(this.contextMenuNode.id);
	console.log(rectJsonObj);

	if(rectJsonObj.attr && rectJsonObj.attr.titleId){
		this.modiTitleObj = this.getNodeObj(rectJsonObj.attr.titleId);
		
		d.value = this.modiTitleObj.text;
	}	


};
Qflow.prototype.contextMenuHide = function() {
	var _this = this;

	this.contextMenuNode = null;
	this.modiTitleObj = null;
	this.contextSettingLayer.setDisplay('none'); 

	var d = document.getElementById('titleInput'); 
	d.style.display = 'none';


	//保留每一个半透明覆盖层对象 下次弹出右键菜单 内容重新初始化
	var tmp = [];
	for (var i = 1; i < this.contextSettingLayer.elements.length; i++) {
		tmp.push(this.contextSettingLayer.elements[i]);
	}
	tmp.forEach(function(item){
		_this.contextSettingLayer.removeEle(item);
	})


	
};

Qflow.prototype.initColorRect = function() {
	var _this = this;
	var disTop = 30;
	var padding = 10;
	var rectW = 20;
	var rectH = 20;

	var tmp = this.contextSettingLayer.elements[1];


	//暂时排4行5列 
	var areaPosition = [
		{
			x:tmp.start[0]+10,
			y:tmp.start[1]+40+disTop
		},
		{
			x:tmp.start[0]+tmp.width-10,
			y:tmp.start[1]+tmp.height+40-10
		}
	];

	var pos = this.childPositionByRow(4,6,areaPosition, rectW,rectH);

	var color = [];
	for(var i in this.colorRect){
		color.push(this.colorRect[i]);
	}

	for (var i = 0; i < color.length; i++) {
		this.contextSettingLayer.push(this.qcanvas.qrect.rect({
			start:[pos[i].x,pos[i].y],
			width:rectW,
			height:rectH,
			fillColor:color[i],
			drag:false,
			mouseup:function(){

				if(_this.contextAimAttr == 'color'){
					//设置节点标题颜色
					_this.updateNodeTitleColor(this.fillColor);


				}else{

					_this.contextMenuNode[_this.contextAimAttr] = this.fillColor;
					 
				}

					//更新json数据相关属性值
					_this.updateInitDataAttr(this.fillColor);


			}
		}))
	}
};
Qflow.prototype.updateNodeTitleColor = function(v) {

	var _this = this;

	//第一步 找到标题的id
	var getTitleNodeJSON = function(){ 

		var tmp = _this.options.initData.node.filter(function(item){
			return item.nodeId == _this.contextMenuNode.id;
		})

		if(tmp.length>0){
			return tmp[0];
		}else{
			console.log('没有找到');
			//如果没有取到  那就是在子项里
			var tmp;
			_this.options.initData.node.forEach(function(item){
				if(item.nodeType == 'container'){
					for (var i = 0; i < item.child.length; i++) {
						if(item.child[i].nodeId == _this.contextMenuNode.id){
							tmp = item.child[i];
							break;
						}
					}
				}
			})

			return tmp;
		}
	} 
 	
 	var titleJSON = getTitleNodeJSON();

	var tmp = this.qnodes.filter(function(item){
		return item.id == titleJSON.attr.titleId;
	})
 
	if(tmp.length>0){
		tmp[0][_this.contextAimAttr] = v;
	}
	 
};


Qflow.prototype.updateInitDataAttr = function(v) {

	var _this = this;
	var getTitleNodeJSON = function(){ 

		var tmp = _this.options.initData.node.filter(function(item){
			return item.nodeId == _this.contextMenuNode.id;
		})

		if(tmp.length>0){
			return tmp[0];
		}else{
			console.log('没有找到');
			//如果没有取到  那就是在子项里
			var tmp;
			_this.options.initData.node.forEach(function(item){
				if(item.nodeType == 'container'){
					for (var i = 0; i < item.child.length; i++) {
						if(item.child[i].nodeId == _this.contextMenuNode.id){
							tmp = item.child[i];
							break;
						}
					}
				}
			})

			return tmp;
		}
	} 


	var titleNodeJSON = getTitleNodeJSON();
	titleNodeJSON.attr[_this.contextAimAttr] = v;		


};

Qflow.prototype.initContextMenuTab = function() {
	var _this = this;
	var tmp = this.contextSettingLayer.elements[1];

	var textArr = [
		{text:'边框颜色', aimAttr:'borderColor'},
		{text:'背景颜色', aimAttr:'fillColor'},
		{text:'文字颜色', aimAttr:'color'},
	];



	textArr.forEach(function(item,index){
		var x = tmp.start[0]+index*(200/(textArr.length)) + 200/(textArr.length)*0.5;

		if(index==0){
			_this.contextAimAttr = item.aimAttr
		}


		var c = _this.qcanvas.qtext.text({
			text:item.text,
			start:[x,tmp.start[1]+40+15],

			color:index==0?'#000':'#ccc',
			aimAttr:item.aimAttr,
			mouseup:function(){   
				var _self = this; 
				_this.contextSettingLayer.elements.forEach(function(item){

					if(item.TYPE == "text"){
						item.color = '#ccc';

						if(item.id == _self.id){ 
							_this.contextAimAttr = item.aimAttr;
							item.color = '#000';
						}
					}

				}) 
			}
		});


		_this.contextSettingLayer.push(c);
	})
	
};
Qflow.prototype.initContextMenuArea = function(pos) {
	var _this = this; 

	//右击显示的菜单块
	var tmp = this.qcanvas.qrect.rect({
		start:[pos.x,pos.y],
		width:200,
		height:200,
		borderColor:'',
		fillColor:'yellow',
		drag:'false'
	})

	this.contextSettingLayer.push(tmp);
	
};
Qflow.prototype.getContainerNodes = function() {
	var containerNode = [];
	if(this.options.initData.node !== null &&
 		this.options.initData.node.length>0
 		){
		containerNode = this.options.initData.node.filter(function(item){
			return item.nodeType == 'container';
		})
	}

	return containerNode;
};
Qflow.prototype.getChildAreaPosition = function(containerNode) {
	var titlePosition = containerNode.attr.titlePosition;

	var startPlaceHolderX = 0;
	var startPlaceHolderY = 0;
	var endPlaceHolderX = 0;
	var endPlaceHolderY = 0;
	if(titlePosition == 'top-center'){
		startPlaceHolderY += (this.containerTitleHeight+this.containerPadding);
	}


	return [
		{
			x:containerNode.x + startPlaceHolderX + this.containerChildMargin,
			y:containerNode.y + startPlaceHolderY
		},
		{
			x:containerNode.x + containerNode.width - endPlaceHolderX,
			y:containerNode.y + containerNode.height - endPlaceHolderY
		}
	]


};

Qflow.prototype.childPositionByRow = function(row,column,areaPosition,w,h) {
	var tmp = [];

	for (var i = 0; i < row; i++) {
		for (var j = 0; j < column; j++) {
			if(tmp[i]){
				tmp[i].push({
					x:areaPosition[0].x+j*w+j*this.containerChildMargin,
					y:areaPosition[0].y+i*h+i*this.containerChildMargin
				})
			}else{
				tmp[i]=[{
					x:areaPosition[0].x+j*w+j*this.containerChildMargin,
					y:areaPosition[0].y+i*h+i*this.containerChildMargin
				}];
			}
		}
	}

	var t = [];
	tmp.forEach(function(item){
		t = t.concat(item);
	}) 

	return t;
};

Qflow.prototype.getChildPosition = function(containerNode,areaPosition) {
	var _this = this;

	//子项要分多少个行列方式画到container中
	var grid = containerNode.grid;
	var child = containerNode.child;
	var childNum = containerNode.child.length;
	var row = grid[0];
	var column = grid[1];
	var areaWidth  = areaPosition[1].x - areaPosition[0].x;
	var areaHeight = areaPosition[1].y - areaPosition[0].y

	//先行后列
	// var childNodeWidth = (areaWidth - (column-1)*this.containerChildMargin)/column;
	// var childNodeHeight = (areaHeight - (row-1)*this.containerChildMargin)/row;

	// console.log(childNodeWidth);

	// //限制一下最小高度
	// childNodeHeight = childNodeHeight<this.childNodeHeight?this.childNodeHeight:childNodeHeight;

	// console.log(row,column,areaPosition,childNodeWidth,childNodeHeight);

	//先把child按行 进行分组 计算坐标
	// return this.childPositionByRow(row,column,areaPosition,childNodeWidth,childNodeHeight);
	return this.childPositionByRow(row,column,areaPosition,this.childNodeWidth,this.childNodeHeight);


	
};
Qflow.prototype.initChildPosition = function() {
	//所有nodeType == 'container'的节点的子项生成x,y
	if(this.options.initData === null){
		return;
	}

	var containerNodes = this.getContainerNodes();
	

	//通过container的grid的属性计算子项位置 
	//注意容器有标题时 标题也需要占一定空间
	//标题位置:
	//top-left top-center top-right
	//left-top left-center left-bottom
	//right-top right-center right-bottom
	//bottom-left bottom-center bottom-right
	for (var i = 0; i < containerNodes.length; i++) {

		//先实现top-center
		//可以摆放子项的区域位置[左上角开始位置，右下角结束位置]
		var childAreaPosition = this.getChildAreaPosition(containerNodes[i]);

		//可以摆放子项的区域位置 计算出各个格子的坐标
		var childPosition = this.getChildPosition(containerNodes[i],childAreaPosition);

		//把格子坐标添加到ettr里
		containerNodes[i].attr.gridPosition = childPosition;
	}


	
};
Qflow.prototype.reSizeByInitData = function() {

	if(this.options.initData === null){
		return;
	}
 	
 	//找出横纵坐标最大值 判断画布是否可以放得下 
 	if(this.options.initData.node !== null &&
 		this.options.initData.node.length>0
 		){

 		var nodes = this.options.initData.node;
 		var xArr = [];
 		var yArr = [];
 		for (var i = 0; i < nodes.length; i++) {
 			xArr.push(nodes[i].x + nodes[i].width);
 			yArr.push(nodes[i].y + nodes[i].height);
 		}

 		var maxX = Math.max.apply({},xArr);
 		var maxY = Math.max.apply({},yArr);

 		if(maxX>this.options.width){
 			this.options.width = maxX
 		}
 		if(maxY>this.options.height){
 			this.options.height = maxY
 		}
 	}
};
Qflow.prototype.getNodeIdFromJsonById = function(id) {

	var tmp = null;
	//搜索父 子项
	for (var i = 0; i < this.options.initData.node.length; i++) {

		if(this.options.initData.node[i].id == id){
			tmp = this.options.initData.node[i].nodeId;
			break;
		}
		if(this.options.initData.node[i].child){
			for (var j = 0; j < this.options.initData.node[i].child.length; j++) {
				if(this.options.initData.node[i].child[j].id == id){
					tmp = this.options.initData.node[i].child[j].nodeId;
					break;
				}
			} 
		}
		
	}

	return tmp;
};
Qflow.prototype.calcLineStartPos = function(A,B,nodeId) {
	var _this = this;
	// console.log(startNode.getRangePoints()); //8个边界点
	// 8个点的示意图
	// 0__1__2    0__1__2
	// |     |	  |     |
	// 7 节点 3	  7 节点 3
	// |     |    |     |
	// 6__5__4	  6__5__4
	


	var F = function(){

		var A_center = A.centerPoints();
		var B_center = B.centerPoints();
		var A_rangePos = A.getRangePoints(); 
		var B_rangePos = B.getRangePoints(); 
 
 
		var startPos = [0,0];
	    var endPos = [0,0];


	    //第一种情况（A在下 B在上）
	    // 0__1__2    
	    // |     |	  
	    // 7  B	 3	 
	    // |     |    
	    // 6__5__4	  
	    //	  ↑
	    // 0__1__2    
	    // |     |	  
	    // 7  A  3	 
	    // |     |    
	    // 6__5__4	  
	    if(A_center.y >= B_center.y){

	        //两点节点上下没有间距
	        if(A_rangePos[0][1] <= B_rangePos[6][1]){ 

	            //A点在B的右侧
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){

	                startPos = A_rangePos[7];
	                endPos = B_rangePos[3];

	                
	            }else if(A_rangePos[2][0] <= B_rangePos[0][0]){
	                //A点在B的左侧
	                startPos = A_rangePos[3];
	                endPos = B_rangePos[7];

	            }else{

	                startPos = A_rangePos[1];
	                endPos = B_rangePos[1];
	            }

	        }else{ //上下没有叠加（上下有间距）
 

	             //A点在B的右下侧
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){

	                startPos = A_rangePos[0];
	                endPos = B_rangePos[4];

	                
	            }else if(A_rangePos[2][0] <= B_rangePos[2][0]){
	                //A点在B的左下侧
	                startPos = A_rangePos[2];
	                endPos = B_rangePos[6];

	            }else{

	                startPos = A_rangePos[1];
	                endPos = B_rangePos[5];
	            }
	        }
	    }else{
	        //第二种情况 （A在上 B在下）
	        // 0__1__2    
			// |     |	  
			// 7  A	 3	 
			// |     |    
			// 6__5__4	  
			//	  ↓
			// 0__1__2    
			// |     |	  
			// 7  B  3	 
			// |     |    
			// 6__5__4

	        //两点节点上下没有间距
	        if(B_rangePos[0][1]<=A_rangePos[6][1]){ 
	            //A在B的右侧
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){
	                startPos = A_rangePos[7];
	                endPos = B_rangePos[3];

	            }else if(A_rangePos[2][0] <= B_rangePos[0][0]){
	                //A在B的左侧
	                startPos = A_rangePos[3];
	                endPos = B_rangePos[7];

	            }else{
	                startPos = A_rangePos[5];
	                endPos = B_center[5];
	            }

	        }else{ //上下没有叠加（上下有间距）
 

	            //A在B的右上方
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){
	                startPos = A_rangePos[6];
	                endPos = B_rangePos[2];
	            }else if(A_rangePos[2][0] <= B_rangePos[0][0]){
	                //A在B的左上方
	                startPos = A_rangePos[4];
	                endPos = B_rangePos[0];
	            }else{
	                startPos = A_rangePos[5];
	                endPos = B_rangePos[1];
	            }



	        }
	    }

	    return startPos;
	}
	
	if(typeof this.lineCache[nodeId] !=='undefined' &&
		typeof this.lineCache[nodeId].oldStart !=='undefined'){

		if(((new Date()).getTime() - _this.lineCache[this.id].startCallTime) >300){
			_this.lineCache[this.id].startCallTime = (new Date()).getTime();
			_this.lineCache[this.id].oldStart = F();	

		}


	}else{

		_this.lineCache[this.id] = {
			startCallTime:(new Date()).getTime(),
			oldStart: F()
		}

	}

	return _this.lineCache[this.id].oldStart; 

	
};
Qflow.prototype.calcLineEndPos = function(A,B,nodeId) {
	var _this = this; 
	
	var F = function(){

		var A_center = A.centerPoints();
		var B_center = B.centerPoints();
		var A_rangePos = A.getRangePoints(); 
		var B_rangePos = B.getRangePoints();  


		var startPos = [0,0];
	    var endPos = [0,0];


	    //第一种情况（A在下 B在上）
	    // 0__1__2    
	    // |     |	  
	    // 7  B	 3	 
	    // |     |    
	    // 6__5__4	  
	    //	  ↑
	    // 0__1__2    
	    // |     |	  
	    // 7  A  3	 
	    // |     |    
	    // 6__5__4	  
	    if(A_center.y >= B_center.y){

	        //两点节点上下没有间距
	        if(A_rangePos[0][1] <= B_rangePos[6][1]){ 

	            //A点在B的右侧
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){

	                startPos = A_rangePos[7];
	                endPos = B_rangePos[3];

	                
	            }else if(A_rangePos[2][0] <= B_rangePos[0][0]){
	                //A点在B的左侧
	                startPos = A_rangePos[3];
	                endPos = B_rangePos[7];

	            }else{

	                startPos = A_rangePos[1];
	                endPos = B_rangePos[1];
	            }

	        }else{ //上下没有叠加（上下有间距） 

	             //A点在B的右下侧
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){

	                startPos = A_rangePos[0];
	                endPos = B_rangePos[4];

	                
	            }else if(A_rangePos[2][0] <= B_rangePos[2][0]){
	                //A点在B的左下侧
	                startPos = A_rangePos[2];
	                endPos = B_rangePos[6];

	            }else{

	                startPos = A_rangePos[1];
	                endPos = B_rangePos[5];
	            }
	        }
	    }else{
	        //第二种情况 （A在上 B在下）
	        // 0__1__2    
			// |     |	  
			// 7  A	 3	 
			// |     |    
			// 6__5__4	  
			//	  ↓
			// 0__1__2    
			// |     |	  
			// 7  B  3	 
			// |     |    
			// 6__5__4

	        //两点节点上下没有间距
	        if(B_rangePos[0][1]<=A_rangePos[6][1]){
 

	            //A在B的右侧
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){
	                startPos = A_rangePos[7];
	                endPos = B_rangePos[3];

	            }else if(A_rangePos[2][0] <= B_rangePos[0][0]){
	                //A在B的左侧
	                startPos = A_rangePos[3];
	                endPos = B_rangePos[7];

	            }else{
	                startPos = A_rangePos[5];
	                endPos = B_rangePos[5];
	            }

	        }else{ //上下没有叠加（上下有间距）


	            //A在B的右上方
	            if(A_rangePos[0][0] >= B_rangePos[2][0]){
	                startPos = A_rangePos[6];
	                endPos = B_rangePos[2];
	            }else if(A_rangePos[2][0] <= B_rangePos[0][0]){
	                //A在B的左上方
	                startPos = A_rangePos[4];
	                endPos = B_rangePos[0];
	            }else{
	                startPos = A_rangePos[5];
	                endPos = B_rangePos[1];
	            }



	        }
	    }

	    return endPos;

	}



	if(typeof this.lineCache[nodeId] !=='undefined' &&
		typeof this.lineCache[nodeId].oldEnd !=='undefined'){

		if(((new Date()).getTime() - _this.lineCache[this.id].endCallTime) >300){
			_this.lineCache[this.id].endCallTime = (new Date()).getTime();
			_this.lineCache[this.id].oldEnd = F();	

		}


	}else{
		_this.lineCache[this.id].endCallTime = (new Date()).getTime();
		_this.lineCache[this.id].oldEnd = F();
 

	}

	return _this.lineCache[this.id].oldEnd; 
};
Qflow.prototype.solveLink = function() {
	var _this = this;
	this.options.initData.link.forEach(function(item){

		item.fromNode =  _this.getNodeObj(_this.getNodeIdFromJsonById(item.fromId));
		item.toNode = _this.getNodeObj(_this.getNodeIdFromJsonById(item.toId));

	})
};
Qflow.prototype.initLink = function() {
	var _this = this;
	this.options.initData.link.forEach(function(item){ 

		var tmp = _this.qcanvas.qline.line({
			start:function(){return _this.calcLineStartPos(item.fromNode,item.toNode,this.id)},
			end:function(){return _this.calcLineEndPos(item.fromNode,item.toNode,this.id)}, 
			width:1,
			// pointerEvent:'none',
			drag:false,
			like:item.attr.like,
			withText:'连接关系'
		});

		_this.lineLayer.push(tmp);


	})
	
}; 
Qflow.prototype.updateInitData = function(obj,jsonObj) {
	jsonObj.x = obj.start[0];
	jsonObj.y = obj.start[1];


	if(jsonObj.nodeType == 'container'){
		//每一步 更新attr.gridPosition 
		//先实现top-center
		//可以摆放子项的区域位置[左上角开始位置，右下角结束位置]
		var childAreaPosition = this.getChildAreaPosition(jsonObj);

		//可以摆放子项的区域位置 计算出各个格子的坐标
		var childPosition = this.getChildPosition(jsonObj,childAreaPosition);

		//把格子坐标添加到ettr里
		jsonObj.attr.gridPosition = childPosition;

		//第二步 更新子项位置 
		// jsonObj.childNodes && jsonObj.childNodes.forEach(function(item,index){
		// 	item.start = [childPosition[index].x,childPosition[index].y]; 
		// })
	}
 



};
Qflow.prototype.initNodeTitle = function(jsonObj,nodeObj) {
	var _this = this;
	var t = this.qcanvas.qtext.text({
			start:function(){
				var start = _this.qcanvas.isFun(nodeObj.start)?nodeObj.start():nodeObj.start;
				return [start[0]+nodeObj.width*0.5,start[1]+nodeObj.height*0.5]
				// return [tmp[0].start[0]+tmp[0].width*0.5,tmp[0].start[1]+tmp[0].height*0.5];
			},
			text:jsonObj.text,
			pointerEvent:'none',
			color:jsonObj.attr && jsonObj.attr.color?jsonObj.attr.color:'#000',
			fontSize:'12px',
			ownerId:jsonObj.nodeId

		})

	this.qnodes.push(t);
	jsonObj.attr.titleId = t.id;


 
};
/**
 * 给容器创建标题节点
 * @param  {[type]} obj  [json数据对象]
 * @param  {[type]} qobj [容器节点对象]
 * @return {[type]}      [description]
 */
Qflow.prototype.initContainerTitle = function(obj,qobj) {
	var _this = this;
	 

		var t = this.qcanvas.qtext.text({
				start:function(){
					return [qobj.start[0]+qobj.width*0.5,qobj.start[1]+_this.containerTitleHeight*0.5];
				},
				text:obj.text,
				pointerEvent:'none',
				color:obj.attr?obj.attr.color:'#000',
				fontSize:'12px',
				ownerId:obj.nodeId
			})

		this.qnodes.push(t);

		//标题节点的id记到container节点json数据上
		obj.attr.titleId = t.id;
 
};
Qflow.prototype.drawNode = function(parentNode,nodes) { 
 
	var _this = this;
	for (var i = 0; i < nodes.length; i++) {

		if(parentNode!== null){

			//创建某个容器里包含的节点
			_this.createChildsOfContainer(parentNode,nodes[i],i);
 
		}else{

			//创建容器或节点（顶级的平行数据）
			_this.createContainerOrNode(nodes[i]); 

		}
	}
};
/**
 * 创建container的子项
 * @param  {[type]} parentNode [description]
 * @param  {[type]} jsonObj    [子项json数据]
 * @param  {[type]} index      [子项在container里的索引]
 * @return {[type]}            [description]
 */
Qflow.prototype.createChildsOfContainer = function(parentNode,jsonObj,index) {
	var _this = this; 
	var tmp = this.qcanvas.qrect.rect({
				 // start:[parentNode.attr.gridPosition[index].x,parentNode.attr.gridPosition[index].y],

				 start:function(){
				 	return [parentNode.attr.gridPosition[this.sort].x,parentNode.attr.gridPosition[this.sort].y]
				 },
				 sort:index,
				 nodeType:jsonObj.nodeType,
				 width:jsonObj.width?jsonObj.width:100,
				 height:jsonObj.height?jsonObj.height:50,
				 borderColor:jsonObj.attr && jsonObj.attr.borderColor?jsonObj.attr.borderColor:'red', 
				 fillColor:jsonObj.attr && jsonObj.attr.fillColor?jsonObj.attr.fillColor:'', 
				 dashed:jsonObj.attr && jsonObj.attr.dashed?jsonObj.attr.dashed:false,  
				 drag:false,
				 ownerId:parentNode.nodeId,
				 mouseenter:function(){ 
					_this.settingIcoShow(this);

				 },
				 mousedown:function(){ 

					 	_this.draging = true;
				 },
				 mouseup:function(e,pos){
				 	_this.settingIcoHide(); 
					

				 	_this.draging = false;
				 	//右击显示菜单
				 	if(e.button == '2'){
				 		_this.contextMenuNode = this;

				 		//右键菜单层级放到最高
				 		_this.qcanvas.raiseToTop(_this.contextSettingLayer);

				 		_this.contextMenuShow.call(_this,pos);

				 	}

				 },
				 mousemove:function(){ 


					_this.settingIcoShow(this);


				 	_this.draging && 
				 	_this.updateInitData.call(_this,this,jsonObj);

				 },
				 mouseout:function(){
				 	_this.settingIcoHide(); 
				 }
				})
	// //qcanvas和数据作关联
	jsonObj.nodeId = tmp.id;
	parentNode.childNodes?parentNode.childNodes.push(tmp):(parentNode.childNodes = [tmp]);

	this.qnodes.push(tmp);


	this.initNodeTitle(jsonObj,tmp);


};
Qflow.prototype.getNodeObj = function(nodeId) {
	var tmp = this.qnodes.filter(function(item){
 		return item.id == nodeId;
 	})

 	if(tmp.length>0){
 		return tmp[0];
 	}else{
 		return null;
 	}
};

Qflow.prototype.getJsonObj = function(nodeId) {

	var tmp = null;
	//搜索父 子项
	for (var i = 0; i < this.options.initData.node.length; i++) {

		if(this.options.initData.node[i].nodeId == nodeId){
			tmp = this.options.initData.node[i];
			break;
		}
		if(this.options.initData.node[i].child){
			for (var j = 0; j < this.options.initData.node[i].child.length; j++) {
				if(this.options.initData.node[i].child[j].nodeId == nodeId){
					tmp = this.options.initData.node[i].child[j];
					break;
				}
			} 
		}
		
	}

	return tmp;

};

Qflow.prototype.containerMouseDown = function(container,jsonObj) {
	var _this = this;
	//提高元素层级
 	_this.qcanvas.raiseToTop(container);

 	//同时提高标题节点层级 
 	var titleNode = _this.getNodeObj(jsonObj.attr.titleId);
 	titleNode !==null && _this.qcanvas.raiseToTop(titleNode);

 	//如果是container 同时提高它的子项节点及标题节点 取消事件响应
 	if(jsonObj.nodeType == 'container'){

 		jsonObj.childNodes && jsonObj.childNodes.forEach(function(item){
		 	_this.qcanvas.raiseToTop(item);
		 	item.setPointerEvent('none');
 		})

 		jsonObj.child && jsonObj.child.forEach(function(item){
 			var titleNode = _this.getNodeObj(item.attr.titleId);
		 	if(titleNode !==null ){
		 		_this.qcanvas.raiseToTop(titleNode);
			 	titleNode.setPointerEvent('none');

		 	} 
 		})
 	}
 	

 	_this.draging = true;
};
Qflow.prototype.containerMouseUp = function(container,e,pos,jsonObj) {
	var _this = this;
	_this.draging = false;

 	//如果是container 恢复事件响应
 	if(jsonObj.nodeType == 'container'){

 		jsonObj.childNodes && jsonObj.childNodes.forEach(function(item){
		 	item.setPointerEvent('auto');
 		})

 		jsonObj.child && jsonObj.child.forEach(function(item){
 			var titleNode = _this.getNodeObj(item.attr.titleId);
		 	if(titleNode !==null ){
			 	titleNode.setPointerEvent('auto');

		 	} 
 		})
 	}

 	//右击显示菜单
 	if(e.button == '2'){ 

 		_this.contextMenuNode = container;

 		//右键菜单层级放到最高
 		_this.qcanvas.raiseToTop(_this.contextSettingLayer);

 		_this.contextMenuShow(pos);

 	}
};
Qflow.prototype.containerMouseMove = function(container,jsonObj) {

	// this.settingIcoShow(container);


	this.draging && 
 	this.updateInitData(container,jsonObj);
};
Qflow.prototype.getMiddleCoordinate = function(s,e) {
 
	var start=[s.x,s.y],end=[e.x,e.y];

	// return {
	// 	x:(start[0] < end[0] ? start[0]:end[0])+Math.abs(start[0]-end[0]) * 0.5,
	// 	y:(start[1] < end[1] ? start[1]:end[1])+Math.abs(start[1]-end[1]) * 0.5,
	// };
	return [
		(start[0] < end[0] ? start[0]:end[0])+Math.abs(start[0]-end[0]) * 0.5,
		(start[1] < end[1] ? start[1]:end[1])+Math.abs(start[1]-end[1]) * 0.5,
	]
};
Qflow.prototype.createRangePoints = function(polyPoints) {
	var tmp = [];
	for (var i = 0; i < polyPoints.length; i++) {
		tmp.push([polyPoints[i].x,polyPoints[i].y]);
		tmp.push(this.getMiddleCoordinate(polyPoints[i],polyPoints[i+1==polyPoints.length?0:i+1]));
	}

	return tmp;
};
Qflow.prototype.createContainerOrNode = function(jsonObj) {
	var _this = this;
	var tmp = this.qcanvas.qrect.rect({
		 start:[jsonObj.x,jsonObj.y], 
		 nodeType:jsonObj.nodeType,
		 width:jsonObj.width?jsonObj.width:100,
		 height:jsonObj.height?jsonObj.height:50,
		 borderColor:jsonObj.attr.borderColor, 
		 fillColor:jsonObj.attr.fillColor, 
		 dashed:jsonObj.attr.dashed,  
		 getRangePoints:function(){ //返回rect边上的8个点的坐标
		 	var polyPoints = this.polyPoints(); 
		 	return _this.createRangePoints(polyPoints);
		 },
		 mouseenter:function(){ 
		 	_this.settingIcoShow(this);
		 },
		 mousedown:function(){ 

		 	_this.containerMouseDown.call(_this,this,jsonObj); 
		 },
		 mouseup:function(e,pos){
		 	_this.settingIcoHide(); 
		 	_this.containerMouseUp.call(_this,this,e,pos,jsonObj); 

		 },
		 mousemove:function(){
		 	_this.settingIcoShow(this);


		 	_this.containerMouseMove.call(_this,this,jsonObj); 

		 },
		 mouseout:function(){
		 	_this.settingIcoHide(); 
		 }
	})


	//qcanvas和数据作关联
	jsonObj.nodeId = tmp.id;

	this.qnodes.push(tmp);

	//初始化容器的标题
	jsonObj.nodeType == 'container' &&
	this.initContainerTitle(jsonObj,tmp);

	//初始化节点标题
	jsonObj.nodeType == 'node' &&
	this.initNodeTitle(jsonObj,tmp);



	jsonObj.nodeType == 'container' && 
	typeof jsonObj.child !='undefined' && 
	this.initNode(jsonObj);
};
Qflow.prototype.initNode = function(parentNode) { 

	if(parentNode){
		//开始画子项
		this.drawNode(parentNode,parentNode.child);
	}else{

		this.drawNode(null,this.options.initData.node);
	}

	
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
	var _this = this;

	//添加容器
	var tmp = this.qcanvas.qrect.rect({
		 start:[obj.x,obj.y],
		 width:this.containerNodeWidth,
		 height:this.containerNodeHeight,
		 borderColor:'red', 
		 fillColor:'',
		 dashed:true, 
		 mousedown:function(){

		 	_this.containerMouseDown.call(_this,this,jsonObj); 
		 },
		 mouseup:function(e,pos){

		 	_this.containerMouseUp.call(_this,this,e,pos,jsonObj); 

		 },
		 mousemove:function(){

		 	_this.containerMouseMove.call(_this,this,jsonObj); 

		 }
	})

	this.qnodes.push(tmp);


	//this.options.initData.node需要添加一项
	var jsonObj = {
		id:tmp.id,
		nodeId:tmp.id,
		nodeType:'container',  //容器类型
		x:obj.x,
		y:obj.y,
		text:'容器标题',
		width:this.containerNodeWidth,
		height:this.containerNodeHeight,
		grid:[1,1], //行 列
		child:[],
		childNodes:[], //qcanvas元素对象
		attr:{
			 titlePosition:'top-center',
			 color:'red', //标题文字的颜色
			 borderColor:'red', 
			 fillColor:'',
			 dashed:false, 
		}
	}
	this.options.initData.node.push(jsonObj);


	//添加容器的标题
	this.initContainerTitle(jsonObj,tmp);
	
	
};
Qflow.prototype.inSertToContainer = function(obj,aim) {
	//添加节点到container
	//根据container里的位置 初始化节点位置
	console.log('创建的节点需要初始到容器里');

	var parentJsonNode = this.getJsonObj(aim.id);
	var parentNode = this.getNodeObj(aim.id);

	//是否需要放大容器
	//attr.gridPosition
	if(parentJsonNode.attr.gridPosition.length <= parentJsonNode.child.length){ //需要放大

		//放大container的一行子节点的高度 同时重新生成JSON数据中的gridPostion
		parentJsonNode.height += (this.childNodeHeight+this.containerChildMargin);
		parentJsonNode.grid[0] += 1;

		parentNode.setHeight(parentJsonNode.height);
		
		//可以摆放子项的区域位置[左上角开始位置，右下角结束位置]
		var childAreaPosition = this.getChildAreaPosition(parentJsonNode);

		//可以摆放子项的区域位置 计算出各个格子的坐标
		var childPosition = this.getChildPosition(parentJsonNode,childAreaPosition);

		//把格子坐标添加到attr里
		parentJsonNode.attr.gridPosition = childPosition;

	}


	var jsonObj = {
			nodeType:'node',
			text:'我是新来的',
			attr:{
				color:'red'
			}
	}

	this.createChildsOfContainer(parentJsonNode,jsonObj,parentJsonNode.child.length);

	parentJsonNode.child.push(jsonObj); 


};
Qflow.prototype.addNode = function(obj) {

	var _this = this;

	//添加节点
	var tmp = this.qcanvas.qrect.rect({
		 start:[obj.x,obj.y],
		 width:this.childNodeWidth,
		 height:this.childNodeHeight,
		 borderColor:'red', 
		 fillColor:'',
		 dashed:true, 
		 mousedown:function(){

		 	_this.containerMouseDown.call(_this,this,jsonObj); 
		 },
		 mouseup:function(e,pos){

		 	_this.containerMouseUp.call(_this,this,e,pos,jsonObj); 

		 },
		 mousemove:function(){

		 	_this.containerMouseMove.call(_this,this,jsonObj); 

		 }
	})

	this.qnodes.push(tmp);


	//添加节点到画布上
	var jsonObj = {	 
			id:tmp.id,
			nodeId:tmp.id,
			nodeType:'node', //普通节点
			x:obj.x,
			y:obj.y,
			text:'标题',
			attr:{
				 borderColor:'red', 
				 color:'red', 
				 fillColor:'',
				 dashed:true, 
			}
	}

	this.options.initData.node.push(jsonObj);

	//初始化节点标题
	this.initNodeTitle(jsonObj,tmp);

};
/**
   * @description 射线法判断点是否在多边形内部
   * @param {Object} p 待判断的点，格式：{ x: X坐标, y: Y坐标 }
   * @param {Array} poly 多边形顶点，数组成员的格式同 p
   * @return {String} 点 p 和多边形 poly 的几何关系
   */
Qflow.prototype.rayCasting = function(p, poly) {
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
};
Qflow.prototype.inContainer = function(obj) {   

	var ele = this.qcanvas.elements; 
	var aim = null;
	for (var i = ele.length - 1; i >= 0; i--) {
		if(ele[i].display !='none' && this.rayCasting({x:obj.x,y:obj.y},ele[i].polyPoints()) == 'in'){
			console.log('找到了');
			aim = ele[i];
			break;
		}
	}

	var sign = false;
	if(aim !== null){

		if(typeof aim.ownerId !='undefined'){ //目标在某个容器里的某个节点上

			var ownerObj = this.getJsonObj(aim.ownerId);
			aim = this.getNodeObj(aim.ownerId);
			if(ownerObj.nodeType == 'container'){
				sign = true;
			}

		}else{

			var tmp = this.getJsonObj(aim.id);
			if(tmp !== null && tmp.nodeType == 'container'){
				sign = true;

			}
		}

		
	}

	return {
		sign:sign,
		aim:aim
	}


};

Qflow.prototype.addEle = function(obj) {

	switch(obj.id){
		case '-1':
			this.addContainer(obj);
		break;
		case '1':
			var tmp = this.inContainer(obj);//判断是否拖动到某了个容器里
			if(tmp.sign){
				this.inSertToContainer(obj,tmp.aim);
			}else{
				this.addNode(obj);
			} 
		break;

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