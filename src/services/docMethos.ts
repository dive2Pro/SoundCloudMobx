/**
 * Created by hyc on 17-4-26.
 */


export const docMethods = {
    addEvent:function addEventListener(type,func,capture=false){
        window.addEventListener(type,func,capture)
    },
    removeEvent:function removeEventListener(type,func,capture=false){
        window.removeEventListener(type,func,capture);
    }
}