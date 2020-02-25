import React, { useState } from "react"
import { View, Text, Image } from "react-native"
import { VoteButton, SkipButton } from "./VoteButton"
import { SafeAreaView, useSafeArea } from "react-native-safe-area-context"
import { StyledText } from "../StyledText"
import { useNavigation } from "@react-navigation/native"
import updateVotes from "../../db/updateVotes"
import { colors } from "../../constants/styles"
import { PieChart } from "react-native-svg-charts"
import Labels from "../../components/Labels"

// TODO: Reorganize these functions in a separate helper file
const createChartData = ({
  influencer,
  normal,
  competitor,
  totalNumVoters
}) => {
  const data = [
    {
      key: 3,
      amount: normal,
      svg: { fill: "#1563af" },
      totalNumVoters: totalNumVoters
    },
    {
      key: 2,
      amount: influencer,
      svg: { fill: "#dd8300" },
      totalNumVoters: totalNumVoters
    },
    {
      key: 1,
      amount: competitor,
      svg: { fill: "#f4f4f4" },
      totalNumVoters: totalNumVoters
    }
  ]
  return data
}

const VoteScreen = ({ roomData, userID, badge, handleNextRoom }) => {
  const [voteState, setVoteState] = useState({})
  const handlePress = async selection => {
    const roomID = roomData.id
    const voteResults = await updateVotes({
      roomID: roomID,
      selection: selection,
      userID: userID,
      badge: badge
    })
    setVoteState({
      ...voteState,
      selectedOption: selection,
      voteResults
    })

    /*
        Janky settimeout to show results for 1.5 seconds
    */

    const delay = 3000
    setTimeout(() => {
      handleNextRoom()
      setVoteState({})
    }, delay)
  }

  return roomData ? (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          alignItems: "center",
          flexDirection: "column",
          width: "100%"
        }}
      >
        <View style={{ padding: 25, maxHeight: 150 }}>
          <StyledText type="bold" size={23}>
            {roomData.room.meta_data.title}
          </StyledText>
        </View>
        <View style={{ width: "100%" }}>
          <View
            style={{
              flexDirection: "row"
            }}
          >
            <View
              style={{ alignItems: "center", flex: 1, marginHorizontal: 4 }}
            >
              <Image
                source={{ uri: roomData.room.optionA.picture }}
                style={{ width: 200, height: 300 }}
                resizeMode="contain"
              />
              {voteState.selectedOption === "A" && <YourVote />}
            </View>
            <View
              style={{ alignItems: "center", flex: 1, marginHorizontal: 4 }}
            >
              <Image
                source={{ uri: roomData.room.optionB.picture }}
                style={{ width: 200, height: 300 }}
                resizeMode="contain"
              />
              {voteState.selectedOption === "B" && <YourVote />}
            </View>
          </View>
          {voteState.voteResults ? (
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <PieChart
                  style={{ height: 200 }}
                  valueAccessor={({ item }) => item.amount}
                  data={createChartData({
                    influencer: voteState.voteResults.numInfluencersA,
                    normal: voteState.voteResults.numNormalA,
                    competitor: voteState.voteResults.scoreB,
                    totalNumVoters:
                      voteState.voteResults.numInfluencersA +
                      voteState.voteResults.numNormalA +
                      voteState.voteResults.scoreB
                  })}
                  spacing={0}
                  outerRadius={"95%"}
                >
                  <Labels />
                </PieChart>
              </View>
              <View style={{ flex: 1 }}>
                {/*TODO: Factor this out into a clean, separate Chart component*/}
                <PieChart
                  style={{ height: 200 }}
                  valueAccessor={({ item }) => item.amount}
                  data={createChartData({
                    influencer: voteState.voteResults.numInfluencersB,
                    normal: voteState.voteResults.numNormalB,
                    competitor: voteState.voteResults.scoreA,
                    totalNumVoters:
                      voteState.voteResults.numInfluencersA +
                      voteState.voteResults.numNormalA +
                      voteState.voteResults.scoreB
                  })}
                  spacing={0}
                  outerRadius={"95%"}
                  innerRadius={"45%"}
                >
                  <Labels />
                </PieChart>
              </View>
            </View>
          ) : (
            <View style={{ alignItems: "center", flexDirection: "column" }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  paddingHorizontal: 42,
                  justifyContent: "space-between"
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <StyledText type="bold" size={20} style={{ paddingTop: 10 }}>
                    Option A
                  </StyledText>
                  <VoteButton content="A" onPress={() => handlePress("A")} />
                </View>
                <View style={{ alignItems: "center" }}>
                  <StyledText type="bold" size={20} style={{ paddingTop: 10 }}>
                    Option B
                  </StyledText>
                  <VoteButton content="B" onPress={() => handlePress("B")} />
                </View>
              </View>
              <SkipButton onPress={handleNextRoom} style={{ marginTop: 16 }} />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  ) : (
    <Text>Loading...</Text>
  )
}

const YourVote = () => (
  <View
    style={{
      backgroundColor: "#fce3bd",
      width: "100%",
      alignItems: "center",
      paddingVertical: 8,
      marignTop: -8
    }}
  >
    <StyledText style={{ color: colors.MAIN_ORANGE }} type="bold">
      YOUR VOTE
    </StyledText>
  </View>
)
export default VoteScreen
