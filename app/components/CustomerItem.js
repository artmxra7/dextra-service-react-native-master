import React, { Component } from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet
} from 'react-native';

import {
    Thumbnail
} from 'native-base';

import List from './List';
import moment from 'moment';

export default class CustomerItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {
            name,
            email,
            registerDate,
            onPress,
            style
        } = this.props;

        registerDate = moment(registerDate).format('dddd, Do MMM YYYY | h:mm:ss');

        return (
            <TouchableOpacity onPress={onPress}>
                <List style={style}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View>
                            <Thumbnail source={require('../assets/images/user.jpg')} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, flex: 1 }}>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <Text style={localStyles.date}>{registerDate}</Text>
                                <Text style={localStyles.name}>{name}</Text>
                                <Text style={localStyles.email}>{email}</Text>
                            </View>
                        </View>
                    </View>
                </List>
            </TouchableOpacity>
        );
    }
}

const localStyles = StyleSheet.create({
    name: {
        fontWeight: 'bold',
        color: '#363636'
    },
    date: {
        fontSize: 11,
        color: '#bbb',
        marginBottom: 8
    }
});
