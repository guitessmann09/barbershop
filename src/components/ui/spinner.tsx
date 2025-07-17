interface SpinnerProps {
  width: number
  height: number
}

const Spinner = ({ width, height }: SpinnerProps) => {
  return (
    <div
      className={`h-${height} w-${width} animate-spin rounded-full border-b-2 border-primary`}
    />
  )
}

export default Spinner
