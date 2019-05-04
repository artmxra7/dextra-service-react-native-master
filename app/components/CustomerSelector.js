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

import CustomerItem from './CustomerItem';

export default class CustomerSelector extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            selected: null,
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
            selected,
            isOpen: false
        });

        onSelect(selected);
    }

    render() {
        let {
            customers
        } = this.props;

        let {
            isOpen,
            selected
        } = this.state;

        return (
            <TouchableNativeFeedback onPress={this.open}>
                <View style={styles.container}>
                    {selected ? (
                        <View style={{ width: '100%' }}>
                            <CustomerItem
                                key={selected.id}
                                name={selected.name}
                                email={selected.email}
                                registerDate={selected.created_at}
                                onPress={this.open} />
                        </View>
                    ) : (
                        <Text style={styles.nothing}>Select Customer</Text>
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
                            <Text style={styles.modalTitle}>Customers</Text>
                            <ScrollView style={{ flex: 1 }}>
                                {customers.map((customer) => {
                                    return (
                                        <CustomerItem
                                            style={styles.item}
                                            key={customer.id}
                                            name={customer.name}
                                            email={customer.email}
                                            registerDate={customer.created_at}
                                            onPress={() => this.select(customer)} />
                                    );
                                })}
                                {customers.length == 0 &&
                                    <Text style={styles.empty}>You don't have a customers T_T</Text>
                                }
                            </ScrollView>
                        </View>
                    </Modal>
                </View>
            </TouchableNativeFeedback>
        );
    }
}

CustomerSelector.propTypes = {
    customers: PropTypes.arrayOf(PropTypes.object),
    onOpen: PropTypes.func,
    onSelect: PropTypes.func,
    onClose: PropTypes.func,
};

CustomerSelector.defaultProps = {
    customers: [],
    onOpen: () => { },
    onClose: () => { },
    onSelect: () => { }
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 2,
        minHeight: 64,
        backgroundColor: 'white',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    nothing: {
        color: '#ffb643',
        fontWeight: 'bold'
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 24,
        paddingBottom: 32,
        height: 320,
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
    }
});
