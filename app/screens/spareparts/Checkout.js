import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import Axios from 'axios';

import CustomerSelector from '../../components/CustomerSelector';
import CitySelector from '../../components/CitySelector';
import ModalLoading from '../../components/ModalLoading';
import Input from '../../components/Input';
import { styles } from '../../assets/styles/Style';
import Button from '../../components/Button';
import Data from '../../config/Data';
import { config } from '../../config/Config';
import { calculateTotalPrice } from '../../config/Helper';
import { clearCart } from '../../store/carts/Actions';

const data = new Data();

class Checkout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            cities: [],
            customer: {},
            customers: [],
            // Form Data
            company_name: '',
            company_email: '',
            company_phone: '',
            personal_name: '',
            personal_email: '',
            personal_phone: '',
            shipping_address: '',
            shipping_city: '',
            isLoading: false,
        };

        this.citiesDB = [];

        this.getCities = this.getCities.bind(this);
        this.resetCities = this.resetCities.bind(this);
        this.searchCity = this.searchCity.bind(this);
    }

    componentDidMount() {
        this.getUser();
        this.getCustomers();
        this.getCities();
    }

    async getUser() {
        const user = await data.select('user');

        if (user) {
            switch (user.role) {
                case 'member':
                    this.setState({
                        user,
                        company_name: user.company.name,
                        company_email: user.company.email,
                        company_phone: user.company.phone,
                        personal_name: user.name,
                        personal_email: user.email,
                        personal_phone: user.phone,
                    });
                    break;
                case 'sales':
                    this.setState({ user });
                    break;
                default:
                    break;
            }
        }
    }

    async getCustomers() {
        try {
            let response = await Axios.get(config.url + 'sales/customers');
            let customers = response.data.data;

            this.setState({ customers });
        } catch (error) {
            console.error(error);
        }
    }

    async getCities() {
        try {
            let response = await Axios.get(config.base_url + 'data/cities.json');
            let cities = response.data;

            this.citiesDB = cities;
            this.setState({ cities });
        } catch (error) {
            console.error(error);
        }
    }

    searchCity(keyword) {
        let cities = [ ...this.citiesDB ];
        cities = cities.filter((city) => city.toLowerCase().includes(keyword.toLowerCase()));

        this.setState({ cities });
    }

    resetCities() {
        this.setState({
            cities: this.citiesDB,
        });
    }

    render() {
        let {
            user,
            cities,
            customers,
            company_name,
            company_email,
            company_phone,
            personal_name,
            personal_email,
            personal_phone,
            shipping_city,
            isLoading,
        } = this.state;

        let { checkout, navigation } = this.props;

        return (
            <View style={styles.container}>
                <ScrollView style={styles.content}>
                    <ModalLoading isOpen={isLoading} />
                    {user.role == 'sales' &&
                        <View style={{ marginBottom: 24 }}>
                            <CustomerSelector
                                customers={customers}
                                onSelect={(selected) => {
                                    this.setState({
                                        // Selected Customer
                                        customer: selected,
                                        // Company Data
                                        company_name: selected.company.name,
                                        company_email: selected.company.email,
                                        company_phone: selected.company.phone,
                                        // Customer Data
                                        personal_name: selected.name,
                                        personal_email: selected.email,
                                        personal_phone: selected.phone,
                                    });
                                }} />
                        </View>
                    }
                    <View>
                        <View style={{ marginBottom: 8 }}>
                            <Text style={styles.content_title}>Company</Text>
                        </View>
                        <View>
                            <Input
                                placeholder="Enter Company Name"
                                autoCapitalize="words"
                                editable={user.role == 'member'}
                                value={company_name}
                                onChangeText={(text) => this.setState({ company_name: text })}
                            />
                            <Input
                                placeholder="Email Office"
                                keyboardType="email-address"
                                editable={user.role == 'member'}
                                value={company_email}
                                onChangeText={(text) => this.setState({ company_email: text })}
                            />
                            <Input
                                placeholder="Phone Office"
                                keyboardType="phone-pad"
                                editable={user.role == 'member'}
                                value={company_phone}
                                onChangeText={(text) => this.setState({ company_phone: text })}
                            />
                        </View>
                    </View>
                    {/*Personal*/}
                    <View>
                        <View style={{ marginBottom: 8 }}>
                            <Text style={styles.content_title}>{user.role == 'member' ? 'Personal' : 'Customer'}</Text>
                        </View>
                        <View>
                            <Input
                                placeholder="Enter Your Name"
                                autoCapitalize="words"
                                value={personal_name}
                                editable={user.role == 'member'}
                                onChangeText={(text) => this.setState({ personal_name: text })}
                            />
                            <Input
                                placeholder="Your Email"
                                keyboardType="email-address"
                                value={personal_email}
                                editable={user.role == 'member'}
                                onChangeText={(text) => this.setState({ personal_email: text })}
                            />
                            <Input
                                placeholder="Your Phone"
                                keyboardType="phone-pad"
                                value={personal_phone}
                                editable={user.role == 'member'}
                                onChangeText={(text) => this.setState({ personal_phone: text })}
                            />
                        </View>
                    </View>
                    {/*Shipping*/}
                    <View>
                        <View style={{ marginBottom: 8 }}>
                            <Text style={styles.content_title}>Shipping</Text>
                        </View>
                        <View>
                            <Input
                                placeholder="Address"
                                multiline={true}
                                onChangeText={(text) => this.setState({ shipping_address: text })}
                            />
                            <View style={{ marginBottom: 8 }}>
                                <CitySelector
                                    cities={cities}
                                    value={shipping_city}
                                    onPressSearch={this.searchCity}
                                    onSelect={(shipping_city) => this.setState({ shipping_city })}
                                    onOpen={this.resetCities} />
                            </View>
                        </View>
                    </View>
                    <Button
                        lowerCase={true}
                        text="Submit Order"
                        onPress={() => {
                            // Check if there is blank form exists
                            let form = { ...this.state };
                            delete form.isLoading;

                            for (let property in form) {
                                if (!form[property]) {
                                    alert('You should fill all data.');
                                    return;
                                }
                            }

                            this.setState({ isLoading: true });

                            checkout(this.state, () => {
                                this.setState({ isLoading: false });

                                if (user.role == 'member') {
                                    navigation.navigate('OrderSparepartList');
                                } else {
                                    navigation.navigate('CustomerIndex');
                                }
                            });
                        }} />
                    <View style={{ height: 96 }}></View>
                </ScrollView>
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
        checkout: async (form, items, callback) => {
            const totalPrice = calculateTotalPrice(items);
            const role = form.user.role;
            const user_member_id = role == 'member' ? form.user.id : form.customer.id;
            const user_sales_id  = role == 'member' ? null : form.user.id;

            try {
                let response = await Axios.post(config.url + 'orders', {
                    shipping: {
                        total_price: totalPrice,
                        address: form.shipping_address,
                        city: form.shipping_city,
                        user_member_id,
                        user_sales_id
                    },
                    company: {
                        name: form.company_name,
                        email: form.company_email,
                        phone: form.company_phone,
                        user_member_id,
                    },
                    personal: {
                        name: form.personal_name,
                        email: form.personal_email,
                        phone: form.personal_phone,
                    },
                    user_member_id,
                    items,
                });

                await data.insert('user', {
                    ...form.user,
                    name: form.personal_name,
                    email: form.personal_email,
                    phone: form.personal_phone,
                    company: {
                        ...form.user.company,
                        name: form.company_name,
                        email: form.company_email,
                        phone: form.company_phone,
                        user_member_id,
                    }
                });

                dispatch(clearCart());
                callback();
            } catch (error) {
                console.error(error.response);
            }
        }
    };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
    return {
        ...ownProps,
        carts: stateProps.carts,
        checkout: (form, callback) => {
            const items = stateProps.carts;
            dispatchProps.checkout(form, items, callback);
        }
    };
}

Checkout = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Checkout);
export default Checkout;
