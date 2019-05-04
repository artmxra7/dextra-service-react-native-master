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
import ImagePicker from 'react-native-image-picker';
import { config } from '../../config/Config';

const data = new Data();

export default class CreateCustomer1 extends Component {
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
            // profile_photo: require('../../assets/images/user.jpg'),
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
            // profile_photo
        } = this.state;

        let { navigation } = this.props;
        let { state } = navigation;
        let member = state.params.member;
        const token = await data.select('api_token');

        try {
            let response = await fetch(config.url + 'sales/customers', {
                method: 'POST',
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
                        user_sales_id: user.id
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

            navigation.navigate('CustomerRouter');
        } catch (errors) {
            console.error(errors);
        }
    }

    redirect(route) {
        const { navigate } = this.props.navigation;
        navigate(route);
    }

    uploadPhoto() {
        var options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker((response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let source = {
                    uri: response.uri,
                };

                this.setState({ profile_photo: source });
            }
        })
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
                {/*Header*/}
                <View style={{ alignItems: 'center', marginBottom: 18 }}>
                    <Text style={{ fontWeight: 'bold', color: '#363636' }}>Data Company</Text>
                </View>
                {/*Content*/}
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
                    {/*Photo profile*/}
                    {/* <View style={{ width: '50%', paddingLeft: 12, paddingRight: 12 }}>
                        <TouchableOpacity onPress={() => this.uploadPhoto()}>
                            <Image source={this.state.profile_photo}
                                style={{ width: 100, height: 100, borderRadius: 3, padding: 2 }}
                            />
                        </TouchableOpacity>
                    </View> */}
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
                        <Button text="Cancel" lowerCase={true} onPress={navigation.goBack} />
                    </View>
                    <View style={{ width: 80 }}>
                        <Button text="Submit" lowerCase={true} onPress={this.submit} />
                    </View>
                </View>
            </ScrollView>
        );
    }

}
