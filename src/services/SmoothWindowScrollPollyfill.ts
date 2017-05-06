/**
 * Created by hyc on 17-5-6.
 */
((w: any, d) => {
    /**
     *
     */
    function pollyfill() {
        var Element = w.HTMLElement || w.Element;

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
        const ANIM_TIME = 468

        function ease(v) {
            return 0.5 * (1 - Math.cos(Math.PI * v));
        }

        function step(context) {
            const {
                startX,
                startY,
                x,
                y,
                method,
                startTime
            } = context;

            let currentTime = now();
            let k = (currentTime - startTime) / ANIM_TIME
            k = k > 1 ? 1 : k;
            let value = ease(k);
            let targetX = startX + (x - startX) * value
            let targetY = startY + (y - startY) * value
            method.call(this, targetX, targetY)
            if (targetX != x || targetY != y) {
                w.requestAnimationFrame(step.bind(this, context))
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
            let startX = 0, startY = 0, method,
                scrollable
            if (el === d.body) {
                scrollable = w
                startX = w.scrollX || w.pageXOffset
                startY = w.scrollY || w.pageYOffset
                method = origin.scroll
            } else {
                startY = el.scrollTop
                startX = el.scrollLeft
                scrollable = el
                method = scrollElement
            }

            step.call(this, {
                startX,
                startY,
                x,
                y,
                method,
                startTime,
                scrollable
            })

        }

        /**
         * 查找节点的最近的可滑动父组件
         * parent 满足 :
         *      ! = d.body
         *      scrollSpace >0
         *      overflow = visible
         *
         * @param el
         */
        function findScrollParent(el) {
            let parent = el
            let isBody, hasScrollableSpace, hasVisibleOverflow
            do {
                parent = parent.parentNode
                isBody = parent === d.body
                hasScrollableSpace = parent.clientHeight < parent.scrollHeight || parent.clientWidth < parent.scrollWidth
                hasVisibleOverflow = w.getComputedStyle(parent, null).overflow === 'visible'

            } while (!isBody && !(hasScrollableSpace && !hasVisibleOverflow )); // 不是body,且 overflow不是visible
            isBody = hasVisibleOverflow = hasVisibleOverflow = null;
            return parent
        }

        w.scroll = w.scrollTo = function (x) {
            if (shouldBailOut(x)) {
                origin.scroll.call(this, x.left || arguments[0], x.top || arguments[1]);
            } else {
                smoothScroll.call(this, d.body, x.left, x.top);
            }
        }

        w.scrollBy = function (x) {
            if (shouldBailOut(x)) {
                origin.scrollBy.call(this, x.left || arguments[0], x.top || arguments[1])

            } else {

                const {left, top} = x
                const endX = w.scrollX || w.pageXOffset + left
                const endY = w.scrollY || w.pageYOffset + top
                smoothScroll.call(this, d.body, endX, endY);

            }
        }

        /**
         *
         * @type {(x)} : { left:number,top:number:behavior:string}
         *
         */
        Element.prototype.scroll = Element.prototype.scrollTo = function (x) {
            if (shouldBailOut(x)) {
                origin.elScroll.call(this, x.left || arguments[0], x.top || arguments[1])
            } else {
                smoothScroll.call(this, this, x.left || arguments[0], x.top || arguments[1])
            }
        }

        Element.prototype.scrollBy = function (x) {
            if (typeof x === 'object') {
                this.scroll({
                    ...x,
                    left: x.left + this.scrollLeft,
                    top: x.top + this.scrollTop
                })
            } else {
                this.scroll({
                    left: this.scrollLeft + arguments[0],
                    top: this.scrollLeft + arguments[1]
                })
            }
        }

        Element.prototype.scrollIntoView = function (x) {
            if (shouldBailOut(x)) {
                origin.elscrollIntoView.apply(this, arguments[0] || true)
                return;
            }
            if (typeof x === 'object') {
                /**
                 * 滑动的距离是可滑动父组件的 scrollTop - top + client.top
                 *
                 */
                const scrollParent = findScrollParent(this)
                const parentRects = scrollParent.getBoundingClientRect();
                const clientRects = this.getBoundingClientRect();

                if (scrollParent !== d.body) {

                    // 滑动到刚好clientRect出现
                    smoothScroll.call(this, scrollParent,
                        parentRects.scrollLeft - parentRects.left + clientRects.left,
                        parentRects.scrollTop - parentRects.top + clientRects.top
                    )
                    w.scrollBy({
                        left: parentRects.left,
                        top: parentRects.top,
                        behavior: 'smooth'
                    });
                }else{
                    w.scrollBy({
                        left:clientRects.left,
                        top:clientRects.top,
                        behavior:'smooth'
                    })
                }

            }
        }


    }

    if (typeof exports === 'object') {
        module.exports = {
            pollyfill
        }
    } else {
        pollyfill()
    }
    ;

})(window, document)