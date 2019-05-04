import React, { Component } from 'react';
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    Text,
    View,
    StyleSheet
} from 'react-native';

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

export default class CartItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {
            name,
            brand,
            defaultType,
            selectedType,
            price,
            quantity,
            photo,
            onBuy,
            onClose,
            onPress,
            onChangeType,
            onChangeQuantity
        } = this.props;

        let path = config.base_url + 'attachments/products/' + photo;
        let image = photo ? { uri: path } : require('../assets/images/bg.jpg');

        price = currencyFormat(price);

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
                        <View>
                            <Thumbnail square style={{ width: 110, height: 95 }} source={image} />
                        </View>
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
                                <Text style={[styles.font_list, { flex: 0.4 }]}>Type</Text>
                                <Text style={[styles.font_list, { flex: 0.1 }]}>:</Text>
                                <Text style={[styles.font_list, { flex: 1 }]}>{defaultType}</Text>
                            </View>
                            <View style={{ marginTop: -8 }}>
                                <Text style={localStyles.price}>{'\n'}Rp. {price},-</Text>
                            </View>
                            <View style={{ marginTop: 6 }}>
                                {defaultType == 'pcs' &&
                                    <PackToggle
                                        value={defaultType}
                                        onPress={onChangeType} />
                                }
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
