import collection1 from '../assets/images/collections/collection-1.png';
import collection2 from '../assets/images/collections/collection-2.png';

export const collectionsMockData = [
  {
    id: 1,
    image: collection1,
    category: 'Statues',

    titleKey: 'artifacts.tutankhamun.title',
    periodKey: 'artifacts.tutankhamun.period',
    locationKey: 'artifacts.tutankhamun.location',
    categoryKey: 'collections.filters.statues',
    detailsTitleKey: 'artifacts.tutankhamun.detailsTitle',
    descriptionKey: 'artifacts.tutankhamun.description',
    historyKey: 'artifacts.tutankhamun.history',
  },
  {
    id: 2,
    image: collection2,
    category: 'Sarcophagi',

    titleKey: 'artifacts.ramesses.title',
    periodKey: 'artifacts.ramesses.period',
    locationKey: 'artifacts.ramesses.location',
    categoryKey: 'collections.filters.sarcophagi',
    detailsTitleKey: 'artifacts.ramesses.detailsTitle',
    descriptionKey: 'artifacts.ramesses.description',
    historyKey: 'artifacts.ramesses.history',
  },
];