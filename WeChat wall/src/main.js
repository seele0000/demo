import 'eventsource-polyfill';
import 'whatwg-fetch';
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './app';
import pages from './pages'
Vue.use(VueRouter);

alert(1)

const routes = [{
    path: '/',
    redirect: '/mobile',
}, ...eachRoutes(pages)]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
})

new Vue({
    el: '#app',
    ...App,
    router
})

function eachRoutes(_routeList) {
    let _routes = [];
    for (let key in _routeList) {
        _routes.push({
            ..._routeList[key].route,
            component: _routeList[key]
        });
    }
    return _routes;
}


// fetch('/data/pullComment', {
//     method: 'GET',
//     body: JSON.stringify({
//         // message:this.messageContent
//     }),
//     headers: {
//         "Content-Type": "text/event-stream",
//         // "Cache-Control": "no-cache",
//         // "Connection": "ke`ep-alive"
//     }
// })
    // .then(function (response) {
    //     return response.json();
    // })
    // .then(function (data) {
    //     // that.dataInit(data.data);
    //     // that.list = data.data;
    //     // that.$set("list",data.data);
    //     console.log('data')
    //     console.log(data)
    // }).catch(()=> {
// });
