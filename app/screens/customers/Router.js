import React, { Component } from 'react';
import {
    Text,
    View,
    Alert,
    Image,
    TouchableOpacity,
} from 'react-native'
import { Icon } from 'native-base';
import {
    TabNavigator,
    StackNavigator
} from 'react-navigation';
import Customer from './Customer';
import Quotation from './Quotation';
import Purchase from './Purchase';
import CustomerDetail from './CustomerDetail';
import CreateCustomer1 from './CreateCustomer1';
import CreateCustomer2 from './CreateCustomer2';
import PurchaseDetail from './PurchaseDetail';
import OrderSparepartList from '../spareparts/OrderSparepartList';
import SparepartListDetail from '../spareparts/SparepartListDetail';
import OfferViewer from '../spareparts/OfferViewer';
import SparepartPaymentOrder from '../spareparts/SparepartPaymentOrder';
import { styles } from '../../assets/styles/Style';
import Drawer from 'react-native-drawer';

export default class Router extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <RouterDetail />
        );
    }
}

const Route = new Router();

export const CustomerRouter = TabNavigator({
    Customer: {
        screen: Customer,
        navigationOptions: {
            tabBarLabel: 'Cust List',
        }
    },
    OrderSparepartList: {
        screen: OrderSparepartList,
        navigationOptions: {
            tabBarLabel: 'History',
        }
    },
    // Quotation: {
    //     screen: Quotation,
    //     navigationOptions: {
    //         tabBarLabel: 'Quotation',
    //     }
    // },
    // Purchase: {
    //     screen: Purchase,
    //     navigationOptions: {
    //         tabBarLabel: 'Purchase'
    //     }
    // }
}, {
    tabBarOptions: {
        style: {
            backgroundColor: '#fff',
        },
        activeTintColor: '#f39c12',
        activeBackgroundColor: 'red',
        inactiveTintColor: '#3E3C3C',
        upperCaseLabel: false,
        indicatorStyle: {
            backgroundColor: 'transparent'
        },
        labelStyle: {
            fontWeight: 'bold'
        }
    }
})

export const RouterDetail = StackNavigator({
    CustomerRouter: {
        screen: CustomerRouter,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Customer',
        }
    },
    SparepartListDetail: {
        screen: SparepartListDetail,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Order Sparepart Detail',
        },
    },
    OfferViewer: {
        screen: OfferViewer,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Offer Viewer',
        },
    },
    SparepartPaymentOrder: {
        screen: SparepartPaymentOrder,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Payment Order',
        },
    },
    CustomerDetail: {
        screen: CustomerDetail,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Customer Detail',
        }
    },
    CreateCustomer2: {
        screen: CreateCustomer2,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Create Customer - Person',
        }
    },
    CreateCustomer1: {
        screen: CreateCustomer1,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Create Customer - Company',
        }
    },
    PurchaseDetail: {
        screen: PurchaseDetail,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Purchase Detail',
        }
    }
})
