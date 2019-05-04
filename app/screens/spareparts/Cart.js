import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    AsyncStorage
} from 'react-native'
import {
    Card,
    Thumbnail,
} from 'native-base'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux';
import _ from 'lodash';

import Ref from '../../components/Ref'
import TabBar from '../../components/TabBar'
import Button from '../../components/Button'
import Switch from '../../components/Switch'
import ButtonCount from '../../components/ButtonCount'
import BuyButton from '../../components/BuyButton'
import { styles } from '../../assets/styles/Style'
import Link from '../../components/Link'
import List from '../../components/List'
import CartItem from '../../components/CartItem'
import Data from '../../config/Data'
import { Feed } from '../../config/Data'
import { currencyFormat, calculateTotalPrice } from '../../config/Helper'

import {
    setCartItemType,
    setCartItemQuantity,
    removeCartItem
} from '../../store/carts/Actions';

class Cart extends Component {
    constructor(props) {
        super(props);

        this.checkout = this.checkout.bind(this);
    }

    checkout() {
        let {
            navigation,
            carts
        } = this.props;

        if (carts.length == 0) {
            alert('There are no items in your cart !');
            return;
        }

        navigation.navigate('Checkout');
    }

    sparepartDetail(itemID) {
        this.props.navigation.navigate('SparepartDetail', { itemID });
    }

    render() {
        let {
            carts,
            setItemType,
            setItemQuantity,
            removeItem
        } = this.props;

        let amounts = calculateTotalPrice(carts);
        amounts = currencyFormat(amounts);

        return (
            <View style={[styles.container]}>
                <ScrollView style={[styles.content, { padding: 2, backgroundColor: '#eee' }]}>
                    {carts.map((item, index) => {
                        return <CartItem
                            key={index}
                            name={item.title}
                            brand={item.product_brand.name}
                            photo={item.photo}
                            quantity={item.quantity}
                            defaultType={item.type}
                            selectedType={item.selected_type}
                            price={(item.selected_type == 'pcs') ? item.price_piece : item.price_box}
                            onPress={() => this.sparepartDetail(item.id)}
                            onChangeType={(type) => setItemType(item, type)}
                            onChangeQuantity={(quantity) => setItemQuantity(item, quantity)}
                            onClose={() => removeItem(item)} />
                    })}
                    {carts.length == 0 &&
                        <Text style={{ alignSelf: 'center', marginTop: 32 }}>No items were found !</Text>
                    }
                </ScrollView>

                <View style={{ flexDirection: 'row', backgroundColor: '#4C4949', paddingHorizontal: 16, paddingVertical: 14 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#fff', fontSize: 12 }}>Estimated Total</Text>
                        <Text style={localStyles.price}>Rp. {amounts},-</Text>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 0.5 }}>
                        <Button
                            text="Checkout"
                            onPress={this.checkout} />
                    </View>
                </View>
            </View>
        )
    }
}

export const localStyles = StyleSheet.create({
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
});

function mapStateToProps(state) {
    return {
        carts: state.carts,
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        setItemType: (item, type) => {
            dispatch(setCartItemType(item.id, type));
            dispatch(setCartItemQuantity(item.id, 1));
        },
        setItemQuantity: (item, quantity) => {
            dispatch(setCartItemQuantity(item.id, quantity));
        },
        removeItem: (item) => {
            dispatch(removeCartItem(item.id));
        }
    };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
    };
}

Cart = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Cart);

export default Cart;