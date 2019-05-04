import React, { Component } from 'react'
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TouchableNativeFeedback
} from 'react-native'
import Axios from 'axios';
import { Thumbnail } from 'native-base'
import Ref from '../../components/Ref'
import TabBar from '../../components/TabBar'
import { styles } from '../../assets/styles/Style'
import Link from '../../components/Link'
import List from '../../components/List'
import Button from '../../components/Button'
import { config } from '../../config/Config'
import Drawer from 'react-native-drawer'

export default class CustomerDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            customer: {
                company: {}
            }
        };
    }

    componentDidMount() {
        this.getCustomer();
    }

    async getCustomer() {
        let { customerID } = this.props.navigation.state.params;

        try {
            let response = await Axios.get(config.url + 'sales/customers/' + customerID);
            let customer = response.data.data;
            this.setState({ customer });
        } catch (error) {
            console.error(error);
        }
    }

    open() {
        this._drawer.open()
    }

    render() {
        let { customer } = this.state;

        const sideMenu = (
            <View>
                <Text>Hello world</Text>
            </View>
        )

        return (
            <Drawer
                content={sideMenu}
                ref={(ref) => this._drawer = ref}>
                <View style={[styles.container]}>
                    <ScrollView style={[styles.content, { padding: 20, backgroundColor: '#eee' }]}>
                        {/*Heading*/}
                        <View style={{ flex: 0.5, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                            {/*Image*/}
                            <View style={{ flex: 1, }}>
                                <Thumbnail square style={{ width: '100%', height: '100%', borderWidth: 1, borderColor: '#4C4949' }} source={require('../../assets/images/example.jpg')} />
                            </View>
                            {/*Text heading*/}
                            <View style={{ flex: 2, marginLeft: 12 }}>
                                {/*Top*/}
                                <View style={{ marginBottom: 8 }}>
                                    <Text style={[styles.content_body_font, { fontSize: 16, fontWeight: 'bold' }]}>{customer.company.name}</Text>
                                </View>
                                {/*Line*/}
                                <View style={{ height: 2, backgroundColor: '#4C4949', width: '100%', marginBottom: 8 }}>
                                </View>
                                {/*Bottom*/}
                                <View style={{ marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View>
                                        <Text style={[styles.content_body_font, localStyles.label]}>{customer.name}</Text>
                                        <Text style={[styles.content_header_italic]}>{customer.company.user_position_title}</Text>
                                    </View>
                                    <View>
                                        <TouchableNativeFeedback onPress={() => this.open()}>
                                            <View style={{ borderRadius: 2, backgroundColor: '#4C4949', width: '100%', marginTop: 2 }}>
                                                <Text style={{ fontSize: 12, paddingLeft: 10, paddingRight: 10, alignSelf: 'center', color: '#fff' }}>Edit Profile</Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/*Line*/}
                        <View style={{ height: 2, backgroundColor: '#4C4949', width: '100%', marginBottom: 8 }}>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {/*Col*/}
                            <View style={{ flex: 1, flexDirection: 'column', marginBottom: 24 }}>
                                <View style={{ justifyContent: 'flex-start', paddingTop: 4, paddingBottom: 4 }}>
                                    <Text style={[styles.content_body_font, localStyles.label]}>Bussiness Sector</Text>
                                    <Text style={[styles.content_body_font, { fontSize: 12 }]}>{customer.company.sector_business}</Text>
                                </View>
                                <View style={{ justifyContent: 'flex-start', paddingTop: 4, paddingBottom: 4 }}>
                                    <Text style={[styles.content_body_font, localStyles.label]}>Email Office</Text>
                                    <Text style={[styles.content_body_font, { fontSize: 12 }]}>{customer.company.email}</Text>
                                </View>
                            </View>
                            {/*Col*/}
                            <View style={{ flex: 1, flexDirection: 'column' }}>
                                <View style={{ justifyContent: 'flex-start', paddingTop: 4, paddingBottom: 4 }}>
                                    <Text style={[styles.content_body_font, localStyles.label]}>Phone Office</Text>
                                    <Text style={[styles.content_body_font, { fontSize: 12 }]}>{customer.company.phone}</Text>
                                </View>
                                <View style={{ justifyContent: 'flex-start', paddingTop: 4, paddingBottom: 4 }}>
                                    <Text style={[styles.content_body_font, localStyles.label]}>Address Office</Text>
                                    <Text style={[styles.content_body_font, { fontSize: 12 }]}>{customer.company.address}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Drawer>
        )
    }
}

const localStyles = StyleSheet.create({
    label: {
        fontWeight: 'bold',
        fontSize: 12,
    }
});