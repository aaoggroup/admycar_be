//import getAllCampaignsFromDB from db util

export const algo = (obj) => {
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

const getAllRelevantCampaign = (area) => {
  //getAllRelvevantCampaignsFromDB(conditions)
  const campaigns = getAllCampaignsFromDB(area);
};

//
