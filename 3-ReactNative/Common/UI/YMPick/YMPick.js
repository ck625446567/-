/**
 * Created on 14:57 2018/07/28.
 * file name YMPick
 * by chenkai
 */

/// 年月选择器

import React from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SectionList,
    Animated,
    Dimensions,
    Easing,
    Image
} from 'react-native';

import PropTypes from 'prop-types';

export default class YMPick extends React.Component {
    static absoluteSuperStyle = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute'
    };

    static defaultProps = {
        /*查询的最小年份*/
        minYear: 2017,
        /*查询的最小月份*/
        minMonth: 7,

        /*头高*/
        yearHeight: 40,
        /*行高*/
        monthHeight: 44,
        /*内容高度*/
        maxContentHeight: 400
    };

    static propTypes = {
        /*是否可见*/
        visible: PropTypes.bool.isRequired,
        /*取消选择*/
        onCancel: PropTypes.func.isRequired,
        /*选择回调 ({year: number, month: number})=>void*/
        onPicked: PropTypes.func.isRequired,
        /*当前年，当 visible true 时，必须赋值，否则报错*/
        nowYear: PropTypes.number,
        /*当前月，当 visible true 时，必须赋值，否则报错*/
        nowMonth: PropTypes.number,
        /*已经选择过的年份*/
        pickedYear: PropTypes.number,
        /*已经选择过的月份*/
        pickedMonth: PropTypes.number,
        /*可选择的最小年份，如果不赋值，则取 2000 年*/
        minMonth: PropTypes.number,
        /*可选择的最小月份，如果不赋值，则取 1 月*/
        minYear: PropTypes.number,

        /// 头部高 默认 40
        yearHeight: PropTypes.number,
        /*行高，默认 44*/
        monthHeight: PropTypes.number,
        /*内容最大高度*/
        maxContentHeight: PropTypes.number
    };

    nowMonth: number = -1;

    nowYear: number = -1;

    screenHeight: number = Dimensions.get('window').height;

    constructor(props) {
        super(props);
        this.state = {
            bodyAlpha: new Animated.Value(0),
            contentHeight: this._calculateContentHeight(props),
            contentTop: new Animated.Value(-this.screenHeight),
            sections: this._getSections(props)
        };
    }

    componentDidMount() {
        this.props.visible && this.beginAnimateAction();
    }

    componentWillReceiveProps(props) {
        this.state.contentTop.setValue(-this.screenHeight);
        this.state.bodyAlpha.setValue(0);
        this.setState(
            {
                contentHeight: this._calculateContentHeight(props),
                sections: this._getSections(props)
            },
            () => {
                props.visible && this.beginAnimateAction();
            }
        );
    }
    _onCancel() {
        this.props.onCancel();
    }

    _onPressItem(item) {
        this.props.onPicked(item);
    }

    _onDismiss(item) {
        Animated.timing(this.state.bodyAlpha, {
            toValue: 0,
            easing: Easing.linear,
            duration: 150
        }).start(() => {
            if (item) {
                this._onPressItem(item);
            } else {
                this._onCancel();
            }
        });
    }

    beginAnimateAction() {
        Animated.parallel([
            Animated.timing(this.state.bodyAlpha, {
                toValue: 1,
                easing: Easing.linear,
                duration: 150
            }),
            Animated.timing(this.state.contentTop, {
                toValue: 0,
                easing: Easing.linear,
                duration: 500
            })
        ]).start();
    }

    render() {

        return (
            <Animated.View
                style={[
                    this.props.style,
                    styles.body,
                    this.props.visible
                        ? { opacity: this.state.bodyAlpha }
                        : { display: 'none', opacity: 0 }
                ]}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={() => {
                        this._onDismiss(null);
                    }}>
                    <Animated.View
                        style={[
                            styles.content,
                            { height: this.state.contentHeight, top: this.state.contentTop }
                        ]}>
                        <SectionList
                            style={{ flex: 1 }}
                            contentContainerStyle={{ alignItems: 'stretch' }}
                            sections={this.state.sections}
                            extraData={this.state}
                            SectionSeparatorComponent={item => this._renderSeparator(item)}
                            keyExtractor={(item, index) => this._keyExtractor(item, index)}
                            ItemSeparatorComponent={item => this._renderSeparator(item)}
                            renderSectionHeader={section => this._renderHeader(section)}
                            renderItem={item => this._renderItem(item)}
                        />
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    _renderItem({ item }) {
        let cur = item.month === this.props.pickedMonth && item.year === this.props.pickedYear;
        return (
            <TouchableOpacity
                style={{
                    height: this.props.monthHeight,
                    justifyContent: 'center',
                    backgroundColor: 'white'
                }}
                activeOpacity={1}
                onPress={() => this._onDismiss(item)}>
                <Text style={styles.rowText}>
                    {this.nowMonth === item.month && this.nowYear === item.year
                        ? '本月'
                        : item.month + '月'}
                </Text>
                <View style={[styles.rowImageBody, cur ? {} : { display: 'none' }]}>
                    <Image
                        source={require('./Source/hook.png')}
                        resizeMode={'contain'}
                        style={{ width: 20, height: 20 }}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    _renderHeader({ section }) {
        return (
            <TouchableOpacity
                style={{
                    height: this.props.yearHeight,
                    justifyContent: 'center',
                    backgroundColor: '#eee'
                }}
                activeOpacity={1}>
                <Text style={styles.headerText}>{section.year + '年'}</Text>
                <View style={styles.headerSep} />
            </TouchableOpacity>
        );
    }

    _renderSeparator() {
        return <View style={{ height: 0.5, backgroundColor: '#eee' }} />;
    }

    checkExistAndNumber(obj, key) {
        return obj.hasOwnProperty(key) && typeof obj[key] === 'number';
    }

    _keyExtractor(item, index) {
        return index;
    }

    _calculateContentHeight(props): number {
        if (!props.visible) {
            return 0;
        }
        let nowYear = this.checkExistAndNumber(props, 'nowYear')
            ? props.nowYear
            : new Date().getFullYear();
        let nowMonth = this.checkExistAndNumber(props, 'nowMonth')
            ? props.nowMonth
            : new Date().getMonth() + 1;
        let minYear = this.checkExistAndNumber(props, 'minYear')
            ? props.minYear
            : YMPick.defaultProps.minYear;
        let minMonth = this.checkExistAndNumber(props, 'minMonth')
            ? props.minMonth
            : YMPick.defaultProps.minMonth;
        if (minYear > nowYear) {
            throw 'YMPick min year > nowYear';
        }
        this.nowYear = nowYear;
        this.nowMonth = nowMonth;
        let yearX = nowYear - minYear - (nowMonth > minMonth ? 0 : 1);
        let monthX = (nowMonth > minMonth ? nowMonth - minMonth : nowMonth + 12 - minMonth) + 1;
        return Math.min(
            this.props.maxContentHeight,
            (monthX + yearX * 12) * this.props.monthHeight + yearX + this.props.yearHeight
        );
    }

    _getSections(props) {
        if (!props.visible) {
            return [];
        }
        let nowYear = this.checkExistAndNumber(props, 'nowYear')
            ? props.nowYear
            : new Date().getFullYear();
        let nowMonth = this.checkExistAndNumber(props, 'nowMonth')
            ? props.nowMonth
            : new Date().getMonth() + 1;
        let minYear = this.checkExistAndNumber(props, 'minYear')
            ? props.minYear
            : YMPick.defaultProps.minYear;
        let minMonth = this.checkExistAndNumber(props, 'minMonth')
            ? props.minMonth
            : YMPick.defaultProps.minMonth;
        if (minYear > nowYear) {
            throw 'YMPick min year > nowYear';
        }
        let sections = [];
        for (let year = minYear; year <= nowYear; year++) {
            let months = [];
            /// 最小年
            if (year === minYear) {
                for (let month = minMonth; month <= (year === nowYear ? nowMonth : 12); month++) {
                    months.push({ month: month, year: year });
                }
                sections.push({
                    year: year,
                    data: months.reverse()
                });
            } else if (year === nowYear) {
                for (let month = 1; month <= nowMonth; month++) {
                    months.push({ month: month, year: year });
                }
                sections.push({
                    year: year,
                    data: months.reverse()
                });
            } else {
                for (let month = 1; month <= 12; month++) {
                    months.push({ month: month, year: year });
                }
                sections.push({
                    year: year,
                    data: months.reverse()
                });
            }
        }
        return sections.reverse();
    }
}

const styles = StyleSheet.create({
    body: {
        alignItems: 'stretch',
        backgroundColor: '#00000099',
        overflow: 'hidden'
    },
    content: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: 'white'
    },
    headerSep: {
        height: 0.5,
        backgroundColor: '#eee',
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0
    },
    headerText: {
        marginLeft: 15,
        fontSize: 16,
        color: 'black',
        fontWeight: '600'
    },
    rowText: {
        marginLeft: 15,
        fontSize: 16,
        color: 'black',
        fontWeight: '600'
    },
    rowImageBody: {
        position: 'absolute',
        right: 20,
        top: 0,
        bottom: 0,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
