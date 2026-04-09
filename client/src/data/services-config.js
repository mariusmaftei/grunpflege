import lawnCareImage from "../assets/images/services/lawn-care-maintenance.jpg";
import lawnCareHeroImage from "../assets/images/services/gartenpflege-gemaehter-rasen-bewaesserte-pflanzen.webp";
import lawnOverviewMowing from "../assets/images/services/rasenpflege-baum-gemaehter-rasen.webp";
import lawnOverviewRenewal from "../assets/images/services/rasen-erneuerung-neuer-rasen-verlegen.webp";
import treeTrimmingImage from "../assets/images/services/gaertner-klettert-baum-spezialausruestung.webp";
import treeOverviewPruning from "../assets/images/services/baum-beschnitten-saubere-aeste.webp";
import treeOverviewRemoval from "../assets/images/services/baum-entfernung-spezialausruestung.webp";
import plantingServicesImage from "../assets/images/services/planting-services.webp";
import plantingOverviewTrees from "../assets/images/services/baeume-gepflanzt-gehweg-kies-nachbarschaft.webp";
import plantingOverviewBeds from "../assets/images/services/blumen-gepflanzt-garten.webp";
import irrigationImage from "../assets/images/services/irigation-systems.webp";
import irrigationOverviewBeds from "../assets/images/services/gaertner-bewaesserungssystem-pflanzen.webp";
import irrigationOverviewLawn from "../assets/images/services/gaertner-bewaessert-rasen.webp";
import landscapingImage from "../assets/images/services/landscaping.webp";
import landscapingOverviewFront from "../assets/images/services/dekorativer-baum-vorgarten-nachbarschaft.webp";
import landscapingOverviewPaths from "../assets/images/services/gruener-garten-kiesweg-nachbarschaft.webp";
import seasonalCleaningImage from "../assets/images/services/seasonal-cleaning.jpg";
import seasonalOverviewSpring from "../assets/images/services/spring-garden-branch-cleaning.webp";
import seasonalOverviewLeaves from "../assets/images/services/rechen-trockene-blaetter-garten.webp";

export const SERVICE_DEFINITIONS = [
  {
    slug: "rasenpflege",
    i18nKey: "lawnCare",
    icon: "🌱",
    image: lawnCareImage,
    heroImage: lawnCareHeroImage,
    overviewImages: [lawnOverviewMowing, lawnOverviewRenewal],
  },
  {
    slug: "baumpflege",
    i18nKey: "treeTrimming",
    icon: "🌳",
    image: treeTrimmingImage,
    overviewImages: [treeOverviewPruning, treeOverviewRemoval],
  },
  {
    slug: "pflanzung",
    i18nKey: "planting",
    icon: "🌿",
    image: plantingServicesImage,
    overviewImages: [plantingOverviewTrees, plantingOverviewBeds],
  },
  {
    slug: "bewaesserung",
    i18nKey: "irrigation",
    icon: "💧",
    image: irrigationImage,
    overviewImages: [irrigationOverviewBeds, irrigationOverviewLawn],
  },
  {
    slug: "landschaftsbau",
    i18nKey: "landscaping",
    icon: "🪨",
    image: landscapingImage,
    overviewImages: [landscapingOverviewFront, landscapingOverviewPaths],
  },
  {
    slug: "saisonpflege",
    i18nKey: "seasonalCleaning",
    icon: "🍂",
    image: seasonalCleaningImage,
    overviewImages: [seasonalOverviewSpring, seasonalOverviewLeaves],
  },
];

export function getServiceBySlug(slug) {
  return SERVICE_DEFINITIONS.find((s) => s.slug === slug) ?? null;
}
