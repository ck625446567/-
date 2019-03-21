/**
 * Created on 10:18 2018/07/05.
 * file name Button
 * by chenkai
 */

import React from 'react';

import { TouchableOpacity, Text } from 'react-native';

import PropTypes from 'prop-types';

import LinearGradient from 'react-native-linear-gradient';

export default class YellowButton extends React.Component {
    static defaultProps = {
        titleStyle: {
            fontSize: 20,
            color: '#4a4a4a'
        }
    };

    static propTypes = {
        ...TouchableOpacity.propTypes,
        title: PropTypes.string.isRequired,
        titleStyle: PropTypes.object
    };

    lastTimestamp = 0;

    constructor(props) {
        super(props);
    }

    render() {
        let style = {
            alignSelf: 'stretch',
            height: 44,
            shadowOffset: {
                width: 0,
                height: -3
            },
            shadowRadius: 3,
            shadowColor: '#4a4a4a',
            shadowOpacity: 0.1
        };
        return (
            <LinearGradient
                style={[style, this.props.style]}
                colors={['#FFF466', '#FFD519']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}>
                <TouchableOpacity
                    {...this.props}
                    style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }]}
                    onPress={() => {
                        if (this.checkTime() && this.props.onPress) {
                            this.props.onPress();
                        }
                    }}>
                    <Text style={[this.props.titleStyle, { backgroundColor: 'transparent' }]}>
                        {this.props.title}
                    </Text>
                </TouchableOpacity>
            </LinearGradient>
        );
    }

    checkTime(): Boolean {
        const currentTimestamp = new Date().getTime();
        if (currentTimestamp - this.lastTimestamp < 1000) {
            return false;
        } else {
            this.lastTimestamp = currentTimestamp;
            return true;
        }
    }
}
