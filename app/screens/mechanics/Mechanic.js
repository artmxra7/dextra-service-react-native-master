import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Alert,
    TouchableHighlight,
    TouchableOpacity,
    Picker,
    Image,
    PermissionsAndroid,
} from 'react-native';
import {
    Fab,
    Icon,
    Item,
    Grid,
    Col,
    Input,
} from 'native-base';

import MapView from 'react-native-maps';
import { NavigationActions } from 'react-navigation';

import { styles } from '../../assets/styles/Style';
import { Thumbnail } from 'native-base';
import Ref from '../../components/Ref';
import Link from '../../components/Link';
import List from '../../components/List';
import Button from '../../components/Button';
import LocationSelector from '../../components/LocationSelector';
import ModalLoading from '../../components/ModalLoading';
import Data from '../../config/Data';
import { config } from '../../config/Config';
import Axios from 'axios';

const data = new Data();

export default class Mechanic extends Component {
    constructor(props) {
        super(props);

        this.locationNextToken = '';

        this.state = {
            categories: [],
            locations: [],
            region: {
                latitude: -6.181935,
                longitude: 106.822616,
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
            },
            form: {
                category: '',
                job_description: '',
                location: null,
                location_description: '',
            },
            mechanics: [],
            isLoading: false,
        };

        this.isFormValid = this.isFormValid.bind(this);
        this.searchLocations = this.searchLocations.bind(this);
        this.centerOnUser = this.centerOnUser.bind(this);
        this.orderMechanic = this.orderMechanic.bind(this);
        this.getLocations = this.getLocations.bind(this);
        this.getMechanics = this.getMechanics.bind(this);
    }

    componentDidMount() {
        this.requestLocationPermissions(() => {
            this.getCurrentPosition();
        });

        this.getCategories();
    }

