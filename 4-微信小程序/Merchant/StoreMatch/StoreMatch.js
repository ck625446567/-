// pages/WaitTaskModule/Merchant/StoreMatch/StoreMatch.js
import { request, URLDefines } from '../../client.js'

const app = getApp();

Page({
  searchText: null,
  currentIndex: -1,
  intendedMerchantId: null, // 	意向或标准店商户id
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: -1,
    empty: false,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.intendedMerchantId = options.intendedMerchantId;
    this.getData()
  },

  /**
   *  搜索回调
   */
  onSearch(res) {
    this.searchText = res.detail.value;
    if (!this.searchText) app.makeHint('请输入')
    this.getData();
  },

  /**
   *  点击每一个条目
   */
  onClickCell(evt) {
    let { item, index } = evt.currentTarget.dataset;
    console.log(item, index);
    this.currentIndex = index;
    let list = this.processData(this.data.list, index);
    this.setData({list})
  },

  /**
   *  点解确认
   */
  onEnsure() {
    if(this.currentIndex<0) {
      app.makeHint('请选择');
      return ;
    }
    let item = this.data.list[this.currentIndex];
    console.log('当前选中',item)
    request(URLDefines.matchStore, {
      params: {
        id: this.intendedMerchantId,
        storeId: item.storeId
      },
      complete: ({ error, inData = [] }) => {
        app.makeHint('匹配门店成功')
        wx.navigateBack({
          delta: 2
        })
      }
    })
  },

  processData(data) {
    if(!data || !data.length) return []
    data.map((item,index )=> {
      if(index === this.currentIndex) {
        return Object.assign(item, { selected: true })
      } else {
        return Object.assign(item, { selected: false })
      }
    }) 
    return data;
  },

  /**
   *  获取数据
   */
  getData() {
    request(URLDefines.similarStore, {
      params: {
        id: this.intendedMerchantId,
        searchCondition: this.searchText
      },
      complete: ({ error, inData = [] }) => {
        if (inData) {
          this.setData({
            empty: !inData.length,
            list: this.processData(inData)
          })
        }
      }
    })
  }, 

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.getData();
  },
  
})