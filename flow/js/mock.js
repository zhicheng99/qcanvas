var jsonData = [
			{
				node:[
					{	
						id:1,     //节点的唯一标识 也有于连线的起终点标识
						nodeId:1, //初始化生成后对应相应的节点对象id 每次都会变
						nodeType:'container',  //容器类型
						x:100,
						y:200,
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
									color:'#fff'
								}
							},
							{	
								id:3,
								nodeType:'node',
								text:'我是容器里的2',
								attr:{
									color:'#fff'
								}
							},
							{	
								id:5,
								nodeType:'node',
								text:'我是容器里的3',
								attr:{
									color:'#fff'
								}

							}

						],
						attr:{
							 titlePosition:'top-center',
							 color:'#fff', //标题文字的颜色
							 borderColor:'#9093DC', 
							 fillColor:'#9093DC',
							 dashed:false, 
						}
					},
					{	
						id:4,
						nodeType:'node', //普通节点
						x:200,
						y:50,
						text:'标题1',
						attr:{
							 borderColor:'#7EC8CE', 
							 color:'#fff', 
							 fillColor:'#585DCB',
							 dashed:false, 
						}
					},
					{	
						id:6,
						nodeType:'node', //普通节点
						x:350,
						y:50,
						text:'标题2',
						attr:{
							 borderColor:'#7EC8CE', 
							 color:'#fff', 
							 fillColor:'#585DCB',
							 dashed:false, 
						}
					},
					{	
						id:7,
						nodeType:'tip', //备注文本节点
						x:350,
						y:50,
						text:'备注',
						attr:{
							 borderColor:'#7EC8CE', 
							 color:'#fff', 
							 fillColor:'#585DCB',
							 dashed:false, 
						}
					},
					// {
					// 	height: 98,
					// 	id: 8,
					// 	nodeType: "tip",
					// 	text: "备注fsfsfs↵ef↵ef↵ef↵e↵fe↵fe",
					// 	width: 150,
					// 	x: 484,
					// 	y: 220,
					// 	attr:{
					// 		 borderColor:'#7EC8CE', 
					// 		 color:'#fff', 
					// 		 fillColor:'#585DCB',
					// 		 dashed:false, 
					// 	}
					// }

				],
				link:[	 //连线关系  
					{
						fromId:1,
						toId:4,
						attr:{
							text:'连线关系1',
							like:'->'
						}
					},
					{
						fromId:4,
						toId:5,
						attr:{
							text:'连线关系2',
							like:'->'
						}
					}
				]
				 
			}
		];
