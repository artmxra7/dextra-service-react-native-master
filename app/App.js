import React, { Component } from "react";
import { Provider } from "react-redux";
import { Stack } from "./config/Router";
import store from "./store/Store";

import FCM, { FCMEvent } from "react-native-fcm";
import moment from "moment";
import "moment/locale/id";

import { fetchOrders } from "./store/orders/Actions";
import { fetchJobs } from "./store/jobs/Actions";
import { fetchCurrentOrder } from "./store/currentOrder/Actions";
import { fetchCurrentJob } from "./store/currentJob/Actions";

moment.locale("id");

export default class App extends Component {
  componentDidMount() {
    this.notificationListener = FCM.on(FCMEvent.Notification, async notif => {
      if (notif.data) {
        const data = JSON.parse(notif.data);

        switch (data.notification_type) {
          case "CREATE_ORDER":
            // Fetch orders data for OrderSparepartList page
            store.dispatch(fetchOrders());
            break;

          case "CREATE_JOB":
            // Fetch jobs data for OrderMechanicList page
            store.dispatch(fetchJobs());
            break;

          case "UPDATE_ORDER":
          case "CREATE_PURCHASE":
            // Fetch current order data for SparepartListDetail page
            store.dispatch(fetchCurrentOrder());
            break;

          case "UPDATE_JOB":
            // Fetch current job data for MechanicHistoryDetail page
            store.dispatch(fetchCurrentJob());
            break;

          default:
            break;
        }
      }
    });
  }

  componentWillUnmount() {
    this.notificationListener.remove();
  }

  render() {
    return (
      <Provider store={store}>
        <Stack />
      </Provider>
    );
  }
}
