import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getAllMedecinUsers,
  getMedecinUser,
  RemoveProfile,
  getLabsUser,
 
  getLabsUsers,
  fetchPatients,
  addLabAppoint,
  addMedAppoint,
  fetch,



 

} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get('/medecins', getAllMedecinUsers,verifyToken);
router.get("/laboratoires", getLabsUsers);
router.get('/:id/patients',fetchPatients)
//router.get('/:id/patients',fetchMyPatients)
router.get('/:value/fetch', fetch)
router.get("/:id/laboratoires", getLabsUser,verifyToken);
router.get("/:id", getUser,verifyToken);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get('/:id/medecin',verifyToken, getMedecinUser);

router.patch("/laboratoires/:ID/appointment", addLabAppoint);
router.patch("/medecin/:ID/appointment", addMedAppoint);
/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
/* Delete */
router.delete ("/remove-profile/:id",RemoveProfile ,verifyToken)


export default router;
