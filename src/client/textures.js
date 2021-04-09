import {TextureLoader} from 'three';
import {insects} from '../shared/model/insects.js';

import ant from '../assets/ant.jpeg';
import bee from '../assets/bee.jpeg';
import beetle from '../assets/beetle.jpeg';
import grasshopper from '../assets/grasshopper.jpeg';
import spider from '../assets/spider.jpeg';

// Preload all images and store the textures in a hashmap for every insect
const loader = new TextureLoader();
let textures = {};
Object.keys(insects).forEach(i => console.log(window[i.toLowerCase()]));
Object.keys(insects).forEach(i => textures[i] = loader.load(window[i.toLowerCase()]));
console.log(textures)
export default textures;