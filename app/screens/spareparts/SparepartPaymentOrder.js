import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView
} from 'react-native';

import Axios from 'axios';

import Input from '../../components/Input';
import CurrencyInput from '../../components/CurrencyInput';
import { styles } from '../../assets/styles/Style';
import Button from '../../components/Button';
import Data from '../../config/Data';
import { config } from '../../config/Config';

const data = new Data();

export default class SparepartPaymentOrder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            amount: 0,
            bank_name: '',
            bank_account: '',
            bank_person_name: '',
        };

        this.submit = this.submit.bind(this);
    }

    componentDidMount() {
        this.getUser();
    }

    async getUser() {
        const user = await data.select('user');

        if (user) {
            this.setState({ user });
        }
    }

    async submit() {
        let {
            user
        } = this.state;

        let { navigation } = this.props;
        let { state } = navigation;
        const { order_id, user_member_id } = state.params;

        try {
            let response = await Axios.post(config.url + 'payments', {
                ...this.state,
                order_id,
                user_member_id,
                type: 'orders',
                status: 'waiting'
            });

            if (user.role == 'member') {
                navigation.navigate('FeedMember');
            } else {
                navigation.navigate('OrderSparepartList');
            }
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        let {
            user,
            amount,
            bank_name,
            bank_account,
            bank_person_name
        } = this.state;


        return (
            <View style={styles.container}>
                <ScrollView style={styles.content}>
                    <View>
                        <CurrencyInput
                            placeholder="Amount"
                            value={amount}
                            onChangeText={(text) => this.setState({ amount: text })} />
                        <Input
                            placeholder="Bank Name"
                            onChangeText={(bank_name) => this.setState({ bank_name })}
                        />
                        <Input
                            placeholder="Bank Account"
                            keyboardType="phone-pad"
                            onChangeText={(bank_account) => this.setState({ bank_account })}
                        />
                        <Input
                            placeholder="Bank Person Name"
                            onChangeText={(bank_person_name) => this.setState({ bank_person_name })}
                        />
                    </View>
                    <Button
                        lowerCase={true}
                        text="Submit Payment"
                        onPress={this.submit} />
                    <View style={{ height: 96 }}></View>
                </ScrollView>
            </View>
        );
    }
}
