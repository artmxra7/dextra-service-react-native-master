import React from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { styles } from "../../assets/styles/Style";

import CommisionItem from "../../components/CommisionItem";

const Commision = ({ screenProps }) => {
  const { commisions, isProgress, getData } = screenProps;

  return (
    <View style={[styles.container]}>
      <ScrollView
        style={[
          styles.content,
          { padding: 0, paddingTop: 2, backgroundColor: "#eee" }
        ]}
        refreshControl={
          <RefreshControl refreshing={isProgress} onRefresh={getData} />
        }
      >
        {commisions.map(commision => {
          return (
            <CommisionItem
              key={commision.id}
              date={commision.created_at}
              type={commision.type}
              amount={commision.amount}
              description={commision.description}
            />
          );
        })}
        {commisions.length === 0 && (
          <Text style={{ textAlign: "center", marginTop: 48 }}>
            You don't have any commisions
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Commision;
