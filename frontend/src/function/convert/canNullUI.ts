export const canNullUI = (value: string|undefined): string =>{
    if(value === "" || typeof value === undefined || value === null){
        return "Không xác định";
    }
    return String(value);
}