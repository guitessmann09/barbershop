import { db } from "@/lib/prisma"
import Calendar from "../_components/calendar"

const AgendaPage = async () => {
  return (
    <div>
      <Calendar></Calendar>
    </div>
  )
}

export default AgendaPage
