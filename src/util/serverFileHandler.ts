import { HttpService } from "@nestjs/axios";
import { ENV } from "@src/env";
import { asyncForEach } from "@src/shared";
import * as FS from "fs";
import { firstValueFrom } from "rxjs";
import { fixNullPrototype } from "./config";
import axios from "axios";
import FormData from "form-data";

export interface IServerFileUploaderReturn {
    success: boolean;
    storedFiles?: string[];
}

export const r2ServerFileUploader = async (
    files: any,
    deleteOld = true
): Promise<IServerFileUploaderReturn> => {
    try {
        console.info("calling r2ServerFileUploader");

        const storedFiles: string[] = [];

        if (Array.isArray(files)) {
            await asyncForEach(files, async (file) => {
                const t = await r2FileUploader(file);
                storedFiles.push(t.url.replace(`${ENV.files.CF_R2_ENDPOINT}`, "https://cdnrc.com"));
            });
            deleteOld ? localFileDelete(files) : "";
        } else {
            const t = await r2FileUploader(files);
            storedFiles.push(t.url.replace(`${ENV.files.CF_R2_ENDPOINT}`, "https://cdn.com"));
            deleteOld ? localFileDelete(files) : "";
        }

        return { success: true, storedFiles };
    } catch (error) {
        console.error(error);
        return { success: false, storedFiles: [] };
    }
};

export const r2FileUploader = async (file: any): Promise<{ url: string }> => {
    try {
        console.log("calling r2FileUploader");
        const prefix = ENV.isProduction ? 'onbez-prod' : 'onbez-dev'
        file = await fixNullPrototype(file);
        const url = `${ENV.files.CF_R2_ENDPOINT}/${prefix}-${Date.now()}-${file.originalname.replace(/\s+/g, "")}`;
        const http = new HttpService();

        const binaryFile = FS.createReadStream(file.path);

        const response = http.put(url, binaryFile, {
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
        });
        const finalResponse = await (await firstValueFrom(response)).data;

        if (finalResponse.success) {
            return { url };
        }
        return null;
    } catch (error) {
        throw error;
    }
};


export const localFileDelete = async (files) => {
    if (!files) return;
    setTimeout(async () => {
        try {
            if (Array.isArray(files)) {
                if (files.length == 1) {
                    FS.unlinkSync(files[0].path);
                } else {
                    await asyncForEach(files, async (file) => {
                        FS.unlinkSync(file.path);
                    });
                }
            } else {
                FS.unlinkSync(files.path);
            }
        } catch (err) {
            console.error(err);
        }
    }, 100);
};

export const imgBBServerFileUploader = async (
    files: any,
    deleteOld = true
): Promise<IServerFileUploaderReturn> => {
    try {
        console.info("Calling imgBBServerFileUploader");

        const storedFiles: string[] = [];

        // Add API key to the upload process
        const API_KEY = '5a01a153e7b5caa3a2c33b631e83c476';  // Replace with your actual ImgBB API key

        if (Array.isArray(files)) {
            for (const file of files) {
                const url = await uploadImageToImgBB(file.path, API_KEY); // Pass the file path and API Key
                storedFiles.push(url);
            }
            if (deleteOld) localFileDelete(files);
        } else {
            const url = await uploadImageToImgBB(files.path, API_KEY); // Pass the file path and API Key
            storedFiles.push(url);
            if (deleteOld) localFileDelete(files);
        }

        return { success: true, storedFiles };
    } catch (error) {
        console.error("ImgBB Upload Error:", error);
        return { success: false, storedFiles: [] };
    }
};
export async function uploadImageToImgBB(imagePath: string, apiKey: string): Promise<string> {
    try {
        const form = new FormData();
        const fileBuffer = FS.readFileSync(imagePath); // Read file as buffer
        const blob = new Blob([fileBuffer]); // Convert buffer to blob
        form.append('image', blob, ); // Append blob with filename
        form.append('key', apiKey); // Use the API key passed

        const response = await axios.post('https://api.imgbb.com/1/upload', form, {
            headers: form.getHeaders(),
        });

        return response.data.data.url; // Return ImgBB image URL
    } catch (error) {
        throw new Error(`ImgBB Upload Error: ${error.message}`);
    }
}

