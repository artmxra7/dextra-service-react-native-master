import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  TextInput
} from "react-native";
import { Spinner } from "native-base";
import { connect } from "react-redux";
import { Icon } from "react-native-elements";
import MapView from "react-native-maps";
import Modal from "react-native-modal";
import moment from "moment";
import Axios from "axios";

import { styles } from "../../assets/styles/Style";
import { config } from "../../config/Config";

class MechanicHistoryDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        location_lat: -7.449452,
        location_long: 112.697036,
        user_member: {
          company: {}
        },
        job_category: {},
        status: ""
      },
      remarks: "",
      isProgress: false,
      isAcceptOffer: false,
      isModalOpen: false
    };

    this.viewOffer = this.viewOffer.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.getData(nextProps);
  }

  getData(nextProps) {
    const { data, isProgress } = nextProps;

    this.setState({
      isProgress,
      data
    });
  }

  viewOffer() {
    let { navigation } = this.props;
    let { quotation } = this.state.data;

    navigation.navigate("OfferViewer", { offer: quotation });
  }

  async changeStatus(status) {
    let { remarks } = this.state;
    let { state } = this.props.navigation;
    const historyID = state.params.historyID;

    try {
      let response = await Axios.put(config.url + "jobs/" + historyID, {
        status: status,
        remarks: remarks,
        fcm_type: "job_approve_reject"
      });

      let data = response.data.data;
      this.setState({ data });
    } catch (error) {
      console.error(error.response);
    }
  }

  openModal(status) {
    this.setState({
      isAcceptOffer: status == "quotation_agreed" ? true : false,
      isModalOpen: true
    });
  }

  renderBottomButton() {
    let { data } = this.state;
    let { width, height } = Dimensions.get("window");

    switch (data.status) {
      case "waiting":
        return (
          <View style={localStyles.bottomMenu}>
            <TouchableNativeFeedback
              onPress={() => this.changeStatus("cancel")}
            >
              <View style={[localStyles.bottomButton, { width }]}>
                <Text style={localStyles.bottomText}>Cancel Jobs</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        );
      case "quotation":
        return (
          <View style={localStyles.bottomMenu}>
            <TouchableNativeFeedback onPress={this.viewOffer}>
              <View style={[localStyles.bottomButton, { width: width / 3 }]}>
                <Text style={localStyles.bottomText}>View Offer</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
              onPress={() => this.openModal("quotation_rejected")}
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
              onPress={() => this.openModal("quotation_agreed")}
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
      case "quotation_rejected":
      case "quotation_agreed":
        return (
          <View style={localStyles.bottomMenu}>
            <TouchableNativeFeedback onPress={this.viewOffer}>
              <View style={[localStyles.bottomButton, { width }]}>
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
    let { data, isProgress, isModalOpen, isAcceptOffer, remarks } = this.state;

    let date = moment(data.created_at).format("dddd, Do MMM YYYY | h:mm:ss");
    let status = data.status.replace("_", " ");
    status = status.replace(/\b\w/g, char => char.toUpperCase());

    return (
      <View style={[styles.container]}>
        <ScrollView
          style={[styles.content, { padding: 2, backgroundColor: "#eee" }]}
        >
          {isProgress && (
            <View style={{ alignItems: "center" }}>
              <Spinner color="#333" />
            </View>
          )}
          {!isProgress && (
            <View style={{ padding: 18 }}>
              <View style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.5 }}>
                    <Text style={[styles.content_body_font, localStyles.label]}>
                      Customer Name
                    </Text>
                    <Text style={[styles.content_body_font, localStyles.value]}>
                      {data.user_member.name}
                    </Text>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <Text style={[styles.content_body_font, localStyles.label]}>
                      Customer Company
                    </Text>
                    <Text style={[styles.content_body_font, localStyles.value]}>
                      {data.user_member.company.name}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.5 }}>
                    <Text style={[styles.content_body_font, localStyles.label]}>
                      Job Category
                    </Text>
                    <Text style={[styles.content_body_font, localStyles.value]}>
                      {data.job_category.name}
                    </Text>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <Text style={[styles.content_body_font, localStyles.label]}>
                      Job Description
                    </Text>
                    <Text style={[styles.content_body_font, localStyles.value]}>
                      {data.description}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ marginBottom: 24 }}>
                <View>
                  <Text style={[styles.content_body_font, localStyles.label]}>
                    Location Name
                  </Text>
                  <Text style={[styles.content_body_font, localStyles.value]}>
                    {data.location_name}
                  </Text>
                </View>
              </View>
              <View style={{ marginVertical: 32 }}>
                <View>
                  <MapView
                    style={localStyles.map}
                    initialRegion={{
                      latitude: parseFloat(data.location_lat),
                      longitude: parseFloat(data.location_long),
                      latitudeDelta: 0,
                      longitudeDelta: 0
                    }}
                    loadingEnabled={true}
                  >
                    <MapView.Marker
                      title="Job Location"
                      key={1}
                      coordinate={{
                        longitude: parseFloat(data.location_long),
                        latitude: parseFloat(data.location_lat)
                      }}
                    />
                  </MapView>
                </View>
              </View>
              <View style={{ marginBottom: 24 }}>
                <View>
                  <Text style={[styles.content_body_font, localStyles.label]}>
                    Location Description
                  </Text>
                  <Text style={[styles.content_body_font, localStyles.value]}>
                    {data.location_description}
                  </Text>
                </View>
              </View>
              <View style={{ marginBottom: 24 }}>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 0.5 }}>
                    <Text style={[styles.content_body_font, localStyles.label]}>
                      Order Date
                    </Text>
                    <Text style={[styles.content_body_font, localStyles.value]}>
                      {date}
                    </Text>
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <Text style={[styles.content_body_font, localStyles.label]}>
                      Status Order
                    </Text>
                    <Text style={[styles.content_body_font, localStyles.value]}>
                      {status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
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
                  this.changeStatus("quotation_agreed");
                } else {
                  this.changeStatus("quotation_rejected");
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
  map: {
    height: 200
  },
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
  label: {
    fontSize: 14,
    fontWeight: "bold"
  },
  value: {
    fontSize: 16,
    color: "#555"
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

const mapStateToProps = ({ currentJob }) => ({
  data: currentJob.data,
  isProgress: currentJob.isLoading
});

export default connect(mapStateToProps)(MechanicHistoryDetail);
