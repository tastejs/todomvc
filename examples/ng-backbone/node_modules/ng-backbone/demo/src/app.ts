import { HeroView } from "./View/Hero";
import { HeroListView } from "./View/HeroList";
import { HeroCollection } from "./Collection/Hero";

let heroes = new HeroCollection();

new HeroView({ collections: { heroes: heroes } });
new HeroListView({ collections: { heroes: heroes } });
