import axios from 'axios';

export default axios.create({
    baseURL: "https://pixabay.com/api/?key=15429123-40b384e475ccef5c0c193b7d6&image_type=photo",
});