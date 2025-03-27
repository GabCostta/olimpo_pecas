import axios from "axios";
import { auth } from "./firebaseAuth";

export const fetchUserProfile = async () => {
  const user = auth.currentUser;
  if (!user) return null;

  const token = await user.getIdToken();
  
  const response = await axios.get("http://localhost:3001/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};
