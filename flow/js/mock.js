var jsonData = [
			{
				node:[
					{	
						id:1,
						type:'container',  //容器类型
						x:100,
						y:100,
						text:'容器标题',
						width:200
						height:200,
						grid:[1,1], //行 列
						child:[

							//容器里的节点不需要坐标  根据grid自动生成
							{	
								id:2,
								type:'node',
								text:'我是容器里的1'
							},
							{	
								id:3,
								type:'node',
								text:'我是容器里的2'
							}

						]
					},
					{	
						id:4,
						type:'node', //普通节点
						x:200,
						y:50,
						text:'标题'
					}

				],
				link:[	 //连线关系  

				] 
			}
		]