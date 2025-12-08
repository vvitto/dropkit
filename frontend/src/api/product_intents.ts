import {api} from "@/api/client.ts";


export async function createProductIntent(): Promise<void> {
    return api.post(`/product_intents`);
}
