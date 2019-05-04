import React, { Component } from 'react';
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    Text,
    View,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';

import {
    Thumbnail
} from 'native-base';

import Button from '../components/Button';
import PackToggle from '../components/PackToggle';
import ButtonCount from '../components/ButtonCount';
import ButtonRadius from '../components/ButtonRadius';
import BuyButton from '../components/BuyButton';
import { styles } from '../assets/styles/Style';
import Link from '../components/Link';
import List from '../components/List';
import { config } from '../config/Config';
import { currencyFormat } from '../config/Helper';
import { Icon } from 'react-native-elements';

export default class CartRequestItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {
            name,
            brand,
            serialNumber,
            noProduct,
            quantity,
            selectedType,
            onBuy,
            onClose,
            onPress,
            onChangeType,
            onChangeQuantity,
        } = this.props;

        return (
            <TouchableOpacity onPress={onPress}>
                <List style={{ flexDirection: 'column' }}>
                    <TouchableWithoutFeedback onPress={onClose}>
                        <View style={localStyles.close}>
                            <Icon
                                name="close"
                                type="font-awesome"
                                color="#ddd"
                                size={16} />
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={[styles.col_list, { flexDirection: 'row', flex: 1 }]}>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.font_list, { flex: 0.4 }]}>Name</Text>
                                <Text style={[styles.font_list, { flex: 0.1 }]}>:</Text>
                                <Text style={[styles.font_list, { flex: 1 }]}>{name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.font_list, { flex: 0.4 }]}>Brand</Text>
                                <Text style={[styles.font_list, { flex: 0.1 }]}>:</Text>
                                <Text style={[styles.font_list, { flex: 1 }]}>{brand}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.font_list, { flex: 0.4 }]}>Part No</Text>
                                <Text style={[styles.font_list, { flex: 0.1 }]}>:</Text>
                                <Text style={[styles.font_list, { flex: 1 }]}>{noProduct}</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.font_list, { flex: 0.4 }]}>S/N</Text>
                                <Text style={[styles.font_list, { flex: 0.1 }]}>:</Text>
                                <Text style={[styles.font_list, { flex: 1 }]}>{serialNumber}</Text>
                            </View>
                            <View style={{ marginTop: 12 }}>
                                <PackToggle
                                    value={selectedType}
                                    onPress={onChangeType} />
                                <ButtonCount
                                    min={1}
                                    value={quantity}
                                    styleContainer={{ marginTop: 8 }}
                                    onChange={onChangeQuantity} />
                            </View>
                        </View>
                    </View>
                </List>
            </TouchableOpacity>
        );
    }
}

CartRequestItem.propTypes = {
    name: PropTypes.string,
    brand: PropTypes.string,
    quantity : PropTypes.number,
    selectedType: PropTypes.string,
    noProduct : PropTypes.string,
    serialNumber: PropTypes.string,
    onBuy: PropTypes.func,
    onClose: PropTypes.func,
    onPress: PropTypes.func,
    onChangeType: PropTypes.func,
    onChangeQuantity: PropTypes.func,
};

export const localStyles = StyleSheet.create({
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4
    },
    close: {
        width: 18,
        height: 18,
        position: 'absolute',
        right: 8,
        top: 8,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3
    }
});