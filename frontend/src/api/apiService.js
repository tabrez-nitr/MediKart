import axios from "axios";
import getMedicines from "./medicines";


export const getProducts = async () => {
    try {
         const response = await getMedicines()
         return response;
    }
    catch(error) {
        console.log("An error occured")

    }

}