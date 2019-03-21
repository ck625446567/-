
import { formatTimeTimeStamp } from '../../../utils/util.js';

Page({

  // 类型 all 或者 wait
  taskType: null,

  /**
   * 页面的初始数据
   */
  data: {
    bars: [
      { name: '招商类', id: '0' },
      { name: '订单类', id: '1' }
    ],
    barIndex: '0',
  },

  onLoad: function (res) {
    this.taskType = res.type || 'all'
  },

  // bar 切换
  barChange: function (evt) {
    this.setData({
      barIndex: evt.detail.id
    })
  },

  // 左右滑动
  swiperChange: function (evt) {
    this.setData({
      barIndex: evt.detail.current + ''
    })
  },
})