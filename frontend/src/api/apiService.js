import axios from "axios";
import { getMedicines , getCartMedicine } from "./modalApi";


//demo to get products 
export const getProducts = async () => {
    try {
         const response = await getMedicines()
         return response;
    }
    catch(error) {
        console.log("An error occured")

    }

}

// demo to get cart products 
export const getCartProducts = async() => {
    try {
        const response = await getCartMedicine()
        return response;
    }
    catch(error) {
        console.log("An error occured")
    }
}