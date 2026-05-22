import type { IncomingMessage, ServerResponse } from "http";
import { insertProduct, readProducts } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parseBody";
import { log } from "console";
import { sendResponse } from "../utility/sendRespons";
export const productController = async (
    req: IncomingMessage,
    res: ServerResponse,
) => {
    const url = req.url;
    const method = req.method;
    const urlParts = url?.split("/");
    const id = urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;
    if (url === "/products" && method === "GET") {
        try {
            const products = readProducts();
            return sendResponse(res, 200, true, "Products retrieved successfully", products);
        } catch (error) {
            return sendResponse(res, 500, false, "Something Went Wrong", error);
        }
    } else if (method == "GET" && id !== null) {
        const products = readProducts();
        const product = products.find((p: IProduct) => p.id === id);

        if (!product) {
            return sendResponse(res, 404, false, "Product not found", null);
        }
        try {
            return sendResponse(res, 200, true, "Products retrieved successfully", product);
        } catch (error) {
            return sendResponse(res, 500, false, "Something Went Wrong", error);
        }

    } else if (method === "POST" && url === "/products") {
        const body = await parseBody(req);
        const products = readProducts();
        // console.log(body);
        const newProduct = {
            id: Date.now(),
            ...body,
        };
        products.push(newProduct);
        insertProduct(products)
        try {
            return sendResponse(res, 200, true, "Product Created successfully", newProduct);
        } catch (error) {
            return sendResponse(res, 500, false, "Something Went Wrong", error);
        }

    } else if (method === "PUT" && id !== null) {
        const body = await parseBody(req);
        const products = readProducts();

        const index = products.findIndex((p: IProduct) => p.id === id)
        if (index < 0) {
            return sendResponse(res, 404, false, "Product not found", null);
        }

        products[index] = { id: products[index].id, ...body };

        insertProduct(products)
        try {
            return sendResponse(res, 200, true, "Product updated succesfully", products[index]);
        } catch (error) {
            return sendResponse(res, 500, false, "Something Went Wrong", error);
        }

    } else if (method === "DELETE" && id !== null) {
        const products = readProducts();
        const index = products.findIndex((p: IProduct) => p.id === id)
        if (index < 0) {
            return sendResponse(res, 404, false, "Product not found", null);
        }

        products.splice(index, 1)
        insertProduct(products);

        try {
            return sendResponse(res, 200, true, "Product Deleted succesfully", null);
        } catch (error) {
            return sendResponse(res, 500, false, "Something Went Wrong", error);
        }

    }
};
