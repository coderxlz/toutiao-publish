// 格式化日期工具
import dayjs from 'dayjs'

export const dateFormat = (date) => {
  if(date !== null){
    return dayjs(date).format('YYYY-MM-DD')
  }else{
    return date
  }
}