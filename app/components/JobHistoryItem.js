import React, { Component } from 'react';
import {
    TouchableOpacity,
    Text,
    View,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

import List from './List';
import moment from 'moment';

export default class JobHistoryItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {
            onPress,
            category,
            date,
            status
        } = this.props;

        date = moment(date).format('dddd, Do MMM YYYY | h:mm:ss');
        status = status.replace('_', ' ');
        status = status.replace(/\b\w/g, (char) => char.toUpperCase());

        let bgColorItem = '#fff';
        if (status == 'Close') {
            bgColorItem = '#27ae60';
        }else if (status == 'Wip') {
            bgColorItem = '#f39c12';
        }

        return (
            <TouchableOpacity
                onPress={onPress}>
                <View style={[styles.list_item, {backgroundColor: bgColorItem}]}>
                    <View style={[styles.col_list, { flexDirection: 'column', flex: 1, justifyContent: 'space-around' }]}>
                        <Text style={[{ fontSize: 10 }]}>{date}</Text>
                        <Text style={[styles.category]}>{category}</Text>
                        <Text style={[{ fontSize: 10 }]}>Status : {status}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

JobHistoryItem.propTypes = {
    category: PropTypes.string,
    status: PropTypes.string,
    date: PropTypes.string,
};

JobHistoryItem.defaultProps = {
    category: 'Category Name',
    status: 'Waiting',
    date: '2017-09-04 08:42:47',
};

const styles = StyleSheet.create({
    list_item: {
        padding: 10,
        marginBottom: 2,
        flexDirection: 'row',
    },
    category: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8
    }
});
