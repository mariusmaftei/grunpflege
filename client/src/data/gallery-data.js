// This is a centralized data store for all gallery images
// It can be used by both gallery.js and infinite-image-carousel.jsx

const galleryData = {
  // Garden Design images
  gardens: [
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Fgardens%2Fflowers1.webp?alt=media&token=c269b9c7-9a97-4049-a496-c7ce80d827c9",
      alt: "gardenDescriptions.perennialPath",
      description: "gardenDescriptions.perennialPath",
      format: "wide",
      width: 450,
      category: "gardens",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Fgardens%2Fflowers2.webp?alt=media&token=b4a319f7-7737-41c1-bb86-6d773fecc047",
      alt: "gardenDescriptions.japaneseGarden",
      description: "gardenDescriptions.japaneseGarden",
      format: "square",
      width: 280,
      category: "gardens",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Fgardens%2Fflowers3.webp?alt=media&token=3d513eda-1727-4791-805a-37c309ffc175",
      alt: "gardenDescriptions.formalTulip",
      description: "gardenDescriptions.formalTulip",
      format: "normal",
      width: 350,
      category: "gardens",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Fgardens%2Fflowers4.webp?alt=media&token=b1ff5075-112b-449b-b8b5-32d85f4bdb49",
      alt: "gardenDescriptions.stoneBorder",
      description: "gardenDescriptions.stoneBorder",
      format: "wide",
      width: 450,
      category: "gardens",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Fgardens%2Fflowers5.webp?alt=media&token=a5e6387a-e322-48ea-9c59-f440ed8462aa",
      alt: "gardenDescriptions.luxuryEstate",
      description: "gardenDescriptions.luxuryEstate",
      format: "square",
      width: 280,
      category: "gardens",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Fgardens%2Fflowers6.webp?alt=media&token=f686f813-42d9-4156-aa8a-7fdfb1311d39",
      alt: "gardenDescriptions.springPlanning",
      description: "gardenDescriptions.springPlanning",
      format: "normal",
      width: 350,
      category: "gardens",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Fgardens%2Fflowers7.webp?alt=media&token=50c27ff0-2a89-4ef0-9721-7a3315e0cb26",
      alt: "gardenDescriptions.springRevitalization",
      description: "gardenDescriptions.springRevitalization",
      format: "wide",
      width: 450,
      category: "gardens",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Fgardens%2Fflowers8.webp?alt=media&token=091e49d6-dacf-481a-8c25-e3f8034d898c",
      alt: "gardenDescriptions.cottageDesign",
      description: "gardenDescriptions.cottageDesign",
      format: "square",
      width: 280,
      category: "gardens",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Fgardens%2Fflowers9.webp?alt=media&token=b383b17c-9192-4f6e-a7d6-2addc7f5cce7",
      alt: "gardenDescriptions.ecoFriendly",
      description: "gardenDescriptions.ecoFriendly",
      format: "normal",
      width: 350,
      category: "gardens",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Fgardens%2Fflowers10.webp?alt=media&token=d192ff34-4c3f-47ad-abf1-462f1299ee4e",
      alt: "gardenDescriptions.colorfulSpring",
      description: "gardenDescriptions.colorfulSpring",
      format: "wide",
      width: 450,
      category: "gardens",
    },
  ],

  // Lawn Care images
  lawns: [
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Flawns%2Flawn1.webp?alt=media&token=fd020ad0-3251-419d-b9f6-89546771d565",
      alt: "lawnDescriptions.premiumInstallation",
      description: "lawnDescriptions.premiumInstallation",
      format: "square",
      width: 280,
      category: "lawns",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Flawns%2Flawn2.webp?alt=media&token=186bf0ad-2be5-4c01-aadf-e9fba2b00eb0",
      alt: "lawnDescriptions.droughtResistant",
      description: "lawnDescriptions.droughtResistant",
      format: "wide",
      width: 450,
      category: "lawns",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Flawns%2Flawn3.webp?alt=media&token=61536266-3534-4fe4-a65f-481fd4b7940c",
      alt: "lawnDescriptions.ornamentalGrass",
      description: "lawnDescriptions.ornamentalGrass",
      format: "normal",
      width: 350,
      category: "lawns",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Flawns%2Flawn4.webp?alt=media&token=7f372776-f2b5-408f-b425-8e565db35457",
      alt: "lawnDescriptions.professionalCare",
      description: "lawnDescriptions.professionalCare",
      format: "square",
      width: 280,
      category: "lawns",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Flawns%2Flawn5.webp?alt=media&token=bfe62c7a-915b-4eec-9f5a-7c65952f2d40",
      alt: "lawnDescriptions.completeRenovation",
      description: "lawnDescriptions.completeRenovation",
      format: "wide",
      width: 450,
      category: "lawns",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Flawns%2Flawn6.webp?alt=media&token=0e9d5dfe-6964-4f6f-bd84-bac32d959f38",
      alt: "lawnDescriptions.premiumInstallation",
      description: "lawnDescriptions.premiumInstallation",
      format: "normal",
      width: 350,
      category: "lawns",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Flawns%2Flawn7.webp?alt=media&token=d5b41eb9-a5d0-4b37-99e3-c912a4181004",
      alt: "lawnDescriptions.residentialInstallation",
      description: "lawnDescriptions.residentialInstallation",
      format: "square",
      width: 280,
      category: "lawns",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Flawns%2Flawn8.webp?alt=media&token=e89c4d8a-955b-4796-9e5f-04fcebe1dcac",
      alt: "lawnDescriptions.ecoFriendlyCare",
      description: "lawnDescriptions.ecoFriendlyCare",
      format: "wide",
      width: 450,
      category: "lawns",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Flawns%2Flawn9.webp?alt=media&token=17738025-9783-4b8b-9699-7691c5c37635",
      alt: "lawnDescriptions.seasonalTreatment",
      description: "lawnDescriptions.seasonalTreatment",
      format: "normal",
      width: 350,
      category: "lawns",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Flawns%2Flawn10.webp?alt=media&token=5051252d-0544-4099-a97c-17f812bbaeb9",
      alt: "lawnDescriptions.aerationFertilization",
      description: "lawnDescriptions.aerationFertilization",
      format: "square",
      width: 280,
      category: "lawns",
    },
  ],

  // Tree Planting images
  trees: [
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Ftrees%2Flawn1.webp?alt=media&token=91df6d38-33b8-4e49-a6bc-f63545921d25",
      alt: "treeDescriptions.expertPlanting",
      description: "treeDescriptions.expertPlanting",
      format: "normal",
      width: 350,
      category: "trees",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Ftrees%2Flawn2.webp?alt=media&token=e75cf982-3a38-4a16-ab42-4996482d64d5",
      alt: "treeDescriptions.matureTrees",
      description: "treeDescriptions.matureTrees",
      format: "wide",
      width: 450,
      category: "trees",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Ftrees%2Flawn3.webp?alt=media&token=5fa9d8cb-b527-442f-88dc-4b70e39609d7",
      alt: "treeDescriptions.ornamentalSelection",
      description: "treeDescriptions.ornamentalSelection",
      format: "square",
      width: 280,
      category: "trees",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Ftrees%2Flawn4.webp?alt=media&token=b8fbf5d6-3235-44e6-9ef8-ee72ad1d044e",
      alt: "treeDescriptions.properTechniques",
      description: "treeDescriptions.properTechniques",
      format: "normal",
      width: 350,
      category: "trees",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Ftrees%2Flawn5.webp?alt=media&token=38078d5c-9265-4b6a-8e18-39fc36a00f44",
      alt: "treeDescriptions.historicOaks",
      description: "treeDescriptions.historicOaks",
      format: "wide",
      width: 450,
      category: "trees",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Ftrees%2Flawn6.webp?alt=media&token=3fcd8050-30d0-4c38-8fe0-74bfe1e01459",
      alt: "treeDescriptions.dwarfTreeDesign",
      description: "treeDescriptions.dwarfTreeDesign",
      format: "square",
      width: 280,
      category: "trees",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Ftrees%2Flawn7.webp?alt=media&token=6a85c88f-b7d3-4f87-ad7d-bcb10fa22af5",
      alt: "treeDescriptions.largeTreeTransplanting",
      description: "treeDescriptions.largeTreeTransplanting",
      format: "normal",
      width: 350,
      category: "trees",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Ftrees%2Flawn8.webp?alt=media&token=5258bdb4-6fa6-4707-9e1f-72b1bead5a90",
      alt: "treeDescriptions.containerPlanting",
      description: "treeDescriptions.containerPlanting",
      format: "wide",
      width: 450,
      category: "trees",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Ftrees%2Flawn9.webp?alt=media&token=eebd35e9-1bfc-4eba-9fc6-18c54fd311ac",
      alt: "treeDescriptions.rootCare",
      description: "treeDescriptions.rootCare",
      format: "square",
      width: 280,
      category: "trees",
    },
    {
      src: "https://firebasestorage.googleapis.com/v0/b/grunpflege-de.firebasestorage.app/o/gallery%2Ftrees%2Flawn10.webp?alt=media&token=03535400-3aa6-4dc1-8f15-fe087d63cf0b",
      alt: "treeDescriptions.professionalPlanting",
      description: "treeDescriptions.professionalPlanting",
      format: "normal",
      width: 350,
      category: "trees",
    },
  ],
};

// Helper function to get images for carousel rows
export const getCarouselRowImages = (category) => {
  return galleryData[category] || [];
};

// Helper function to get all images for gallery
export const getAllGalleryImages = () => {
  return [...galleryData.gardens, ...galleryData.lawns, ...galleryData.trees];
};

// Helper function to get images by category for gallery filtering
export const getImagesByCategory = (category) => {
  if (category === "all") {
    return getAllGalleryImages();
  }
  return galleryData[category] || [];
};

export default galleryData;
