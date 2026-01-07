import { FileDataProps } from "../../types/FormInterfaces";

export const convertFileDataToBase64 = async (data: FileDataProps): Promise<{
    [key in keyof FileDataProps]: string | string[] | undefined;
}> => {
    const result: any = {};

    for (const key in data) {
        const value = data[key];

        if (value instanceof File) {
            result[key] = await fileToBase64(value);
        } else if (Array.isArray(value)) {
            result[key] = await Promise.all(value.map(file => fileToBase64(file)));
        } else {
            result[key] = undefined;
        }
    }

    return result;
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
