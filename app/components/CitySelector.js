import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { Icon } from 'react-native-elements';
import Input from './Input';
import Button from './Button';

export default class CitySelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            keyword: '',
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.select = this.select.bind(this);
    }

    open() {
        let {
            onOpen
        } = this.props;

        this.setState({ isOpen: true });
        onOpen();
    }

    close() {
        let {
            onClose
        } = this.props;

        this.setState({ isOpen: false });
        onClose();
    }

    select(selected) {
        let {
            onSelect
        } = this.props;

        this.setState({
            isOpen: false
        });

        onSelect(selected);
    }

    render() {
        let {
            value,
            cities,
            onPressSearch
        } = this.props;

        let {
            isOpen,
            keyword
        } = this.state;

        return (
            <TouchableNativeFeedback onPress={this.open}>
                <View style={styles.container}>
                    {value ? (
                        <View style={{ width: '100%' }}>
                            <View style={[styles.city, { borderBottomWidth: 0, paddingVertical: 0 }]}>
                                <Text>{value}</Text>
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.nothing}>Your City</Text>
                    )}

                    <Modal
                        isVisible={isOpen}>
                        <View style={styles.modal}>
                            <TouchableWithoutFeedback onPress={this.close}>
                                <View style={styles.close}>
                                    <Icon
                                        name="close"
                                        type="font-awesome"
                                        color="#ddd"
                                        size={16} />
                                </View>
                            </TouchableWithoutFeedback>
                            <Text style={styles.modalTitle}>Cities</Text>
                            <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 8 }}>
                                <Input
                                    placeholder="Search your city"
                                    style={styles.searchbox}
                                    onChangeText={(keyword) => this.setState({ keyword })}
                                    onSubmitEditing={() => onPressSearch(keyword)} />
                                <TouchableNativeFeedback
                                    onPress={() => onPressSearch(keyword)}>
                                    <View style={styles.searchButton}>
                                        <Icon
                                            name="search"
                                            type="font-awesome"
                                            color="white"
                                            size={16} />
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                            <ScrollView style={{ flex: 1 }}>
                                {cities.map((city, index) => {
                                    return (
                                        <TouchableNativeFeedback
                                            key={index}
                                            onPress={() => this.select(city)}>
                                            <View style={styles.city}>
                                                <Text style={styles.cityName}>{city}</Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    );
                                })}
                                {cities.length == 0 &&
                                    <Text style={styles.empty}>Your city was not found T_T</Text>
                                }
                            </ScrollView>
                        </View>
                    </Modal>
                </View>
            </TouchableNativeFeedback>
        );
    }
}

CitySelector.propTypes = {
    cities: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.string,
    onOpen: PropTypes.func,
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
    onPressSearch: PropTypes.func,
};

CitySelector.defaultProps = {
    locations: [],
    value: null,
    onOpen: () => { },
    onClose: () => { },
    onSelect: () => { },
    onPressSearch: () => { },
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderRadius: 2,
    },
    nothing: {
        color: '#555',
        fontSize: 14,
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 24,
        paddingBottom: 32,
        height: 480,
    },
    modalTitle: {
        fontWeight: 'bold',
        color: '#363636',
        textAlign: 'center',
        marginBottom: 16,
    },
    empty: {
        textAlign: 'center',
        marginTop: 32,
    },
    item: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee'
    },
    close: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center'
    },
    city: {
        width: '100%',
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
        paddingVertical: 8,
    },
    cityName: {
        fontWeight: 'bold',
        color: '#363636',
    },
    searchbox: {
        flex: 0.75,
        borderWidth: 0.5,
        borderColor: '#ccc',
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    searchButton: {
        flex: 0.25,
        backgroundColor: '#ffb643',
        marginLeft: 2,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
