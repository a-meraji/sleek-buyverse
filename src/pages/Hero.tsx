import LuxuryFashionHero from "@/components/heroes/LuxuryFashionHero";
import StreetwearHero from "@/components/heroes/StreetwearHero";
import HomeDecorHero from "@/components/heroes/HomeDecorHero";
import ElectronicsStoreHero from "@/components/heroes/ElectronicsStoreHero";
import BeautyStoreHero from "@/components/heroes/BeautyStoreHero";
import SportsStoreHero from "@/components/heroes/SportsStoreHero";
import JewelryStoreHero from "@/components/heroes/JewelryStoreHero";
import FurnitureStoreHero from "@/components/heroes/FurnitureStoreHero";
import KidsStoreHero from "@/components/heroes/KidsStoreHero";
import SustainableFashionHero from "@/components/heroes/SustainableFashionHero";
import PremiumFashionBoutique from "@/components/heroes/PremiumFashionBoutique";
import DesignerAccessories from "@/components/heroes/DesignerAccessories";
import HighEndCosmetics from "@/components/heroes/HighEndCosmetics";
import VintageFashion from "@/components/heroes/VintageFashion";
import AthleisureWear from "@/components/heroes/AthleisureWear";
import MinimalistFashion from "@/components/heroes/MinimalistFashion";
import LuxurySkincare from "@/components/heroes/LuxurySkincare";
import DesignerShoes from "@/components/heroes/DesignerShoes";
import BridalCollection from "@/components/heroes/BridalCollection";

export default function Hero() {
  return (
    <div className="space-y-32 pb-32">
      <LuxuryFashionHero />
      <StreetwearHero />
      <HomeDecorHero />
      <ElectronicsStoreHero />
      <BeautyStoreHero />
      <SportsStoreHero />
      <JewelryStoreHero />
      <FurnitureStoreHero />
      <KidsStoreHero />
      <SustainableFashionHero />
      <PremiumFashionBoutique />
      <DesignerAccessories />
      <HighEndCosmetics />
      <VintageFashion />
      <AthleisureWear />
      <MinimalistFashion />
      <LuxurySkincare />
      <DesignerShoes />
      <BridalCollection />
    </div>
  );
}
