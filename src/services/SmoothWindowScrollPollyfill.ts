/**
 * Created by hyc on 17-5-6.
 */
((w: any, d) => {
    /**
     *
     */
    function pollyfill() {

        const origin = {
            scroll: w.scroll || w.scrollTo,
            scrollBy: w.scrollBy,
            elScroll: Element.prototype.scroll || scrollElement,
            elscrollIntoView: Element.prototype.scrollIntoView
        }

        function scrollElement(x, y) {
            this.scrollTop = y;
            this.scrollLeft = x;
        }

        function shouldBailOut(x): boolean {
            if (typeof x !== 'object' || x.behavior == null || x.behavior === 'auto' || x.behavior === 'instant') {
                return true
            }


            if (typeof x === 'object' && x.behavior === 'smooth') {
                return false
            }

            throw new TypeError('behavior not valid')
        }

        const now = w.performance && w.performance.now ? w.performance.now.bind(w.performance) : Date.now
        const ANIM_TIME  = 468
        function ease(v){
            return 0.5 * (1-Math.cos(Math.PI*v));
        }
        function step(context) {
            const {
                startX,
                startY,
                x,
                y,
                method,
                startTime
            }=context;

            let currentTime = now();
            let k = (currentTime-startTime)/ANIM_TIME
            k = k>1?1:k;
            let value = ease(k);
            let targetX =startX+ (x - startX)*value
            let targetY =startY+ (y-startY)*value
            method.call(this,targetX,targetY)
            if(targetX!=x||targetY!=y){
                w.requestAnimationFrame(step.bind(this,context))
            }
        }

        /**
         * 确定要进行动画的属性
         * @param el 滑动的节点
         * @param x 目标x坐标
         * @param y 目标y坐标
         */
        function smoothScroll(el, x, y) {
            let startTime = now();
            let startX=0, startY=0, method=null;

            if (el === d.body) {
                startX = w.scrollX || w.pageXOffset
                startY = w.scrollY || w.pageYOffset
                method = origin.scroll
            } else {

            }


            step.call(this,{
                startX,
                startY,
                x,
                y,
                method,
                startTime
            })

        }


        w.scroll = w.scrollTo = function (x) {
            if (shouldBailOut(x)) {
                origin.scroll.call(this, x.left || arguments[0], x.top || arguments[1]);
            } else {
                smoothScroll.call(this, d.body, x.left,x.top);
            }
        }
    }

    if(typeof exports ==='object'){
        module.exports={
            pollyfill
        }
    }else{
        pollyfill()
    };

})(window, document)