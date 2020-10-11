function Drag(options){
    this.drag = null;
    this.disX = 0;
    this.disY = 0;
    this.options = { 
        dragAimClass:options.dragAimClass?options.dragAimClass:'',
        dragServerClass:options.dragServerClass?options.dragServerClass:'',
        moveFun:options.moveFun?options.moveFun:function(){},
        upFun:options.upFun?options.upFun:function(){},

    }

    this.init();
}
Drag.prototype.addEvents = function(target,eventType,handle){
    if(target.addEventListener){ 
            target.addEventListener(eventType,handle,false);
        
    }else{
            target.attachEvent('on'+eventType,function(){
                handle.call(target,arguments);
            });
        
    };
}

Drag.prototype.removeEvents = function(target,eventType,handle){
        if(target.removeEventListener){
             target.removeEventListener(eventType, handle, false);
         } else if(target.detachEvent){
             target.detachEvent('on' + eventType, handle);
         } else {
             element['on' + eventType] = null;
         }
}

Drag.prototype.init = function(){
    this.mouseMove();
}
Drag.prototype.createDragDom = function(x,y,w,h,domId){ 
    var d = document.createElement('div');
    d.id="dragDom";
    d.style.position = 'absolute';
    d.style.zIndex = 9999;
    d.style.border = 'dashed red 1px';
    d.style.boxSizing = 'border-box';
    d.style.transform="translate3d(0,0,0)";
    d.style.left = x+'px';
    d.style.top = y+'px';
    d.style.width = w+'px';
    d.style.height = h+'px';
    d.dataset.id = domId;



    document.getElementById('qflow_lay').appendChild(d);
    // document.body.appendChild(d);

    this.drag = d; 
    _this = this;
    this.addEvents(d,'mouseup',function(event){

            var e = event || window.event;
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            var x = e.pageX || e.clientX + scrollX;
            var y = e.pageY || e.clientY + scrollY;

            // var layX = document.getElementById('qflow_lay').offsetLeft;
            // var layY = document.getElementById('qflow_lay').offsetTop;

            var layX = _this.getElementLeft(document.getElementById('qflow_lay'));
            var layY = _this.getElementTop(document.getElementById('qflow_lay'));



        _this.disX = 0;
        _this.disY = 0;
        _this.removeEvents(d,'mouseup',null);
        document.getElementById('dragDom') && 
        document.getElementById('qflow_lay').removeChild(document.getElementById('dragDom'));
        // document.body.removeChild(document.getElementById('dragDom'));
 
        _this.options.upFun({x:x-layX,y:y-layY,id:_this.drag.getAttribute('data-id')});
        _this.drag = null; 


    })

}

Drag.prototype.getElementLeft = function(element){
　　　　var actualLeft = element.offsetLeft;
　　　　var current = element.offsetParent;

　　　　while (current !== null){
　　　　　　actualLeft += current.offsetLeft;
　　　　　　current = current.offsetParent;
　　　　}

　　　　return actualLeft;
　　}
Drag.prototype.getElementTop = function(element){

　　　　var actualTop = element.offsetTop;
　　　　var current = element.offsetParent;

　　　　while (current !== null){
　　　　　　actualTop += current.offsetTop;
　　　　　　current = current.offsetParent;
　　　　}

　　　　return actualTop;
　　}

Drag.prototype.mouseMove = function(){
    var _this = this;

    this.addEvents(document,'mouseleave',function(event){
        _this.disX = 0;
        _this.disY = 0; 
        _this.drag = null; 

         document.getElementById('dragDom') && 
        document.getElementById('qflow_lay').removeChild(document.getElementById('dragDom'));
         
        // document.body.removeChild(document.getElementById('dragDom'));
    })

    this.addEvents(document,'mouseup',function(event){
        _this.disX = 0;
        _this.disY = 0;  


        _this.drag = null; 

         document.getElementById('dragDom') && 
        document.getElementById('qflow_lay').removeChild(document.getElementById('dragDom'));

        // document.body.removeChild(document.getElementById('dragDom'));
    })


    this.addEvents(document,'mousedown',function(event){

         var e = event || window.event; 
 
        //点中了要拖动的元素
        if(e.target.className.toLowerCase().indexOf(_this.options.dragAimClass)>-1){
            _this.drag = e.target;
 

            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            var x = e.pageX || e.clientX + scrollX;
            var y = e.pageY || e.clientY + scrollY; 

            _this.disX = x - e.target.offsetLeft;
            _this.disY = y - e.target.offsetTop;


            // var layX = document.getElementById('qflow_lay').offsetLeft;
            // var layY = document.getElementById('qflow_lay').offsetTop;



            _this.createDragDom(
                e.target.offsetLeft-scrollX,
                e.target.offsetTop-scrollY, 

                e.target.offsetWidth,
                e.target.offsetHeight,
                e.target.getAttribute('data-id')

            );
        } 

    })

    this.addEvents(document,'mousemove',function(event){ 
                if(_this.drag !== null){
                var e = event || window.event;
 


            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            var x = e.pageX || e.clientX + scrollX;
            var y = e.pageY || e.clientY + scrollY;  


            // var layX = document.getElementById('qflow_lay').offsetLeft;
            // var layY = document.getElementById('qflow_lay').offsetTop;

                _this.drag.style.left = (x - _this.disX - scrollX)+'px';
                _this.drag.style.top = (y - _this.disY - scrollY)+'px';

                _this.options.moveFun(x,y);
            
            }
                
        
        })
} 