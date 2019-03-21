// pages/WaitTaskModule/MyMerchantList/MyMerchantList.js

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onAdd: function () {
    wx.navigateTo({
      url: "/pages/WaitTaskModule/MerchantFetch/MerchantFetch",
    })
  }
})