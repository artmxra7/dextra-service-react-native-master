import React, { Component } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import Axios from "axios";
import { styles } from "../../assets/styles/Style";
import Button from "../../components/Button";
import CustomerItem from "../../components/CustomerItem";
import { config } from "../../config/Config";

export default class Customer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customers: [],
      isProgress: false
    };

    this.getCustomers = this.getCustomers.bind(this);
  }

  componentDidMount() {
    this.getCustomers();
  }

  async getCustomers() {
    this.setState({ isProgress: true });

    try {
      let response = await Axios.get(config.url + "sales/customers");
      let customers = response.data.data;

      this.setState({ customers, isProgress: false });
    } catch (error) {
      console.error(error);
      this.setState({ isProgress: false });
    }
  }

  customerDetail(customerID) {
    this.props.navigation.navigate("CustomerDetail", { customerID });
  }

  redirect(route) {
    const { navigate } = this.props.navigation;
    navigate(route);
  }

  render() {
    const { customers, isProgress } = this.state;

    return (
      <View style={[styles.container]}>
        <ScrollView
          style={[
            styles.content,
            { padding: 0, paddingTop: 2, backgroundColor: "#eee" }
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isProgress}
              onRefresh={this.getCustomers}
            />
          }
        >
          {customers.map(customer => (
            <CustomerItem
              key={customer.id}
              name={customer.name}
              email={customer.email}
              registerDate={customer.created_at}
              onPress={() => this.customerDetail(customer.id)}
            />
          ))}
        </ScrollView>
        <View style={{ backgroundColor: "#4C4949", padding: 12 }}>
          <Button
            text="Create Customer"
            onPress={() => {
              this.redirect("CreateCustomer2");
            }}
          />
        </View>
      </View>
    );
  }
}