// var jsonData = [{"node":[{"id":6791,"nodeId":1663,"nodeType":"container","x":340,"y":124,"text":"Qcanvas实例","width":120,"height":550,"grid":[13,1],"child":[{"nodeType":"node","text":"this.qline","attr":{"color":"#fff","titleId":5347},"id":9815,"nodeId":8052},{"nodeType":"node","text":"this.qtext","attr":{"color":"#fff","titleId":6239},"id":3997,"nodeId":8897},{"nodeType":"node","text":"this.qrect","attr":{"color":"#fff","titleId":6601},"id":1943,"nodeId":5963},{"nodeType":"node","text":"this.qarc","attr":{"color":"#fff","titleId":8639},"id":5005,"nodeId":8435},{"nodeType":"node","text":"this.qpolygon","attr":{"color":"#fff","titleId":5573},"id":2930,"nodeId":6749},{"nodeType":"node","text":"this.qanimation","attr":{"color":"#fff","titleId":1928},"id":1547,"nodeId":6610},{"nodeType":"node","text":"this.qimg","attr":{"color":"#fff","titleId":2216},"id":3396,"nodeId":4471},{"nodeType":"node","text":"this.qspirit","attr":{"color":"#fff","titleId":3317},"id":5860,"nodeId":2991},{"nodeType":"node","text":"this.qshape","attr":{"color":"#fff","titleId":472},"id":2049,"nodeId":3698},{"nodeType":"node","text":"this.qlayer","attr":{"color":"#fff","titleId":2699},"id":9146,"nodeId":6443},{"nodeType":"node","text":"this.qgroup","attr":{"color":"#fff","titleId":319},"id":6701,"nodeId":6810},{"nodeType":"node","text":"this.event","attr":{"color":"#fff","titleId":1044},"id":8441,"nodeId":4287},{"nodeType":"node","text":"this.element = []","attr":{"color":"#fff","titleId":8034},"id":6652,"nodeId":274}],"attr":{"titlePosition":"top-center","color":"#fff","borderColor":"#9093DC","fillColor":"#9093DC","dashed":false,"gridPosition":[{"x":350,"y":154},{"x":350,"y":194},{"x":350,"y":234},{"x":350,"y":274},{"x":350,"y":314},{"x":350,"y":354},{"x":350,"y":394},{"x":350,"y":434},{"x":350,"y":474},{"x":350,"y":514},{"x":350,"y":554},{"x":350,"y":594},{"x":350,"y":634}],"titleId":5418}},{"id":9238,"nodeId":4899,"nodeType":"node","x":350,"y":49,"text":"Qcanvas类","attr":{"borderColor":"#70BDC4","color":"#fff","fillColor":"#FFA500","dashed":false,"titleId":2961}},{"id":4704,"nodeId":2065,"nodeType":"node","x":596,"y":162,"text":"Qtext类","attr":{"borderColor":"#70BDC4","color":"#fff","fillColor":"#585DCB","dashed":false,"titleId":8921}},{"id":2108,"nodeId":3753,"nodeType":"node","x":596,"y":208,"text":"Qrect类","attr":{"borderColor":"#70BDC4","color":"#fff","fillColor":"#585DCB","dashed":false,"titleId":8288}},{"id":5379,"nodeId":745,"nodeType":"node","x":597,"y":255,"text":"Qarc类","attr":{"borderColor":"#70BDC4","color":"#fff","fillColor":"#585DCB","dashed":false,"titleId":2075}},{"id":2045,"nodeId":235,"nodeType":"node","x":597,"y":300,"text":"Qpolygon类","attr":{"borderColor":"#70BDC4","color":"#fff","fillColor":"#585DCB","dashed":false,"titleId":4315}},{"id":6965,"nodeId":1985,"nodeType":"node","x":598,"y":346,"text":"Qanimation类","attr":{"borderColor":"#70BDC4","color":"#fff","fillColor":"#585DCB","dashed":false,"titleId":5218}},{"id":839,"nodeId":3110,"nodeType":"node","x":598,"y":391,"text":"Qimg类","attr":{"borderColor":"#70BDC4","color":"#fff","fillColor":"#585DCB","dashed":false,"titleId":9472}},{"id":7002,"nodeId":3791,"nodeType":"node","x":598,"y":436,"text":"Qspirit类","attr":{"borderColor":"#70BDC4","color":"#fff","fillColor":"#585DCB","dashed":false,"titleId":5348}},{"id":4744,"nodeId":9431,"nodeType":"node","x":594,"y":112,"text":"Qline类","attr":{"borderColor":"#70BDC4","color":"#fff","fillColor":"#585DCB","dashed":false,"titleId":5472}},{"id":9511,"nodeId":6768,"nodeType":"node","x":600,"y":482,"text":"Qshape类","attr":{"borderColor":"#70BDC4","color":"#fff","fillColor":"#585DCB","dashed":false,"titleId":466}},{"id":7235,"nodeId":7267,"nodeType":"container","x":61,"y":63,"text":"Qlayer类","width":120,"height":70,"grid":[1,1],"child":[{"nodeType":"node","text":"Qlayer.prototype","attr":{"color":"#fff","titleId":4610},"id":2200,"nodeId":4498}],"attr":{"titlePosition":"top-center","color":"#fff","borderColor":"#9093DC","fillColor":"#9093DC","dashed":false,"gridPosition":[{"x":71,"y":93}],"titleId":7343}},{"id":7681,"nodeId":5874,"nodeType":"node","x":599,"y":526,"text":"Qgroup类","attr":{"borderColor":"#70BDC4","color":"#fff","fillColor":"#585DCB","dashed":false,"titleId":5122}},{"id":6048,"nodeId":8416,"nodeType":"node","x":599,"y":570,"text":"Qevent类","attr":{"borderColor":"#70BDC4","color":"#fff","fillColor":"#585DCB","dashed":false,"titleId":5707}},{"id":9375,"nodeId":3175,"nodeType":"container","x":742,"y":587,"text":"elements","width":230,"height":150,"grid":[3,2],"child":[{"nodeType":"node","text":"line元素对象","attr":{"color":"#fff","titleId":1608},"id":7846,"nodeId":6577},{"nodeType":"node","text":"rect元素对象","attr":{"color":"#fff","titleId":9898},"id":9350,"nodeId":5085},{"nodeType":"node","text":"text元素对象","attr":{"color":"#fff","titleId":8830},"id":2234,"nodeId":3607},{"nodeType":"node","text":"arc元素对象","attr":{"color":"#fff","titleId":7207},"id":2468,"nodeId":3956},{"nodeType":"node","text":"layer元素对象","attr":{"color":"#fff","titleId":8054},"id":2667,"nodeId":8545}],"attr":{"titlePosition":"top-center","color":"#fff","borderColor":"#9093DC","fillColor":"#9093DC","dashed":false,"gridPosition":[{"x":752,"y":617},{"x":862,"y":617},{"x":752,"y":657},{"x":862,"y":657},{"x":752,"y":697},{"x":862,"y":697}],"titleId":1904}},{"id":2698,"nodeId":3009,"nodeType":"node","x":807,"y":437,"text":"requestNextAnimationFrame","attr":{"borderColor":"#808080","color":"#000080","fillColor":"#008000","dashed":false,"titleId":9160}},{"id":2561,"nodeId":925,"nodeType":"container","x":423,"y":758,"text":"元素相应paint方法","width":120,"height":230,"grid":[5,1],"child":[{"nodeType":"node","text":"paintLine","attr":{"color":"#fff","titleId":3634},"id":96,"nodeId":232},{"nodeType":"node","text":"paintRect","attr":{"color":"#fff","titleId":7310},"id":8621,"nodeId":9394},{"nodeType":"node","text":"paintText","attr":{"color":"#fff","titleId":3993},"id":7110,"nodeId":1456},{"nodeType":"node","text":"。。。","attr":{"color":"#fff","titleId":9749},"id":244,"nodeId":1062},{"nodeType":"node","text":"paintLayer","attr":{"color":"#fff","titleId":2730},"id":1891,"nodeId":7109}],"attr":{"titlePosition":"top-center","color":"#fff","borderColor":"#9093DC","fillColor":"#9093DC","dashed":false,"gridPosition":[{"x":433,"y":788},{"x":433,"y":828},{"x":433,"y":868},{"x":433,"y":908},{"x":433,"y":948}],"titleId":8699}},{"id":2536,"nodeId":2303,"nodeType":"node","x":254,"y":770,"text":"页面canvas","attr":{"borderColor":"#FFFF00","color":"#FFFFFF","fillColor":"#008000","dashed":false,"titleId":8905}},{"id":7763,"nodeId":489,"nodeType":"container","x":54,"y":528,"text":"layer.element成员","width":120,"height":150,"grid":[3,1],"child":[{"nodeType":"node","text":"line元素对象","attr":{"color":"#fff","titleId":5027},"id":744,"nodeId":6370},{"nodeType":"node","text":"rect元素对象","attr":{"color":"#fff","titleId":7761},"id":4077,"nodeId":4767},{"nodeType":"node","text":"arc元素对象","attr":{"color":"#fff","titleId":3216},"id":2717,"nodeId":3332}],"attr":{"titlePosition":"top-center","color":"#fff","borderColor":"#9093DC","fillColor":"#9093DC","dashed":false,"gridPosition":[{"x":64,"y":558},{"x":64,"y":598},{"x":64,"y":638}],"titleId":570}},{"id":195,"nodeId":9410,"nodeType":"container","x":35,"y":738,"text":"元素相应paint方法","width":120,"height":150,"grid":[3,1],"child":[{"nodeType":"node","text":"paintLine","attr":{"color":"#fff","titleId":7186},"id":2279,"nodeId":7603},{"nodeType":"node","text":"paintRect","attr":{"color":"#fff","titleId":1986},"id":6048,"nodeId":4938},{"nodeType":"node","text":"paintArc","attr":{"color":"#fff","titleId":4058},"id":8230,"nodeId":8967}],"attr":{"titlePosition":"top-center","color":"#fff","borderColor":"#9093DC","fillColor":"#9093DC","dashed":false,"gridPosition":[{"x":45,"y":768},{"x":45,"y":808},{"x":45,"y":848}],"titleId":1374}},{"id":4373,"nodeId":7999,"nodeType":"node","x":200,"y":892,"text":"layer临时canvas","attr":{"borderColor":"#70BDC4","color":"#fff","fillColor":"#585DCB","dashed":false,"titleId":2395}}],"link":[{"fromId":9238,"toId":6791,"attr":{"like":"->","color":"#FF912D","text":"new Qcanvas()"},"lineId":4339},{"fromId":4704,"toId":3997,"attr":{"like":"->","color":"#FF912D","text":"new Qtext(this)"},"lineId":2907},{"fromId":2108,"toId":1943,"attr":{"like":"->","color":"#FF912D","text":"new Qrect(this)"},"lineId":6530},{"fromId":5379,"toId":5005,"attr":{"like":"->","color":"#FF912D","text":"new Qarc(this)"},"lineId":6514},{"fromId":2045,"toId":2930,"attr":{"like":"->","color":"#FF912D","text":"new Qpolygon(this)"},"lineId":7626},{"fromId":6965,"toId":1547,"attr":{"like":"->","color":"#FF912D","text":"new Qanimation(this)"},"lineId":2513},{"fromId":839,"toId":3396,"attr":{"like":"->","color":"#FF912D","text":"new Qimg(this)"},"lineId":1312},{"fromId":7002,"toId":5860,"attr":{"like":"->","color":"#FF912D","text":"new Qspirit(this)"},"lineId":1822},{"fromId":4744,"toId":9815,"attr":{"like":"->","color":"#FF912D","text":"new Qline(this)"},"lineId":8319},{"fromId":9511,"toId":2049,"attr":{"like":"->","color":"#FF912D","text":"new Qshape(this)"},"lineId":1162},{"fromId":7235,"toId":9146,"attr":{"like":"->","color":"#FF912D","text":"new Qlayer(this)"},"lineId":6712},{"fromId":2200,"toId":6791,"attr":{"like":"->","color":"#FF912D","text":"指向"},"lineId":9961},{"fromId":7681,"toId":6701,"attr":{"like":"->","color":"#FF912D","text":"new Qgroup(this)"},"lineId":267},{"fromId":6048,"toId":8441,"attr":{"like":"->","color":"#FF912D","text":"new Qevent(this)"},"lineId":6720},{"fromId":6652,"toId":9375,"attr":{"like":"->","color":"#FF912D","text":"保存元素"},"lineId":9042},{"fromId":2698,"toId":9375,"attr":{"like":"->","color":"#FF912D","text":"循环"},"lineId":3327},{"fromId":9375,"toId":2561,"attr":{"like":"->","color":"#FF912D","text":"执行相应方法"},"lineId":1280},{"fromId":96,"toId":2536,"attr":{"like":"->","color":"#FF912D","text":"绘到"},"lineId":4327},{"fromId":8621,"toId":2536,"attr":{"like":"->","color":"#FF912D","text":"绘到"},"lineId":3197},{"fromId":7110,"toId":2536,"attr":{"like":"->","color":"#FF912D","text":"绘到"},"lineId":2775},{"fromId":2667,"toId":7763,"attr":{"like":"->","color":"#008000","text":"循环layer对象中的elements"},"lineId":2703},{"fromId":7763,"toId":195,"attr":{"like":"->","color":"#008000","text":"执行相应方法"},"lineId":5130},{"fromId":195,"toId":4373,"attr":{"like":"->","color":"#008000","text":"绘到"},"lineId":8785},{"fromId":4373,"toId":2536,"attr":{"like":"->","color":"#008000","text":"绘到"},"lineId":9022},{"fromId":1891,"toId":4373,"attr":{"like":"->","color":"#008000","text":"访问"},"lineId":9439},{"fromId":244,"toId":2536,"attr":{"like":"->","color":"#FF912D","text":"绘到"},"lineId":6847},{"fromId":9146,"toId":7763,"attr":{"like":"->","color":"#FF912D","text":"element成员"},"lineId":3597}]}];	