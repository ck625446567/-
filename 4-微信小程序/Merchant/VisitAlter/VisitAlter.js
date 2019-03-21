// pages/WaitTaskModule/Merchant/VisitAlter/VisitAlter.js

import * as Check from '../../../../utils/check.js'

import { request, URLDefines } from '../../client.js'

const app = getApp()

Page({

  action: null,

  intendedMerchantId: '', // 意向商户ID

  /**
   * 页面的初始数据
   */
  data: {
    contactList: [],
    submitModel: {}
  },

  onLoad: function (res) {
    this.action = res.action
    this.intendedMerchantId = res.intendedMerchantId
    if (res.submitModel) {
      const submitModel = JSON.parse(res.submitModel)
      this.setData({
        submitModel: submitModel
      })
      if (submitModel.contact) {
        wx.setNavigationBarTitle({
          title: submitModel.contact
        })
      }
    }
    this.getData()
  },

  /**
   *  点击箭头
   */
  onClickFt() {
    console.log('hahahaha')
  },

  // 输入框输入内容
  onInput: function (evt) {
    let key = evt.currentTarget.dataset.key
    let submitModel = this.data.submitModel
    submitModel[key] = evt.detail.value
    this.setData({
      submitModel: submitModel
    })
  },

  /**
   * 选择后回调
   */
  onPickedContact: function (evt) {
    let key = evt.currentTarget.dataset.key
    let item = evt.detail
    let submitModel = this.data.submitModel
    
    this.setData({
      submitModel: Object.assign({}, submitModel, item)
    })
  },

  onEnsure: function () {
    const makeHint = (msg) => {
      app.makeHint(msg)
    }
    if (!Check.checkEmpty(this.data.submitModel.contact)) {
      makeHint('请输入门店联系人')
      return
    } else if (!Check.checkEmpty(this.data.submitModel.position)) {
      makeHint('请输入联系人职位')
      return
    } else if (!Check.checkEmpty(this.data.submitModel.telephone)) {
      makeHint('请输入联系人联系方式')
      return
    } else if (!Check.checkMobilePhone(this.data.submitModel.telephone)) {
      makeHint('联系人手机号格式不正确')
      return
    }
    let _params = {
      contact: this.data.submitModel.contact,
      position: this.data.submitModel.position,
      telephone: this.data.submitModel.telephone,
      content: this.data.submitModel.content,
      intendedMerchantId: this.intendedMerchantId,
      id: this.data.submitModel.id
    };
    if (this.action === 'add') {
      delete _params.id
    }
    app.makeActivity('提交中...')
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        request(this.action === 'add' ? URLDefines.addIntendedVisit : URLDefines.updateIntendedVisit, {
          params: Object.assign(_params, {latitude: res.latitude,longitude: res.longitude}),
          autoDealError: true,
          complete: ()=>{
            app.hiddenActivity()
            wx.navigateBack({
              delta: 1
            })
          }
        })
      },
      fail: function() {
        app.makeHint('获取定位信息失败')
      }
    })
  },

  onCancel: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   *  获取
   */
  getData() {
    request(URLDefines.contactList, {
      params: {
        id: this.intendedMerchantId
      },
      complete: ({ error, inData=[] }) => {
        if (inData) {
          this.setData({
            contactList: inData
          })
        }
      }
    })
  }
})