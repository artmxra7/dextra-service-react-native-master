import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Dimensions,
  TextInput
} from "react-native";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";
import moment from "moment";
import Axios from "axios";
import Modal from "react-native-modal";

import SparepartOrderItem from "../../components/SparepartOrderItem";
import { styles } from "../../assets/styles/Style";
import CustomerItem from "../../components/CustomerItem";
import Data from "../../config/Data";
import { config } from "../../config/Config";

import { currencyFormat, formatStatus } from "../../config/Helper";

const data = new Data();

class SparepartListDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      api_token: null,
      user: {},
      customer: {},
      detail: {},
      purchase: {},
      items: [],
      remarks: "",
      isModalOpen: false,
      isAcceptOffer: false,
      transferInfo: {}
    };

    this.changeStatus = this.changeStatus.bind(this);
    this.toItemDetail = this.toItemDetail.bind(this);
    this.viewOffer = this.viewOffer.bind(this);
    this.renderBottomButton = this.renderBottomButton.bind(this);
    this.paymentOrder = this.paymentOrder.bind(this);
    this.deliveryReceived = this.deliveryReceived.bind(this);
    this.openModal = this.openModal.bind(this);
    this.getTransferInfo = this.getTransferInfo.bind(this);
  }

  componentDidMount() {
    this.getUser();
    this.getTransferInfo();
  }

  componentWillReceiveProps(nextProps) {
    this.getDetail(nextProps);
  }

  async getUser() {
    const user = await data.select("user");

    if (user) {
      this.setState({ user });
    }
  }

  getDetail(nextProps) {
    const { currentOrder: detail } = nextProps;

    let purchase = { ...detail.purchase };
    let customer = { ...detail.user_member };
    let items = [...detail.order_products];

    delete detail.order_products;
    delete detail.purchase;
    delete detail.user_member;

    this.setState({
      customer,
      detail,
      items,
      purchase
    });
  }

  async getTransferInfo() {
    try {
      let response = await Axios.get(config.url + "settings/");
      let result = response.data.data;
      let transferInfo = {};

      for (let setting of result) {
        const key = setting.key.toLowerCase();
        transferInfo[key] = setting.value;
      }

      this.setState({ transferInfo });
    } catch (error) {
      console.error(error);
    }
  }

  cart() {
    this.props.navigation.navigate("Cart");
  }

  toItemDetail(itemID) {
    const { navigate } = this.props.navigation;
    navigate("SparepartDetail", { itemID });
  }

  viewOffer() {
    let { navigation } = this.props;
    let { purchase } = this.state;

    navigation.navigate("OfferViewer", { offer: purchase });
  }

  paymentOrder() {
    let { detail } = this.state;
    let { navigation } = this.props;
    const order_id = detail.id;
    const user_member_id = detail.user_member_id;

    navigation.navigate("SparepartPaymentOrder", { order_id, user_member_id });
  }

  async deliveryReceived() {
    let { state } = this.props.navigation;
    let historyID = state.params.historyID;

    try {
      let response = await Axios.post(config.url + "orders/" + historyID, {
        _method: "PATCH",
        status: "DELIVERY_RECEIVED"
      });

      let detail = { ...response.data.data };
      let purchase = { ...detail.purchase };
      let customer = { ...detail.user_member };
      let items = [...detail.order_products];

      delete detail.order_products;
      delete detail.purchase;
      delete detail.user_member;

      this.setState({
        customer,
        detail,
        items,
        purchase
      });
    } catch (error) {
      console.error(error);
    }
  }

  async changeStatus(status) {
    let { remarks } = this.state;
    let { state } = this.props.navigation;
    const historyID = state.params.historyID;

    try {
      let response = await Axios.put(config.url + "orders/" + historyID, {
        status: status,
        remarks: remarks
      });

      let detail = { ...response.data.data };
      let purchase = { ...detail.purchase };
      let customer = { ...detail.user_member };
      let items = [...detail.order_products];

      delete detail.order_products;
      delete detail.purchase;
      delete detail.user_member;

      this.setState({
        customer,
        detail,
        items,
        purchase
      });
    } catch (error) {
      console.error(error);
    }
  }

  openModal(status) {
    this.setState({
      isAcceptOffer: status == "OFFER_AGREED" ? true : false,
      isModalOpen: true
    });
  }

  renderBottomButton() {
    let { detail } = this.state;
    let { width, height } = Dimensions.get("window");

    switch (detail.status) {
      case "WAITING_OFFER":
        return (
          <View style={localStyles.bottomMenu}>
            <TouchableNativeFeedback
              onPress={() => this.changeStatus("ORDER_CANCELED")}
            >
              <View style={[localStyles.bottomButton, { width }]}>
                <Text style={localStyles.bottomText}>Cancel Order</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        );
      case "OFFER_RECEIVED":
        return (
          <View style={localStyles.bottomMenu}>
            <TouchableNativeFeedback onPress={this.viewOffer}>
              <View style={[localStyles.bottomButton, { width: width / 3 }]}>
                <Text style={localStyles.bottomText}>View Offer</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
              onPress={() => this.openModal("OFFER_REJECTED")}
            >
              <View
                style={[
                  localStyles.bottomButton,
                  { width: width / 3, backgroundColor: "#a50e0e" }
                ]}
              >
                <Text style={localStyles.bottomText}>Reject Offer</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
              onPress={() => this.openModal("OFFER_AGREED")}
            >
              <View
                style={[
                  localStyles.bottomButton,
                  { width: width / 3, backgroundColor: "#3ba50d" }
                ]}
              >
                <Text style={localStyles.bottomText}>Accept Offer</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        );
      case "OFFER_REJECTED":
      case "OFFER_AGREED":
        return (
          <View style={localStyles.bottomMenu}>
            <TouchableNativeFeedback onPress={this.viewOffer}>
              <View style={[localStyles.bottomButton, { width: width / 2 }]}>
                <Text style={localStyles.bottomText}>View Offer</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={this.paymentOrder}>
              <View
                style={[
                  localStyles.bottomButton,
                  { width: width / 2, backgroundColor: "#0c6fa5" }
                ]}
              >
                <Text style={localStyles.bottomText}>Payment Order</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        );
      case "DELIVERY_PROCESS":
        return (
          <View style={localStyles.bottomMenu}>
            <TouchableNativeFeedback onPress={this.viewOffer}>
              <View style={[localStyles.bottomButton, { width: width / 2 }]}>
                <Text style={localStyles.bottomText}>View Offer</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={this.deliveryReceived}>
              <View
                style={[
                  localStyles.bottomButton,
                  { width: width / 2, backgroundColor: "#0c6fa5" }
                ]}
              >
                <Text style={localStyles.bottomText}>Delivery Received</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        );
      case "ORDER_FINISHED":
        return (
          <View style={localStyles.bottomMenu}>
            <TouchableNativeFeedback onPress={this.viewOffer}>
              <View style={[localStyles.bottomButton, { width: width }]}>
                <Text style={localStyles.bottomText}>View Offer</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        );
      default:
        return null;
    }
  }

  render() {
    let {
      detail,
      items,
      isModalOpen,
      remarks,
      isAcceptOffer,
      user,
      customer,
      transferInfo
    } = this.state;

    let status = formatStatus(detail.status);
    let date = moment(detail.created_at).format("dddd, Do MMM YYYY | h:mm:ss");

    return (
      <View style={[styles.container, { flexDirection: "column" }]}>
        <ScrollView
          style={[styles.content, { padding: 2, backgroundColor: "#eee" }]}
        >
          <View>
            {items.map((item, index) => {
              return (
                <SparepartOrderItem
                  key={index}
                  onDetail={() => this.openDetail(item.id)}
                  name={item.product.title}
                  brand={item.product.product_brand.name}
                  photo={item.product.photo}
                  quantity={item.qty}
                  price={item.price}
                  onPress={() => this.toItemDetail(item.product.id)}
                />
              );
            })}
          </View>
          <View style={{ padding: 18 }}>
            <View style={{ marginBottom: 8 }}>
              <View>
                <Text
                  style={[
                    styles.content_body_font,
                    { fontSize: 16, fontWeight: "bold" }
                  ]}
                >
                  Total
                </Text>
                <Text
                  style={[
                    styles.content_body_font,
                    { fontSize: 24, fontWeight: "bold" }
                  ]}
                >
                  Rp. {currencyFormat(detail.total_price || 0)},-
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 24 }}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 0.5 }}>
                  <Text
                    style={[
                      styles.content_body_font,
                      { fontWeight: "bold", fontSize: 12 }
                    ]}
                  >
                    Order Date
                  </Text>
                  <Text style={[styles.content_body_font, { color: "#888" }]}>
                    {date}
                  </Text>
                </View>
                <View style={{ flex: 0.5 }}>
                  <Text
                    style={[
                      styles.content_body_font,
                      { fontSize: 12, fontWeight: "bold" }
                    ]}
                  >
                    Status Order
                  </Text>
                  <Text style={[styles.content_body_font, { color: "#888" }]}>
                    {status}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", marginTop: 16 }}>
                <View style={{ flex: 0.5 }}>
                  <Text
                    style={[
                      styles.content_body_font,
                      { fontWeight: "bold", fontSize: 12 }
                    ]}
                  >
                    Shipping
                  </Text>
                  <Text style={[styles.content_body_font, { color: "#888" }]}>
                    {detail.address}
                  </Text>
                </View>
                <View style={{ flex: 0.5 }}>
                  <Text
                    style={[
                      styles.content_body_font,
                      { fontSize: 12, fontWeight: "bold" }
                    ]}
                  >
                    City
                  </Text>
                  <Text style={[styles.content_body_font, { color: "#888" }]}>
                    {detail.city}
                  </Text>
                </View>
              </View>
              {user.role == "sales" && (
                <View style={{ marginTop: 32 }}>
                  <Text
                    style={[
                      styles.content_body_font,
                      {
                        fontSize: 12,
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: 8
                      }
                    ]}
                  >
                    Customer
                  </Text>
                  <CustomerItem
                    name={customer.name}
                    email={customer.email}
                    registerDate={customer.created_at}
                  />
                </View>
              )}
            </View>
            {(detail.status == "OFFER_AGREED" ||
              detail.status == "OFFER_REJECTED") && (
              <View style={{ marginTop: 24 }}>
                <Text
                  style={[
                    styles.content_body_font,
                    {
                      fontWeight: "bold",
                      fontSize: 12,
                      textAlign: "center",
                      marginVertical: 24
                    }
                  ]}
                >
                  Transfer to
                </Text>
                <View style={{ flexDirection: "row", marginBottom: 18 }}>
                  <View style={{ flex: 0.5 }}>
                    <Text
                      style={[
                        styles.content_body_font,
                        { fontWeight: "bold", fontSize: 12 }
                      ]}
                    >
                      Bank Name
                    </Text>
                    <Text style={[styles.content_body_font, { color: "#888" }]}>
                      {transferInfo.bank_name}
                    </Text>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <Text
                      style={[
                        styles.content_body_font,
                        { fontWeight: "bold", fontSize: 12 }
                      ]}
                    >
                      Bank Person Name
                    </Text>
                    <Text style={[styles.content_body_font, { color: "#888" }]}>
                      {transferInfo.bank_person_name}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text
                    style={[
                      styles.content_body_font,
                      { fontWeight: "bold", fontSize: 12 }
                    ]}
                  >
                    Bank Account
                  </Text>
                  <Text style={[styles.content_body_font, { color: "#888" }]}>
                    {transferInfo.bank_account}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
        <Modal
          isVisible={isModalOpen}
          onModalHide={() => this.setState({ isModalOpen: false })}
        >
          <View style={localStyles.modal}>
            <TouchableWithoutFeedback
              onPress={() => this.setState({ isModalOpen: false })}
            >
              <View style={localStyles.close}>
                <Icon name="close" type="font-awesome" color="#ddd" size={16} />
              </View>
            </TouchableWithoutFeedback>
            <Text style={{ fontWeight: "bold" }}>Reasons</Text>
            <TextInput
              underlineColorAndroid="transparent"
              multiline={true}
              autoFocus={true}
              autoCorrect={false}
              numberOfLines={5}
              onChangeText={remarks => {
                this.setState({ remarks });
              }}
              value={remarks}
              style={localStyles.remarks}
            />
            <TouchableNativeFeedback
              onPress={() => {
                if (!remarks) {
                  alert("Please give a reason about this !");
                  return;
                }

                if (isAcceptOffer) {
                  this.changeStatus("OFFER_AGREED");
                } else {
                  this.changeStatus("OFFER_REJECTED");
                }

                this.setState({
                  isModalOpen: false
                });
              }}
            >
              <View
                style={[
                  localStyles.largeButton,
                  { backgroundColor: isAcceptOffer ? "#3ba50d" : "#a50e0e" }
                ]}
              >
                <Text style={localStyles.largeButtonText}>
                  {isAcceptOffer ? "ACCEPT" : "REJECT"}
                </Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </Modal>
        {this.renderBottomButton()}
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  bottomMenu: {
    width: Dimensions.get("window").width,
    height: 48,
    flexDirection: "row"
  },
  bottomButton: {
    width: Dimensions.get("window").width / 3,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffb643",
    borderRightWidth: 0.5,
    borderRightColor: "#e5a43d",
    borderLeftWidth: 0.5,
    borderLeftColor: "#e5a43d"
  },
  bottomText: {
    fontSize: 12,
    color: "white"
  },
  modal: {
    backgroundColor: "white",
    height: 240,
    borderRadius: 5,
    padding: 16
  },
  remarks: {
    marginTop: 8,
    padding: 16,
    textAlignVertical: "top",
    flex: 1,
    borderWidth: 0.5,
    borderColor: "#bbb",
    borderRadius: 5
  },
  largeButton: {
    width: "100%",
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#363636",
    marginTop: 12,
    borderRadius: 4
  },
  largeButtonText: {
    fontSize: 14,
    color: "white"
  },
  close: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = ({ currentOrder }) => ({ currentOrder });

export default connect(mapStateToProps)(SparepartListDetail);
