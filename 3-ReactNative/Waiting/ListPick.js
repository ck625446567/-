/*
 * Created on 11:31 2018/08/01.
 * file name PickPage
 * by chenkai
 * */

import React from 'react';

import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import PropTypes from 'prop-types';

import { NavigationBackButton } from '@shenmajr/shenmajr-react-native-uibuttonimage';

import { getUserInfo, getWaitingPickList, handInStock } from '../Client';
import { SMRefreshSectionList } from '@shenmajr/shenmajr-react-native-refresh';
import { ListWaitingStockConfigModel, ListWaitingStockInfoModel } from './ListModel';
import YellowButton from '../Common/UI/YellowButton/YellowButton';
import { ImageCache } from '@shenmajr/shenmajr-react-native-uibuttonimage';
import { carTypeImage } from '../Common/Tool/GlobalDefine';

/*库存列表*/
export default class ListPick extends React.Component {

    static navigationOptions = {
        headerTitle: '待入库车辆',
        headerLeft: (
            <NavigationBackButton
                black={true}
                onPress={() => {
                    sm.event.call({
                        eventName: 'inventory_wait_list_pick_cancel'
                    });
                }}
            />
        )
    };

    /// 不在我的代办列表
    extraData = 'extraData';

    /// 车架号
    frameNo: string = null;

    /// 选择器的类型、作用
    /// inStock: 入库使用
    /// pick: 仅仅是选择某一个
    pickType: string = null;

    constructor(props) {
        super(props);
        this.state = {
            noMoreData: false,
            selected: null,
            data: [],
            enableEnsure: false,
            empty: false
        };
        this.frameNo = sm.launchParams.frameNo;
        this.pickType = sm.launchParams.pickType;
        if (['inStock', 'pick'].indexOf(this.pickType) === -1) {
            throw 'pickType is not right';
        }
    }

    componentDidMount() {
        if (this.begin) {
            this.begin();
        }
    }

    _onSelected(data: ListWaitingStockConfigModel) {
        this.setState({
            selected: data,
            enableEnsure: true
        });
    }

    _onEnsurePick() {
        if (!this.state.selected) {
            return;
        }
        let isExtra = this.state.selected === this.extraData;
        let selectedData = isExtra ? {} : this.state.selected;
        let params = {
            ...selectedData,
            scanFrameNo: this.frameNo,
            isSigning: isExtra ? '0' : '1'
        };
        /// 入库
        if (this.pickType === 'inStock') {
            /// 直接调用后台接口入库
            this.makeActivity('入库中...');
            handInStock(params, ({ error }) => {
                if (error) {
                    this.makeHint(error.showMessage());
                    return;
                }
                if (isExtra === true) {
                    this.makeHint('车架号上报成功，请等待工作人员处理！');
                } else {
                    this.makeHint('入库成功');
                }
                let timer = setTimeout(() => {
                    clearTimeout(timer);
                    sm.event.call({
                        eventName: 'inventory_wait_list_inStock_success',
                        body: params
                    });
                }, 2000);
            });
        } else {
            /// 选择使用
            sm.event.call({
                eventName: 'inventory_wait_list_pick',
                body: params
            });
        }
    }

    /// 获取数据
    getData(end) {
        getUserInfo(() => {
            getWaitingPickList({ scanFrameNo: this.frameNo }, ({ error, data }) => {
                end();
                if (error) {
                    this.makeHint(error.showMessage());
                    return;
                }
                if (!data || !data.data) {
                    this.makeHint('服务器数据格式错误');
                    return;
                }
                let inData: { waitingStockInfos: [ListWaitingStockInfoModel] } = data.data;
                let models = inData.waitingStockInfos || [];
                for (let model of models) {
                    /// data 是 sectionList 识别的
                    model.data = model.modelConfigInfos;
                    model.modelConfigInfos = [];
                }
                this.setState({
                    data: models,
                    noMoreData: models.length < 10,
                    empty: models.length === 0
                });
            });
        });
    }

    render() {
        return (
            <View style={styles.body}>
                <View style={{ backgroundColor: '#f8f8f8' }}>
                    <View style={styles.frameNo}>
                        <Text
                            style={{
                                color: '#9b9b9b',
                                fontSize: 12,
                                fontWeight: '600',
                                marginLeft: 30
                            }}>
                            识别车架号：
                        </Text>
                        <Text style={{ color: 'black', fontSize: 12 }}>{this.frameNo}</Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <SMRefreshSectionList
                        style={{ flex: 1 }}
                        onRefresh={end => {
                            this.getData(end);
                        }}
                        beginRefresh={begin => (this.begin = begin)}
                        SectionSeparatorComponent={() => <View style={styles.sep} />}
                        keyExtractor={(item, index) => index}
                        ItemSeparatorComponent={() => <View style={styles.sep} />}
                        renderSectionHeader={section => this._renderHeader(section)}
                        ListFooterComponent={this._renderFooter()}
                        renderSectionFooter={() => <View style={{ height: 10 }} />}
                        sections={this.state.data}
                        extraData={this.state}
                        renderItem={({ item }) => {
                            return (
                                <ListCell
                                    data={item}
                                    selected={this.state.selected === item}
                                    onSelected={cellData => this._onSelected(cellData)}
                                />
                            );
                        }}
                    />
                    <YellowButton
                        title={'确认'}
                        activeOpacity={this.state.enableEnsure ? 0.8 : 1}
                        onPress={() => {
                            this._onEnsurePick();
                        }}
                    />
                    {this.state.empty && (
                        <View style={styles.empty}>
                            <Text style={{ color: 'gray', fontSize: 17, marginTop: 100 }}>
                                暂无待签收车辆
                            </Text>
                        </View>
                    )}
                </View>
                {this.hintView()}
            </View>
        );
    }

