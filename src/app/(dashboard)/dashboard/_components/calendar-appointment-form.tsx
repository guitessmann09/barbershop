import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"

const CalendarAppointmentForm = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-full min-h-[40px] w-full border-2 border-dashed"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CalendarAppointmentForm
