// Components/Apply/TitlePickerCell/TitlePickerCell.js

// 标题、选择UI视图

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 标题
    title: String,
    // 选择器数据源
    pickItems: {
      value: [],
      type: Array
    },
    // 当前选中的值
    // 如果 driveMode 为 1 则 value 代表 code，选中的 code
    // 否则 value 只是用来展示的文本
    value: {
      value: null,
      type: String,
    },
    // 最大长度。-1不限制
    maxlength: {
        value: -1,
        type: Number
    },
    // text	文本输入键盘
    // number	数字输入键盘
    // idcard	身份证输入键盘
    // digit	带小数点的数字键盘
    inputType: {
        value: 'text',
        type: String,
    },
    // 占位字符
    placeholder: {
      value: '',
      type: String 
    },
    // 驱动模式
    // 1. pickItems 为对象集合，存在 code 和 name
    // 2. pickItems 为字符串集合，直接用来选取
    driveMode: {
      value: '1',
      type: String,
    },
    // 当 driveMode 为 1 时。pickItems 集合对象的的 code 字段取值
    keyName: {
      value: 'code',
      type: String,
    },
    // 当 driveMode 为 1 时。pickItems 集合对象的的 code 字段取值
    valueName: {
      value: 'name',
      type: String
    },

    // 标题宽度
    titleWidth: {
      value: '168rpx',
      type: String,
    },

    // 标题到左边的距离
    titleMarginLeft: {
      value: '40rpx',
      type: String
    },
    
    // 右边距
    marginRight: {
      value: '40rpx',
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 选择器更改选项
    onPickChange: function (event) {
      let index = event.detail.value
      this.triggerEvent('selected', this.properties.pickItems[index])
    },
    onChangeText: function (value) {
        this.triggerEvent('input', value.detail)
    },
    onBeginEdit: function () {
        this.triggerEvent('beginEdit')
    },
    onEndEdit: function () {
        this.triggerEvent('endEdit')
    }
  }
})
