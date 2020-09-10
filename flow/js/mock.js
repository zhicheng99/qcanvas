var jsonData = [
			{
				node:[
					{	
						id:1,
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
								text:'我是容器里的1'
							},
							{	
								id:3,
								nodeType:'node',
								text:'我是容器里的2'
							},
							{	
								id:5,
								nodeType:'node',
								text:'我是容器里的2'
							}

						],
						attr:{
							 titlePosition:'top-center',
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
							 fillColor:'',
							 dashed:true, 
						}
					}

				],
				link:[	 //连线关系  

				] 
			}
		]