    async requestLocationPermissions(callback) {
        try {
            const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: 'Dextra Location Permission',
                message: 'Dextra need to access your location',
            });

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                alert('Location access granted !');
                callback();
            } else {
                alert('Location access not permitted !');
            }
        } catch (err) {
            console.warn(err)
        }
    }

    async getCategories() {
        const token = await data.select('api_token');

        try {
            let response = await Axios.get(config.url + 'job_categories');
            let categories = response.data.data;

            this.setState({ categories });
        } catch (error) {
            console.error(error);
        }
    }

    getCurrentPosition() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                let { latitude, longitude } = position.coords;

                this.map.animateToCoordinate(position.coords);
                this.getMechanics(latitude, longitude);

                this.setState((prevState) => ({
                    region: {
                        ...prevState.region,
                        latitude,
                        longitude,
                        error: null,
                    }
                }));
            },
            (error) => alert(error.message),
            // {
            //     enableHighAccuracy: false,
            //     timeout: 20000,
            //     maximumAge: 1000
            // },
        );
    }

    async getMechanics(latitude, longitude) {
        try {
            let response = await Axios.post(config.url + 'mechanics/by-radius', {
                latitude,
                longitude,
            });

            let mechanics = response.data.data;

            this.setState({ mechanics });
        } catch (error) {
            console.error(error.response);
        }
    }

    async getLocations(keyword = '', callback = null) {
        let {
            locations,
            region
        } = this.state;

        try {
            const { latitude, longitude } = region;
            const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
            const location = latitude + ',' + longitude;
            const radius = 50;
            const key = config.google_api_key;

            let response = await Axios.get(url, {
                params: {
                    location,
                    radius,
                    key,
                    keyword,
                    pagetoken: this.locationNextToken,
                }
            });

            let result = response.data;
            let locations = result.results;
            let newLocations = [];

            this.locationNextToken = result.next_page_token;

            this.setState((prevState) => {
                newLocations = [...prevState.locations, ...locations];

                return { locations: newLocations };
            }, () => {
                if (callback) callback(newLocations);
            });
        } catch (error) {
            console.error(error);
        }
    }

    searchLocations(keyword) {
        this.locationNextToken = '';
        this.setState({ locations: [] });
        this.getLocations(keyword);
    }

    centerOnUser() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.map.animateToCoordinate(position.coords);
            },
            (error) => alert(error.message),
            // {
            //     enableHighAccuracy: false,
            //     timeout: 20000,
            //     maximumAge: 1000
            // },
        );
    }

    isFormValid() {
        let {
            form,
        } = this.state;

        let errors = [];
        let field = form;

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

            return false;
        } else {
            return true;
        }
    }

    async orderMechanic() {
        let {
            form,
        } = this.state;

        if (!this.isFormValid()) return;

        this.setState({
            isLoading: true
        });

        try {
            let response = await Axios.post(config.url + 'jobs', {
                job_category_id: form.category,
                description: form.job_description,
                location_name: form.location.name,
                location_lat: form.location.geometry.location.lat,
                location_long: form.location.geometry.location.lng,
                location_description: form.location_description,
            });

            this.setState({
                isLoading: false
            });

            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'MechanicSearching' }),
                ]
            });

            this.props.navigation.dispatch(resetAction);
        } catch (error) {
            this.setState({
                isLoading: false
            });
            console.error(error.response);
            alert('Order failed. Please try again !');
        }
    }

    render() {
        let {
            region,
            categories,
            form,
            locations,
            mechanics,
            isLoading,
        } = this.state;

        return (
            <View style={[styles.container]}>
                <ModalLoading isOpen={isLoading} />
                <View style={localStyles.mapForm}>
                    <View style={styles.map_form}>
                        <View style={localStyles.item}>
                            <Picker
                                selectedValue={form.category}
                                onValueChange={(value) => {
                                    this.setState({
                                        form: {
                                            ...form,
                                            category: value
                                        }
                                    });
                                }}
                                style={localStyles.picker}>
                                <Picker.Item
                                    label="Select Category"
                                    value=""
                                    style={{ fontSize: 12 }} />
                                {categories.map((category) => {
                                    return (
                                        <Picker.Item
                                            key={category.id}
                                            label={category.name}
                                            value={category.id}
                                            style={{ fontSize: 12 }} />
                                    );
                                })}
                            </Picker>
                        </View>
                        <View style={localStyles.item}>
                            <Icon active name="md-create" color="#4099FF" style={{ fontSize: 16, marginRight: 8 }} />
                            <Input
                                multiline={true}
                                placeholder="Brand, Model, Serial Number, Permasalahan"
                                value={form.job_description}
                                style={{ fontSize: 12 }}
                                onChangeText={(value) => this.setState({
                                    form: {
                                        ...form,
                                        job_description: value
                                    }
                                })} />
                        </View>
                        <View style={localStyles.item}>
                            <Icon active name="md-pin" color="#4099FF" style={{ fontSize: 16 }} />
                            <LocationSelector
                                locations={locations}
                                value={form.location}
                                labelSize={12}
                                onSelect={(selected) => {
                                    this.setState({
                                        form: {
                                            ...form,
                                            location: selected
                                        },
                                        mechanics: [],
                                    });

                                    this.getMechanics(selected.geometry.location.lat, selected.geometry.location.lng);
                                }}
                                onOpen={() => {
                                    this.setState({ locations: [] });
                                    this.getLocations();
                                }}
                                onScrollEnd={() => {
                                    this.getLocations();
                                }}
                                onPressSearch={this.searchLocations} />
                        </View>
                        <View style={localStyles.item}>
                            <Icon active name="md-list-box" color="#4099FF" style={{ fontSize: 16, marginRight: 8 }} />
                            <Input
                                multiline={true}
                                placeholder="Jalan, Kota, Kec, RT/RW, No Blok Lokasi"
                                value={form.location_description}
                                style={{ fontSize: 12 }}
                                onChangeText={(value) => this.setState({
                                    form: {
                                        ...form,
                                        location_description: value
                                    }
                                })} />
                        </View>
                    </View>
                </View>

                <View style={localStyles.mapContainer}>
                    <MapView
                        ref={map => { this.map = map }}
                        style={styles.map}
                        showsUserLocation={true}
                        followUserLocation={true}
                        showsMyLocationButton={true}
                        zoomEnabled={true}
                        initialRegion={region}
                        onRegionChange={(region) => {
                            this.setState({ region });
                            this.marker.showCallout();
                        }}
                        onRegionChangeComplete={() => {
                            this.setState({ locations: [] });
                            this.getLocations();
                        }}>
                        <MapView.Marker
                            ref={marker => { this.marker = marker }}
                            coordinate={region}
                            pinColor="#ffb643"
                            onCalloutPress={(e) => {
                                this.setState({ locations: [] });
                                this.getLocations('', (locations) => {
                                    if (locations.length > 0) {
                                        const location = locations[0];

                                        this.setState({
                                            form: {
                                                ...form,
                                                location,
                                            },
                                            mechanics: [],
                                        });

                                        this.marker.hideCallout();
                                        this.getMechanics(location.geometry.location.lat, location.geometry.location.lng);
                                    } else {
                                        alert('Location not found');
                                    }
                                });
                            }}>
                            <MapView.Callout>
                                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontWeight: 'bold', textAlign: 'center'}}>
                                        Pick This
                                    </Text>
                                </View>
                            </MapView.Callout>
                        </MapView.Marker>
                        {mechanics.map((mechanic) => {
                            const location = {
                                latitude: parseFloat(mechanic.latitude),
                                longitude: parseFloat(mechanic.longitude),
                            };

                            return (
                                <MapView.Marker
                                    key={mechanic.id}
                                    coordinate={location}
                                    title={mechanic.name}>
                                    <Image
                                        source={require('../../assets/images/logo.png')}
                                        style={{ width: 32, height: 32 }} />
                                </MapView.Marker>
                            );
                        })}
                    </MapView>
                    <View style={styles.map_button}>
                        <Button text="Order" onPress={() => this.orderMechanic()} />
                    </View>
                    <Fab
                        style={{ backgroundColor: '#3E3C3C' }}
                        position="bottomLeft"
                        onPress={() => this.centerOnUser()}>
                        <Icon name="md-locate" />
                    </Fab>
                </View>
            </View>
        );
    }
}

const localStyles = StyleSheet.create({
    picker: {
        width: '100%',
    },
    mapContainer: {
        flex: 1,
    },
    mapForm: {
        position: 'relative',
        height: 220,
    },
    input: {
        fontSize: 32,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
    }
});
