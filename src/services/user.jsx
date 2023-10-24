import { DEBUG_MODE } from "@/utils/constant";
import http from "@/utils/http";

const USER_API = "";

const getAllMedias = () => {
    return http
        .get(USER_API + "/allfiles")
        .then(
            (res) => {
                return res;
            },
            (err) => {
                if (!DEBUG_MODE) console.clear();
                return err.response;
            }
        )
        .catch((err) => {
            return err;
        });
}

const UserService = {
    getAllMedias,
};

export default UserService;