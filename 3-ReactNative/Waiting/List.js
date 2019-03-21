/**
 * Created on 13:40 2018/07/31.
 * file name List
 * by chenkai
 */

import React from 'react';

import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

import PropTypes from 'prop-types';

import { getWaitingList } from '../Client';
import { SMRefreshSectionList } from '@shenmajr/shenmajr-react-native-refresh';
import { ListWaitingStockConfigModel } from './ListModel';
import YellowButton from '../Common/UI/YellowButton/YellowButton';
import { ImageCache } from '@shenmajr/shenmajr-react-native-uibuttonimage';
import { carTypeImage } from '../Common/Tool/GlobalDefine';

/*库存列表*/
export default class List extends React.Component {

    static navigationOptions = {
        headerTitle: '待入库车辆'
    };

    constructor(props) {
        super(props);
        this.state = {
            noMoreData: false,
            data: []
        };
    }

    componentDidMount() {
        if (this.begin) {
            this.begin();
        }
    }

    /// 扫码入库
    _scanCodeInStockAction() {
        sm.event.call({
            eventName: 'inventory_out_scan',
            callBack: () => {
                if (this.begin) {
                    this.begin();
                }
            }
        });
    }

    _scanCodeExampleAction() {
        sm.event.call({
            eventName: 'inventory_scan_example'
        });
    }

    /// 获取数据
    getData(end) {
        getWaitingList({}, ({ error, data }) => {
            end();
            if (error) {
                this.makeHint(error.showMessage());
                return;
            }
            if (!data || !data.data) {
                this.makeHint('服务器数据格式错误');
                return;
            }
            let models = data.data.waitingStockInfos || [];
            for (let model of models) {
                model.data = model.modelConfigInfos;
                model.modelConfigInfos = [];
            }
            this.setState({
                data: models,
                noMoreData: models.length < 10
            });
        });
    }

    render() {
        return (
            <View style={styles.body}>
                <SMRefreshSectionList
                    onRefresh={end => {
                        this.getData(end);
                    }}
                    beginRefresh={begin => (this.begin = begin)}
                    SectionSeparatorComponent={() => <View style={styles.sep} />}
                    keyExtractor={(item, index) => index}
                    ItemSeparatorComponent={() => <View style={styles.sep} />}
                    renderSectionHeader={section => this._renderHeader(section)}
                    renderSectionFooter={() => <View style={{ height: 10 }} />}
                    sections={this.state.data}
                    extraData={this.state}
                    emptyDefaultView={{
                        emptyTitle: {
                            title: '暂无数据'
                        }
                    }}
                    renderItem={({ item }) => {
                        return <ListCell data={item} />;
                    }}
                />
                <YellowButton title={'扫码入库'} onPress={() => this._scanCodeInStockAction()} />
                <TouchableOpacity
                    style={styles.float}
                    onPress={() => {
                        this._scanCodeExampleAction();
                    }}>
                    <Image
                        style={{ width: 60, height: 60 }}
                        source={require('./Source/pic_scanzhiyin.png')}
                    />
                </TouchableOpacity>
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
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#eee',
        alignItems: 'stretch'
    },
    float: {
        position: 'absolute',
        right: 10,
        bottom: 80,
        width: 60,
        height: 60,
        overflow: 'hidden',
        borderRadius: 10
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
        data: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        let data: ListWaitingStockConfigModel = this.props.data;
        return (
            <View style={cellStyles.body}>
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
    top: {
        marginLeft: 15,
        height: 70,
        flexDirection: 'row',
        alignItems: 'center'
    },
    topImage: {
        width: 80,
        height: 60
    },
    topText: {
        marginLeft: 20,
        color: 'black',
        fontSize: 14
    },
    item: {
        height: 25,
        marginLeft: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemTitle: {
        color: 'gray',
        fontSize: 14
    },
    itemContent: {
        color: 'black',
        fontSize: 14
    }
});
