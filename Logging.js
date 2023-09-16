export async function Logs(Message) {
    try {
        const Time = new Date()
        const Year = Time.getFullYear()
        const Month = Time.getMonth()
        const Day = Time.getDay()
        const Hour = Time.getHours()
        const Min = Time.getMinutes()
        const Sec = Time.getSeconds()
        const YearIntToString = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const DayIntToString = ["", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"]
    
        console.log(`\n[ Year: ${Year}.${YearIntToString[Month]}.${DayIntToString[Day]}.${Hour}:${Min}:${Sec} ] - [ Message : ${String(Message)} ]`)
    } catch(e) {
        console.log(`Terrible news: The logging function failed with error: ${e}`)
        return
    }
}