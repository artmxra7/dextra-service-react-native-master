import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    AsyncStorage
} from 'react-native';
import {
    Card,
    Thumbnail,
    Spinner
} from 'native-base';
import { Icon } from 'react-native-elements';
import _ from 'lodash';

import Ref from '../../components/Ref';
import TabBar from '../../components/TabBar';
import Button from '../../components/Button';
import Switch from '../../components/Switch';
import ButtonCount from '../../components/ButtonCount';
import ButtonRadius from '../../components/ButtonRadius';
import BuyButton from '../../components/BuyButton';
import { styles } from '../../assets/styles/Style';
import Link from '../../components/Link';
import List from '../../components/List';
import ContentProductList from '../../components/ContentProductList';
import Data from '../../config/Data';
import { Feed } from '../../config/Data';
import Modal from 'react-native-modal';
import { config } from '../../config/Config';

const data = new Data();
export default class TabSparepartList extends Component {
    constructor(props) {
        super(props);
    }

    openDetail(itemID) {
        this.props.navigation.navigate('SparepartDetail', { itemID });
    }

    render() {
        let {
            products,
            onBuy
        } = this.props;

        return (
            <View style={[styles.container]}>
                <ScrollView style={[styles.content, { padding: 2, backgroundColor: '#eee' }]}>
                    {products.map((product, index) => {
                        return <ContentProductList
                            key={index}
                            onDetail={() => this.openDetail(product.id)}
                            onBuy={() => onBuy(product)}
                            name={product.title}
                            brand={product.product_brand.name}
                            photo={product.photo.split(',')[0]}
                            type={product.type}
                            price={(product.type == 'pcs') ? product.price_piece : product.price_box} />
                    })}
                    {products.length == 0 &&
                        <Text style={styles.no_data}>No found data</Text>
                    }
                </ScrollView>
            </View>
        );
    }
}
