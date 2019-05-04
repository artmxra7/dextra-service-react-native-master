import React, {Component} from 'react';
import {
    Text,
    Image,
    View,
    AsyncStorage,
    StyleSheet
} from 'react-native';
import {Icon} from 'react-native-elements';
import {
    StackNavigator,
    TabNavigator,
    DrawerNavigator
} from 'react-navigation';

import Intro from '../screens/auth/Intro';
import Register from '../screens/auth/Register';
import Login from '../screens/auth/Login';
import EmailSent from '../screens/auth/EmailSent';
import ResetPassword from '../screens/auth/ResetPassword';
import ConfirmRegister from '../screens/auth/ConfirmRegister';
import EditProfilePerson from '../screens/auth/EditProfilePerson';
import EditProfileCompany from '../screens/auth/EditProfileCompany';
import Timeline from '../screens/timelines/Timeline';
import TimelineDetail from '../screens/timelines/TimelineDetail';
import { default as TabCommision } from '../screens/commisions/Router';
import Commision from '../screens/commisions/Commision';
import CommisionDetail from '../screens/commisions/CommisionDetail';
import CommisionWithdraw from '../screens/commisions/CommisionWithdraw';
import Customer from '../screens/customers/Customer';
import Router from '../screens/customers/Router';
import CustomerDetail from '../screens/customers/CustomerDetail';
import SidemenuCust from '../screens/customers/SidemenuCust';
import Sparepart from '../screens/spareparts/Sparepart';
import Cart from '../screens/spareparts/Cart';
import RequestProduct from '../screens/spareparts/RequestProduct';
import Checkout from '../screens/spareparts/Checkout';
import SparepartDetail from '../screens/spareparts/SparepartDetail';
import SparepartPaymentOrder from '../screens/spareparts/SparepartPaymentOrder';
import OrderSparepartList from '../screens/spareparts/OrderSparepartList';
import SparepartListDetail from '../screens/spareparts/SparepartListDetail';
import OrderMechanicList from '../screens/spareparts/OrderMechanicList';
import OfferViewer from '../screens/spareparts/OfferViewer';
import Mechanic from '../screens/mechanics/Mechanic';
import MechanicSearching from '../screens/mechanics/MechanicSearching';
import MechanicHistoryDetail from '../screens/mechanics/MechanicHistoryDetail';
import TabBar from '../components/TabBar';
import {styles} from '../assets/styles/Style';

import {Icon as Icons} from 'native-base';

function logout(navigation) {
    AsyncStorage.clear();
    navigation.navigate('Intro');
}

export const SparepartIndex = StackNavigator({
    Sparepart: {
        screen: Sparepart,
        navigationOptions: ({ navigation }) => ({
            headerRight: <Icons name="list-box" size={16} style={{alignSelf: 'center', color: '#fff', marginRight: 20}} onPress={() => navigation.navigate('RequestProduct')} />,
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Products',
        }),
    },
});

export const CommisionIndex = StackNavigator({
    Commision: {
        screen: TabCommision,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Commision',
        },
    },
    CommisionDetail: {
        screen: CommisionDetail,
    },
    CommisionWithdraw: {
        screen: CommisionWithdraw,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Commision Withdraw',
        },
    },
});

export const CustomerIndex = StackNavigator({
    Router: {
        screen: Router,
    },
    CustomerDetail: {
        screen: CustomerDetail,
    },
},{
    navigationOptions: {
        header: false,
    },
});

// Timeline
export const TimelineIndex = StackNavigator({
    Timeline: {
        screen: Timeline,
        navigationOptions: ({ navigation }) => ({
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Home Timeline',
            headerRight: <Icons name="md-exit" style={{alignSelf: 'center', color: '#fff', marginRight: 20}} onPress={() => logout(navigation)}/>,
        }),
    },
});

export const MechanicIndex = StackNavigator({
    Mechanic: {
        screen: Mechanic,
        navigationOptions: ({ navigation }) => ({
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Mechanic',
        }),
    },
    MechanicSearching: {
        screen: MechanicSearching,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Mechanic Searching',
        },
    },
});

const TabOrderHistory = TabNavigator({
    OrderSparepartList: {
        screen: OrderSparepartList,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Orders History',
        },
    },
    OrderMechanicList: {
        screen: OrderMechanicList,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Mechanics History',
        },
    },
},{
    tabBarOptions: {
        style: {
            backgroundColor: '#fff',
        },
        activeTintColor: '#f39c12',
        activeBackgroundColor: 'red',
        inactiveTintColor: '#3E3C3C',
        upperCaseLabel: false,
        indicatorStyle: {
            backgroundColor: 'transparent',
        },
        labelStyle: {
            fontWeight: 'bold',
        },
    },
});

