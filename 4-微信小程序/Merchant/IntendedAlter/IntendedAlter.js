// pages/WaitTaskModule/Merchant/IntendedAlter/IntendedAlter.js

import * as Check from '../../../../utils/check.js'

import { uuid } from '../../../../utils/util.js'

import { request, URLDefines } from '../../client.js'

const app = getApp()

Page({

  action: 'add',

  /**
   * 页面的初始数据
   */
  data: {
    firstLevel: [
      { code: '0', name: '否' },
      { code: '1', name: '是' }
    ],
    secondLevel: [
      { code: '0', name: '否' },
      { code: '1', name: '是' }
    ],
    // 每个字段都写出来，以后来看代码的人，可以清楚看到每个字段的意义
    // 门头照照片
    storeHeaderPicture: {
      type: 'store_header',
      src: null,
      ossKey: null,
      title: '门头照',
      local: null
    },
    // 营业执照照片
    businessLicensePicture: {
      type: 'business_license',
      src: null,
      ossKey: null,
      title: '营业执照',
      local: null
    },
    inmManagerType: [],
    inmDealerType: [],
    inmRank: [],
    inmIndusty: [], // 现经营行业

    inmTwoNetwork: [], // 二网数量
    inmBusinessLife: [], // 经营年限
    inmInvestment: [], // 预计投资

    // 门店名称
    storeName: null,
    // address	详细地址	string	选填
    address: null,
    // areaId	区域ID	string	必填
    areaId: null,
    // areaName	区域名	string	必填
    areaName: null,
    // brand	经营品牌	string	选填
    brand: null,
    // cityId	城市ID	string	必填
    cityId: null,
    // cityName	城市名	string	必填
    cityName: null,
    // contact	联系人	string	必填
    contact: null,
    // expectedInvestmentScale	预计投资规模	string	必填
    expectedInvestmentScale: null,
    // fristRank	是否一网	number	必填
    fristRank: null,
    // hasStore	是否有店	number	必填（0-无，1-有）
    hasStore: null,
    // intentionRank	意向分级	string	必填
    intentionRank: null,
    // manageYear	经营年限	number	选填
    manageYear: null,
    // industry	经营行业	string	选填
    industry: null,
    // projectedRetail	预计零售	string	选填
    projectedRetail: null,
    // provinceId	省份ID	string	选填
    provinceId: null,
    // provinceName	省份名	string	必填
    provinceName: null,
    // storeManageType	经营类型	string	选填
    storeManageType: null,
    // storePerson	法 / 经营人姓名	string	选填
    storePerson: null,
    // subordinateNum	下属二网数量	number	选填
    subordinateNum: null,
    // telephone	联系手机号	string	必填
    telephone: null,
    // type	商户类型	string	必填
    type: null,

    addressPickShow: false,
  },
  onLoad: function (evt) {
    this.action = evt.action
    let data = Object.assign({}, this.data)
    if (evt.submitModel) {
      const submitModel = JSON.parse(evt.submitModel)
      Object.assign(data, submitModel)
      if (submitModel.doorOssKey) {
        data.storeHeaderPicture.ossKey = submitModel.doorOssKey
      }
      if (submitModel.doorPicUrl) {
        data.storeHeaderPicture.src = submitModel.doorPicUrl
      }
      if (submitModel.licenseOssKey) {
        data.businessLicensePicture.ossKey = submitModel.licenseOssKey
      }
      if (submitModel.licensePicUrl) {
        data.businessLicensePicture.src = submitModel.licensePicUrl
      }
    }
    Object.assign(data, JSON.parse(evt.constant))
    this.setData(data)

    wx.setNavigationBarTitle({
      title: data.storeName || '新增意向商户'
    })
  },
  /**
   * 取消
   */
  onCancel: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 确认
   */
  onEnsure: function () {
    const makeHint = (msg)=>{
      app.makeHint(msg)
    }
    if (!Check.checkEmpty(this.data.storeName)) {
      makeHint('请输入门店名称')
      return
    } else if (!Check.checkEmpty(this.data.provinceId)) {
      makeHint('请选择门店地址')
      return
    } else if (!Check.checkEmpty(this.data.address)) {
      makeHint('请输入详细地址')
      return
    } else if (!Check.checkEmpty(this.data.contact)) {
      makeHint('请输入联系人')
      return
    } else if (!Check.checkEmpty(this.data.telephone)) {
      makeHint('请输入联系人手机号')
      return
    } else if (!Check.checkMobilePhone(this.data.telephone)) {
      makeHint('联系人手机号格式不正确')
      return
    }    
    app.makeActivity('提交中...')
    let waitUpload = []
    if (Check.checkEmpty(this.data.storeHeaderPicture.local)) {
      waitUpload.push(this.data.storeHeaderPicture)
    }
    if (Check.checkEmpty(this.data.businessLicensePicture.local)) {
      waitUpload.push(this.data.businessLicensePicture)
    }
    // waitUpload = waitUpload.filter(item => !!item.local || !!item.src)
    if (waitUpload.length) {
      this.uploadPictures(waitUpload,
      () => {
        this.submitData()
      }, ({errMsg}) => {
        makeHint(errMsg)
      })
    } else {
      this.submitData()
    }
  },
  /**
   * 提交数据
   */
  submitData: function () {
    let data = Object.assign({}, this.data)
    data.doorOssKey = this.data.storeHeaderPicture.ossKey
    data.licenseOssKey = this.data.businessLicensePicture.ossKey
    if (data.createTime) {
      delete data.createTime
    }
    request(this.action === 'edit' ? URLDefines.updateMerchantIntended : URLDefines.addMerchantIntended, {
      params: data,
      autoDealError: true,
      complete: ({ error, inData }) => {
        app.makeHint('提交成功')
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  /**
   * 上传图片
   */
  uploadPictures: function (objs, success, fail) {
    this.uploadPicturesByIndex(objs, 0, success, fail)
  },
  uploadPicturesByIndex: function (objs, index, success, fail) {
    if (index < objs.length) {
      this.uploadPicture(objs[index], (ossKey)=> {
        objs[index].ossKey = ossKey
        this.uploadPicturesByIndex(objs, index + 1, success, fail)
      }, fail)
    } else {
      success()
    }
  },
  uploadPicture: function (obj, success, fail) {
    wx.uploadFile({
      url: app.urlInfo.ossUrl + 'upload/v1/?',
      filePath: obj.local,
      name: 'file',
      formData: {
        fileName: obj.type,
        fileType: '.jpg',
        moduleKey: 'EV',
        sourceCode: uuid(),
        sourceSystem: 'EV',
      },
      success: res => {
        if (res.data) {
          let body = JSON.parse(res.data)
          if (body.data && body.data.attachid) {
            success(body.data.attachid)
            return
          }
        } 
        fail({ errMsg: '上传失败' })
      },
      fail: (res) => {
        fail(res)
      }
    })
    // wx.uploadFile({
    //   url: '',
    //   filePath: obj.local,
    //   name: 'file',
    //   formData: {
    //     name: obj.type,
    //     key: 'dingdang/' + obj.type,
    //   },
    //   success: success,
    //   fail: fail
    // })
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
    const {province, city, area} = evt.detail
    this.setData({
      provinceName: province.addressName,
      provinceId: province.addressId,
      cityName: city.addressName,
      cityId: city.addressId,
      areaName: area.addressName,
      areaId: area.addressId,
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
  /**
   * 输入框输入
   */
  onInput: function (evt) {
    let key = evt.currentTarget.dataset.key
    let value = evt.detail.value
    let obj = {}
    obj[key] = value
    this.setData(obj)
  },
  /**
   * 选择后回调
   */
  onPicked: function (evt) {
    let key = evt.currentTarget.dataset.key
    let value = evt.detail
    let obj = {}
    obj[key] = value.code
    this.setData(obj)
  },
  /**
   * segmentcontrol 选择
   */
  onSegmentControlSelected: function (evt) {
    let key = evt.currentTarget.dataset.key
    let value = evt.detail
    let obj = {}
    obj[key] = value.code
    this.setData(obj)
  },
  /**
   * 图片更新
   */
  onUpdatePicture: function (evt) {
    const { type, local } = evt.detail
    if (type === this.data.storeHeaderPicture.type) {
      let p = this.data.storeHeaderPicture
      p.ossKey = null
      p.src = null
      p.local = local
      this.setData({
        storeHeaderPicture: p
      })
    } else if (type === this.data.businessLicensePicture.type) {
      let p = this.data.businessLicensePicture
      p.ossKey = null
      p.src = null
      p.local = local
      this.setData({
        businessLicensePicture: p
      })
    }
  }
})