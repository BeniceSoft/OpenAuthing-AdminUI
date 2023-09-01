import dayjs from "dayjs";
import { Random } from "mockjs";

export default () => {

    const data: any = [];
    const now = dayjs()
    const yearMonth = now.format('YYYY-MM')
    for (var i = 0; i < now.daysInMonth(); i++) {
        const date = dayjs(yearMonth).add(i, 'day');

        data.push({
            date: date.format('MM/DD'),
            登录人次: Random.integer(0, 1000),
            登录人数: Random.integer(0, 1000),
        })
    }

    return { data }
}