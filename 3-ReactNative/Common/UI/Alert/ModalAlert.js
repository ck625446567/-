/**
 * Created on 18:06 2018/07/10.
 * file name ModalHint
 * by chenkai
 */

import React, { Component } from 'react';

import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';

import PropTypes from 'prop-types';

export interface SMModalAlertType {
    title: string;
    message: string;
    buttons: string[];
    onClick: (index: number) => void;
}

Object.assign(Component.prototype, {
    modalAlertView() {
        if (!this.state) {
            this.state = {};
        }
        if (!this.state.modalAlert) {
            this.state.modalAlert = { show: false };
        }
        return (
            <ModalAlert
                {...this.state.modalAlert}
                visible={this.state.modalAlert.show}
                onClick={index => {
                    let sheet = this.state.modalAlert;
                    sheet.show = false;
                    this.setState(
                        {
                            modalAlert: sheet
                        },
                        () => {
                            this.state.modalAlert.onClick(index);
                        }
                    );
                }}
                onNeedDismiss={() => {
                    let sheet = this.state.modalAlert;
                    sheet.show = false;
                    this.setState({
                        modalAlert: sheet
                    });
                }}
            />
        );
    },

    /**
     * alert
     * @param options SMAlertType
     */
    modalAlert(options: SMModalAlertType) {
        const { title, message, onClick } = options;
        let show = !!(title || message);
        this.setState({
            modalAlert: {
                ...options,
                show: show,
                onClick: index => {
                    if (onClick) {
                        onClick(index);
                    }
                }
            }
        });
    }
});

export default class ModalAlert extends React.Component {
    static defaultProps = {
        buttons: ['取消']
    };

    static propTypes = {
        /*是否展示*/
        visible: PropTypes.bool.isRequired,
        /*icon*/
        icon: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
        /*标题*/
        title: PropTypes.string,
        /*内容*/
        message: PropTypes.string,
        /*需要消失界面时的回调 iOS 需求*/
        onNeedDismiss: PropTypes.func.isRequired,
        /*页面消失回调 (index)=>void*/
        onClick: PropTypes.func.isRequired,
        /*按钮。如果没有或者为空，则默认 取消*/
        buttons: PropTypes.array
    };

    /*选中的索引*/
    selectedIndex: number = -1;

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(props) {
        if (!props.onNeedDismiss) {
            throw 'ModalHint -> can not get onNeedDismiss from props';
        }
    }

    _onDismiss() {
        this.props.onClick(this.selectedIndex);
    }

    _onClick(index) {
        if (Platform.OS === 'ios') {
            this.selectedIndex = index;
            this.props.onNeedDismiss();
        } else {
            this.props.onClick(index);
        }
    }

    _onRequestClose() {}

    render() {
        let hasIcon: boolean = !!this.props.icon;
        let borderStyle = { borderRadius: 10 };
        return (
            <Modal
                visible={this.props.visible}
                transparent={true}
                animationType={'fade'}
                onRequestClose={() => this._onRequestClose()}
                onDismiss={() => this._onDismiss()}>
                <View style={styles.body}>
                    <View
                        style={[
                            { width: 280, marginBottom: 60, alignItems: 'stretch' },
                            borderStyle
                        ]}>
                        <View style={[styles.textContainer]}>
                            {hasIcon && (
                                <Image
                                    style={{ marginTop: 40, alignSelf: 'center' }}
                                    source={this.props.icon}
                                />
                            )}
                            <Text
                                style={[
                                    styles.title,
                                    hasIcon ? { marginTop: 10 } : {},
                                    this.props.message ? {} : { marginBottom: 30 }
                                ]}>
                                {this.props.title}
                            </Text>
                            {this.props.message && (
                                <Text style={styles.message}>{this.props.message}</Text>
                            )}
                        </View>
                        {this._buttonsView()}
                    </View>
                </View>
            </Modal>
        );
    }

    _buttonsView() {
        let buttons = this.props.buttons || [];
        if (buttons.length === 0) {
            buttons = ['取消'];
        }
        if (buttons.length === 1) {
            return (
                <View style={styles.buttonView}>
                    <TouchableOpacity
                        style={[styles.button]}
                        activeOpacity={1}
                        onPress={() => {
                            this._onClick(0);
                        }}>
                        <Text style={styles.text}>{buttons[0]}</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return (
            <View style={styles.buttonView}>
                <TouchableOpacity
                    style={[styles.button, styles.buttonLeft]}
                    activeOpacity={1}
                    onPress={() => {
                        this._onClick(0);
                    }}>
                    <Text style={styles.text}>{buttons[0]}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.buttonRight]}
                    activeOpacity={1}
                    onPress={() => {
                        this._onClick(1);
                    }}>
                    <Text style={styles.text}>{buttons[1]}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#000000aa',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
        alignItems: 'stretch',
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    title: {
        marginTop: 40,
        fontSize: 17,
        color: 'black',
        marginHorizontal: 15,
        textAlign: 'center'
    },
    message: {
        marginHorizontal: 15,
        marginTop: 20,
        marginBottom: 25,
        color: 'black',
        fontSize: 15,
        lineHeight: 20,
        textAlign: 'center'
    },
    buttonView: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'stretch',
        borderColor: 'black',
        elevation: 3,
        shadowOffset: { width: 0, height: -3 },
        shadowColor: 'black',
        shadowOpacity: 0.15
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffe600',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    buttonLeft: {
        borderBottomRightRadius: 0,
        backgroundColor: 'white'
    },
    buttonRight: {
        borderBottomLeftRadius: 0
    },
    text: {
        fontSize: 17,
        color: 'black',
        fontWeight: '600'
    }
});
