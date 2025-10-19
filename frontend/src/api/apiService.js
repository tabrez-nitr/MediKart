import axios from "axios";
import { getMedicines , getCartMedicine } from "./modalApi";


//demo to get products 
export const getProducts = async () => {
    try {
         const response = await getMedicines()
         return response;
    }
    catch(error) {
        console.log(""+error)

    }

}

// demo to get cart products 
export const getCartProducts = async() => {
    try {
        const response = await getCartMedicine()
        console.log("cart products " +response)
        return response;

    }
    catch(error) {
        console.log("error"+error)
    }
}