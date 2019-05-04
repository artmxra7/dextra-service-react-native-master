import React, { Component } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { connect } from "react-redux";

import { styles } from "../../assets/styles/Style";
import JobHistoryItem from "../../components/JobHistoryItem";
import Data from "../../config/Data";
import { fetchJobs } from "../../store/jobs/Actions";
import { fetchCurrentJob } from "../../store/currentJob/Actions";
import { setCurrentJobID } from "../../store/currentJobID/Actions";

const data = new Data();

class OrderMechanicList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      api_token: null,
      user: null
    };
  }

  async componentDidMount() {
    const { loadJobs } = this.props;
    const api_token = await data.select("api_token");
    const user = await data.select("user");

    this.setState({ api_token, user });
    loadJobs();
  }

  detail(historyID) {
    const { navigation, selectJob, loadJob } = this.props;

    selectJob(historyID);
    loadJob();
    navigation.navigate("MechanicHistoryDetail", { historyID });
  }

  render() {
    const { histories, loadJobs, isProgress } = this.props;

    return (
      <View style={[styles.container]}>
        <ScrollView
          style={[styles.content, { padding: 2, backgroundColor: "#eee" }]}
          refreshControl={
            <RefreshControl refreshing={isProgress} onRefresh={loadJobs} />
          }
        >
          {histories.map(history => (
            <JobHistoryItem
              key={history.id}
              category={history.job_category.name}
              status={history.status}
              date={history.created_at}
              onPress={() => this.detail(history.id)}
            />
          ))}
          {histories.length === 0 && (
            <Text style={{ marginTop: 48, textAlign: "center" }}>
              You never order Jobs !
            </Text>
          )}
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = ({ jobs }) => ({
  histories: jobs.data,
  isProgress: jobs.isLoading
});

const mapDispatchToProps = dispatch => ({
  loadJobs: () => dispatch(fetchJobs()),
  selectJob: jobID => dispatch(setCurrentJobID(jobID)),
  loadJob: () => dispatch(fetchCurrentJob())
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderMechanicList);