    _renderHeader({ section }) {
        return (
            <View style={styles.header}>
                <View style={{ width: 3, backgroundColor: '#ffe600', height: 20 }} />
                <Text style={styles.headerOrderDesc}>订单编号：</Text>
                <Text style={styles.headerOrderNo}>{section.orderNo}</Text>
                <Text style={styles.headerOrderCount}>
                    {section.waitingStockNumber + '辆待入库'}
                </Text>
            </View>
        );
    }

    _renderFooter() {
        if (this.pickType === 'pick') {
            return;
        }
        let selected = this.state.selected === this.extraData;
        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 40,
                    backgroundColor: 'white'
                }}>
                <TouchableOpacity
                    style={cellStyles.selectedImageBody}
                    onPress={() => {
                        this._onSelected(this.extraData);
                    }}>
                    <Image
                        style={cellStyles.selectedImage}
                        resizeMode={'contain'}
                        source={
                            selected
                                ? require('./Source/st_sc_selected.png')
                                : require('./Source/st_sc_unselected.png')
                        }
                    />
                </TouchableOpacity>
                <Text style={[cellStyles.topText, { marginLeft: 40 }]}>不在我的待签收列表</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    empty: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: '#f8f8f8',
        alignItems: 'center'
    },
    body: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        alignItems: 'stretch'
    },
    frameNo: {
        backgroundColor: 'white',
        height: 40,
        alignItems: 'center',
        marginHorizontal: 30,
        flexDirection: 'row',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowOpacity: 0.1,
        shadowColor: 'black',
        shadowOffset: { height: 3 },
        elevation: 3,
        marginBottom: 10
    },
    sep: {
        backgroundColor: '#eee',
        height: 0.5
    },
    header: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        height: 40
    },
    headerOrderDesc: {
        marginLeft: 15,
        color: '#9b9b9b',
        fontSize: 14
    },
    headerOrderNo: {
        flex: 1,
        marginLeft: 10,
        color: 'black',
        fontSize: 14
    },
    headerOrderCount: {
        marginRight: 15,
        color: 'black',
        fontSize: 12
    }
});

export class ListCell extends React.Component {
    static propTypes = {
        selected: PropTypes.bool.isRequired,
        data: PropTypes.object.isRequired,
        onSelected: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        let data: ListWaitingStockConfigModel = this.props.data;
        return (
            <View style={cellStyles.body}>
                <TouchableOpacity
                    style={cellStyles.selectedImageBody}
                    onPress={() => this.props.onSelected(this.props.data)}>
                    <Image
                        style={cellStyles.selectedImage}
                        resizeMode={'contain'}
                        source={
                            this.props.selected
                                ? require('./Source/st_sc_selected.png')
                                : require('./Source/st_sc_unselected.png')
                        }
                    />
                </TouchableOpacity>
                <View style={cellStyles.top}>
                    <ImageCache
                        style={cellStyles.topImage}
                        resizeMode={'contain'}
                        placeHolderSource={require('./Source/st_pla.png')}
                        source={{ uri: data.pictureUrl }}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={cellStyles.topText}>{data.smModel}</Text>
                        <Image
                            style={{ marginLeft: 4, width: 38, height: 16 }}
                            resizeMode={'contain'}
                            source={carTypeImage(data.carType)}
                        />
                    </View>
                </View>
                <View style={cellStyles.item}>
                    <Text style={cellStyles.itemTitle}>型号：</Text>
                    <Text style={cellStyles.itemContent}>{data.modelConfig}</Text>
                </View>
                <View style={cellStyles.item}>
                    <Text style={cellStyles.itemTitle}>颜色：</Text>
                    <Text style={cellStyles.itemContent}>{data.color}</Text>
                </View>
                <View
                    style={[
                        cellStyles.item,
                        this.checkExist(data.optionalPart) ? {} : { display: 'none' }
                    ]}>
                    <Text style={cellStyles.itemTitle}>配置：</Text>
                    <Text style={cellStyles.itemContent}>{data.optionalPart}</Text>
                </View>
                <View style={cellStyles.item}>
                    <Text style={cellStyles.itemTitle}>车架号：</Text>
                    <Text style={[cellStyles.itemContent, data.frameNo ? {} : { color: 'red' }]}>
                        {data.frameNo || '暂未录入'}
                    </Text>
                </View>
            </View>
        );
    }

    checkExist(obj, key): boolean {
        return obj.hasOwnProperty(key) && obj[key] && obj[key] !== '';
    }
}

const cellStyles = StyleSheet.create({
    body: {
        backgroundColor: 'white',
        alignItems: 'stretch'
    },
    selectedImageBody: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedImage: {
        width: 20,
        height: 20
    },
    top: {
        marginLeft: 44,
        height: 60,
        flexDirection: 'row',
        alignItems: 'center'
    },
    topImage: {
        width: 80,
        height: 50
    },
    topText: {
        marginLeft: 20,
        color: 'black',
        fontSize: 14
    },
    item: {
        height: 25,
        marginLeft: 44,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemTitle: {
        color: '#9b9b9b',
        fontSize: 14
    },
    itemContent: {
        color: 'black',
        fontSize: 14
    }
});
