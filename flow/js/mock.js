var jsonData = [
			{
				node:[
					{	
						id:1,     //节点的唯一标识 也有于连线的起终点标识
						nodeId:1, //初始化生成后对应相应的节点对象id 每次都会变
						nodeType:'container',  //容器类型
						x:100,
						y:100,
						text:'容器标题',
						width:230,
						height:160,
						grid:[2,2], //行 列
						child:[

							//容器里的节点不需要坐标  根据grid自动生成
							{	
								id:2,
								nodeType:'node',
								text:'我是容器里的1',
								attr:{
									color:'red'
								}
							},
							{	
								id:3,
								nodeType:'node',
								text:'我是容器里的2',
								attr:{
									color:'red'
								}
							},
							{	
								id:5,
								nodeType:'node',
								text:'我是容器里的3',
								attr:{
									color:'red'
								}

							}

						],
						attr:{
							 titlePosition:'top-center',
							 color:'red', //标题文字的颜色
							 borderColor:'red', 
							 fillColor:'',
							 dashed:false, 
						}
					},
					{	
						id:4,
						nodeType:'node', //普通节点
						x:200,
						y:50,
						text:'标题',
						attr:{
							 borderColor:'red', 
							 color:'red', 
							 fillColor:'',
							 dashed:true, 
						}
					}

				],
				link:[	 //连线关系  

				] 
			}
		]