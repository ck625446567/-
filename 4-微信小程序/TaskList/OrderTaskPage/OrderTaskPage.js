// pages/HomeModule/WaitSession/WaitSession.js

import { URLDefines, request } from '../../client.js'

import { formatTime } from '../../../../utils/util.js'

import { getOrderStatusDesc, getOrderStatusColor } from '../../../../utils/ordertool.js'

// 代办任务
Component({

  /**
   * 声明周期
   */
  lifetimes: {
    created() {
      this.page = 1;
      this.pageSize = 10;
      this.searchText = null;
      this.noMoreData = false;
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    // all or wait
    type: {
      type: String,
      value: '',
      observer: 'handleChange'
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    empty: false,
    data: []
  },

  methods: {
    handleChange: function () {
      if (this.properties.type) {
        this.getData(true)
      }
    },
    /*
     * 点击条目
    */
    onclickcell: function (event) {
      let item = event.currentTarget.dataset.item;
      if (item && item.orderNo) {
        wx.navigateTo({
          url: '/pages/StoreModule/OrderDetail/OrderDetail?orderNo=' + item.orderNo
        })
      }
    },
    
    // 搜索
    onSearch: function (res) {
      this.searchText = res.detail.value;
      this.getData(true)
    },
    onRefresh: function () {
      this.getData(true)
    },
    onLoadMore: function () {
      this.getData(false)
    },
    getData: function (refresh) {
      let page = refresh ? 1 : (this.page + 1)
      request(this.properties.type === 'all' ? URLDefines.myTask : URLDefines.waitTask, {
        params: {
          searchType: 'ORDER_TYPE',
          page: page,
          pageSize: this.pageSize,
          searchText: this.searchText
        },
        autoDealError: true,
        complete: ({ error, inData }) => {
          let newList = inData || []
          for (let item of newList) {
            if (!item.orderModels) {
              item.orderModels = []
            }
            item.orderTimeDesc = item.orderTime ? formatTime(new Date(item.orderTime)) : ''
            item.orderStatusColor = getOrderStatusColor(item.orderStatus)
            item.orderStatusCn = getOrderStatusDesc(item.orderStatus)
          }
          let data = (refresh ? [] : this.data.list).concat(newList)
          this.setData({
            empty: !data.length,
            list: data
          })
          this.page = page
        }
      })
    }
  }
})