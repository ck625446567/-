// pages/WaitTaskModule/WaitTaskList/WaitTaskPage/WaitTaskPage.js

import { request, URLDefines } from '../../client.js'

import { formatTimeTimeStamp } from '../../../../utils/util.js'

import { getFlowStatus } from '../../../../utils/ordertool.js'

const app = getApp()

Component({
  /**
   * 声明周期
   */
  lifetimes: {
    created() {
      this.page = 1;
      this.pageSize = 10;
      this.searchText = null;
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
   * 组件的初始数据
   */
  data: {
    list: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleChange: function() {
      if (this.properties.type) {
        this.getData(true)
      }
    },
    onSearch: function (evt) {
      this.searchText = evt.detail.value
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
          searchType: 'STORE_TYPE',
          page: page,
          pageSize: this.pageSize,
          searchText: this.searchText
        },
        complete: ({ error, inData }) => {
          if (inData) {
            let newList = inData
            for (let item of newList) {
              item.applyTime = formatTimeTimeStamp(item.applyTime)
              item.statusCn= getFlowStatus(item.status)
            }
            let data = (refresh ? [] : this.data.list).concat(newList)
            this.setData({
              list: data
            })
            this.page = page
          }
        }
      })
    },
    /**
     * 点击整个条目
     */
    onClickCell: function (evt) {
      const item = evt.currentTarget.dataset.item
      // 将建店申请storeApplyId storeId 放在全局， 后面很多页面使用
      app.globalData.storeApplyId= item.id
      app.globalData.storeId = item.storeId

      wx.navigateTo({
        url: '/pages/ApplyModule/Flow/Flow'
      })  
    },
    /**
     * 打电话
     */
    onCallPhone: function (evt) {
      const item = evt.currentTarget.dataset.item
      if (item.telephone) {
        wx.makePhoneCall({
          phoneNumber: item.telephone,
        })
      }
    }
  }
})
