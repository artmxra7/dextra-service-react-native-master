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

export default class LocationSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            keyword: '',
        };

        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.select = this.select.bind(this);
        this.scroll = this.scroll.bind(this);
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

    scroll(e) {
        let {
            onScrollEnd
        } = this.props;

        let layoutHeight = e.nativeEvent.layoutMeasurement.height;
        let height = e.nativeEvent.contentSize.height;
        let offset = e.nativeEvent.contentOffset.y;
        let isEnd = layoutHeight + offset >= height;

        if (isEnd) {
            onScrollEnd();
        }
    }

    render() {
        let {
            value,
            locations,
            labelSize,
            onPressSearch,
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
                            <View style={[styles.location, { borderBottomWidth: 0, paddingVertical: 0 }]}>
                                <Text style={styles.locationName}>{value.name}</Text>
                                <Text style={styles.locationVicinity}>{value.vicinity}</Text>
                            </View>
                        </View>
                    ) : (
                        <Text style={[styles.nothing, { fontSize: labelSize }]}>Your Location</Text>
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
                            <Text style={styles.modalTitle}>Locations</Text>
                            <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 8 }}>
                                <Input
                                    placeholder="Search your location"
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
                            <ScrollView style={{ flex: 1 }} onScroll={this.scroll}>
                                {locations.map((location, index) => {
                                    return (
                                        <TouchableNativeFeedback
                                            key={index}
                                            onPress={() => this.select(location)}>
                                            <View style={styles.location}>
                                                <Text style={styles.locationName}>{location.name}</Text>
                                                <Text style={styles.locationVicinity}>{location.vicinity}</Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    );
                                })}
                                {locations.length == 0 &&
                                    <Text style={styles.empty}>Your locations was not found T_T</Text>
                                }
                            </ScrollView>
                        </View>
                    </Modal>
                </View>
            </TouchableNativeFeedback>
        );
    }
}

LocationSelector.propTypes = {
    locations: PropTypes.arrayOf(PropTypes.object),
    value: PropTypes.object,
    labelSize: PropTypes.number,
    onOpen: PropTypes.func,
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
    onScrollEnd: PropTypes.func,
    onPressSearch: PropTypes.func,
};

LocationSelector.defaultProps = {
    locations: [],
    value: null,
    labelSize: 16,
    onOpen: () => { },
    onClose: () => { },
    onSelect: () => { },
    onScrollEnd: () => { },
    onPressSearch: () => { },
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 16
    },
    nothing: {
        color: '#555',
        fontSize: 16,
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
    location: {
        width: '100%',
        borderBottomWidth: 0.5,
        borderBottomColor: '#eee',
        paddingVertical: 8,
    },
    locationName: {
        fontWeight: 'bold',
        color: '#363636',
    },
    locationVicinity: {
        color: '#bbb',
        fontSize: 11,
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
