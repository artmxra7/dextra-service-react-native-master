import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    TouchableOpacity,
    ViewPagerAndroid,
    AsyncStorage
} from 'react-native';

import {
    Card,
    Thumbnail,
    Tabs,
    Tab,
    ScrollableTab,
    Spinner
} from 'native-base';

import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import _ from 'lodash';
import Axios from 'axios';

import TabBar from '../../components/TabBar';
import Button from '../../components/Button';
import Switch from '../../components/Switch';
import ButtonCount from '../../components/ButtonCount';
import BuyButton from '../../components/BuyButton';
import CartInfo from '../../components/CartInfo';
import { styles } from '../../assets/styles/Style';
import Link from '../../components/Link';
import List from '../../components/List';
import Data from '../../config/Data';
import { Feed } from '../../config/Data';
import Modal from 'react-native-modal';
import CapsuleTabList from '../../components/CapsuleTabList';
import TabSparepartList from '../spareparts/TabSparepartList';
import { config } from '../../config/Config';

import {
    addCartItem,
    setCartItemQuantity
} from '../../store/carts/Actions';

const data = new Data();

class Sparepart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isProgress: false,
            tabs: [],
            unitModels: [],
            products: [],
        };

        this.changeView = this.changeView.bind(this);
        this.cart = this.cart.bind(this);
    }

    componentDidMount() {
        this.getProducts(() => {
            this.getUnitModels();
        });
    }

    cart() {
        this.props.navigation.navigate('Cart');
    }

    redirect(route) {
        const { navigate } = this.props.navigation;
        navigate(route);
    }

    changeView(index) {
        this.viewpager.setPage(index);
    }

    async getUnitModels() {
        this.setState({ isProgress: true });

        try {
            let response = await Axios.get(config.url + 'product_unit_models');
            let unitModels = response.data.data;
            let tabs = _.map(unitModels, 'name');

            this.setState({
                isProgress: false,
                tabs,
                unitModels
            });
        } catch (error) {
            this.setState({ isProgress: false });
            console.error(error);
        }
    }

    async getProducts(callback) {
        try {
            let response = await Axios.get(config.url + 'products');
            let products = response.data.data;

            this.setState({ products });

            callback();
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        let {
            tabs,
            unitModels,
            isProgress,
            products
        } = this.state;

        let {
            carts,
            buy
        } = this.props;

        return (
            <View style={[styles.container]}>
                {isProgress ? (
                    <View style={{ alignItems: 'center' }}>
                        <Spinner color="#333" />
                    </View>
                ) : (
                        <View style={{ flex: 1 }}>
                            <CapsuleTabList
                                ref={(capsuleTabList) => { this.capsuleTabList = capsuleTabList; }}
                                data={tabs}
                                onSelect={this.changeView} />
                            <ViewPagerAndroid
                                ref={(viewpager) => { this.viewpager = viewpager }}
                                initialPage={0}
                                style={styles.viewPager}
                                onPageSelected={(e) => this.capsuleTabList.selectTab(e.nativeEvent.position)}>
                                {unitModels.map((unitModel, index) => {
                                    let productsByCategory = _.filter(products, { product_unit_model_id: unitModel.id });

                                    return (
                                        <View style={styles.pageStyle} key={index}>
                                            <TabSparepartList
                                                products={productsByCategory}
                                                unitModelID={unitModel.id}
                                                navigation={this.props.navigation}
                                                onBuy={buy} />
                                        </View>
                                    );
                                })}
                            </ViewPagerAndroid>
                            <CartInfo
                                items={carts}
                                onPressCart={this.cart} />
                        </View>
                    )}
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        carts: state.carts,
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        buy: (product, carts) => {
            let wasBought = _.some(carts, { id: product.id });

            if (wasBought) {
                let index = _.findIndex(carts, { id: product.id });
                let quantity = carts[index].quantity + 1;

                dispatch(setCartItemQuantity(product.id, quantity));
            } else {
                dispatch(addCartItem(product));
            }
        }
    };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    return {
        ...ownProps,
        carts: stateProps.carts,
        buy: (product) => {
            dispatchProps.buy(product, stateProps.carts);
        }
    };
}

Sparepart = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Sparepart);
export default Sparepart;