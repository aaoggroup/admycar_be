//import getAllCampaignsFromDB from db util
const CampaignsSchema = require("../models/Campaigns");

const algo = async (obj) => {
  const { area, promoterID } = obj;
  const poolOfCampaigns = await getAllRelevantCampaign(area);
  const campaignToStream = sortCampaigns(poolOfCampaigns);
  console.log(campaignToStream);
  //check how many times campaign was live
  //inject to history which promoter got which ad
  return campaignToStream;
};

const sortCampaigns = (campaigns) => {
  const sortedByBid = campaigns.sort((a, b) => b.current_bid - a.current_bid);
  const topBid = sortedByBid[0].current_bid;
  const randomDecimal = Math.random();
  console.log(randomDecimal);
  if (randomDecimal > 0.3) {
    const filteredByTopBid = sortedByBid.filter(
      (camp) => camp.current_bid === topBid
    );
    if (filteredByTopBid.length === 1) return filteredByTopBid[0];
    else {
      return filteredByTopBid.sort(() => Math.random() - 0.5)[0];
    }
  } else return campaigns.sort(() => Math.random() - 0.5)[0];
};

const getAllRelevantCampaign = async (area) => {
  const campaigns = await CampaignsSchema.find();
  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.daily_budget > campaign.today_spent &&
      // campaign.area === area &&
      campaign.campaign_status === "Active"
  );

  return filteredCampaigns;
};
module.exports = { algo };

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
