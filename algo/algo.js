//import getAllCampaignsFromDB from db util
const CampaignsSchema = require("../models/Campaigns");

const algo = (obj) => {
  const { area, promoterID } = obj;
  const poolOfCampaigns = getAllRelevantCampaign(area);
  const sortedCampaigns = sortCampaigns(poolOfCampaigns);
  //check how many times campaign was live
  // randomize if was already
  //inject to history which promoter got which ad
  return sortedCampaigns[0];
};

const sortCampaigns = (campaigns) => {
  const sortedCampaigns = campaigns.map((a, b) => a.bid - b.bid);
  return sortedCampaigns;
};

const getAllRelevantCampaign = async (area) => {
  //getAllRelvevantCampaignsFromDB(conditions)

  const campaigns = await CampaignsSchema.find();
  const filteredCampaigns = campaigns.filter((camp) => "xx");
  console.log(campaigns);
};
module.exports = { algo, getAllRelevantCampaign };

//

/*
daily 20
1
daily 19
2
daily 17



SELECT * FROM CAMPAIGNS WHERE DAILYBUDGET(20) < TODAYSSPENT(21)



putAssetOnMonitor
ChargeTheCompany
addToCampaignTodaySpentTheBid
*/

/*

  const campaigns = await CampaignsSchema.find({
    area: area,
    campaign_status: "Active",
    $where: "this.daily_budget > this.today_spent",
  });

  */
