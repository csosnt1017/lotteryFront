

Vue.prototype.$axios = axios;

//自动添加请求头
// axios.interceptors.request.use(function(config) {
// 	let token = localStorage.getItem('authorization');
// 	if (token) {
// 		config.headers['Authorization'] = token;
// 	}
// 	// 	next(function(response){
// 	// 	    if(response.body.code===401){ //与后台约定登录失效的返回码
// 	// 		alert("登录已过期，请重新登录!");
// 	// 	        parent.location.href ='/login';
// 	// 			return response;
// 	// 	    }
// 	// 	})
// 	return config;
// });
axios.interceptors.response.use(response => {
		return response;
	},
	error => {
		if (error.response) {
			if (error.response.status == 401) {
				sessionStorage.removeItem('Authorization');
				alert('登录过期,请重新登录');
				window.location.href = "Login.html";
			}
			if (error.response.status == 403) {
				sessionStorage.removeItem('Authorization');
				window.location.href = "Login.html";
			}
			// 			switch (error.response.status) {
			// 				case 401:
			// 					// 返回 401 清除token信息并跳转到登录页面
			// 					localStorage.removeItem('authorization');
			// 					alert("登录已过期，请重新登录!");
			// 					router.replace({
			// 						path: '/login',
			// 						query: {
			// 							redirect: router.currentRoute.fullPath
			// 						}
			// 					})
			// 				case 403:
			// 					// 返回 401 清除token信息并跳转到登录页面
			// 					localStorage.removeItem('authorization');
			// 					router.replace({
			// 						path: '/login',
			// 						query: {
			// 							redirect: router.currentRoute.fullPath
			// 						}
			// 					})
			// 			}
		}
		return Promise.reject(error.response.data) // 返回接口返回的错误信息
	});
// router.beforeEach((to, from, next) => {
// 	const role = localStorage.getItem('userName');
// 	if (!role && to.path !== '/login') {
// 		next('/login');
// 	} else if (to.meta.permission) {
// 		// 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
// 		role === 'admin' ? next() : next('/404');
// 	} else {
// 		// 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
// 		if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
// 			Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
// 				confirmButtonText: '确定'
// 			});
// 		} else {
// 			next();
// 		}
// 	}
// })
// 
// new Vue({
// 	router,
// 	render: h => h(App)
// }).$mount('#app');
//
