import servicesData from './services.json';
import { getAssetUrl } from '../utils/url';

// Process the services data to include proper image URLs
const processedServices = servicesData.map(service => ({
  ...service,
  image: getAssetUrl(service.image)
}));

export default processedServices;
