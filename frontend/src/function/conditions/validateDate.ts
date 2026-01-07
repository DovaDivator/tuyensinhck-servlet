import { validateTypeText } from "./validateTypeText";
import { DateValids } from "../../classes/DateValids";
import { FormDataProps } from "../../types/FormInterfaces";
import { parseFlexibleDate } from "../convert/parseFlexibleDate";
import { compareTime, durationToMilliseconds } from "./compareTime";

export const validateDate = (
  name: string,
  value: string,
  valids: DateValids = new DateValids({}),
  formData: FormDataProps = {}
): { [key: string]: string } => {
  if (valids.required && value.trim() === '') {
    return { [name]: 'Trường này là bắt buộc.' };
  }

  try {
    if (valids.cons) {
      // console.log("value", value);
      const dateValue = parseFlexibleDate(value);
      // const miliDist = durationToMilliseconds(valids.dist ?? {});

      if (valids.cons?.max?.value !== undefined) {
        const maxValue = valids.cons.max.value instanceof Date
          ? valids.cons.max.value
          : parseFlexibleDate(formData?.[valids.cons.max.value as string] as string);

        const distMax = valids.cons.max.dist ?? {};
        const miliDist = durationToMilliseconds(distMax); // Hàm này giả sử bạn đã có

        const result = compareTime(
          dateValue,
          maxValue,
          miliDist,
          distMax?.isWithin ?? false
        );

        if (!result) {
          return { [name]: 'Thời gian vượt quá ràng buộc cho phép!' };
        }
      }

      if (valids.cons?.min?.value !== undefined) {
        const minValue = valids.cons.min.value instanceof Date
          ? valids.cons.min.value
          : parseFlexibleDate(formData?.[valids.cons.min.value as string] as string);

        const distMin = valids.cons.min.dist ?? {};
        const miliDist = durationToMilliseconds(distMin);

        const result = compareTime(
          minValue,
          dateValue,
          miliDist,
          distMin?.isWithin ?? false
        );

        if (!result) {
          return { [name]: 'Thời gian sớm hơn ràng buộc cho phép!' };
        }
      }
    }

    return { [name]: '' };
  } catch (error: any) {
    console.error(error);
    return { [name]: "Có sự cố xảy ra!" };
  }
};


