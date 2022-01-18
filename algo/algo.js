const CampaignsSchema = require("../models/Campaigns");
const CompaniesSchema = require("../models/Companies");

const MINIMUM_BUDGET = 5;

const rightBorder = 34.935701;
const leftBorder = 34.657605;
const bottomBorder = 31.844067;
const topBorder = 32.209666;

const algo = async (obj) => {
  const { area, promoterID } = obj;
  const areaCode = getAreaCode(area);
  if (areaCode === 0) return 0;
  let poolOfCampaigns = await getAllRelevantCampaign(areaCode);
  poolOfCampaigns = await removeCompaniesWithoutBalance(poolOfCampaigns);
  if (poolOfCampaigns.length === 0) return 0;
  if (poolOfCampaigns.length === 1) return poolOfCampaigns[0];
  const campaignToStream = sortCampaigns(poolOfCampaigns);
  //check how many times campaign was live
  //inject to history which promoter got which ad
  return campaignToStream;
};

const removeCompaniesWithoutBalance = async (campaigns) => {
  const companySet = new Set();
  campaigns.forEach((camp) => {
    const actualID = camp.company_id.toString();
    companySet.add(actualID);
  });

  const onlyPositive = await checkEachCompanyBalance(companySet);

  const campaignsWithPositiveBalance = campaigns.filter((camp) =>
    companySet.has(camp.company_id.toString())
  );

  return campaignsWithPositiveBalance;
};

const checkEachCompanyBalance = async (companySet) => {
  for (let id of companySet) {
    const company = await CompaniesSchema.findById(id);

    if (company.balance <= MINIMUM_BUDGET) {
      companySet.delete(id);
    }
  }

  return companySet;
};

const getAreaCode = (area) => {
  const { lat, lng } = area;
  if (lat > topBorder || lat < bottomBorder) return 0;
  if (lng > rightBorder || lng < leftBorder) return 0;
  if (lat > 32.124273) return 1;
  if (lat < 32.007744) return 3;
  return 2;
};

const sortCampaigns = (campaigns) => {
  const sortedByBid = campaigns.sort((a, b) => b.current_bid - a.current_bid);
  const topBid = sortedByBid[0].current_bid;
  const randomDecimal = Math.random();
  if (randomDecimal > 0.5) {
    const filteredByTopBid = sortedByBid.filter(
      (camp) => camp.current_bid === topBid
    );
    if (filteredByTopBid.length === 1) return filteredByTopBid[0];
    else {
      return filteredByTopBid.sort(() => Math.random() - 0.5)[0];
    }
    // }
    // if (randomDecimal > 0.3 && randomDecimal < 0.5) {
    //   const length = sortedByBid.length;
    //   const halfLength = Math.floor(length / 2);
    //   const filteredByTopBid = sortedByBid.filter(
    //     (camp) =>
    //       camp.current_bid < topBid &&
    //       camp.current_bid > sortedByBid[halfLength].current_bid
    //   );
  } else return campaigns.sort(() => Math.random() - 0.5)[0];
};

const getAllRelevantCampaign = async (area) => {
  const campaigns = await CampaignsSchema.find();
  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      (campaign.daily_budget > campaign.today_spent &&
        campaign.total_budget > campaign.total_spent &&
        campaign.area === 100 &&
        campaign.campaign_status === "Active") ||
      (campaign.daily_budget > campaign.today_spent &&
        campaign.total_budget > campaign.total_spent &&
        campaign.area === area &&
        campaign.campaign_status === "Active")
  );

  return filteredCampaigns;
};
module.exports = { algo };
