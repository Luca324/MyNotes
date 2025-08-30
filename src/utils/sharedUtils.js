

export function formatDate(str) {
    const date = new Date(str)
    const year = date.getFullYear()
    const month = date.getMonth().toString().padStart(2, '0')
    const day = date.getDay().toString().padStart(2, '0')
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return `${day}.${month}.${year} ${hours}:${minutes}`
}