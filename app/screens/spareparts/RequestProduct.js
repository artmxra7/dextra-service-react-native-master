import React, { Component } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    AsyncStorage,
    TouchableNativeFeedback,
} from 'react-native'
import {
    Card,
    Thumbnail,
} from 'native-base'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux';
import _ from 'lodash';

import Button from '../../components/Button'
import ButtonCount from '../../components/ButtonCount'
import BuyButton from '../../components/BuyButton'
import { styles } from '../../assets/styles/Style'
import CartRequestItem from '../../components/CartRequestItem'
import ModalFormRequest from '../../components/ModalFormRequest'
import Data from '../../config/Data'
import { Feed } from '../../config/Data'
import { currencyFormat, calculateTotalPrice } from '../../config/Helper'

import {
    setCartItemType,
    setCartItemQuantity,
    removeCartItem,
    clearCart,
    addCartItemBatch,
} from '../../store/carts/Actions';

class RequestProduct extends Component {
    constructor(props) {
        super(props);

        this.state = {
            carts: [],
            isModalOpen: false,
        };  

        this.checkout = this.checkout.bind(this);
        this.add = this.add.bind(this);
        this.setItemQuantity = this.setItemQuantity.bind(this);
        this.setItemType = this.setItemType.bind(this);
    }

    checkout() {
        const { navigation, clearCart, addCartItemBatch } = this.props;
        const { carts } = this.state;

        if (carts.length == 0) {
            alert('There are no items in your cart !');
            return;
        }

        let newCarts = carts.map((cart) => {
            cart.id = null;
            return cart;
        });

        clearCart();
        addCartItemBatch(newCarts);
        navigation.navigate('Checkout');
    }

    add(form) {
        this.setState((prevState) => {
            const date = new Date();
            const carts = prevState.carts;
            const cart = {
                ...form,
                id: date.getTime(),
                selected_type: 'pcs',
                quantity: 1,
                price_piece: 0,
                price_box: 0,
            };

            return {
                carts: [ ...carts, cart ]
            };
        });
    }

    remove(id) {
        this.setState((prevState) => {
            const carts = prevState.carts.filter((cart) => cart.id != id);
            return { carts };
        });
    }

    setItemQuantity(id, quantity) {
        this.setState((prevState) => {
            const carts = prevState.carts.map((cart) => {
                if (cart.id == id) {
                    cart.quantity = quantity;   
                } 

                return cart;
            });

            return { carts };
        });
    }

    setItemType(id, type) {
        this.setState((prevState) => {
            const carts = prevState.carts.map((cart) => {
                if (cart.id == id) {
                    cart.selected_type = type;   
                } 

                return cart;
            });

            return { carts };
        });
    }

    render() {
        let {
            clearCart,
        } = this.props;

        let { 
            carts,
            isModalOpen,
        } = this.state;

        return (
            <View style={[styles.container]}>
                <ModalFormRequest 
                    isOpen={isModalOpen}
                    onPressClose={() => this.setState({
                        isModalOpen: false,
                    })}
                    onPressAdd={(form) => {
                        this.add(form);
                        this.setState({ isModalOpen: false });
                    }} />
                <ScrollView style={[styles.content, { padding: 2, backgroundColor: '#eee' }]}>
                    {carts.map((item) => {
                        return <CartRequestItem
                            key={item.id}
                            name={item.title}
                            serialNumber={item.sn_product}
                            noProduct={item.no_product}
                            brand={item.product_brand.name}
                            quantity={item.quantity}
                            selectedType={item.selected_type}
                            onChangeType={(type) => this.setItemType(item.id, type)}
                            onChangeQuantity={(quantity) => this.setItemQuantity(item.id, quantity)}
                            onClose={() => this.remove(item.id)} />
                    })}
                    {carts.length == 0 &&
                        <Text style={{ alignSelf: 'center', marginTop: 32 }}>No items were found !</Text>
                    }
                </ScrollView>
            
                <View style={localStyles.bottomButtonContainer}>
                    <TouchableNativeFeedback onPress={this.checkout}>
                        <View style={localStyles.bottomButton}>
                            <Text style={localStyles.bottomButtonCaption}>Order</Text>
                        </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback onPress={() => this.setState({ isModalOpen: true })}>
                        <View style={localStyles.bottomButton}>
                            <Text style={localStyles.bottomButtonCaption}>Add New</Text>
                        </View>
                    </TouchableNativeFeedback>
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
    bottomButtonContainer: {
        flexDirection: 'row',
    },
    bottomButton: {
        flex: 1,
        height: 48,
        backgroundColor: '#ff9b00',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomButtonCaption: {
        fontSize: 14,
        color: 'white',
    }
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
        },
        clearCart: () => {
            dispatch(clearCart());
        },
        addCartItemBatch: (products) => {
            dispatch(addCartItemBatch(products));
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

RequestProduct = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(RequestProduct);

export default RequestProduct;