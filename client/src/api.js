import axios from "axios";

// Points directly at the deployed Cloud Function (gcloud functions deploy api)
const api = axios.create({ baseURL: "https://us-central1-nida-ad6ec.cloudfunctions.net/api" });

export default api;
