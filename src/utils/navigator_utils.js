/*
*  返回到指定视图
*  在栈中已经存在的路由  并销毁指定路由之后的界面
* */

const popToRoute = (navigator, route) => {
  const routes = navigator.getCurrentRoutes();
  console.log(routes);
  for (let i = routes.length - 1; i >= 0; i--) {
    if (routes[i].id === route.id) {
      Object.assign(routes[i], route);
      navigator.popToRoute(routes[i]);
    }
  }
};

export default {
  popToRoute,
};
