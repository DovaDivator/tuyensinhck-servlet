const monThiLabels = ["Toán tư duy", "Tiếng việt", "Môn chuyên", "Ngoại ngữ"];

interface KetQua {
    diemToan: number | null;
    diemVan: number | null;
    diemTC: number | null;
    diemNN: number | null;
}

interface ItemThi {
    ttMon: number;
    timeStart?: string;
    timeEnd?: string;
    viTri?: string;
    maPhong?: number;
    dateExam?: string;
    mon_thi: string;
    diem?: number | null;
}

interface ApiResponse {
    dsThi: ItemThi[];
    ketQua: KetQua;
    he: string;
    khoa: string;
    monNN: string;
    monTC: string;
}


export const processExamListTS = (data: any): ItemThi[] => {
    const typedData = data as ApiResponse
    if (typedData.dsThi.length === 0) {
        return [
            {
                ttMon: 1,
                mon_thi: monThiLabels[0]
            },
            {
                ttMon: 2,
                mon_thi: monThiLabels[1]
            },
            {
                ttMon: 3,
                mon_thi: data.monTC || monThiLabels[2]
            },
            {
                ttMon: 4,
                mon_thi: data.monNN || monThiLabels[3]
            }
        ]
    }

    return typedData.dsThi.map((item) => {
        let mon_thi = "";
        let diem: number | null = null;

        switch (item.ttMon) {
            case 1:
                mon_thi = monThiLabels[0]; // "Toán"
                diem = data.ketQua.diemToan;
                break;
            case 2:
                mon_thi = monThiLabels[1]; // "Văn"
                diem = data.ketQua.diemVan;
                break;
            case 3:
                mon_thi = data.monTC || monThiLabels[2]; // môn chuyên
                diem = data.ketQua.diemTC;
                break;
            case 4:
                mon_thi = data.monNN || monThiLabels[3]; // ngoại ngữ
                diem = data.ketQua.diemNN;
                break;
            default:
                mon_thi = "Không xác định";
                diem = null;
        }

        return {
            ...item,
            mon_thi,
            diem,
        };
    });
}
