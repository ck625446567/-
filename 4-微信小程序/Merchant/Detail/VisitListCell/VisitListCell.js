// pages/WaitTaskModule/Merchant/Detail/VisitListCell/VisitListCell.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      value: {},
      type: Object
    },
    intendedMerchantId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    explan: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDetail: function () {
      this.setData({
        explan: !this.data.explan
      })
    },
    onEdit: function () {
      wx.navigateTo({
        url: '/pages/WaitTaskModule/Merchant/VisitAlter/VisitAlter?action=edit&intendedMerchantId=' + this.properties.intendedMerchantId +'&submitModel=' + JSON.stringify(this.properties.data),
      })
    }
  }
})
