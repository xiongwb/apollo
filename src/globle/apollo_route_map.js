/*
 * @providesModule ApolloRouteMap
 */


import Pages from 'ApolloPages'

const map = {}
for (let page in Pages) {
  map[page] = {component: Pages[page]};
}

export default map;
