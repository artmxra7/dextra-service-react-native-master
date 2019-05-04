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

export default class ModalFormRequest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            product_brand: {
                name: '',
            },
            no_product: '',
            sn_product: '',
        };
    }

    render() {
        let {
            isOpen,
            onPressClose,
            onPressAdd,
        } = this.props;

        let {
            title,
            product_brand,
            no_product,
            sn_product,
        } = this.state;

        return (
            <Modal
                isVisible={isOpen}>
                <View style={styles.modal}>
                    <TouchableWithoutFeedback onPress={onPressClose}>
                        <View style={styles.close}>
                            <Icon
                                name="close"
                                type="font-awesome"
                                color="#ddd"
                                size={16} />
                        </View>
                    </TouchableWithoutFeedback>
                    <Text style={styles.modalTitle}>Request Product</Text>
                    <View style={{ flex: 1 }}>
                        <Input 
                            placeholder="Product Name"
                            value={title}
                            style={styles.input}
                            onChangeText={(title) => this.setState({ title })} />
                        <Input 
                            placeholder="Product Brand"
                            value={product_brand.name}
                            style={styles.input}
                            onChangeText={(name) => this.setState({ 
                                product_brand: { name }    
                            })} />
                        <Input 
                            placeholder="Part No"
                            value={no_product}
                            style={styles.input}
                            onChangeText={(no_product) => this.setState({ no_product })} />
                        <Input 
                            placeholder="Serial Number"
                            value={sn_product}
                            style={styles.input}
                            onChangeText={(sn_product) => this.setState({ sn_product })} />
                        <Button 
                            text="Add" 
                            style={{ marginTop: 32 }} 
                            onPress={() => {
                                onPressAdd(this.state);

                                this.setState({
                                    title: '',
                                    product_brand: {
                                        name: '',
                                    },
                                    no_product: '',
                                    sn_product: '',
                                });
                            }} />
                    </View>
                </View>
            </Modal>
        );
    }
}

ModalFormRequest.propTypes = {
    isOpen: PropTypes.bool,
    onPressClose: PropTypes.func,
    onPressAdd: PropTypes.func,
};

const styles = StyleSheet.create({
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
    close: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        borderWidth: 0.5,
        borderColor: '#bbb',
        borderRadius: 5,
        paddingHorizontal: 8,
        marginVertical: 8,
    }
});
