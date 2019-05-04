import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image
} from 'react-native';
import {
    Spinner
} from 'native-base';
import Input from '../../components/Input';
import { styles } from '../../assets/styles/Style';
import Button from '../../components/Button';

import { NavigationActions } from 'react-navigation';

export default class MechanicSearching extends Component {
    constructor(props) {
        super(props);

        this.state = {
            time: 10,
        };

        this.timeID = null;
        this.history = this.history.bind(this);
        this.backOrder = this.backOrder.bind(this);
    }

    componentDidMount() {
        this.countdown();
    }

    componentWillUnmount() {
        clearInterval(this.timeID);
    }

    countdown() {
        let time = 0;

        this.timeID = setInterval(() => {
            this.setState((prevState) => {
                time = prevState.time - 1;
                return { time };
            }, () => {
                if (time == 0) {
                    clearInterval(this.timeID);
                    alert('You will get notification if mechanic was found, check history menu!');
                    this.history();
                }
            });
        }, 1000);
    }

    history() {
        let { navigate } = this.props.navigation;
        navigate('OrderMechanicList');
    }

    backOrder() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Mechanic' }),
            ]
        });

        this.props.navigation.dispatch(resetAction);
    }

    render() {
        let { time } = this.state;

        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Image
                        style={[styles.bg_excavators, { width: '115%' }]}
                        source={require('../../assets/images/bg-excavators.png')}
                    />
                    <Text style={{ fontSize: 18, color: '#333', textAlign: 'center' }}>We are looking for a mechanic for you</Text>
                    <Text style={{ fontSize: 24, color: '#333', textAlign: 'center' }}>Please waiting...</Text>
                    <Text style={{ fontSize: 32, color: '#333', textAlign: 'center' }}>{time}</Text>
                    <Spinner color="#333" />
                    <View style={styles.button_container}>
                        <Button text="Back" onPress={this.backOrder} />
                        <Button style={{marginTop: 32}} text="Go to History" onPress={this.history} />
                    </View>
                </View>
            </View>
        );
    }
}
