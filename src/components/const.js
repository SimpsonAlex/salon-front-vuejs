const BACKEND_PATH = 'https://backend-djangorfw.herokuapp.com/';
// const BACKEND_PATH = 'http://127.0.0.1:8000/';


const url = {
    imageCreateBase: BACKEND_PATH + 'images/',
    imagePut: BACKEND_PATH + 'image_create/',
    visits_only: BACKEND_PATH + 'visits/',
    visits: BACKEND_PATH + 'visit_detail/',
    clients: BACKEND_PATH + 'list_clients/',
    client_without_photo: BACKEND_PATH + 'list_clients_without_photo/',
    client_photo: BACKEND_PATH + 'photo/',
    calendar: BACKEND_PATH + 'calendar/',
    registration: BACKEND_PATH + 'registration/',
    login: BACKEND_PATH + 'auth/login/'
}

export default url