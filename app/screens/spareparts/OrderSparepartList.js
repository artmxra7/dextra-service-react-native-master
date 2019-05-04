import React, { Component } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { connect } from "react-redux";

import SparepartHistoryItem from "../../components/SparepartHistoryItem";
import { styles } from "../../assets/styles/Style";
import Data from "../../config/Data";
import { fetchOrders } from "../../store/orders/Actions";
import { fetchCurrentOrder } from "../../store/currentOrder/Actions";
import { setCurrentOrderID } from "../../store/currentOrderID/Actions";

const data = new Data();

class OrderSparepartList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      api_token: null,
      user: null
    };

    this.detail = this.detail.bind(this);
  }

  async componentDidMount() {
    const { loadOrders } = this.props;
    const api_token = await data.select("api_token");
    const user = await data.select("user");

    this.setState({ api_token, user });
    loadOrders();
  }

  detail(historyID) {
    const { navigation, selectOrder, loadOrder } = this.props;

    selectOrder(historyID);
    loadOrder();
    navigation.navigate("SparepartListDetail", { historyID });
  }

  render() {
    const { histories, loadOrders, isProgress } = this.props;

    return (
      <View style={[styles.container]}>
        <ScrollView
          style={[styles.content, { padding: 2, backgroundColor: "#eee" }]}
          refreshControl={
            <RefreshControl refreshing={isProgress} onRefresh={loadOrders} />
          }
        >
          {histories.map(history => {
            let customer = history.user_member
              ? history.user_member.name
              : null;

            return (
              <SparepartHistoryItem
                key={history.id}
                date={history.created_at}
                totalPrice={history.total_price}
                status={history.status}
                customerName={customer}
                onPress={() => this.detail(history.id)}
              />
            );
          })}
          {histories.length === 0 && (
            <Text style={{ marginTop: 48, textAlign: "center" }}>
              You never order Products !
            </Text>
          )}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ orders }) => ({
  histories: orders.data,
  isProgress: orders.isLoading
});

const mapDispatchToProps = dispatch => ({
  loadOrders: () => dispatch(fetchOrders()),
  selectOrder: orderID => dispatch(setCurrentOrderID(orderID)),
  loadOrder: () => dispatch(fetchCurrentOrder())
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderSparepartList);
