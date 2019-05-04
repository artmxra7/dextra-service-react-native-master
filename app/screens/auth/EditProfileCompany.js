import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { styles } from '../../assets/styles/Style';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Data from '../../config/Data';
import { config } from '../../config/Config';

import { NavigationActions } from 'react-navigation';

const data = new Data();
export default class EditProfileCompany extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            company_profile: '',
            sector_business: '',
            user_position_title: '',
            email_office: '',
            phone_number: '',
            address_office: '',
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
        let errors = [];
        let field = { ...this.state };

        for (let fieldName in field) {
            if (field[fieldName] == '') {
                fieldName = fieldName.replace('_', ' ');
                fieldName = fieldName.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });

                errors.push(fieldName);
            }
        }

        if (errors.length > 0) {
            const fields = errors.join(', ');
            const message = 'Maaf, kolom ' + fields + ' tidak boleh kosong !';
            alert(message);
            return;
        }

        let {
            user,
            company_profile,
            sector_business,
            user_position_title,
            email_office,
            phone_number,
            address_office,
        } = this.state;

        let { navigation } = this.props;
        let { state } = navigation;
        let member = state.params.member;
        const token = await data.select('api_token');

        try {
            let response = await fetch(config.url + 'sales/customers/' + user.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                },
                body: JSON.stringify({
                    person: {
                        name: member.name,
                        email: member.email,
                        password: member.password,
                        phone: member.phone,
                        city: member.city,
                        address: member.address,
                    },
                    company: {
                        name: company_profile,
                        sector_business: sector_business,
                        user_position_title: user_position_title,
                        email: email_office,
                        phone: phone_number,
                        address: address_office,
                    }
                }),
            });

            response = await response.json();
            await data.insert('user', response.data);

            let routeRedirect = '';
            if (response.data.role == 'member') {
                routeRedirect = 'FeedMember';
            }else if (response.data.role == 'sales') {
                routeRedirect = 'FeedSales';
            }
            alert('Data success updated');

            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: routeRedirect }),
                ]
            });

            navigation.dispatch(resetAction);
        } catch (errors) {
            console.error(errors);
        }
    }

    redirect(route) {
        const { navigate } = this.props.navigation;
        navigate(route);
    }

    render() {
        let {
            navigation
        } = this.props;

        let {
            company_profile,
            sector_business,
            user_position_title,
            email_office,
            phone_number,
            address_office,
        } = this.state;

        return (
            <ScrollView style={styles.content}>
                <View style={{ alignItems: 'center', marginBottom: 18 }}>
                    <Text style={{ fontWeight: 'bold', color: '#363636' }}>Data Company</Text>
                </View>
                <View>
                    <Input
                        placeholder="Enter Customer Profile"
                        autoCapitalize="words"
                        onChangeText={(text) => this.setState({ company_profile: text })}
                        value={company_profile}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '100%' }}>
                        <Input
                            placeholder="Sector Business"
                            autoCapitalize="words"
                            onChangeText={(text) => this.setState({ sector_business: text })}
                            value={sector_business}
                        />
                        <Input
                            placeholder="Position Title"
                            autoCapitalize="words"
                            onChangeText={(text) => this.setState({ user_position_title: text })}
                            value={user_position_title}
                        />
                        <Input
                            placeholder="Email Office"
                            keyboardType="email-address"
                            onChangeText={(text) => this.setState({ email_office: text })}
                            value={email_office}
                        />
                        <Input
                            placeholder="Phone Office"
                            keyboardType="phone-pad"
                            onChangeText={(text) => this.setState({ phone_number: text })}
                            value={phone_number}
                        />
                    </View>
                </View>
                <View>
                    <Input
                        placeholder="Address Office"
                        multiline={true}
                        onChangeText={(text) => this.setState({ address_office: text })}
                        value={address_office}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ width: 80 }}>
                        <Button text="Cancel" lowerCase={true} onPress={() => navigation.goBack()} />
                    </View>
                    <View style={{ width: 80 }}>
                        <Button text="Submit" lowerCase={true} onPress={this.submit} />
                    </View>
                </View>
                <View style={{height: 50}}></View>
            </ScrollView>
        );
    }

}
