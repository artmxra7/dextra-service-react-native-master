import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    ScrollView
} from 'react-native';
import {
    Grid,
    Col
} from 'native-base';
import { styles } from '../../assets/styles/Style';
import Input from '../../components/Input';
import Button from '../../components/Button';
import CitySelector from '../../components/CitySelector';
import Modal from 'react-native-modal';
import { config } from '../../config/Config';
import Axios from 'axios';

export default class CreateCustomer2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            phone: '',
            city: '',
            address: '',
            cities: [],
        };

        // Cities Database should not filtered
        this.citiesDB = [];

        this.getCities = this.getCities.bind(this);
        this.resetCities = this.resetCities.bind(this);
        this.searchCity = this.searchCity.bind(this);
        this.nextStep = this.nextStep.bind(this);
    }

    componentDidMount() {
        this.getCities();
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

    nextStep() {
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

        if (errors.length == 0) {
            const {
                password,
                password_confirmation
            } = this.state;
            const { navigate } = this.props.navigation;
            const isMatch = password == password_confirmation;

            if (isMatch) {
                navigate('CreateCustomer1', { member: this.state });
            } else {
                alert('Maaf, Password tidak cocok !');
            }
        } else {
            const fields = errors.join(', ');
            const message = 'Maaf, kolom ' + fields + ' tidak boleh kosong !';
            alert(message);
        }
    }

    render() {
        let {
            name,
            email,
            password,
            password_confirmation,
            phone,
            city,
            address,
            cities,
        } = this.state;

        return (
            <ScrollView style={[styles.content, { padding: 0 }]}>
                <View style={styles.content}>
                    {/*Header*/}
                    <View style={{ alignItems: 'center', marginBottom: 18 }}>
                        <Text style={{ fontWeight: 'bold', color: '#363636' }}>Data Person</Text>
                    </View>
                    {/*Content*/}
                    <View>
                        <Input
                            placeholder="Enter Customer Name"
                            autoCapitalize="words"
                            onChangeText={(text) => this.setState({ name: text })}
                            value={name}
                        />
                        <Input
                            placeholder="Email"
                            keyboardType="email-address"
                            onChangeText={(text) => this.setState({ email: text })}
                            value={email}
                        />
                        <Input
                            placeholder="Password"
                            secureTextEntry={true}
                            onChangeText={(text) => this.setState({ password: text })}
                            value={password}
                        />
                        <Input
                            placeholder="Password Confirmation"
                            secureTextEntry={true}
                            onChangeText={(text) => this.setState({ password_confirmation: text })}
                            value={password_confirmation}
                        />
                    </View>
                    <View>
                        <Input
                            placeholder="Phone"
                            keyboardType="phone-pad"
                            onChangeText={(text) => this.setState({ phone: text })}
                            value={phone}
                        />
                    </View>
                    <View style={{ marginBottom: 8 }}>
                        <CitySelector
                            cities={cities}
                            value={city}
                            onPressSearch={this.searchCity}
                            onSelect={(city) => this.setState({ city })}
                            onOpen={this.resetCities} />
                    </View>
                    <View>
                        <Input
                            placeholder="Address"
                            multiline={true}
                            onChangeText={(text) => this.setState({ address: text })}
                            value={address}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Button text="Next" lowerCase={true} onPress={this.nextStep} />
                    </View>
                </View>
            </ScrollView>
        );
    }
}
