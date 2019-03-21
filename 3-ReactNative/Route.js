/* eslint-disable camelcase */
/**
 * Created on 13:40 2018/07/31.
 * file name List
 * by chenkai
 */

import React from 'react';

import InventoryList from './List/List/List';

import WaitingList from './Waiting/List';

import WaitingListPick from './Waiting/ListPick';

import { View } from 'react-native';

import { StackNavigator } from 'react-navigation';
import ListDetail from './List/Detail/ListDetail';
import StockInOutList from './StockInOutList/StockInOutList';
import StockOut from './StockOut/StockOut';
import StockOutPick from './StockOut/StockOutPick';

function headerTitleStyle() {
    return Object.assign(
        {
            flex: 1,
            color: 'black',
            textAlign: 'center'
        },
        sm.isIOS
            ? {}
            : {
                fontSize: 18,
                color: '#4a4a4a' }
    );
}

export default function Route() {
    let page = sm.page;

    let NavigationVC = StackNavigator(
        {
            /*库存列表*/
            inventory_list: {
                screen: InventoryList
            },
            /*库存待入库列表*/
            inventory_wait_list: {
                screen: WaitingList
            },
            /*库存，待入库列表，选择器*/
            inventory_list_wait_pick: {
                screen: WaitingListPick
            },
            /*库存详情*/
            stock_list_detail: {
                screen: ListDetail
            },
            /*出入库列表*/
            stock_list_in_out: {
                screen: StockInOutList
            },
            /*出库*/
            stock_out: {
                screen: StockOut
            },
            /*出库选择界面*/
            stock_out_pick: {
                screen: StockOutPick
            }
        },
        {
            initialRouteName: page,
            initialRouteParams: {
                from: 'native'
            },
            navigationOptions: {
                headerBackTitle: null,
                headerBackTitleStyle: { color: 'black' },
                headerStyle: {
                    height: 44,
                    backgroundColor: 'white'
                    /* 以下三个配置，用来配置导航无阴影
                shadowOpacity: 0,//ios
                elevation: 0,//android
                borderBottomWidth: 0,
                */
                },
                headerTitleStyle: headerTitleStyle(),
                headerTintColor: 'black',
                headerRight: <View style={{ width: 60, height: 1 }} />
            }
        }
    );

    return <NavigationVC />;
}
