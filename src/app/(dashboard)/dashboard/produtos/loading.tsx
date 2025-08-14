import Spinner from "@/components/ui/spinner"

const Loading = () => {
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center p-6">
      <Spinner width={8} height={8} />
    </div>
  )
}

export default Loading
