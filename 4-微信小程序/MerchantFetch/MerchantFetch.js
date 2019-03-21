// pages/WaitTaskModule/MerchantFetch/MerchantFetch.js

import { request, URLDefines } from '../client.js'

import { prepare } from '../Merchant/IntendedAlter/IntendedAlterTool.js'

import { getMerchantTypeDesc, getMerchantTypeColor } from '../../../utils/ordertool.js'

Page({

  page: 1,

  pageSize: 10,

  /**
   * 页面的初始数据
   */
  data: {
    showBtn: false,
    list: [],
    empty: false,
    provinceName: null,
    provinceId: null,
    cityName: null,
    cityId: null,
    areaName: null,
    areaId: null,
    addressPickShow: false
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  onRefresh: function () {
    this.getData(true)
  },

  onLoadMore: function () {
    this.getData(false)
  },

  /**
   * 点击新建
   */
  onAdd: function () {
    prepare((constant) => {
      wx.navigateTo({
        url: '/pages/WaitTaskModule/Merchant/IntendedAlter/IntendedAlter?action=add' + '&constant=' + JSON.stringify(constant),
      })
    })
  },

  onClickCell(evt) {
    const item = evt.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/WaitTaskModule/Merchant/Detail/Detail?id=' + item.id
    })
  },

  /**
   *  获取意向商户信息
   */

  /**
   * 获取数据
   */
  getData: function (refresh) {
    if (!this.data.provinceId) {
      return
    }
    const page = refresh ? 1 : (this.page + 1)
    request(URLDefines.merchantSearch, {
      params: {
        page: page,
        pageSize: this.pageSize,
        provinceId: this.data.provinceId,
        cityId: this.data.cityId,
        areaId: this.data.areaId,
      },
      dataValiate: ({ inData }) => {
        return inData
      },
      autoDealError: true,
      complete: ({ error, inData=[] }) => {

        let data = refresh ? [] : this.data.list
        inData.map(item => {
          return Object.assign(item, { merchantTypeDesc: getMerchantTypeDesc(item.type), merchantTypeColor: getMerchantTypeColor(item.type)})
        })
        data = data.concat(inData)
        this.setData({
          showBtn: true,
          list: data,
          empty: !data.length
        })
      }
    })
  },

  /**
     * 选择地址
     */
  beginChooseAddress: function () {
    this.setData({
      addressPickShow: true
    })
  },
  /**
   * 地址选择后的回调
   */
  onChooseAddress: function (evt) {
    const { province, city, area } = evt.detail
    this.setData({
      provinceName: province.addressName,
      provinceId: province.addressId,
      cityName: city.addressName,
      cityId: city.addressId,
      areaName: area.addressName,
      areaId: area.addressId,
    }, () => {
      this.getData(true)
    })
  },
  /**
   * 取消地址选择
   */
  onCancelChooseAddress: function () {
    this.setData({
      addressPickShow: false
    })
  },

})