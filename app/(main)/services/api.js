import axios from "axios";


export const recordGameStats = async (protocolType, playersCount) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/record_game_statistic/`, {
      protocol_type: protocolType,
      players_count: playersCount,
    });
    return response.data;
  } catch (error) {
    console.error("Error recording game stats:", error);
    throw error;
  }
};
