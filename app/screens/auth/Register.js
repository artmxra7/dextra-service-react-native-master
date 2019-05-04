import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    TouchableNativeFeedback,
    ScrollView,
    Alert
} from 'react-native';
import {Spinner} from 'native-base';
import {styles} from '../../assets/styles/Style';
import Button from '../../components/Button';
import Input from '../../components/Input';
import axios from 'axios';
import {config} from '../../config/Config';
import Modal from 'react-native-modal';

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            error: [],
            modalVisible: false
        };
    }

    redirect(route) {
        this.props.navigation.navigate(route);
    }

    async checkConnection() {
        try {
            this.setState({modalVisible:true})
            let response = await fetch(config.url + 'activate', {
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
                    'accept' : 'application/json',
                },
            });

            this.formRegister();
        } catch (error) {
            this.setState({modalVisible:false})
            console.error(error);
            Alert.alert('Pastikan anda terhubung dengan internet');
        }
    }

    async formRegister() {
        try {
            this.setState({modalVisible:true})
            let response = await fetch(config.url + 'register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
                body: JSON.stringify({
                     name: this.state.name,
                     email: this.state.email,
                     password: this.state.password,
                     password_confirmation: this.state.password_confirmation,
                }),
            });
            let res = await response.json();

            if (res.success == false) {
                let error = JSON.stringify(res);
                throw error;
            }else {
                this.redirect('ConfirmRegister');
            }
            this.setState({modalVisible:false});
        } catch(errors) {
            let formErrors = JSON.parse(errors);
            let errorsArray = [];

            for (var key in formErrors.data) {
                if (formErrors.data[key].length >= 1) {
                    formErrors.data[key].map(error => errorsArray.push(`${error}`));
                }else{
                    errorsArray.push('');
                }
            }

            this.setState({error:errorsArray, modalVisible: false});
        }
    }

    render() {
        return (
            <ScrollView style={{backgroundColor:'#ffb643'}}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        {/*logo*/}
                        <Image
                            style={styles.logo}
                            source={require('../../assets/images/logo.png')}
                            resizeMode="contain"
                        />
                        {/*header text*/}
                        <Text style={styles.header_text}>
                            {/*content text*/}
                            <Text style={styles.content_text}>Selamat datang di {'\n'}</Text>
                            {/*header text big*/}
                            <Text style={styles.header_text_big}>D’extra Service Apps {'\n'}</Text>
                            {/*header text small*/}
                            <Text style={styles.header_text_small}>By PT Dextratama Nitya
                            Sanjaya</Text>
                        </Text>
                    </View>
                    {/*Content*/}
                    <View style={styles.content}>
                        <View style={{backgroundColor:'#fff', marginBottom: 20}}>
                            <Errors errors={this.state.error}/>
                        </View>
                        {/*input*/}
                        <View>
                            <Input
                              placeholder="Fullname"
                              autoCapitalize="words"
                              value={this.state.name}
                              onChangeText={(text) => this.setState({name:text})}
                            />
                            <Input
                              placeholder="Email"
                              keyboardType="email-address"
                              value={this.state.email}
                              onChangeText={(text) => this.setState({email:text})}
                            />
                            <Input
                              placeholder="Password"
                              secureTextEntry={true}
                              value={this.state.password}
                              onChangeText={(text) => this.setState({password:text})}
                            />
                            <Input
                              placeholder="Password Confirmation"
                              secureTextEntry={true}
                              value={this.state.password_confirmation}
                              onChangeText={(text) => this.setState({password_confirmation:text})}
                            />
                        </View>
                        <View style={styles.button_container}>
                            <Button text="Register" onPress={() => {this.formRegister()}}/>
                            <Text style={{marginTop: 5, textAlign: 'center'}} onPress={() => this.redirect('ConfirmRegister')}>Aktivasi Akun</Text>
                        </View>
                    </View>
                </View>
                <Modal
                  style={{height:40}}
                  isVisible={this.state.modalVisible}
                >
                    <View style={{backgroundColor:'#fff', alignItems:'center', padding:20}}>
                        <Spinner color="#333"/>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const Errors = (props) => {
    return(
        <View>
            {props.errors.map((error, i) => <Text key={i} style={{textAlign:'center', color:'red'}}> {error} </Text>)}
        </View>
    )
}
