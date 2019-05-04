import React, { Component } from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import { Spinner } from 'native-base';

export default class ModalLoading extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {
            isOpen,
        } = this.props;

        return (
            <Modal isVisible={isOpen}>
                <View style={styles.container}>
                    <Spinner color="#333" />
                </View>
            </Modal>
        );
    }
}

ModalLoading.propTypes = {
    isOpen: PropTypes.bool,
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 20,
    },
});