// Main for Sales
export const FeedSales = TabNavigator({
    TimelineIndex: {
        screen: TimelineIndex,
        navigationOptions: {
            tabBarLabel: 'Home',
            tabBarIcon: ({tintColor}) => <Icon name="home" color={tintColor} size={24}/>,
        },
    },
    CustomerIndex: {
        screen: CustomerIndex,
        navigationOptions: {
            tabBarLabel: 'Customer',
            tabBarIcon: ({tintColor}) => <Icon name="users" type="font-awesome" color={tintColor} size={20}/>,
        },
    },
    SparepartIndex: {
        screen: SparepartIndex,
        navigationOptions: {
            tabBarLabel: 'Product',
            tabBarIcon: ({tintColor}) => <Icon name="cogs" type="font-awesome" color={tintColor} size={22}/>,
        },
    },
    CommisionIndex: {
        screen: CommisionIndex,
        navigationOptions: {
            tabBarLabel: 'Commision',
            tabBarIcon: ({tintColor}) => <Icon name="money" type="font-awesome" color={tintColor} size={24}/>,
        },
    },
},{
    lazy: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
        style: {
            backgroundColor: '#3E3C3C',
        },
        indicatorStyle: {
            backgroundColor: '#fff',
            height: 4,
            alignContent: 'center',
        },
        labelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            padding: 0,
            margin: 0,
        },
        iconStyle: {
            width: 24,
        },
        activeTintColor: '#fff',
        scrollEnabled: false,
        showIcon: true,
        upperCaseLabel: false,
        pressColor: 'transparent',
    },
    swipeEnabled: false,
    animationEnabled: false,
    navigationOptions: {
        tabBarVisible: true,
    },
});

// Main for Member
export const FeedMember = TabNavigator({
    TimelineIndex: {
        screen: TimelineIndex,
        navigationOptions: {
            tabBarLabel: 'Home',
            tabBarIcon: ({tintColor}) => <Icon name="home" color={tintColor} size={24}/>,
        },
    },
    MechanicIndex: {
        screen: MechanicIndex,
        navigationOptions: {
            tabBarLabel: 'Mechanics',
            tabBarIcon: ({tintColor}) => <Icon name="user" type="font-awesome" color={tintColor} size={20}/>,
        }
    },
    SparepartIndex: {
        screen: SparepartIndex,
        navigationOptions: {
            tabBarLabel: 'Product',
            tabBarIcon: ({tintColor}) => <Icon name="cogs" type="font-awesome" color={tintColor} size={22}/>,
        },
    },
    HistoryIndex: {
        screen: TabOrderHistory,
        navigationOptions: {
            tabBarLabel: 'History',
            tabBarIcon: ({tintColor}) => <Icon name="history" type="font-awesome" color={tintColor} size={24}/>,
        },
    },
},{
    lazy: true,
    tabBarPosition: 'bottom',
    tabBarOptions: {
        style: {
            backgroundColor: '#3E3C3C',
        },
        indicatorStyle: {
            backgroundColor: '#fff',
            height: 4,
            alignContent: 'center',
        },
        labelStyle: {
            fontSize: 14,
            fontWeight: 'bold',
            padding: 0,
            margin: 0,
        },
        iconStyle: {
            width: 24,
        },
        activeTintColor: '#fff',
        scrollEnabled: false,
        showIcon: true,
        upperCaseLabel: false,
        pressColor: 'transparent',
    },
    swipeEnabled: false,
    animationEnabled: false,
    navigationOptions: {
        tabBarVisible: true,
    },
});

export const Reset = StackNavigator({
    EmailSent: {
        screen: EmailSent,
        navigationOptions: {
            header: false,
        },
    },
    ResetPassword: {
        screen: ResetPassword,
        navigationOptions: {
            header: false,
        },
    },
    Login: {
        screen: Login,
        navigationOptions: {
            header: {
                visible: false,
            },
        },
    },
});

// Main Router
export const Stack = StackNavigator({
    Intro: {
        screen: Intro,
        navigationOptions: {
            header: false,
        },
    },
    Register: {
      screen: Register,
      navigationOptions: {
          header: false,
      },
    },
    ConfirmRegister: {
        screen: ConfirmRegister,
        navigationOptions: {
            header: false,
        },
    },
    Login: {
        screen: Login,
        navigationOptions: {
            header: false,
        },
    },
    Reset: {
        screen: Reset,
        navigationOptions: {
            header: false,
        },
    },
    EditProfilePerson: {
        screen: EditProfilePerson,
        navigationOptions: ({ navigation }) => ({
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Edit Profile',
            headerRight: <Icons name="md-exit" style={{alignSelf: 'center', color: '#fff', marginRight: 20}} onPress={() => logout(navigation)}/>,
        }),
    },
    EditProfileCompany: {
        screen: EditProfileCompany,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Edit Profile',
        },
    },
    FeedSales: {
        screen: FeedSales,
        navigationOptions: {
            header: false,
        },
    },
    FeedMember: {
        screen: FeedMember,
        navigationOptions: {
            header: false,
        },
    },
    SparepartDetail: {
        screen: SparepartDetail,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Product Detail',
        },
    },
    RequestProduct: {
        screen: RequestProduct,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Request Product',
        },
    },
    Cart: {
        screen: Cart,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Cart',
        },
    },
    Checkout: {
        screen: Checkout,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Checkout',
        },
    },
    TimelineDetail: {
        screen: TimelineDetail,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Home Timeline',
        },
    },
    TabOrderHistory: {
        screen: TabOrderHistory,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Order History',
        },
    },
    SparepartListDetail: {
        screen: SparepartListDetail,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Order Product Detail',
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
    MechanicHistoryDetail: {
        screen: MechanicHistoryDetail,
        navigationOptions: {
            headerStyle: styles.header_menu,
            headerTitleStyle: styles.header_title,
            headerTintColor: '#fff',
            title: 'Mechanic Order Detail',
        },
    },
});
